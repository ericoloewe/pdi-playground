var gulp = require("gulp");
var compass = require("gulp-compass");
var cssmin = require("gulp-cssmin");
var rename = require("gulp-rename");

var paths = {
    compile: ["./app/styles/main.scss"],
    watch: ["./app/styles/**/*.scss"],
    dest: "./app/styles",
    compass: {
        sass: "app/styles",
        css: "app/styles",
        image: "app/media/img",
        font: "app/fonts"
    }
};

gulp.task("sass", function () {
    return gulp.src(paths.compile)
        .pipe(compass(paths.compass))
        .on("error", function () {
            console.log(arguments);
        })
        .pipe(rename({ suffix: ".min" }))
        .pipe(cssmin())
        .pipe(gulp.dest(paths.dest));
});

gulp.task("sass:watch", function () {
    gulp.watch(paths.watch, ["sass"]);
});