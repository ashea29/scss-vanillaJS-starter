const { execSync } = require("child_process");
const { exit, argv } = require("node:process");
const { Command } = require("commander");
const compileSass = require("./compileSass");
const copyHTMLandJS = require("./copyHTMLandJS");

const program = new Command();

program
  .option("-D, --dev", "Compile for development")
  .option("-P, --prod", "Compile for production");

program.parse(argv);
const options = program.opts();

compileSass(options.dev);
copyHTMLandJS();
