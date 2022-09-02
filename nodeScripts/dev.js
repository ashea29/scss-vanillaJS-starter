const { existsSync } = require("fs");
const { execSync } = require("child_process");
const { exit, argv } = require("node:process");
const { Command } = require("commander");
const { findFiles } = require("./findFiles");
const { copyAllFiles } = require("./utils/copyAllFiles");

const htmlFilesArray = [];
const jsFilesArray = [];

findFiles("./pages", ".html", htmlFilesArray);
findFiles("./js", ".js", jsFilesArray);

// console.log(htmlFilesArray)

copyAllFiles(htmlFilesArray, jsFilesArray);


