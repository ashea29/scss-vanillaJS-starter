const { argv } = require("node:process");
const { Command } = require("commander");
const concurrently = require('concurrently');
const { outputHTMLandJS, compileSass } = require("./utils");
const { execSync } = require("node:child_process");

const program = new Command();

program
  .option("-D, --dev", "Compile for development")
  .option("-P, --prod", "Compile for production");

program.parse(argv);
const build = program.opts();


const cssOutputArray = []

if (build.dev) {
  concurrently([
    'nodemon ./scripts/utils/dev/outputHTMLandJS.js', 'yarn:gulp:dev', 'node ./scripts/dev.js'
  ])
}

if (build.prod) {
  outputHTMLandJS(cssOutputArray);
  execSync('yarn gulp:prod');
}
