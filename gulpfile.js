const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const notify = require('gulp-notify');
const csso = require('gulp-csso');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

// Server
gulp.task('server', function() {
  browserSync.init({
    server: {
      port: 3000,
      baseDir: 'build',
    },
  });

  gulp.watch('build/**/*').on('change', browserSync.reload);
});

// Pug
gulp.task('templates:compile', function buildHTML() {
  return gulp
    .src('src/templates/index.pug')
    .pipe(
      pug({
        pretty: true,
      }),
    )
    .pipe(gulp.dest('build'));
});

// Style
gulp.task('style:compile', function() {
  return gulp
    .src('src/styles/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 5 versions'] }))
    .on('error', notify.onError({ title: 'Error style' }))
    .pipe(csso())
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'));
});

// JavaScript
gulp.task('javascript', function() {
  return gulp
    .src(['node_modules/siema/dist/siema.min.js', 'src/js/main.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'));
});

// Sprite
gulp.task('sprite', function(cb) {
  const spriteData = gulp.src('src/images/icons/*.png').pipe(
    spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/sprite.png',
      cssName: 'sprite.scss',
    }),
  );

  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.css.pipe(gulp.dest('src/styles/global/'));
  cb();
});

// Delete
gulp.task('clean', function del(cb) {
  return rimraf('build', cb);
});

// Copy fonts
gulp.task('copy:fonts', function() {
  return gulp.src('./src/fonts/**/*.*').pipe(gulp.dest('build/fonts'));
});

// Copy images
gulp.task('copy:images', function() {
  return gulp.src('./src/images/**/*.*').pipe(gulp.dest('build/images'));
});

// Copy
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

// Watchers
gulp.task('watch', function() {
  gulp.watch('src/templates/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('src/styles/**/*.scss', gulp.series('style:compile'));
  gulp.watch('src/js/**/*.js', gulp.series('javascript'));
});

// Default
gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel(
      'templates:compile',
      'style:compile',
      'javascript',
      'sprite',
      'copy',
    ),
    gulp.parallel('watch', 'server'),
  ),
);
