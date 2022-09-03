const { findFiles } = require("./utils/findFiles");
const { copyFiles } = require("./utils/copyFiles");

const { rootDir } = require("./utils/paths");

const htmlFilesArray = [];
const jsFilesArray = [];

findFiles(`${rootDir}/src/pages`, ".html", htmlFilesArray);
findFiles(`${rootDir}/src/js`, ".js", jsFilesArray);

findFiles("./pages", ".html", htmlFilesArray);
findFiles("./js", ".js", jsFilesArray);

copyFiles(htmlFilesArray, jsFilesArray);
