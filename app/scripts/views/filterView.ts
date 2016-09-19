/// <reference path="../models/picture.ts" />
/// <reference path="../utils/canvas.ts" />
/// <reference path="view.ts" />
"use strict";

class FilterView extends View {
    private filter: Filter;
    private canvas: HTMLCanvasElement;
    private $canvasSection: JQuery;

    public constructor(fragment: Fragment, image: Picture) {
        super(fragment);

        this.filter = new Filter(image);
        this.loadCanvas();
    }

    private loadCanvas() {
        var self = this;
        this.fragment.on("load-all", function() {
            self.$canvasSection = self.fragment.$htmlLoadedWithChilds.find("#FILTER_CANVAS_SECTION"); 
            var canvas = <HTMLCanvasElement>document.createElement('canvas');
            canvas.id = "FILTER_CANVAS";
            canvas.className = "pdi-canvas";
            canvas.width = 650;
            canvas.height = 650;

            CanvasUtil.reziseImageCanvas(canvas, self.filter.picture.getHtmlImage(), 650, 650);

            self.canvas = canvas;
            self.$canvasSection.append(canvas);
        });
    }
}