const path = require("path");
const { execSync } = require("child_process");
const {
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} = require("node:fs");
const { Buffer } = require("node:buffer");
const { platform } = require("os");
const {
  rootDir,
  distPath,
  htmlPath,
  jsPath,
  cssPath,
  scssPath,
} = require("./paths");
const minifyHtml = require("@minify-html/node");
const UglifyJS = require("uglify-js");

const OS = platform();

const findFiles = (sourcePath, filter, outputArray = []) => {
  if (!existsSync(sourcePath)) {
    console.log("No directory at this path", sourcePath);
    return;
  }

  const results = readdirSync(sourcePath, { withFileTypes: true });
  console.log("Results: ", results);
  for (const result of results) {
    const resultPath = path.resolve(sourcePath, result.name);
    console.log("Result Path: ", resultPath);
    let fileExtension = path.extname(result.name);
    // if (!result.isDirectory()) {
    //   fileExtension = path.extname(result.name);
    // }
    if (result.isDirectory()) {
      const directoryContents = readdirSync(resultPath, {
        withFileTypes: true,
      });
      console.log("isDirectory Contents: ", directoryContents);
      outputArray.push({
        result: { ...result },
        isDirectory: true,
        path: resultPath,
        files: [...directoryContents],
        // dirContents:
      });

      findFiles(resultPath, filter, outputArray);
      // findFiles(sourcePath, filter, outputArray);
    } else if (!result.isDirectory() && resultPath.endsWith(filter)) {
      outputArray.push({
        name: result.name.substring(0, result.name.indexOf(fileExtension)),
        isFile: true,
        ext: fileExtension,
        path: resultPath,
      });
    }
  }
};

const outputFiles = (htmlArray = [], jsArray = []) => {
  if (existsSync(`${htmlPath}`)) {
    htmlArray.forEach((file) => {
      writeFileSync(
        `${htmlPath}${OS === "win32" ? "\\" : "/"}${file.name}${file.ext}`,
        file.content,
        {}
      );
    });
  } else {
    execSync(`mkdir ${htmlPath}`);
    htmlArray.forEach((file) => {
      writeFileSync(
        `${htmlPath}${OS === "win32" ? "\\" : "/"}${file.name}${file.ext}`,
        file.content,
        {}
      );
    });
  }

  if (jsArray && jsArray.length != 0) {
    if (existsSync(`${jsPath}`)) {
      jsArray.forEach((entry) => {
        if (entry.isFile) {
          writeFileSync(
            `${jsPath}${OS === "win32" ? "\\" : "/"}${entry.name}${entry.ext}`,
            entry.content,
            {}
          );
        } else if (entry.isDirectory) {
          execSync(
            `mkdir ${jsPath}${OS === "win32" ? "\\" : "/"}${entry.name}`
          );

          entry.dirContents.forEach(() => {});
        }
      });
    } else {
      execSync(`mkdir ${jsPath}`);
      jsArray.forEach((file) => {
        writeFileSync(
          `${jsPath}${OS === "win32" ? "\\" : "/"}${file.name}${file.ext}`,
          file.content,
          {}
        );
      });
    }
  }
};

const outputHTMLandJS = () => {
  const htmlFilesArray = [];
  const jsEntriesArray = [];
  const jsSubdirContents = [];
  const jsSubdirs = [];
  const jsSubdirFiles = [];
  const minifiedHtmlArray = [];
  const minifiedJSArray = [];
  findFiles(`${rootDir}/src/pages`, ".html", htmlFilesArray);
  findFiles(`${rootDir}/src/js`, ".js", jsEntriesArray);

  htmlFilesArray.forEach((file) => {
    const fileContents = readFileSync(file.path);
    let minifiedContents;
    let contentsWithScriptTag;

    if (jsEntriesArray.length !== 0) {
      const matchingJsFile = jsEntriesArray.find(
        (jsFile) => !jsFile.isDirectory && jsFile.name === file.name
      );
      const scriptTag = `\t<script src="./js/${matchingJsFile.name}.js"></script>`;
      const lines = fileContents.toString().split(OS === "win32" ? "\r" : "\n");
      lines.splice(lines.length - 2, 0, scriptTag);
      contentsWithScriptTag = lines.join(OS === "win32" ? "\r" : "\n");

      minifiedContents = minifyHtml.minify(Buffer.from(contentsWithScriptTag), {
        do_not_minify_doctype: true,
        ensure_spec_compliant_unquoted_attribute_values: true,
        keep_spaces_between_attributes: true,
        keep_closing_tags: true,
      });
    } else {
      minifiedContents = minifyHtml.minify(fileContents, {
        do_not_minify_doctype: true,
        ensure_spec_compliant_unquoted_attribute_values: true,
        keep_spaces_between_attributes: true,
        keep_closing_tags: true,
      });
    }

    minifiedHtmlArray.push({
      name: file.name,
      ext: file.ext,
      destinationPath: distPath,
      content: minifiedContents,
    });
  });

  if (jsEntriesArray.length != 0) {
    console.log("JS Entries Array: ", jsEntriesArray);
    jsEntriesArray.forEach((entry) => {
      if (entry.isDirectory) {
        console.log(entry.files);
      }
    });
    // jsEntriesArray.forEach((entry) => {
    //   if (entry.isDirectory) {
    //     // const contentsArr = entry.dirContents;
    //     jsSubdirFiles.push({
    //       ...entry.dirContents,
    //     });
    //     console.log("Dir contents: ", jsSubdirFiles);
    //   } else if (entry.isFile) {
    //     const fileContents = readFileSync(entry.path);

    //     const minifiedContents = UglifyJS.minify(fileContents.toString());

    //     minifiedJSArray.push({
    //       name: entry.name,
    //       ext: entry.ext,
    //       destinationPath: jsPath,
    //       content: minifiedContents.code,
    //     });
    //   }
    // });

    // jsSubdirContents.forEach((entry) => {
    //   const jsFiles = [];
    //   jsSubdirFiles.push({});
    // });
    // outputFiles(minifiedHtmlArray, minifiedJSArray);
  } else {
    outputFiles(minifiedHtmlArray);
  }
};

const compileSass = () => {
  const sassCompileString = `
    sass --style=compressed --no-source-map ${path.resolve(
      scssPath,
      "globalStyles.scss"
    )}:${path.resolve(cssPath, "globalStyles.css")} ${path.resolve(
    scssPath,
    "pages"
  )}:${path.resolve(cssPath)}`.trim();
  execSync(sassCompileString);
};

module.exports = {
  outputHTMLandJS,
  compileSass,
  findFiles,
  outputFiles,
};
