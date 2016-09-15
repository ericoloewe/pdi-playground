/// <reference path="../models/picture.ts" />
/// <reference path="view.ts" />
"use strict";

class HomeView extends View {
    private $btnLoadAnImage: JQuery;
    private $btnContinueWithoutLoad: JQuery;
    private $inputLoadAnimage: JQuery;

    public constructor(fragment: Fragment) {
        super(fragment);
        var self = this;
        
        this.fragment.on("load-all", function () {
            self.fetchElements();
            self.bindEvents();
        });        
    }

    private fetchElements() {
        this.$btnLoadAnImage = this.fragment.$htmlLoadedWithChilds.find(".btn-load-an-image");
        this.$btnContinueWithoutLoad = this.fragment.$htmlLoadedWithChilds.find(".btn-continue-without-load");
        this.$inputLoadAnimage = this.fragment.$htmlLoadedWithChilds.find(".input-load-an-image");
    }

    private bindEvents() {
        var self = this;

        this.$btnContinueWithoutLoad.click(function () {
            PDIPlayGroundApplication.own.initImage("media/img/Lenna.png");
        });

        this.$inputLoadAnimage.change(function () {
            PDIPlayGroundApplication.own.initImage(this.files[0].path);
        });
    }
}