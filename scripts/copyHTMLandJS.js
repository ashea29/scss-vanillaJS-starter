const { findFiles } = require("./utils/findFiles");
const { copyFiles } = require("./utils/copyFiles");
const { rootDir } = require("./utils/directories");

const htmlFilesArray = [];
const jsFilesArray = [];

findFiles(`${rootDir}/pages`, ".html", htmlFilesArray);
findFiles(`${rootDir}/js`, ".js", jsFilesArray);

// console.log(htmlFilesArray)

copyFiles(htmlFilesArray, jsFilesArray);
