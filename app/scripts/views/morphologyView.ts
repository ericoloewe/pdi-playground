/// <reference path="view.ts" />
/// <reference path="../managers/morphologyManager.ts" />
/// <reference path="../models/morphologyInfo.ts" />
/// <reference path="../utils/math.ts" />
"use strict";

class MorphologyView extends View {
    private canvas: HTMLCanvasElement;
    private canvasWidth: number;
    private canvasHeight: number;
    private morphologyManager: MorphologyManager;
    private maskArray: Array<Array<number>>;
    private gausMaskArray: Array<Array<number>>;

    public constructor(fragment: Fragment, picture: Picture) {
        super(fragment);

        this.morphologyManager = new MorphologyManager(picture);
        this.canvasHeight = 650;
        this.canvasWidth = 650;
    }

    public load() {
        super.load();

        this.fragment.on("load-all", function () {
            this.loadMorphologies();
            this.loadCanvas();
            this.bindEvents();
        }.bind(this));
    }

    public unload() {
        super.unload();
    }

    private bindEvents() {
        var self = this;

        var $panelFragment = this.fragment.$htmlLoadedWithChilds.siblings(".panel-morphology");

    }

    private loadCanvas() {
        var $canvasSection = this.fragment.$htmlLoadedWithChilds.find("#MORPHOLOGY_CANVAS_SECTION");
        var canvas = CanvasUtil.createCustomCanvas(this.canvasWidth, this.canvasHeight, this.morphologyManager.picture.getHtmlImage(), "MORPHOLOGY_CANVAS", "pdi-canvas");
        this.canvas = canvas;
        $canvasSection.append(canvas);
    }

    private loadMorphologies() {
        var self = this;
    }

    private restoreCanvasImage(canvas: HTMLCanvasElement = this.canvas) {
        CanvasUtil.reziseImageCanvas(this.canvas, this.morphologyManager.picture.getHtmlImage(), this.canvas.width, this.canvas.height);
    }
}