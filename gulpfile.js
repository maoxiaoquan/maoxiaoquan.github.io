const path = require("path");
const gulp = require("gulp");

gulp.task("copy", function () {
  return gulp.src("./src/.vuepress/dist/**/*").pipe(gulp.dest("./docs"));
});
