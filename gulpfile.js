const gulp = require("gulp");
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const uglifyCSS = require("gulp-uglifycss");
const concat = require("gulp-concat");
const del = require("del");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();

// CSS source file
const cssFiles = "./src/scss/**/*.scss";
const jsFiles = "./src/js/**/*.js";
const imgFiles = "./src/img/*";

// Css File Compile
function styles() {
  return gulp
    .src(cssFiles)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(concat("style.css"))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: "ie8", level: 2 }))
    .pipe(
      uglifyCSS({
        maxLineLen: 120,
        uglyComments: true
      })
    )
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp
    .src(jsFiles)
    .pipe(sourcemaps.init())
    .pipe(concat("script.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./dist/js"))
    .pipe(browserSync.stream());
}

function images() {
  return gulp
    .src(imgFiles)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
        })
      ])
    )
    .pipe(gulp.dest("./dist/images"))
    .pipe(browserSync.stream());
}

function clean() {
  return del(["dist/*"]);
}

// Browser-sync

function watch() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch("./src/scss/**/*.scss", styles);
  gulp.watch("./src/js/**/*.js", scripts);
  gulp.watch("./*.html").on("change", browserSync.reload);
}

gulp.task("styles", styles);
gulp.task("scripts", scripts);
gulp.task("images", images);
gulp.task("clean", clean);
gulp.task("watch", watch);
gulp.task("build", gulp.series(clean, gulp.parallel(styles, scripts, images)));
gulp.task("dev", gulp.series("build", "watch"));
