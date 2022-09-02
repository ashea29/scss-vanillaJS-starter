const path = require("path");
const { execSync } = require("child_process");
const { exit, argv } = require("node:process");
const { Command } = require("commander");
const { findFiles } = require("./utils/findFiles");
const { rootDir } = require("./utils/directories");

const program = new Command();
const args = argv.slice(2);

// console.log(args);

// const rootDir = path.resolve(__dirname, "../../");

program
  .option("-D, --dev", "Compile for development")
  .option("-P, --prod", "Compile for production");

program.parse(argv);
const options = program.opts();

const pagesPath = path.resolve(rootDir, "scss/pages/");
const pagesArray = [];
const sassCompileString = `sass ${
  options.dev ? "--watch --style=expanded" : "--style=compressed"
} --no-source-map`;

const compileSass = () => {
  findFiles(pagesPath, ".scss", pagesArray);

  if (pagesArray.length === 0) {
    const errorMsg = "No pages yet. Add some, then run the command again";
    console.log(errorMsg);
    exit();
  }

  pagesArray.forEach((page) =>
    sassCompileString.concat(` scss/pages/${page}:dist/css/${page}.css`)
  );

  execSync(sassCompileString);
  if (!options.dev) {
    exit();
  }
};

compileSass();
