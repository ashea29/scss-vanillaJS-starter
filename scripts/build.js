const { argv } = require("node:process");
const { Command } = require("commander");
const { outputHTMLandJS } = require("./outputHTMLandJS");
const { compileSass } = require("./compileSass");

const program = new Command();

program
  .option("-D, --dev", "Compile for development")
  .option("-P, --prod", "Compile for production");

program.parse(argv);
const options = program.opts();

compileSass(options.dev);
outputHTMLandJS();
