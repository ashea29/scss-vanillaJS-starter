const path = require("path");
const { readFileSync, writeFileSync } = require("fs");
const postcss = require('gulp-postcss')
const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const { cssPath } = require("./scripts/utils/paths");

gulp.task('css_dev', function () {
  const plugins = [
    require('postcss-import'),
    require('autoprefixer')(),
    require('postcss-preset-env'),
    require('postcss-jit-props')(require('open-props'))
  ]

  return gulp.src(['./src/scss/*.scss', './src/scss/pages/**/*.scss'])
    .pipe(sass({ 
      outputStyle: "expanded"
    }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./dist/css'))
})

gulp.task('css_prod', function () {
  const plugins = [
    require('postcss-import'),
    require('autoprefixer')(),
    require('postcss-preset-env'),
    require('postcss-jit-props')(require('open-props'))
  ]

  return gulp.src(['./src/scss/*.scss', './src/scss/pages/**/*.scss'])
    .pipe(sass({ 
      outputStyle: "compressed" 
    }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./dist/css'))
})

gulp.task('modifyGlobalCSS_dev', function (done) {
  const globalOutputFile = readFileSync(path.resolve(cssPath, 'globalStyles.css'))
  let newGlobalOutputFile

  const outputToArray = globalOutputFile.toString().split("\n")
  outputToArray.shift()
  newGlobalOutputFile = outputToArray.join("\n")

  writeFileSync(
    path.resolve(cssPath, 'globalStyles.css'),
    newGlobalOutputFile,
    {}
  )

  done()
})

gulp.task('modifyGlobalCSS_prod', function (done) {
  const globalOutputFile = readFileSync(path.resolve(cssPath, 'globalStyles.css'))
  let newGlobalOutputFile

  const outputToArray = globalOutputFile.toString().split("\n")
  outputToArray.shift()
  newGlobalOutputFile = outputToArray.join("")

  writeFileSync(
    path.resolve(cssPath, 'globalStyles.css'),
    newGlobalOutputFile,
    {}
  )

  done()
})

gulp.task('serve', gulp.series('css_dev', 'modifyGlobalCSS_dev', function () {
  console.log(process.env.NODE_ENV)
  gulp.watch(['./src/scss/*.scss', './src/scss/pages/**/*.scss'], gulp.series('css_dev', 'modifyGlobalCSS_dev'))
}))

gulp.task('build', gulp.series('css_prod', 'modifyGlobalCSS_prod'))