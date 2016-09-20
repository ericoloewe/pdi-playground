/// <reference path="../models/picture.ts" />
/// <reference path="../utils/canvas.ts" />
/// <reference path="view.ts" />
"use strict";

class FilterView extends View {
    private filterManager: FilterManager;
    private canvas: HTMLCanvasElement;
    private canvasWidth: number;
    private canvasHeight: number;
    private $canvasSection: JQuery;

    public constructor(fragment: Fragment, image: Picture) {
        super(fragment);

        this.filterManager = new FilterManager(image);
        this.canvasHeight = 650;
        this.canvasWidth = 650;
        this.loadFilters();
        this.applyFilters();
        this.loadCanvas();
    }

    private loadCanvas() {
        var self = this;
        this.fragment.on("load-all", function () {
            self.$canvasSection = self.fragment.$htmlLoadedWithChilds.find("#FILTER_CANVAS_SECTION");
            var canvas = <HTMLCanvasElement>document.createElement('canvas');
            canvas.id = "FILTER_CANVAS";
            canvas.className = "pdi-canvas";
            canvas.width = self.canvasWidth;
            canvas.height = self.canvasHeight;

            CanvasUtil.reziseImageCanvas(canvas, self.filterManager.picture.getHtmlImage(), self.canvasWidth, self.canvasHeight);

            self.canvas = canvas;
            self.$canvasSection.append(canvas);
        });
    }

    private applyFilters() {
        var self = this;
        this.filterManager.picture.on("load-all-values", function () {
            self.filterManager.applyFilterByNameToCanvas("BLUE", self.canvas);
        });
    }

    private loadFilters() {
        var self = this;

        this.filterManager.picture.on("load-all-values", function () {
            var picture = self.filterManager.picture;
            var average = picture.gray.statistics.average;
            var median = picture.gray.statistics.median;
            var mode = picture.gray.statistics.mode;

            self.filterManager.addFilter(new Filter("BLUE", function (color: number, index: number) {
                if (color >= 128) {
                    color = average;
                }

                return color;
            }));

            self.filterManager.addFilter(new Filter("CONTRAST", function (color: number, index: number) {
                if (color >= 128) {
                    color = mode;
                }

                return color;
            }));

            self.filterManager.addFilter(new Filter("CONTRAST-2", function (color: number, index: number) {
                if (color >= 128) {
                    color = median;
                }

                return color;
            }));

            self.filterManager.addFilter(new Filter("HOT", function (color: number, index: number) {
                if (color < average) {
                    color = 0;
                }

                return color;
            }));

            self.filterManager.addFilter(new Filter("HOT-2", function (color: number, index: number) {
                if (color < average) {
                    color = 0;
                } else if (color > median) {
                    color = 255;
                }

                return color;
            }));
        });
    }
}