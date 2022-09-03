const path = require("path");
const { execSync } = require("child_process");
const { existsSync } = require("fs");
const { rootDir } = require("./directories");

// const rootDir = path.resolve(__dirname, "../../");
// console.log("Root dir:", rootDir);
// console.log(path.resolve(rootDir, "dist"));
const dist = path.resolve(rootDir, "dist");

const copyFiles = (htmlArray = [], jsArray = []) => {
  //   console.log("html array: ", htmlArray);
  //   console.log("js array", jsArray);
  if (existsSync(`${dist}`)) {
    execSync(`rm -rf ${dist} && mkdir ${dist}`);
    htmlArray.forEach((file) => {
      execSync(`cp ${file.path} ${dist}/`);
    });
  } else {
    execSync(`mkdir ${dist}`);
    htmlArray.forEach((file) => {
      execSync(`cp ${file.path} ${dist}/`);
    });
  }

  if (existsSync(`${dist}/js`)) {
    jsArray.forEach((file) => {
      execSync(`cp ${file.path} ${dist}/js/`);
    });
  } else {
    execSync(`mkdir ${dist}/js`);
    jsArray.forEach((file) => {
      execSync(`cp ${file.path} ${dist}/js/`);
    });
  }
};

module.exports = {
  copyFiles,
};
