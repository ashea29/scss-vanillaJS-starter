const { argv } = require("node:process");
const path = require("path");
const { platform } = require("os");
const { execSync } = require("child_process");
const {
  existsSync,
  writeFileSync,
} = require("node:fs");
const { scssPath } = require('./utils/paths')

const OS = platform();


const args = argv.slice(2)
const moduleName = args[0]

const pageStylesPath = path.resolve(scssPath, "pages")
const newModulePath = `${pageStylesPath}${OS === "win32" ? "\\" : "/"}${moduleName}`

if (!existsSync(pageStylesPath)) {
  execSync(`mkdir ${pageStylesPath}`)
}

if (moduleName && !existsSync(newModulePath)) {
  execSync(`mkdir ${newModulePath}`)
} else if (!moduleName) {
  console.log('Exiting process without completing... no module name provided')
} else if (moduleName && existsSync(newModulePath)) {
  console.log('Error - Module already exists')
}

const moduleIndexTemplate = `
@use './main' as *;
@use './responsive' as *;
`.trim()

const filesToGenerate = [
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


filesToGenerate.forEach((file) => {
  if (file.name !== 'index') {
    writeFileSync(
      `${newModulePath}${OS === "win32" ? "\\" : "/"}${file.name}${file.ext}`,
      '',
      {}
    )
  } else if (file.name === 'index') {
    writeFileSync(
      `${newModulePath}${OS === "win32" ? "\\" : "/"}${file.name}${file.ext}`,
      moduleIndexTemplate,
      {}
    )
  }
})