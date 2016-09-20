/// <reference path="../models/picture.ts" />
/// <reference path="../utils/canvas.ts" />
/// <reference path="view.ts" />
"use strict";

class FilterView extends View {
    private filter: Filter;
    private canvas: HTMLCanvasElement;
    private canvasWidth: number;
    private canvasHeight: number;
    private $canvasSection: JQuery;

    public constructor(fragment: Fragment, image: Picture) {
        super(fragment);

        this.filter = new Filter(image);
        this.canvasHeight = 650;
        this.canvasWidth = 650;
        this.applyFilters();
        this.loadCanvas();
    }

    private loadCanvas() {
        var self = this;
        this.fragment.on("load-all", function() {
            self.$canvasSection = self.fragment.$htmlLoadedWithChilds.find("#FILTER_CANVAS_SECTION"); 
            var canvas = <HTMLCanvasElement>document.createElement('canvas');
            canvas.id = "FILTER_CANVAS";
            canvas.className = "pdi-canvas";
            canvas.width = self.canvasWidth;
            canvas.height = self.canvasHeight;

            CanvasUtil.reziseImageCanvas(canvas, self.filter.picture.getHtmlImage(), self.canvasWidth, self.canvasHeight);

            self.canvas = canvas;
            self.$canvasSection.append(canvas);
        });
    }

    private applyFilters() {
        var self = this;
        this.filter.picture.on("load-all-values", function() {
            self.applyBlueFilter();
        });
    }

    private applyBlueFilter() {
        var picture = this.filter.picture;
        var newImageData = this.filter.applyFilter(function(color: number, index: number) {
            if(color >= 128) {
                color = picture.gray.statistics.average;
            }

            return color;
        });

        CanvasUtil.applyImageDataToCanvas(newImageData, this.canvas, this.filter.picture.width, this.filter.picture.height);
    }

    private applyContrastFilter() {
        var picture = this.filter.picture;
        var newImageData = this.filter.applyFilter(function(color: number, index: number) {
            if(color >= 128) {
                color = picture.gray.statistics.mode;
            }

            return color;
        });

        CanvasUtil.applyImageDataToCanvas(newImageData, this.canvas, this.filter.picture.width, this.filter.picture.height);
    }

    private applyContrast2Filter() {
        var picture = this.filter.picture;
        var newImageData = this.filter.applyFilter(function(color: number, index: number) {
            if(color >= 128) {
                color = picture.gray.statistics.median;
            }

            return color;
        });

        CanvasUtil.applyImageDataToCanvas(newImageData, this.canvas, this.filter.picture.width, this.filter.picture.height);
    }

    private applyHotFilter() {
        var picture = this.filter.picture;
        var average = picture.gray.statistics.average;
        var newImageData = this.filter.applyFilter(function(color: number, index: number) {
            if(color < average) {
                color = 0;
            }

            return color;
        });

        CanvasUtil.applyImageDataToCanvas(newImageData, this.canvas, this.filter.picture.width, this.filter.picture.height);
    }

    private applyHot2Filter() {
        var picture = this.filter.picture;
        var average = picture.gray.statistics.average;
        var median = picture.gray.statistics.median;
        var newImageData = this.filter.applyFilter(function(color: number, index: number) {
            if(color < average) {
                color = 0;
            } else if (color > median) {
                color = 255;
            }

            return color;
        });

        CanvasUtil.applyImageDataToCanvas(newImageData, this.canvas, this.filter.picture.width, this.filter.picture.height);
    }
}