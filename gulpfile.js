var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    header  = require('gulp-header'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    concat = require('gulp-concat');
    include = require("gulp-include");
    responsive = require('gulp-responsive');
    $ = require('gulp-load-plugins')();
    package = require('./package.json');


var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

gulp.task('images', function () {
  return gulp.src('src/images/*.jpg')
  .pipe($.responsive({
    // Resize all JPG images to three different sizes: 200, 500, and 630 pixels
    '*.jpg': [{
      width: 50,
      rename: { suffix: '-50px' },
    }, {
      width: 800,
      rename: { suffix: '-800px' },
    }, {
      // Compress, strip metadata, and rename original image
      rename: {
        suffix: '-original',
      },
    }],
    // Resize all PNG images to be retina ready
    // '*.png': [{
    //   width: 250,
    // }, {
    //   width: 250 * 2,
    //   rename: { suffix: '@2x' },
    // }],
  }, {
    // Global configuration for all images
    // The output quality for JPEG, WebP and TIFF output formats
    quality: 100,
    // Use progressive (interlace) scan for JPEG and PNG output
    progressive: true,
    // Strip all metadata
    withMetadata: false,
  }))
    .pipe(gulp.dest('assets/img/sizes'));
});

gulp.task('css', function () {
    return gulp.src('src/scss/style.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('assets/css'))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js',function(){
  gulp.src('src/js/*.js')
    .pipe(include())
      .on('error', console.log)
    .pipe(concat('scripts.js'))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest('assets/js'))
    .pipe(uglify())
    .pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('assets/js'))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "./"
        },
        open:false,
        notify:false
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload({
      open:false,
      notify:false
    });
});

gulp.task('default', ['images', 'css', 'js', 'browser-sync'], function () {
    gulp.watch("src/scss/*/*.scss", ['css']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("*.html", ['bs-reload']);
});
