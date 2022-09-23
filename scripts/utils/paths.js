const path = require("path");
const { platform } = require("os");

const OS = platform();

const rootDir = path.resolve(__dirname, "../../");
const distPath = path.resolve(rootDir, "dist");
// const htmlPath = `${dist}${OS === "win32" ? "\\" : "/"}`;
const htmlPath = path.resolve(distPath);
// const jsPath = `
//     ${dist}${OS === "win32" ? "\\" : "/"}js
//     ${OS === "win32" ? "\\" : "/"}
// `;
const jsPath = path.resolve(distPath, "js");
// const cssPath = `
//     ${dist}${OS === "win32" ? "\\" : "/"}css
//     ${OS === "win32" ? "\\" : "/"}
// `;
const cssPath = path.resolve(distPath, "css");

module.exports = {
  rootDir,
  dist,
  htmlPath,
  jsPath,
  cssPath,
};
