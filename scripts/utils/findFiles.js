const path = require("path");
const { existsSync, readdirSync, lstatSync } = require("fs");

const findFiles = (sourcePath, filter, outputArray = []) => {
  if (!existsSync(sourcePath)) {
    console.log("No directory at this path", sourcePath);
    return;
  }

  const files = readdirSync(sourcePath);
  for (const file of files) {
    const filename = path.join(sourcePath, file);
    const stat = lstatSync(filename);
    if (stat.isDirectory()) {
      findFiles(filename, filter, outputArray); //recurse
    } else if (filename.endsWith(filter)) {
      outputArray.push(filename);
    }
  }
};

module.exports = {
  findFiles,
};
