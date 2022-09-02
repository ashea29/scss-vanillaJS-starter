const path = require("path");
const { existsSync, readdirSync, lstatSync } = require("fs");

const findFiles = (sourcePath, filter, outputArray = []) => {
  if (!existsSync(sourcePath)) {
    console.log("No directory at this path", sourcePath);
    return;
  }

  const files = readdirSync(sourcePath);
  console.log("Files (findFiles): ", files);
  for (const file of files) {
    const filename = path.join(sourcePath, file);
    console.log("Filename (findFiles): ", filename);
    const stat = lstatSync(filename);
    if (stat.isDirectory()) {
      findFiles(filename, filter, outputArray); //recurse
    } else if (filename.endsWith(filter)) {
      outputArray.push({name: file, filePath: filename});
    }
  }
};

module.exports = {
  findFiles,
};
