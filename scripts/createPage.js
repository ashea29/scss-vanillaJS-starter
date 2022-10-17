const { argv } = require("node:process");
const path = require("path");
const { platform } = require("os");
const { execSync } = require("child_process");
const {
  existsSync,
  writeFileSync,
} = require("node:fs");
const { scssPath, srcDir } = require('./utils/paths')

const OS = platform();


const args = argv.slice(2)
const moduleName = args[0]

const pageStylesPath = path.resolve(scssPath, "pages")
const newModulePath = `${pageStylesPath}${OS === "win32" ? "\\" : "/"}${moduleName}`
const htmlPagesPath = path.resolve(srcDir, "pages")
const newHtmlPath = `${htmlPagesPath}${OS === "win32" ? "\\" : "/"}${moduleName}.html`

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

const scssIndexTemplate = `
@use './main' as *;
@use './responsive' as *;
`.trim()

const pageTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
`.trim()


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


writeFileSync(
  `${newHtmlPath}`,
  pageTemplate,
  {}
)

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