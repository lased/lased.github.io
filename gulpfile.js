import groupCssMediaQueries from 'gulp-group-css-media-queries';
import extractMediaQuery from 'postcss-extract-media-query';
import stripCssComments from 'gulp-strip-css-comments';
import { postcssPlugin as uncss } from 'uncss';
import htmlmin from 'gulp-html-minifier';
import postcss from 'gulp-postcss';
import { deleteAsync } from 'del';
import { resolve } from 'path';
import uglify from 'gulp-uglify';
import csso from 'gulp-csso';
import gulp from 'gulp';
const DIST = 'build';
const pathToDist = resolve(DIST);

async function clean() {
  await deleteAsync([pathToDist]);
  return true;
}

function html() {
  return gulp
    .src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(DIST));
}

function assets() {
  return gulp.src('src/assets/**/*').pipe(gulp.dest(`${DIST}/assets`));
}

function js() {
  return gulp.src('src/**/*.js').pipe(uglify()).pipe(gulp.dest(DIST));
}

function css() {
  const plugins = [
    uncss({
      html: [`${DIST}/*.html`],
      ignore: ['.header__links_opened'],
    }),
    extractMediaQuery({
      output: {
        path: resolve(DIST),
      },
      queries: {
        '(max-width:1024px)': 'tablet',
        '(max-width:768px)': 'mobile',
      },
    }),
  ];

  return gulp
    .src('src/**/*.css')
    .pipe(groupCssMediaQueries())
    .pipe(stripCssComments())
    .pipe(csso())
    .pipe(postcss(plugins))
    .pipe(gulp.dest(DIST));
}

const tasks = [clean, html, js, assets, css];

export default gulp.series(...tasks);
