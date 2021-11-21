const gulp = require('gulp');
const gulpless = require('gulp-less');
const postcss = require('gulp-postcss');
const debug = require('gulp-debug');
const csso = require('gulp-csso');
const autoprefixer = require('autoprefixer');

gulp.task('theme', () =>
  gulp
    .src('src/assets/less/*.less')
    .pipe(debug({ title: 'Less files:' }))
    .pipe(
      gulpless({
        javascriptEnabled: true,
      }),
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(
      csso({
        debug: true,
      }),
    )
    .pipe(gulp.dest('./public/css')),
);

gulp.task('less', () =>
  gulp
    .src('src/assets/less/index.less')
    .pipe(
      gulpless({
        javascriptEnabled: true,
      }),
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest('./public/css')),
);

gulp.task('watch', () =>
  gulp.watch('src/assets/less/**/*.less', gulp.series('theme', 'less')),
);
