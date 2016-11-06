/// <reference path="view.ts" />
/// <reference path="../managers/segmentationManager.ts" />
"use strict";

class SegmentationView extends View {
    private canvas: HTMLCanvasElement;
    private canvasWidth: number;
    private canvasHeight: number;
    private segmentationManager: SegmentationManager;

    public constructor(fragment: Fragment, picture: Picture) {
        super(fragment);

        this.segmentationManager = new SegmentationManager(picture);
        this.canvasHeight = 650;
        this.canvasWidth = 650;

        this.fragment.on("load-all", function() {
            this.loadSegmentations();
            this.loadCanvas();
            this.bindEvents();
        }.bind(this));
    }

    private bindEvents() {
        var self = this;
    }

    private loadCanvas() {
        var $canvasSection = this.fragment.$htmlLoadedWithChilds.find("#SEGMENTATION_CANVAS_SECTION");
        var canvas = CanvasUtil.createCustomCanvas(this.canvasWidth, this.canvasHeight, this.segmentationManager.picture.getHtmlImage(), "SEGMENTATION_CANVAS", "pdi-canvas");
        this.canvas = canvas;
        $canvasSection.append(canvas);
    }

    private loadSegmentations() {

    }
}