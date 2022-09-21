const { execSync } = require("child_process");
const { exit } = require("node:process");
// const { Command } = require("commander");

// const program = new Command();

// program
//   .option("-D, --dev", "Compile for development")
//   .option("-P, --prod", "Compile for production");

// program.parse(argv);
// const options = program.opts();

const compileSass = (devBuild) => {
  const sassCompileString = `sass ${
    devBuild ? "--watch --style=expanded" : "--style=compressed"
  } --no-source-map src/scss/globalStyles.scss:dist/css/globalStyles.css src/scss/pages/:dist/css/`;
  execSync(sassCompileString);
  if (devOption !== true) {
    exit();
  }
};

// compileSass();
export default compileSass;
