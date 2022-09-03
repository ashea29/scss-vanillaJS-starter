const path = require("path");
const { existsSync, readdirSync } = require("fs");

const findFiles = (sourcePath, filter, outputArray = []) => {
  if (!existsSync(sourcePath)) {
    console.log("No directory at this path", sourcePath);
    return;
  }

  const files = readdirSync(sourcePath, { withFileTypes: true });
  for (const file of files) {
    const filename = path.resolve(sourcePath, file.name);
    const fileExtension = path.extname(file.name);
    if (file.isDirectory()) {
      findFiles(filename, filter, outputArray);
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
