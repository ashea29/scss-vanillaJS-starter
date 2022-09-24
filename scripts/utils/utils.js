const path = require("path");
const { execSync } = require("child_process");
const {
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} = require("node:fs");
const { exit } = require("node:process");
const { platform } = require("os");
const { rootDir, distPath, htmlPath, jsPath, cssPath, scssPath } = require("./paths");
const minifyHtml = require("@minify-html/node");
const UglifyJS = require("uglify-js");

const OS = platform()

const findFiles = (sourcePath, filter, outputArray = []) => {
  if (!existsSync(sourcePath)) {
    console.log("No directory at this path", sourcePath);
    return;
  }

  const files = readdirSync(sourcePath, { withFileTypes: true });
  for (const file of files) {
    const filename = path.resolve(sourcePath, file.name);
    const fileExtension = path.extname(file.name);
    if (file.isDirectory()) {
      findFiles(filename, filter, outputArray);
    } else if (filename.endsWith(filter)) {
      outputArray.push({
        name: file.name.substring(0, file.name.indexOf(fileExtension)),
        ext: fileExtension,
        path: filename,
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
    htmlArray.forEach(async (file) => {
      writeFileSync(
        `${htmlPath}${OS === "win32" ? "\\" : "/"}${file.name}${file.ext}`,
        file.content,
        {}
      );
    });
  }

  if (jsArray.length != 0) {
    if (existsSync(`${jsPath}`)) {
      jsArray.forEach((file) => {
        writeFileSync(`${jsPath}${OS === "win32" ? "\\" : "/"}${file.name}${file.ext}`, file.content, {});
      });
    } else {
      execSync(`mkdir ${jsPath}`);
      jsArray.forEach((file) => {
        writeFileSync(`${jsPath}${OS === "win32" ? "\\" : "/"}${file.name}${file.ext}`, file.content, {});
      });
    }
  }
};

const outputHTMLandJS = () => {
  const htmlFilesArray = [];
  const jsFilesArray = [];
  const minifiedHtmlArray = [];
  const minifiedJSArray = [];
  findFiles(`${rootDir}/src/pages`, ".html", htmlFilesArray);
  findFiles(`${rootDir}/src/js`, ".js", jsFilesArray);

  htmlFilesArray.forEach((file) => {
    const fileContents = readFileSync(file.path);

    const minifiedContents = minifyHtml.minify(fileContents, {
      do_not_minify_doctype: true,
      ensure_spec_compliant_unquoted_attribute_values: true,
      keep_spaces_between_attributes: true,
      keep_closing_tags: true,
    });

    minifiedHtmlArray.push({
      name: file.name,
      ext: file.ext,
      destinationPath: distPath,
      content: minifiedContents,
    });
  });

  jsFilesArray.forEach((file) => {
    const fileContents = readFileSync(file.path);

    const minifiedContents = UglifyJS.minify(fileContents.toString());

    minifiedJSArray.push({
      name: file.name,
      ext: file.ext,
      destinationPath: jsPath,
      content: minifiedContents.code,
    });
  });

  outputFiles(minifiedHtmlArray, minifiedJSArray);
};

const compileSass = (devBuild) => {
  const sassCompileString = `
    sass ${
      devBuild ? "--watch --style=expanded" : "--style=compressed"
    } --no-source-map ${
      path.resolve(scssPath, 'globalStyles.scss')
    }:${
      path.resolve(cssPath, 'globalStyles.css')
    } ${
      path.resolve(scssPath, 'pages')
    }:${
      path.resolve(cssPath)
    }`.trim();
  execSync(sassCompileString);
  if (devBuild !== true) {
    exit();
  }
};


module.exports = {
  outputHTMLandJS,
  compileSass,
};
