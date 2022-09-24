const { readFileSync } = require("node:fs");
const { rootDir, jsPath, htmlPath } = require('../paths')
const { findFiles, outputFiles } = require('../utils')

const outputHTMLandJS = () => {
  const htmlFilesArray = [];
  const htmlOutputArray = [];
  const jsFilesArray = [];
  const jsOutputArray = [];
  findFiles(`${rootDir}/src/pages`, ".html", htmlFilesArray);
  findFiles(`${rootDir}/src/js`, ".js", jsFilesArray);

  htmlFilesArray.forEach((file) => {
    const fileContents = readFileSync(file.path);

    htmlOutputArray.push({
      name: file.name,
      ext: file.ext,
      destinationPath: htmlPath,
      content: fileContents,
    })
  });

  jsFilesArray.forEach((file) => {
    const fileContents = readFileSync(file.path);

    jsOutputArray.push({
      name: file.name,
      ext: file.ext,
      destinationPath: jsPath,
      content: fileContents,
    })
  });
  outputFiles(htmlOutputArray, jsOutputArray);
};

outputHTMLandJS()