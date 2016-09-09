/// <reference path="../models/picture.ts" />
/// <reference path="view.ts" />
"use strict";

class HomeView extends View {
    private $btnLoadAnImage: JQuery;
    private $btnContinueWithoutLoad: JQuery;
    private $inputLoadAnimage: JQuery;

    public constructor() {
        super($(".home"));
        
        this.fetchElements();
        this.bindEvents();
    }

    private fetchElements() {
        this.$btnLoadAnImage = $(".btn-load-an-image");
        this.$btnContinueWithoutLoad = $(".btn-continue-without-load");
        this.$inputLoadAnimage = $(".input-load-an-image");
    }

    private bindEvents() {
        var self = this;

        console.log(this);
        this.$btnContinueWithoutLoad.click(function () {
            console.log("here");
            PDIPlayGroundApplication.own.initWithImage("media/img/Lenna.png");
        });

        this.$inputLoadAnimage.change(function () {
            console.log(this.files[0]);
            PDIPlayGroundApplication.own.initWithImage(this.files[0].path);
        });
    }
}