const path = require("path");
const { execSync } = require("child_process");
const {
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} = require("node:fs");
const { exit } = require("node:process");
const { rootDir, distPath, htmlPath, jsPath, cssPath } = require("./paths");
const minifyHtml = require("@minify-html/node");
const UglifyJS = require("uglify-js");

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
  console.log(distPath);
  console.log(htmlPath);
  console.log(jsPath);
  if (existsSync(`${distPath}`)) {
    htmlArray.forEach((file) => {
      writeFileSync(`${htmlPath}`, file.content, {});
    });
  } else {
    execSync(`mkdir ${distPath}`);
    htmlArray.forEach(async (file) => {
      writeFileSync(`${htmlPath}${file.name}${file.ext}`, file.content, {});
    });
  }

  if (jsArray.length != 0) {
    if (existsSync(`${jsPath}`)) {
      jsArray.forEach((file) => {
        // execSync(`cp ${file.path} ${dist}${OS === "win32" ? "\\" : "/"}js`);
        writeFileSync(`${jsPath}${file.name}${file.ext}`, file.content, {});
      });
    } else {
      execSync(`${jsPath}`);
      jsArray.forEach((file) => {
        // execSync(`cp ${file.path} ${dist}${OS === "win32" ? "\\" : "/"}js`);
        writeFileSync(`${jsPath}${file.name}${file.ext}`, file.content, {});
      });
    }
  }
};

const htmlFilesArray = [];
const jsFilesArray = [];
const minifiedHtmlArray = [];
const minifiedJSArray = [];

const outputHTMLandJS = async () => {
  findFiles(`${rootDir}/src/pages`, ".html", htmlFilesArray);
  findFiles(`${rootDir}/src/js`, ".js", jsFilesArray);

  //   console.log("HTML Files Array: ", htmlFilesArray);

  htmlFilesArray.forEach((file) => {
    const fileContents = readFileSync(file.path);
    // console.log("File Contents: ", fileContents.toString());
    const minifiedContents = minifyHtml.minify(fileContents, {
      do_not_minify_doctype: true,
      ensure_spec_compliant_unquoted_attribute_values: true,
      keep_spaces_between_attributes: true,
      keep_closing_tags: true,
    });
    // console.log("Minfied Contents: ", minifiedContents.toString());
    minifiedHtmlArray.push({
      name: file.name,
      ext: file.ext,
      destinationPath: distPath,
      content: minifiedContents,
    });
    // console.log("Minfied Array: ", minifiedHtmlArray);
  });

  jsFilesArray.forEach((file) => {
    const fileContents = readFileSync(file.path);

    const minifiedContents = UglifyJS.minify(fileContents);

    minifiedJSArray.push({
      name: file.name,
      ext: file.ext,
      destinationPath: distPath,
      content: minifiedContents,
    });
  });

  outputFiles(minifiedHtmlArray, minifiedJSArray);
};

const compileSass = (devBuild) => {
  const sassCompileString = `sass ${
    devBuild ? "--watch --style=expanded" : "--style=compressed"
  } --no-source-map src/scss/globalStyles.scss:dist/css/globalStyles.css src/scss/pages/:dist/css/`;
  execSync(sassCompileString);
  if (devBuild !== true) {
    exit();
  }
};

module.exports = {
  outputHTMLandJS,
  compileSass,
};
