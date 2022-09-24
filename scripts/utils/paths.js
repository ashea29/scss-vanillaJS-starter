const path = require("path");
const { platform } = require("os");

const OS = platform();

const rootDir = path.resolve(__dirname, "../../");
// console.log(rootDir)
const distPath = path.resolve(rootDir, "dist");
// console.log(distPath)
// const htmlPath = `${distPath}${OS === "win32" ? "\\" : "/"}`;
const htmlPath = path.resolve(distPath);
// console.log(htmlPath)
// const jsPath = `
//     ${distPath}${OS === "win32" ? "\\" : "/"}js
//     ${OS === "win32" ? "\\" : "/"}
// `;
const jsPath = path.resolve(distPath, "js");
// console.log(jsPath)
const scssPath = `${rootDir}${OS === "win32" ? "\\" : "/"}src${OS === "win32" ? "\\" : "/"}scss${OS === "win32" ? "\\" : "/"}`;
// const scssPath = path.resolve(rootDir, 'src/scss/')
// console.log(scssPath)
const cssPath = `${distPath}${OS === "win32" ? "\\" : "/"}css${OS === "win32" ? "\\" : "/"}`;
// const cssPath = path.resolve(distPath, "css/");
// console.log(cssPath)

module.exports = {
  rootDir,
  distPath,
  htmlPath,
  jsPath,
  cssPath,
  scssPath
};
