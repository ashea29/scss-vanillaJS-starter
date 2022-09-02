const copyAllFiles = (htmlArray = [], jsArray = []) => {
  if (existsSync("./dist/")) {
    execSync("rm -rf dist/ && mkdir ./dist");
    htmlArray.forEach((file) => {
      execSync(`cp ${file} dist/`);
    });
  } else {
    execSync("mkdir ./dist");
    htmlArray.forEach((file) => {
      execSync(`cp ${file} dist/`);
    });
  }

  if (existsSync("./dist/js")) {
    jsArray.forEach((file) => {
      execSync(`cp ${file} dist/js/`);
    });
  } else {
    execSync("mkdir ./dist/js");
    jsArray.forEach((file) => {
      execSync(`cp ${file} dist/js/`);
    });
  }
};

module.exports = {
  copyAllFiles,
};