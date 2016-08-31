var gulp = require("gulp");
var ts = require("gulp-typescript");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var tsProject = ts.createProject("tsconfig.json");

var paths = {
    compile: ["./app/scripts/**/*.ts"],
    watch: ["./app/scripts/**/*.ts"],
    dest: "./app/scripts"
};

var resourcesPaths = {
    js: ["./resources/imports.js", "./main.js"],
    compile: ["./resources/**/*.ts"],
    watch: ["./resources/**/*.ts"],
    dest: "./"
};

gulp.task("scripts", function () {
    return gulp.src(paths.compile)
        .pipe(ts({
            noImplicitAny: true,
            out: "app.min.js"
        }))
        .pipe(concat("app.js"))
        .pipe(gulp.dest(paths.dest))
        .pipe(rename({ suffix: ".min" }))        
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest));
});

gulp.task("resources-scripts:ts", function () {
    return gulp.src(resourcesPaths.compile)
        .pipe(ts(tsProject))
        .pipe(concat("main.js"))
        .pipe(gulp.dest(resourcesPaths.dest))
        .pipe(rename({ suffix: ".min" }))
        .pipe(uglify())
        .pipe(gulp.dest(resourcesPaths.dest));
});

gulp.task("resources-scripts", ["resources-scripts:ts"], function () {
    return gulp.src(resourcesPaths.js)
        .pipe(concat("main.js"))
        .pipe(gulp.dest(resourcesPaths.dest))
        .pipe(rename({ suffix: ".min" }))
        .pipe(uglify())
        .pipe(gulp.dest(resourcesPaths.dest));
});

gulp.task("scripts:watch", function () {
    gulp.watch(paths.watch, ["scripts"]);
});

gulp.task("resources-scripts:watch", function () {
    gulp.watch(resourcesPaths.watch, ["resources-scripts"]);
});