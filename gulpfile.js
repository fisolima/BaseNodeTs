var gulp = require("gulp");
var runSequence = require("run-sequence");
var del = require("del");
var mainBowerFiles = require("main-bower-files");
var ts = require("gulp-typescript");

var tsServerProject = ts.createProject("src/server/tsconfig.json");
var tsClientProject = ts.createProject("src/client/tsconfig.json");

gulp.task("server:clean", function () {
    return del("dist/server/**/*");
});

gulp.task("client:clean", function () {
    return del("dist/public/**/*");
});

gulp.task("client:copy_html", function () {
    return gulp.src("src/client/**/*.html")
        .pipe(gulp.dest("dist/public"));
});

gulp.task("client:dev:copy_libs", function () {
    return gulp.src(mainBowerFiles({
            base: 'src/client/bower_components'
        }))
        .pipe(gulp.dest("dist/public/libs"));
});

gulp.task("server:build", function (done) {
    runSequence(
        "server:clean",
        function() {
            tsServerProject.src()
                .pipe(tsServerProject())
                .js.pipe(gulp.dest("dist/server"));

            done();
        }
    );
});

gulp.task("client:dev:build", function (done) {
    runSequence(
        "client:clean",
        "client:dev:copy_libs",
        "client:copy_html",
        function () {
            tsClientProject.src()
                .pipe(tsClientProject())
                .js.pipe(gulp.dest("dist/public/js"));

            done();
        }
    );
});
