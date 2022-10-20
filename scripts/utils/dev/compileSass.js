const path = require("path");
const { cssPath, scssPath } = require("../paths");
const { execSync } = require("child_process");
const { cssOutputArray } = require('./outputHTMLandJS');
const { readFileSync, writeFileSync } = require("fs");
const { platform } = require("os");

const OS = platform()
// const compileSass = (cssArray) => {
//   const sassCompileString = `
//     sass --watch --style=expanded --no-source-map ${
//       path.resolve(scssPath, 'globalStyles.scss')
//     }:${
//       path.resolve(cssPath, 'globalStyles.css')
//     } ${
//       cssArray.join(' ')
//     }`.trim();
//   execSync(sassCompileString);
// };

// compileSass(cssOutputArray)


const compileSass = () => {
  // execSync(`mkdir ${cssPath}`)
  // const sassCompileString = `gulp`;
  // execSync(sassCompileString);
  const globalOutputFile = readFileSync(path.resolve(cssPath, 'globalStyles.css'))
  let newGlobalOutputFile

  const outputToArray = globalOutputFile.toString().split("\n")
  const rootSelector = outputToArray.shift()
  // const rootSelector = outputToArray[outputToArray.findIndex((line) => line.includes(':root'))]
  const newRootSelectorIndex = outputToArray.findIndex((line) => line.includes('*, *::before, *::after'))

  outputToArray.splice(newRootSelectorIndex, 0, rootSelector)

  newGlobalOutputFile = outputToArray.join('\n')

  writeFileSync(
    path.resolve(cssPath, 'globalStyles.css'),
    newGlobalOutputFile,
    {}
  )

};

compileSass()