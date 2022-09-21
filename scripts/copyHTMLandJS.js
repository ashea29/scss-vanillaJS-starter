const path = require("path");
const minifyHtml = require("@minify-html/node");
const { mkdir, writeFile, readFileSync, readdir } = require("node:fs");
const { Buffer } = require("node:buffer");
const { platform } = require("os");
const { findFiles } = require("./utils/findFiles");
const { copyFiles } = require("./utils/copyFiles");
const { rootDir } = require("./utils/paths");

const distPath = path.resolve(rootDir, "dist");

const copyHTMLandJS = async () => {
  const htmlFilesArray = [];
  const jsFilesArray = [];
  const minifiedHtmlArray = [];
  const minfiedJS = [];
  findFiles(`${rootDir}/src/pages`, ".html", htmlFilesArray);
  findFiles(`${rootDir}/src/js`, ".js", jsFilesArray);

  //   console.log("HTML Files Array: ", htmlFilesArray);

  htmlFilesArray.forEach((file) => {
    const fileContents = readFileSync(file.path);
    // console.log("File Contents: ", fileContents.toString());
    const minifiedContents = minifyHtml.minify(fileContents, {
      do_not_minify_doctype: true,
      ensure_spec_compliant_unquoted_attribute_values: true,
      keep_spaces_between_attributes: true,
      keep_closing_tags: true,
    });
    // console.log("Minfied Contents: ", minifiedContents.toString());
    minifiedHtmlArray.push({
      name: file.name,
      ext: file.ext,
      destinationPath: distPath,
      content: minifiedContents,
    });
    // console.log("Minfied Array: ", minifiedHtmlArray);
  });

  copyFiles(minifiedHtmlArray, jsFilesArray);
};

// export default copyHTMLandJS;

copyHTMLandJS();
