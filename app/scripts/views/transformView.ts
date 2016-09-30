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
        var self = this;

        this.transformManager = new TransformManager(picture);
        this.canvasHeight = 650;
        this.canvasWidth = 650;

        this.fragment.on("load-all", function () {
            self.loadTransforms();
            self.loadCanvas();
            self.bindEvents();
        });
    }

    private bindEvents() {
        var self = this;
        var $thread:number;
        var $panelFragment = this.fragment.$htmlLoadedWithChilds.siblings(".panel-transforms");

        $panelFragment.find(".panel-translation .form-pos-x, .panel-translation .form-pos-y").on("change keyup", function () {
            var x = $panelFragment.find(".panel-translation .form-pos-x").val();
            var y = $panelFragment.find(".panel-translation .form-pos-y").val();

            clearTimeout($thread);
            $thread = setTimeout(function () {
                self.translateTo(x, y);
            });
        });
    }

    private loadCanvas() {
        this.$canvasSection = this.fragment.$htmlLoadedWithChilds.find("#TRANSFORM_CANVAS_SECTION");
        var canvas = CanvasUtil.createCustomCanvas(this.canvasWidth, this.canvasHeight, this.transformManager.picture.getHtmlImage(), "TRANSFORM_CANVAS", "pdi-canvas");
        this.canvas = canvas;
        this.$canvasSection.append(canvas);
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
            self.transformManager.addTransform(new Transform("ROTACAO", function (info: TransformInfo) {

            }, $("<i>").addClass("glyphicon").append("∢")));

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
        this.disableAllPanels();
        this.fragment.$htmlLoadedWithChilds.find(String.format("[data-panel-name={0}]", name)).addClass("active");
    }

    private disableAllPanels() {
        this.fragment.$htmlLoadedWithChilds.find("[data-panel-name]").removeClass("active");
    }

    private translateTo(x: number, y: number) {
        x = Math.round(x);
        y = Math.round(y);

        this.transformManager.restoreCanvasImage(this.canvas);
        this.transformManager.applyTransformByNameToCanvas("TRANSLACAO", this.canvas, { translateX: x, translateY: y });
    }
}