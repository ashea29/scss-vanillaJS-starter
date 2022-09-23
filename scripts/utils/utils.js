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
  if (existsSync(`${distPath}`)) {
    htmlArray.forEach((file) => {
      writeFileSync(htmlPath, file.content, {});
    });
  } else {
    execSync(`mkdir ${distPath}`);
    htmlArray.forEach(async (file) => {
      writeFileSync(`${htmlPath}${file.name}${file.ext}`, file.content, {});
    });
  }

  if (jsArray.length != 0) {
    if (existsSync(`${distPath}${OS === "win32" ? "\\" : "/"}js`)) {
      jsArray.forEach((file) => {
        execSync(`cp ${file.path} ${dist}${OS === "win32" ? "\\" : "/"}js`);
      });
    } else {
      execSync(`mkdir ${dist}${OS === "win32" ? "\\" : "/"}js`);
      jsArray.forEach((file) => {
        execSync(`cp ${file.path} ${dist}${OS === "win32" ? "\\" : "/"}js`);
      });
    }
  }
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
