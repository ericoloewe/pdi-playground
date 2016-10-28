var gulp = require("gulp");
var ts = require("gulp-typescript");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var appTsProject = ts.createProject("app/tsconfig.json");
var resourcesTsProject = ts.createProject("resources/tsconfig.json");

var paths = {
    compile: ["./app/scripts/**/*.ts"],
    vendors: ["./app/scripts/extensions/**/*.js", "!./app/scripts/extensions/jquery/*.js"],
    watch: ["./app/scripts/**/*.ts", "./app/scripts/**/*.js"],
    dest: "./app/scripts"
};

var resourcesPaths = {
    compile: ["./resources/**/**/*.ts"],
    watch: ["./resources/**/*.ts"],
    dest: "./resources/"
};

gulp.task("scripts:vendors", function () {
    return gulp.src(paths.vendors)
        .pipe(concat("vendors.js"))
        .pipe(gulp.dest(paths.dest))
        .pipe(rename({ suffix: ".min" }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest));
});

gulp.task("scripts", ["scripts:vendors"], function () {
    return gulp.src(paths.compile)
        .pipe(ts(appTsProject))
        .pipe(concat("app.js"))
        .pipe(gulp.dest(paths.dest))
        .pipe(rename({ suffix: ".min" }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest));
});

gulp.task("resources-scripts", function () {
    return gulp.src(resourcesPaths.compile)
        .pipe(ts(resourcesTsProject))
        .pipe(gulp.dest(resourcesPaths.dest));
});

gulp.task("scripts:watch", function () {
    gulp.watch(paths.watch, ["scripts"]);
});

gulp.task("resources-scripts:watch", function () {
    gulp.watch(resourcesPaths.watch, ["resources-scripts"]);
});