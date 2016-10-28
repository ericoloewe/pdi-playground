var gulp = require("gulp");
var ts = require("gulp-typescript");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var appTsProject = ts.createProject("app/tsconfig.json");
var srcTsProject = ts.createProject("src/tsconfig.json");

var paths = {
    compile: ["./app/scripts/**/*.ts"],
    vendors: ["./app/scripts/extensions/**/*.js", "!./app/scripts/extensions/jquery/*.js"],
    watch: ["./app/scripts/**/*.ts", "./app/scripts/**/*.js"],
    dest: "./app/scripts"
};

var srcPaths = {
    compile: ["./src/**/**/*.ts"],
    watch: ["./src/**/*.ts"],
    dest: "./src/"
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

gulp.task("src-scripts", function () {
    return gulp.src(srcPaths.compile)
        .pipe(ts(srcTsProject))
        .pipe(gulp.dest(srcPaths.dest));
});

gulp.task("scripts:watch", function () {
    gulp.watch(paths.watch, ["scripts"]);
});

gulp.task("src-scripts:watch", function () {
    gulp.watch(srcPaths.watch, ["src-scripts"]);
});