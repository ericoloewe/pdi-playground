var gulp = require("gulp");
var requireDir = require("require-dir");

var todasTask = requireDir("./tasks/gulp");

var subTask = [
    "sass",
    "scripts",
    "src-scripts"
];

var subTaskWatch = [
    "sass:watch",
    "scripts:watch",
    "src-scripts:watch"
];

gulp.task("build", subTask, function (done) {
    done();
});

gulp.task("watch", subTaskWatch, function (done) {
    done();
});