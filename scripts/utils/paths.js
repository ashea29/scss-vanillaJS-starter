const path = require("path");
const { platform } = require("os");

const OS = platform();

const rootDir = path.resolve(__dirname, "../../");
const distPath = path.resolve(rootDir, "dist");
const htmlPath = path.resolve(distPath);
const jsPath = path.resolve(distPath, "js");
const scssPath = `${rootDir}${OS === "win32" ? "\\" : "/"}src${OS === "win32" ? "\\" : "/"}scss${OS === "win32" ? "\\" : "/"}`;
const cssPath = `${distPath}${OS === "win32" ? "\\" : "/"}css${OS === "win32" ? "\\" : "/"}`;

module.exports = {
  rootDir,
  distPath,
  htmlPath,
  jsPath,
  cssPath,
  scssPath
};
