const { execSync } = require("child_process");
const { exit } = require("node:process");

const compileSass = (devBuild) => {
  const sassCompileString = `sass ${
    devBuild ? "--watch --style=expanded" : "--style=compressed"
  } --no-source-map src/scss/globalStyles.scss:dist/css/globalStyles.css src/scss/pages/:dist/css/`;
  execSync(sassCompileString);
  if (devBuild !== true) {
    exit();
  }
};

// module.exports = {
//   compileSass,
// };

compileSass();
