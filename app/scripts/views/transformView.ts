/// <reference path="../models/picture.ts" />
/// <reference path="../managers/transformManager.ts" />
/// <reference path="../references/jquery/main.ts" />
/// <reference path="view.ts" />
"use strict";

class TransformView extends View {
    private transformManager: TransformManager;
    private canvas: HTMLCanvasElement;
    private canvasWidth: number;
    private canvasHeight: number;
    private $canvasSection: JQuery;

    public constructor(fragment: Fragment, picture: Picture) {
        super(fragment);
        this.transformManager = new TransformManager(picture);
        this.canvasHeight = 650;
        this.canvasWidth = 650;
        this.loadTransforms();
        this.loadCanvas();
    }

    private loadCanvas() {
        var self = this;
        this.fragment.on("load-all", function () {
            self.$canvasSection = self.fragment.$htmlLoadedWithChilds.find("#TRANSFORM_CANVAS_SECTION");
            var canvas = CanvasUtil.createCustomCanvas(self.canvasWidth, self.canvasHeight, self.transformManager.picture.getHtmlImage(), "TRANSFORM_CANVAS", "pdi-canvas");
            self.canvas = canvas;
            self.$canvasSection.append(canvas);
        });
    }

    private loadTransforms() {
        var self = this;
        var a = new Array();

        this.transformManager.picture.on("load-all-values", function () {
            self.transformManager.addTransform(new Transform("TRANSLACAO", function (info: TransformInfo) {
                var posY = info.y + info.params.translateY;
                var posX = info.x + info.params.translateX;
                var newIndex = posX + posY * info.matrixWidth;
                var maxPosX = info.matrixWidth;

                if (posX >= maxPosX || posX < 0) {
                    return undefined;
                }

                return newIndex * 4 + info.colorType;
            }, $("<i>").addClass("glyphicon glyphicon-move")));

            self.loadTranformsAtScreen();
        });
    }

    private loadTranformsAtScreen() {
        var self = this;
        var transformList = this.fragment.$htmlLoadedWithChilds.find(".transforms-list");

        transformList.append(this.transformManager.getTransforms().map(function (transform) {
            return $("<li>")
                .attr("data-transform-name", transform.name.toString())
                .attr("title", transform.name.toString())
                .click(function (e) {
                    var $canvas = $(this);
                    self.openPanelByName($canvas.data("transform-name"));
                    return e.preventDefault();
                })
                .append(
                transform.$icon
                );
        }));
    }

    private openPanelByName(name: String) {
        this.transformManager.restoreCanvasImage(this.canvas);
        this.transformManager.applyTransformByNameToCanvas(name, this.canvas, { translateX: 0, translateY: 100 });
    }
}