var gulp = require("gulp");
var runSequence = require("run-sequence");
var del = require("del");
var bowerFiles = require('bower-files')();
var gulpInject = require('gulp-inject');
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
    return gulp.src(["src/client/**/*.html","!src/client/bower_components/**/*"])
        .pipe(gulp.dest("dist/public"));
});

gulp.task("client:compile", function () {
    return tsClientProject.src()
            .pipe(tsClientProject())
            .js.pipe(gulp.dest("dist/public/js"));
});

gulp.task("client:dev:copy_libs", function () {
    return gulp.src(bowerFiles.ext('js').files)
        .pipe(gulp.dest("dist/public/libs"));
});

gulp.task("client:dev:copy_styles", function () {
    return gulp.src(bowerFiles.ext('css').files)
        .pipe(gulp.dest("dist/public/css"));
});

gulp.task("client:dev:inject", function () {
    var sources = gulp.src(["./dist/public/libs/**/*.js", "./dist/public/js/**/*.js", "./dist/public/css/**/*.css"], {read: false});

    return gulp.src("./dist/public/index.html")
        .pipe(gulpInject(sources, {relative: true}))
        .pipe(gulp.dest("./dist/public"));
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
        "client:dev:copy_styles",
        "client:copy_html",
        "client:compile",
        "client:dev:inject",        
        function () {
            done();
        }
    );
});
