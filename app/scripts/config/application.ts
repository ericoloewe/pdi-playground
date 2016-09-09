/// <reference path="../views/statisticsView.ts" />
/// <reference path="../config/fragments.ts" />
/// <reference path="../config/pages.ts" />

class Application {
    protected views: Array<View>;
    protected fragments: Fragments;
    protected pages: Pages;

    constructor() {
        this.views = new Array<View>();
    }
}