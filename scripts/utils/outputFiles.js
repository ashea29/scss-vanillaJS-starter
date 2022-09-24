const path = require("path");
const { execSync } = require("child_process");
const { mkdir, writeFileSync, readFile, readdir } = require("node:fs");
const { existsSync } = require("fs");
const { platform } = require("os");
const { rootDir, jsPath, distPath } = require("./paths");

const OS = platform();

// const dist = path.resolve(rootDir, "dist");

const outputFiles = (htmlArray = [], jsArray = []) => {
  if (existsSync(`${distPath}`)) {
    htmlArray.forEach((file) => {
      writeFileSync(
        `${distPath}${OS === "win32" ? "\\" : "/"}${file.name}${file.ext}`,
        file.content,
        {}
      );
    });
  } else {
    execSync(`mkdir ${distPath}`);
    htmlArray.forEach(async (file) => {
      writeFileSync(
        `${distPath}${OS === "win32" ? "\\" : "/"}${file.name}${file.ext}`,
        file.content,
        {}
      );
    });
  }

  //   console.log(jsArray);
  if (jsArray.length != 0) {
    if (existsSync(`${distPath}${OS === "win32" ? "\\" : "/"}js`)) {
      jsArray.forEach((file) => {
        // execSync(`cp ${file.path} ${distPath}${OS === "win32" ? "\\" : "/"}js`);
        writeFileSync(`${jsPath}${OS === "win32" ? "\\" : "/"}${file.name}${file.ext}`, file.content, {});
      });
    } else {
      execSync(`mkdir ${distPath}${OS === "win32" ? "\\" : "/"}js`);
      jsArray.forEach((file) => {
        // execSync(`cp ${file.path} ${distPath}${OS === "win32" ? "\\" : "/"}js`);
        writeFileSync(`${jsPath}${OS === "win32" ? "\\" : "/"}${file.name}${file.ext}`, file.content, {});
      });
    }
  }
};

module.exports = {
  outputFiles,
};
