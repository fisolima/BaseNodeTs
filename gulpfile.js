var gulp = require("gulp");
var runSequence = require("run-sequence");
var del = require("del");
var bowerFiles = require('bower-files')();
var gulpInject = require('gulp-inject');
var ts = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var mocha = require('gulp-mocha');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-clean-css');

var tsServerProject = ts.createProject("src/server/tsconfig.json");
var tsClientProject = ts.createProject("src/client/tsconfig.json");
var tsTestProject = ts.createProject("src/tests/tsconfig.json");

/**
 * Internal tasks
 */

function GetArgumentVersionValue() {
    var version,
        i = process.argv.indexOf("--build_version");

    if (i>-1) {
        version = process.argv[i+1];
    }

    if (!version)
        throw new Error("--build_version option is not declared");

    return version;
}

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

gulp.task("client:prod:compile", function () {
    return tsClientProject.src()
            .pipe(tsClientProject())
            .js
            .pipe(gulp.dest("dist/public/js"));
});

gulp.task("client:prod:clean", function () {
    var version = GetArgumentVersionValue();

    return del(
        ["dist/public/css/**/*.css",
        "dist/public/css/libs",
        "!dist/public/css/style." + version + ".min.css",
        "dist/public/js/**/*.js",
        "dist/public/libs",
        "!dist/public/js/app." + version + ".min.js"]);
});

gulp.task("client:dev:copy_libs", function () {
    return gulp.src(bowerFiles.ext('js').files)
        .pipe(gulp.dest("dist/public/libs"));
});

gulp.task("client:dev:copy_style_libs", function () {
    return gulp.src(bowerFiles.ext('css').files)
        .pipe(gulp.dest("dist/public/css/libs"));
});

gulp.task("client:dev:copy_styles", function () {
    return gulp.src('src/client/css/**/*.css')
        .pipe(gulp.dest("dist/public/css"));
});

gulp.task("client:prod:concat_js", function() {
    var version = GetArgumentVersionValue();

    return gulp.src(["./dist/public/libs/**/*.js", "./dist/public/js/**/*.js"])
        .pipe(concat("app." + version + ".min.js"))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest("./dist/public/js"));
});

gulp.task("client:prod:concat_css", function() {
    var version = GetArgumentVersionValue();

    return gulp.src(["./dist/public/css/libs/**/*.css", "./dist/public/css/*.css"])
        .pipe(concat("style." + version + ".min.css"))
        .pipe(minifyCss())
        .pipe(gulp.dest("./dist/public/css"));
});

gulp.task("client:prod:inject", function () {
    var version = GetArgumentVersionValue();

    var sources = gulp.src(["./dist/public/js/app." + version + ".min.js", "./dist/public/css/style." + version + ".min.css"], {read: false});

    return gulp.src("./dist/public/index.html")
        .pipe(gulpInject(sources, {relative: true}))
        .pipe(gulp.dest("./dist/public"));
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

gulp.task("server:prod:compile", function() {
    return tsServerProject.src()
                .pipe(tsServerProject())
                .js
                .pipe(stripDebug())
                .pipe(gulp.dest("dist/server"));
});

gulp.task("test:clean", function () {
    return del("dist/test/**/*");
});

gulp.task("test:compile", function () {
    return tsTestProject.src()
            .pipe(tsTestProject())
            .js
            .pipe(gulp.dest("dist/test"));
});

gulp.task("test:run", function () {
    gulp.src(['dist/test/*.test.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec'
    }));
});

/**
 * Available tasks
 */

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
        "client:dev:copy_style_libs",
        "client:dev:copy_styles",
        "client:copy_html",
        "client:dev:compile",
        "client:dev:inject",        
        function () {
            done();
        }
    );
});

gulp.task("client:prod:build", function (done) {
    runSequence(
        "client:clean",
        "client:dev:copy_libs",
        "client:dev:copy_style_libs",
        "client:dev:copy_styles",
        "client:copy_html",
        "client:prod:compile",
        "client:prod:concat_js",
        "client:prod:concat_css",
        "client:prod:clean",
        "client:prod:inject",
        function () {
            done();
        }
    );
});

gulp.task("server:prod:build", function (done) {
    runSequence(
        "server:clean",
        "server:prod:compile",
        function() {
            done();
        }
    );
});

gulp.task("dev:build", function (done) {
    runSequence(
        "server:dev:build",
        "client:dev:build",
        function() {
            done();
        }
    );
});

gulp.task("prod:build", function (done) {
    runSequence(
        "server:prod:build",
        "client:prod:build",
        function() {
            done();
        }
    );
});

gulp.task("test", function (done) {
    runSequence(
        "test:clean",
        "test:compile",
        "test:run",
        function () {
            done();
        }
    );
});