const { execSync } = require("child_process");
const { exit, argv } = require("node:process");
const { Command } = require("commander");

const program = new Command();

program
  .option("-D, --dev", "Compile for development")
  .option("-P, --prod", "Compile for production");

program.parse(argv);
const options = program.opts();

const sassCompileString = `sass ${
  options.dev ? "--watch --style=expanded" : "--style=compressed"
} --no-source-map src/scss/globalStyles.scss:dist/css/globalStyles.css src/scss/pages/:dist/css/`;

const compileSass = () => {
  execSync(sassCompileString);
  if (options.dev !== true) {
    exit();
  }
};

compileSass();
