/// <reference path="views/statisticsView.ts" />
/// <reference path="config/fragments.ts" />

var view = new StatisticsView();

view.render();

var fragments = new Fragments([
    new Fragment("home", "views/home.html"),
    new Fragment("statistics", "views/statistics.html", [
        new Fragment("color-gray", "views/statistics/color-gray.html"),
        new Fragment("color-red", "views/statistics/color-red.html"),
        new Fragment("color-green", "views/statistics/color-green.html"),
        new Fragment("color-blue", "views/statistics/color-blue.html"),
        new Fragment("color-alpha", "views/statistics/color-alpha.html")
    ]),
    new Fragment("header", "views/shared/header.html")
]);