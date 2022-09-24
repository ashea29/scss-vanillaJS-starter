const { argv } = require("node:process");
const { Command } = require("commander");
const concurrently = require('concurrently');
const { outputHTMLandJS, compileSass } = require("./utils/utils");

const program = new Command();

program
  .option("-D, --dev", "Compile for development")
  .option("-P, --prod", "Compile for production");

program.parse(argv);
const build = program.opts();

if (build.dev) {
  concurrently([
    'nodemon ./scripts/utils/dev/outputHTMLandJS.js', 'node ./scripts/utils/dev/compileSass.js', 'node ./scripts/dev.js'
  ])
}

if (build.prod) {
  outputHTMLandJS();
  compileSass();
}
