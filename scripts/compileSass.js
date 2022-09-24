const path = require("path");
const { execSync } = require("child_process");
const { exit } = require("node:process");
const { cssPath, scssPath } = require("./utils/paths");

const compileSass = (devBuild) => {
  // const sassCompileString = `sass ${
  //   devBuild ? "--watch --style=expanded" : "--style=compressed"
  // } --no-source-map src/scss/globalStyles.scss:dist/css/globalStyles.css src/scss/pages/:dist/css/`;
  const sassCompileString = `
    sass ${
      devBuild ? "--watch --style=expanded" : "--style=compressed"
    } --no-source-map ${
      path.resolve(scssPath, 'globalStyles.scss')
    }:${
      path.resolve(cssPath, 'globalStyles.css')
    } ${
      path.resolve(scssPath)
    }:${
      path.resolve(cssPath)
    }`.trim();
  execSync(sassCompileString);
  if (devBuild !== true) {
    exit();
  }
  // console.log(sassCompileString)
};

module.exports = {
  compileSass,
};

// compileSass();
