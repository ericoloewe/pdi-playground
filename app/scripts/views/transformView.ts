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
        var $thread: number;
        var isHorizontalMirroring = false;
        var $panelFragment = this.fragment.$htmlLoadedWithChilds.siblings(".panel-transforms");
        var $iconsList = this.fragment.$htmlLoadedWithChilds.find(".transforms-list");

        $panelFragment.find(".panel-translation .form-pos-x, .panel-translation .form-pos-y").on("change keyup", function (e) {
            var x = $panelFragment.find(".panel-translation .form-pos-x").val();
            var y = $panelFragment.find(".panel-translation .form-pos-y").val();

            clearTimeout($thread);
            $thread = setTimeout(function () {
                self.translateTo(x, y);
            });

            return e.preventDefault();
        });

        $panelFragment.find(".panel-rotation form").on("submit", function (e) {
            var formData: any = new FormData(this);
            self.rotateTo(formData.get("posX"), formData.get("posY"), formData.get("angle"));
            return e.preventDefault();
        });

        $panelFragment.find(".panel-enlarge form").on("submit", function (e) {
            var formData: any = new FormData(this);
            self.enlargeTo(formData.get("percent"));
            return e.preventDefault();
        });

        $panelFragment.find(".panel-reduction form").on("submit", function (e) {
            var formData: any = new FormData(this);
            self.reduceTo(formData.get("percent"));
            return e.preventDefault();
        });

        $panelFragment.find(".panel-mirroring form").on("submit", function (e) {
            var formData: any = new FormData(this);
            var wantHorizontalMirror = formData.get("horizontal-mirroring") === "on";
            var wantVerticalMirror = formData.get("vertical-mirroring") === "on";

            self.applyMirroringToCanvas({ vertical: wantVerticalMirror, horizontal: wantHorizontalMirror });
            return e.preventDefault();
        });

        $panelFragment.find(".panel-matrix form").on("submit", function (e) {
            var matrix = new Array<Array<number>>([], []);
            var formData: any = new FormData(this);

            matrix[0][0] = parseFloat(formData.get("pos00"));
            matrix[0][1] = parseFloat(formData.get("pos01"));
            matrix[0][2] = parseFloat(formData.get("pos02"));
            matrix[1][0] = parseFloat(formData.get("pos10"));
            matrix[1][1] = parseFloat(formData.get("pos11"));
            matrix[1][2] = parseFloat(formData.get("pos12"));

            self.applyFreeTransform(matrix);
            return e.preventDefault();
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

                if (posX >= 0 && posX < info.matrixWidth && posY >= 0 && posY < info.matrixHeight) {
                    return newIndex * 4 + info.colorType;
                }
            }, $("<i>").addClass("glyphicon glyphicon-move")));

            self.transformManager.addTransform(new Transform("ROTACAO", function (info: TransformInfo) {
                var pos1 = info.x - info.params.centerX;
                var pos2 = info.y - info.params.centerY;
                var newPosX = info.params.centerX - pos1 * info.params.cos + pos2 * info.params.sin;
                var newPosY = info.params.centerX - pos1 * info.params.sin - pos2 * info.params.cos;

                newPosX = Math.round(newPosX);
                newPosY = Math.round(newPosY);

                var newIndex = newPosX + newPosY * info.matrixWidth;

                if (newPosX >= 0 && newPosX < info.matrixWidth && newPosY >= 0 && newPosY < info.matrixHeight) {
                    return newIndex * 4 + info.colorType;
                }
            }, $("<i>").addClass("glyphicon").append("∢")));

            self.transformManager.addTransform(new Transform("AMPLIACAO", function (info: TransformInfo) {
                var percent = info.params.percent;
                var newPosX = info.x / percent;
                var newPosY = info.y / percent;

                var newIndex = Math.round(newPosX + newPosY * info.matrixWidth * percent);

                if (newPosX >= 0 && newPosX < info.matrixWidth * percent && newPosY >= 0 && newPosY < info.matrixHeight * percent) {
                    return newIndex * 4 + info.colorType;
                }
            }, $("<i>").addClass("glyphicon glyphicon-resize-full")));

            self.transformManager.addTransform(new Transform("REDUCAO", function (info: TransformInfo) {
                var percent = info.params.percent;
                var newPosX = Math.round(info.x * percent);
                var newPosY = Math.round(info.y * percent);

                var newIndex = newPosX + newPosY * info.matrixWidth;

                if (newPosX >= 0 && newPosX < info.matrixWidth && newPosY >= 0 && newPosY < info.matrixHeight) {
                    return newIndex * 4 + info.colorType;
                }
            }, $("<i>").addClass("glyphicon glyphicon-resize-small")));

            self.transformManager.addTransform(new Transform("ESPELHAMENTO", function (info: TransformInfo) {
                var wantHorizontalMirror = info.params.horizontal;
                var wantVerticalMirror = info.params.vertical;
                var newPosX = wantHorizontalMirror ? info.matrixWidth - info.x : info.x;
                var newPosY = wantVerticalMirror ? info.matrixHeight - info.y : info.y;

                var newIndex = newPosX + newPosY * info.matrixWidth;

                if (newPosX >= 0 && newPosX < info.matrixWidth && newPosY >= 0 && newPosY < info.matrixHeight) {
                    return newIndex * 4 + info.colorType;
                }
            }, $("<i>").addClass("glyphicon glyphicon-road")));

            self.transformManager.addTransform(new Transform("MATRIZ", function (info: TransformInfo) {
                var matrix = info.params.matrix;
                var newPosX = (info.x * matrix[0][0]) + (info.y * matrix[0][1]) + (matrix[0][2]);
                var newPosY = (info.x * matrix[1][0]) + (info.y * matrix[1][1]) + (matrix[1][2]);

                newPosX = Math.round(newPosX);
                newPosY = Math.round(newPosY);

                var newIndex = newPosX + newPosY * info.matrixWidth;

                if (newPosX >= 0 && newPosX < info.matrixWidth && newPosY >= 0 && newPosY < info.matrixHeight) {
                    return newIndex * 4 + info.colorType;
                }
            }, $("<i>").addClass("glyphicon glyphicon-th")));

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

    private rotateTo(x: number, y: number, angle: number) {
        x = Math.round(x);
        y = Math.round(y);
        angle = Math.toRadians(Math.round(angle));

        this.transformManager.restoreCanvasImage(this.canvas);
        this.transformManager.applyTransformByNameToCanvas("ROTACAO", this.canvas, {
            centerX: x,
            centerY: y,
            angle: angle,
            sin: Math.sin(angle),
            cos: Math.cos(angle)
        });
    }

    private enlargeTo(percent: string) {
        var percentNumber = parseFloat(percent);

        this.transformManager.restoreCanvasImage(this.canvas);
        this.transformManager.applyTransformByNameToCanvas("AMPLIACAO", this.canvas, { percent: percentNumber });
    }

    private reduceTo(percent: string) {
        var percentNumber = parseFloat(percent);

        this.transformManager.restoreCanvasImage(this.canvas);
        this.transformManager.applyTransformByNameToCanvas("REDUCAO", this.canvas, { percent: percentNumber });
    }

    private applyMirroringToCanvas(options: Object) {
        this.transformManager.restoreCanvasImage(this.canvas);
        this.transformManager.applyTransformByNameToCanvas("ESPELHAMENTO", this.canvas, options);
    }

    private applyFreeTransform(matrix: Array<Array<number>>) {
        this.transformManager.restoreCanvasImage(this.canvas);
        this.transformManager.applyTransformByNameToCanvas("MATRIZ", this.canvas, { matrix: matrix });
    }
}