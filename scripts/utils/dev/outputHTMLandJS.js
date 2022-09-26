const path = require("path");
const { readFileSync } = require("node:fs");
const { platform } = require("os");
const { rootDir, jsPath, htmlPath } = require('../paths')
const { findFiles, outputFiles } = require('../utils')

const OS = platform()

const outputHTMLandJS = () => {
  const htmlFilesArray = [];
  const htmlOutputArray = [];
  const jsEntriesArray = [];
  const jsOutputArray = [];
  findFiles(`${rootDir}/src/pages`, ".html", htmlFilesArray);
  findFiles(`${rootDir}/src/js`, ".js", jsEntriesArray);

  htmlFilesArray.forEach((file) => {
    const fileContents = readFileSync(file.path);
    let contentsWithScriptTag;

    if (jsEntriesArray.length !== 0) {
      const matchingJsEntry = jsEntriesArray.find(
        (jsEntry) => jsEntry.parentDir ? path.basename(jsEntry.parentDir) === file.name : jsEntry.name === file.name
      );

      if (matchingJsEntry) {
        const scriptTag = `\t<script src="./js/${matchingJsEntry.parentDir ? path.basename(matchingJsEntry.parentDir)+'/' : ''}${matchingJsEntry.name}.js"></script>`;
        const lines = fileContents.toString().split(OS === "win32" ? "\r" : "\n");
        lines.splice(lines.length - 2, 0, scriptTag);
        contentsWithScriptTag = lines.join(OS === "win32" ? "\r" : "\n");
  
        htmlOutputArray.push({
          name: file.name,
          ext: file.ext,
          destinationPath: htmlPath,
          content: contentsWithScriptTag,
        });
      } 
    } else {
      htmlOutputArray.push({
        name: file.name,
        ext: file.ext,
        destinationPath: htmlPath,
        content: fileContents,
      });
    }
  });

  if (jsEntriesArray.length != 0) {
    jsEntriesArray.forEach((entry) => {
      const fileContents = readFileSync(entry.path);
      if (entry.parentDir) {
        jsOutputArray.push({
          name: entry.name,
          ext: entry.ext,
          destinationPath: path.resolve(jsPath, path.basename(entry.parentDir)),
          parentDir: entry.parentDir,
          content: fileContents,
        });
      } else {
        jsOutputArray.push({
          name: entry.name,
          ext: entry.ext,
          destinationPath: jsPath,
          content: fileContents,
        });
      }
    })
    outputFiles(htmlOutputArray, jsOutputArray)
  } else {
    outputFiles(htmlOutputArray);
  }
};

outputHTMLandJS()