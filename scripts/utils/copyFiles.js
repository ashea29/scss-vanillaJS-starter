const path = require("path");
const { execSync } = require("child_process");
const { existsSync } = require("fs");
const { platform } = require("os");
const { rootDir } = require("./paths");

const OS = platform();

const dist = path.resolve(rootDir, "dist");

const copyFiles = (htmlArray = [], jsArray = []) => {
  if (existsSync(`${dist}`)) {
    htmlArray.forEach((file) => {
      execSync(`cp ${file.path} ${dist}`);
    });
  } else {
    execSync(`mkdir ${dist}`);
    htmlArray.forEach((file) => {
      execSync(`cp ${file.path} ${dist}`);
    });
  }

  if (jsArray.length != 0) {
    if (existsSync(`${dist}${OS === "win32" ? "\\" : "/"}js`)) {
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

module.exports = {
  copyFiles,
};
