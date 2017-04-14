var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsServerProject = ts.createProject("src/server/tsconfig.json");
var tsClientProject = ts.createProject("src/client/tsconfig.json");

gulp.task("buildServer", function () {
    return tsServerProject.src()
        .pipe(tsServerProject())
        .js.pipe(gulp.dest("dist/server"));
});

gulp.task("buildClient", function () {
    return tsClientProject.src()
        .pipe(tsClientProject())
        .js.pipe(gulp.dest("dist/public"));
});