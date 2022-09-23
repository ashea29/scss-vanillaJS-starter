const path = require("path");
const { execSync } = require("child_process");
const { mkdir, writeFileSync, readFile, readdir } = require("node:fs");
const { existsSync } = require("fs");
const { platform } = require("os");
const { rootDir, jsPath } = require("./paths");

const OS = platform();

const dist = path.resolve(rootDir, "dist");

const outputFiles = (htmlArray = [], jsArray = []) => {
  if (existsSync(`${dist}`)) {
    htmlArray.forEach((file) => {
      writeFileSync(
        `${dist}${OS === "win32" ? "\\" : "/"}${file.name}${file.ext}`,
        file.content,
        {}
      );
    });
  } else {
    execSync(`mkdir ${dist}`);
    htmlArray.forEach(async (file) => {
      writeFileSync(
        `${dist}${OS === "win32" ? "\\" : "/"}${file.name}${file.ext}`,
        file.content,
        {}
      );
    });
  }

  //   console.log(jsArray);
  if (jsArray.length != 0) {
    if (existsSync(`${dist}${OS === "win32" ? "\\" : "/"}js`)) {
      jsArray.forEach((file) => {
        // execSync(`cp ${file.path} ${dist}${OS === "win32" ? "\\" : "/"}js`);
        writeFileSync(`${jsPath}${file.name}${file.ext}`, file.content, {});
      });
    } else {
      execSync(`mkdir ${dist}${OS === "win32" ? "\\" : "/"}js`);
      jsArray.forEach((file) => {
        // execSync(`cp ${file.path} ${dist}${OS === "win32" ? "\\" : "/"}js`);
        writeFileSync(`${jsPath}${file.name}${file.ext}`, file.content, {});
      });
    }
  }
};

module.exports = {
  outputFiles,
};
