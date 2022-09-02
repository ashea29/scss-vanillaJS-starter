const { findFiles } = require("./utils/findFiles");
const { copyFiles } = require("./utils/copyFiles");

const htmlFilesArray = [];
const jsFilesArray = [];

findFiles("./pages", ".html", htmlFilesArray);
findFiles("./js", ".js", jsFilesArray);

// console.log(htmlFilesArray)

copyFiles(htmlFilesArray, jsFilesArray);
