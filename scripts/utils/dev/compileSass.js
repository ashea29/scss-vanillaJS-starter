const path = require("path");
const { cssPath, scssPath } = require("../paths");
const { execSync } = require("child_process");


const compileSass = () => {
  const sassCompileString = `
    sass --watch --style=expanded --no-source-map ${
      path.resolve(scssPath, 'globalStyles.scss')
    }:${
      path.resolve(cssPath, 'globalStyles.css')
    } ${
      path.resolve(scssPath, 'pages')
    }:${
      path.resolve(cssPath)
    }`.trim();
  execSync(sassCompileString);
};

compileSass()