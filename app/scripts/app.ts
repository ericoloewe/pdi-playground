/// <reference path="references/jquery/main.ts" />
/// <reference path="config/application.ts" />
/// <reference path="views/homeView.ts" />
/// <reference path="views/statisticsView.ts" />
/// <reference path="views/filterView.ts" />
/// <reference path="views/transformView.ts" />
/// <reference path="views/headerView.ts" />

class PDIPlayGroundApplication extends Application {
    public static own: PDIPlayGroundApplication;
    public static imagePath: string;
    public static actualPicture: Picture;
    public static canvas: Fragment;

    constructor() {
        super();
        this.createInitialPages();
        PDIPlayGroundApplication.canvas = new Fragment("canvas", "views/shared/canvas.html");
    }

    public initImage(imagePath: string) {
        var self = this;
        PDIPlayGroundApplication.imagePath = imagePath;

        PDIPlayGroundApplication.canvas.on("load-all", function () {
            PDIPlayGroundApplication.actualPicture = new Picture(imagePath, PDIPlayGroundApplication.canvas);
            $(PDIPlayGroundApplication.actualPicture.getHtmlImage()).on("load", function () {
                self.createPages();
                self.pageManager.activePageByName("header");
                self.pageManager.activePageByName("statistics");
                self.pageManager.activePageByName("canvas");
                self.pageManager.refreshLinks();
            });
        });
    }

    private createInitialPages() {
        this.pageManager = new PageManager([
            new Page(new HomeView(new Fragment("home", "views/home.html")), true),
            new Page(new HeaderView(new Fragment("header", "views/shared/header.html"))),
        ]);
    }

    private createPages() {
        this.pageManager.addAllPages([
            new Page(new StatisticsView(new Fragment("statistics", "views/statistics.html", [
                new Fragment("color-gray", "views/statistics/color-gray.html"),
                new Fragment("color-red", "views/statistics/color-red.html"),
                new Fragment("color-green", "views/statistics/color-green.html"),
                new Fragment("color-blue", "views/statistics/color-blue.html"),
                new Fragment("color-alpha", "views/statistics/color-alpha.html")
            ]), PDIPlayGroundApplication.actualPicture)),
            new Page(new FilterView(new Fragment("filters", "views/filters.html", [
                new Fragment("nav-filters", "views/filter/nav-filters.html")
            ]), PDIPlayGroundApplication.actualPicture)),
            new Page(new TransformView(new Fragment("transforms", "views/transforms.html", [
            ]), PDIPlayGroundApplication.actualPicture))
        ]);
    }
}

PDIPlayGroundApplication.own = new PDIPlayGroundApplication();