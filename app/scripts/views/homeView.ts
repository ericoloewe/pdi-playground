/// <reference path="../models/picture.ts" />
/// <reference path="view.ts" />
"use strict";

class HomeView extends View {
    private $btnLoadAnImage: JQuery;
    private $btnContinueWithoutLoad: JQuery;
    private $inputLoadAnimage: JQuery;

    public constructor(fragment: Fragment) {
        super(fragment);
    }

    public load() {
        super.load();

        this.fragment.on("load-all", function () {
            this.fetchElements();
            this.bindEvents();
        }.bind(this));
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