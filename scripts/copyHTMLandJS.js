const { mkdir, writeFile, readFile, readdir } = require("node:fs/promises");
const { findFiles } = require("./utils/findFiles");
const { copyFiles } = require("./utils/copyFiles");
const { rootDir } = require("./utils/paths");

const copyHTMLandJS = () => {
  const htmlFilesArray = [];
  const jsFilesArray = [];
  const minifiedHtml = [];
  const minfiedJS = [];
  findFiles(`${rootDir}/src/pages`, ".html", htmlFilesArray);
  findFiles(`${rootDir}/src/js`, ".js", jsFilesArray);

  copyFiles(htmlFilesArray, jsFilesArray);
};

export default copyHTMLandJS;
