/// <reference path="config/application.ts" />
/// <reference path="views/homeView.ts" />
/// <reference path="views/statisticsView.ts" />

class PDIPlayGroundApplication extends Application {
    public static own: PDIPlayGroundApplication;
    public static imagePath: string;

    constructor() {
        super();
        var self = this;

        this.createFragments();
        Fragments.on("load-all", function () {
            self.createHome();
            self.createPages();
        });
    }

    public initWithImage(image: string) {
        PDIPlayGroundApplication.imagePath = image;
        this.createViews();
    }

    private createHome() {
        this.views.push(new HomeView());
    }

    private createViews() {
        this.views = [
            new StatisticsView()
        ];
    }

    private createFragments() {
        this.fragments = new Fragments([
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
    }

    private createPages() {
        this.pages = new Pages();
    }
}

PDIPlayGroundApplication.own = new PDIPlayGroundApplication();