const { readFileSync } = require("node:fs");
const { platform } = require("os");
const { rootDir, jsPath, htmlPath } = require('../paths')
const { findFiles, outputFiles } = require('../utils')

const OS = platform()

const outputHTMLandJS = () => {
  const htmlFilesArray = [];
  const htmlOutputArray = [];
  const jsFilesArray = [];
  const jsOutputArray = [];
  findFiles(`${rootDir}/src/pages`, ".html", htmlFilesArray);
  findFiles(`${rootDir}/src/js`, ".js", jsFilesArray);

  htmlFilesArray.forEach((file) => {
    const fileContents = readFileSync(file.path);
    let contentsWithScriptTag

    if (jsFilesArray.length != 0) {
      const matchingJsFile = jsFilesArray.find((jsFile) => jsFile.name === file.name)
      const scriptTag = `\t<script src="./js/${matchingJsFile.name}.js"></script>`
      const lines = fileContents.toString().split(OS === 'win32' ? '\r' : '\n')
      lines.splice(lines.length - 2, 0, scriptTag)
      contentsWithScriptTag = lines.join(OS === 'win32' ? '\r' : '\n')

      htmlOutputArray.push({
        name: file.name,
        ext: file.ext,
        destinationPath: htmlPath,
        content: contentsWithScriptTag,
      })
    } else {
      htmlOutputArray.push({
        name: file.name,
        ext: file.ext,
        destinationPath: htmlPath,
        content: fileContents,
      })
    }
  });

  if (jsFilesArray.length != 0) {
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
  } else {
    outputFiles(htmlOutputArray)
  }
};

outputHTMLandJS()