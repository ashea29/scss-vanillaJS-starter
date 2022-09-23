const { argv } = require("node:process");
const { Command } = require("commander");
const { outputHTMLandJS, compileSass } = require("./utils/utils");

const program = new Command();

program
  .option("-D, --dev", "Compile for development")
  .option("-P, --prod", "Compile for production");

program.parse(argv);
const options = program.opts();

compileSass(options.dev);
outputHTMLandJS();
