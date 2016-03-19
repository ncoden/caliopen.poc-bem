// -------------------------------------
//   Gulpfile
// -------------------------------------
// 
//   'build' (default)  : compile sass
// 
// -------------------------------------

// --- Configuration ---

var config = {
  srcDirectory: 'src',
  buildDirectory: '.build',
  destDirectory: 'dist',

  htmlMain: 'src/index.html',
  scssMain: 'src/scss/main.scss',
  scssFiles: [
    'src/scss/**/*.scss',
  ],

  scssVendorsNamespace: 'vendor',
  scssVendors: [
    './node_modules/foundation-apps/scss/**/*.scss',
  ],

  cssDestFile: 'dist/css/main.css',
  assetsDest: 'dist',
};


// --- Dependencies ---

// gulp and tasks
var gulp = require('gulp');
var gulpPlumber = require('gulp-plumber');
var gulpSequence = require('gulp-sequence');

// file management
var del = require('del');
var pathParse = require('path-parse');
var rename = require("gulp-rename");

// build (scss)
var sass = require('gulp-sass');


// --- Tasks ---

gulp.task('default', ['build']);

gulp.task('build', gulpSequence('clean', 'build:assets', 'build:scss'));

// config
var onError = function (err) {
  console.error(err);
  this.emit('end');
};
var runTimestamp = Math.round(Date.now()/1000);

// Build
gulp.task('build:assets', function() {
  return gulp.src(config.htmlMain)
    .pipe(gulp.dest(config.destDirectory));
});

gulp.task('build:scss', function(cb) {
  gulpSequence('build:scssVendors', 'build:scssPrepare', 'build:scssCompile', 'build:scssClean', cb);
});
gulp.task('build:scssVendors', function () {
  return gulp.src(config.scssVendors)
    .pipe(gulp.dest(config.buildDirectory + '/scss/' + config.scssVendorsNamespace));
});
gulp.task('build:scssPrepare', function () {
  return gulp.src(config.scssFiles)
    .pipe(gulp.dest(config.buildDirectory + '/scss'));
});
gulp.task('build:scssCompile', function () {
  var srcPath = pathParse(config.scssMain);
  var destPath = pathParse(config.cssDestFile);

  return gulp.src(config.buildDirectory + '/scss/' + srcPath.base)
    .pipe(gulpPlumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(rename(destPath.base))
    .pipe(gulp.dest(destPath.dir));
});
gulp.task('build:scssClean', function() {
  del(config.buildDirectory + '/scss');
});

gulp.task('clean', function() {
  return del(config.destDirectory + '/*')
      && del(config.buildDirectory);
});

// Development
gulp.task('watch', function() {
  gulp.watch(config.htmlMain, ['build:assets']);
  gulp.watch(config.scssFiles, ['build:scss']);
  gulp.watch(config.jsFiles, ['build:js']);
});
