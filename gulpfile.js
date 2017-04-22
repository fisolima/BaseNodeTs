var gulp = require("gulp");
var runSequence = require("run-sequence");
var del = require("del");
var bowerFiles = require('bower-files')();
var gulpInject = require('gulp-inject');
var ts = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");

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

gulp.task("client:dev:compile", function () {
    return tsClientProject.src()
            .pipe(sourcemaps.init())
            .pipe(tsClientProject())
            .js
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest("dist/public/js"));
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

gulp.task("server:dev:compile", function() {
    return tsServerProject.src()
                .pipe(sourcemaps.init())
                .pipe(tsServerProject())
                .js
                .pipe(sourcemaps.write("."))
                .pipe(gulp.dest("dist/server"));
});

gulp.task("server:dev:build", function (done) {
    runSequence(
        "server:clean",
        "server:dev:compile",
        function() {
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
        "client:dev:compile",
        "client:dev:inject",        
        function () {
            done();
        }
    );
});
