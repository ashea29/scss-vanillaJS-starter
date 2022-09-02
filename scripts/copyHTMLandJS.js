const path = require("path");
const { findFiles } = require("./utils/findFiles");
const { copyFiles } = require("./utils/copyFiles");
const { rootDir } = require("./utils/directories");

const htmlFilesArray = [];
const jsFilesArray = [];

findFiles(path.resolve(rootDir, "pages"), ".html", htmlFilesArray);
findFiles(path.resolve(rootDir, "js"), ".js", jsFilesArray);

console.log("HTML files array: ", htmlFilesArray);
console.log("JS files array: ", jsFilesArray);
// console.log(htmlFilesArray)

copyFiles(htmlFilesArray, jsFilesArray);
