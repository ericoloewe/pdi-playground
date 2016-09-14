/// <reference path="../views/statisticsView.ts" />
/// <reference path="../config/fragments.ts" />
/// <reference path="../config/pages.ts" />

class Application {
    public static own: Application;
    protected pageManager: PageManager;

    constructor() {
        this.pageManager = new PageManager();
    }
}