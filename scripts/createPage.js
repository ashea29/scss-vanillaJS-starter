const { argv, exit } = require("node:process");
const path = require("path");
const { platform } = require("os");
const { execSync } = require("child_process");
const {
  existsSync,
  writeFileSync,
} = require("node:fs");
const commander = require('commander')
const { scssPath, srcDir } = require('./utils/paths');

const OS = platform();
const { Command } = commander
const args = argv.slice(2)
const moduleName = args[0]


const program = new Command();

program
  .option("-F, --favicon", "Add favicon link to HTML")
  .option("-J, --javascript", "Create JS file for page");

program.parse(argv);
const options = program.opts()

let inquirer
let chalk
let stripIndent

const loadModules = async () => {
  const { default: inquirerDefault } = await import('inquirer')
  const { default: chalkDefault } = await import("chalk")
  const { default: stripIndentDefault } = await import('strip-indent')

  inquirer = inquirerDefault
  chalk = chalkDefault
  stripIndent = stripIndentDefault
}

const pageStylesPath = path.resolve(scssPath, "pages")
const newModulePath = `${pageStylesPath}${OS === "win32" ? "\\" : "/"}${moduleName}`
const htmlPagesPath = path.resolve(srcDir, "pages")
const newHtmlPath = `${htmlPagesPath}${OS === "win32" ? "\\" : "/"}${moduleName}.html`
const jsPath = path.resolve(srcDir, "js")
const newJSdir = `${jsPath}${OS === "win32" ? "\\" : "/"}${moduleName}`

const faviconPreference = {
  type: "confirm",
  name: "Favicon Preference",
  message: "Do you want to add a favicon link to the HTML file?",
  default: false,
  when: (answers) => {
    return (!answers["Favicon Preference"]) && !options.favicon
  }
}

const javascriptPreference = {
  type: "confirm",
  name: "JavaScript Preference",
  message: "Do you want to add a JavaScript file for this page?",
  default: false,
  when: (answers) => {
    return (!answers["JavaScript Preference"]) && !options.javascript
  }
}


const scssFilesToGenerate = [
  {
    name: '_config',
    ext: '.scss'
  },
  {
    name: '_main-imports',
    ext: '.scss'
  },
  {
    name: '_main',
    ext: '.scss'
  },
  {
    name: '_responsive-imports',
    ext: '.scss'
  },
  {
    name: '_responsive',
    ext: '.scss'
  },
  {
    name: 'index',
    ext: '.scss'
  }
]

loadModules()
  .then(() => {
    const scssIndexTemplate = stripIndent(`
      @use './main' as *;
      @use './responsive' as *;
    `).trim()

    const pageTemplate = (answers) => stripIndent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${options.favicon || answers["Favicon Preference"] ? `<link rel="icon" type="image/png" sizes="32x32" href="">` : ''}
        <title>${moduleName[0].toUpperCase() + moduleName.substring(1)}</title>
      </head>
      <body>
        <header class="header">
          <h1>${moduleName[0].toUpperCase() + moduleName.substring(1)}</h1>
        </header>

        <main class="main">

        </main>
      </body>
      </html>
    `).trim()

    if (!options.javascript || !options.favicon) {
      inquirer.prompt([
        faviconPreference,
        javascriptPreference
      ]).then((answers) => {
        if (!existsSync(pageStylesPath)) {
          execSync(`mkdir ${pageStylesPath}`)
        }
        
        if (!existsSync(htmlPagesPath)) {
          execSync(`mkdir ${htmlPagesPath}`)
        }
        
        if (moduleName && !existsSync(newModulePath)) {
          execSync(`mkdir ${newModulePath}`)
        } else if (!moduleName) {
          console.log('Exiting process without completing... no module name provided')
        } else if (moduleName && existsSync(newModulePath)) {
          console.log('Error - Module already exists')
        }

        writeFileSync(
          `${newHtmlPath}`,
          pageTemplate(answers),
          {}
        )
    
        if (options.javascript || answers["JavaScript Preference"]) {

          if (!existsSync(newJSdir)) {
            execSync(`mkdir ${newJSdir}`)
          }
          
          writeFileSync(
           `${newJSdir}${OS === "win32" ? "\\" : "/"}index.js`,
            `console.log('Hello from "${moduleName[0].toUpperCase() + moduleName.substring(1)}" page index.js!')`,
            {}
          )
        }

        scssFilesToGenerate.forEach((file) => {
          if (file.name !== 'index') {
            writeFileSync(
              `${newModulePath}${OS === "win32" ? "\\" : "/"}${file.name}${file.ext}`,
              '',
              {}
            )
          } else if (file.name === 'index') {
            writeFileSync(
              `${newModulePath}${OS === "win32" ? "\\" : "/"}${file.name}${file.ext}`,
              scssIndexTemplate,
              {}
            )
          }
        })
        console.log(chalk.cyan('All files successfully created.'))
      }).catch(error => console.log(error))
    }    
  }).catch(error => console.log(error))