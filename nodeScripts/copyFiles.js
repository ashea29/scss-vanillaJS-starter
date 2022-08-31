const path = require("path")
const { existsSync, readdirSync, lstatSync} = require("fs")
const { execSync } = require('child_process')
const { exit } = require('node:process')


const htmlFilesArray = []
const jsFilesArray = [] 

const findFiles = (sourcePath, filter, outputArray = []) => {

  if (!existsSync(sourcePath)) {
    console.log("No directory at this path", sourcePath);
    return;
  }

  const files = readdirSync(sourcePath);
  for (const file of files) {
    const filename = path.join(sourcePath, file);
    const stat = lstatSync(filename);
    if (stat.isDirectory()) {
      findFiles(filename, filter, outputArray); //recurse
    } else if (filename.endsWith(filter)) {
      outputArray.push(filename)
    }
  }
}

findFiles("./pages", ".html", htmlFilesArray);
findFiles("./js", ".js", jsFilesArray);


// console.log(htmlFilesArray)

const copyAllFiles = () => {
    
    if (existsSync('./dist/')) {
        htmlFilesArray.forEach((file) => {
            execSync(`cp ${file} dist/`)
        })  
    } else {
        execSync('mkdir ./dist')
        htmlFilesArray.forEach((file) => {
            execSync(`cp ${file} dist/`)
        }) 
    }
    
    if (existsSync('./dist/js')) {
        jsFilesArray.forEach((file) => {
            execSync(`cp ${file} dist/js/`)
        })
    } else {
        execSync('mkdir ./dist/js')
        jsFilesArray.forEach((file) => {
            execSync(`cp ${file} dist/js/`)
        })
    }
    
exit()
    
}

copyAllFiles()
