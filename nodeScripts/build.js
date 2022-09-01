const { existsSync } = require("fs");
const { execSync } = require("child_process");
const { exit } = require("node:process");
const { findFiles } = require("./findFiles");

const htmlFilesArray = [];
const jsFilesArray = [];

findFiles("./pages", ".html", htmlFilesArray);
findFiles("./js", ".js", jsFilesArray);

// console.log(htmlFilesArray)

const copyAllFiles = () => {
  if (existsSync("./dist/")) {
    execSync("rm -rf dist/ && mkdir ./dist");
    htmlFilesArray.forEach((file) => {
      execSync(`cp ${file} dist/`);
    });
  } else {
    execSync("mkdir ./dist");
    htmlFilesArray.forEach((file) => {
      execSync(`cp ${file} dist/`);
    });
  }

  if (existsSync("./dist/js")) {
    jsFilesArray.forEach((file) => {
      execSync(`cp ${file} dist/js/`);
    });
  } else {
    execSync("mkdir ./dist/js");
    jsFilesArray.forEach((file) => {
      execSync(`cp ${file} dist/js/`);
    });
  }

  exit();
};

copyAllFiles();