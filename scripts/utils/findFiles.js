const path = require("path");
const { existsSync, readdirSync, lstatSync } = require("fs");

const findFiles = (sourcePath, filter, outputArray = []) => {
  //   console.log("Source path (findFiles): ", sourcePath);
  if (!existsSync(sourcePath)) {
    console.log("No directory at this path", sourcePath);
    return;
  }

  const files = readdirSync(sourcePath, { withFileTypes: true });
  //   console.log("Files (findFiles): ", files);
  for (const file of files) {
    const filename = path.resolve(sourcePath, file.name);
    const fileExtension = path.extname(file.name);
    // console.log("Filename (findFiles): ", filename);
    // const stat = lstatSync(filename);
    if (file.isDirectory()) {
      findFiles(filename, filter, outputArray); //recurse
    } else if (filename.endsWith(filter)) {
      outputArray.push({
        name: file.name.substring(0, file.name.indexOf(fileExtension)),
        ext: fileExtension,
        path: filename,
      });
    }
  }
};

module.exports = {
  findFiles,
};
