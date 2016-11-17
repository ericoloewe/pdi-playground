/// <reference path="view.ts" />
/// <reference path="../managers/segmentationManager.ts" />
/// <reference path="../models/segmentationInfo.ts" />
/// <reference path="../utils/math.ts" />
"use strict";

class SegmentationView extends View {
    private canvas: HTMLCanvasElement;
    private canvasWidth: number;
    private canvasHeight: number;
    private segmentationManager: SegmentationManager;
    private maskArray: Array<Array<number>>;
    private gausMaskArray: Array<Array<number>>;

    public constructor(fragment: Fragment, picture: Picture) {
        super(fragment);

        this.segmentationManager = new SegmentationManager(picture);
        this.canvasHeight = 650;
        this.canvasWidth = 650;
        this.maskArray = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
        this.gausMaskArray = [[1, 2, 1], [2, 4, 2], [1, 2, 1]];
    }

    public load() {
        super.load();

        this.fragment.on("load-all", function () {
            this.loadSegmentations();
            this.loadCanvas();
            this.bindEvents();
        }.bind(this));
    }

    public unload() {
        super.unload();
    }

    private bindEvents() {
        var self = this;

        var $panelFragment = this.fragment.$htmlLoadedWithChilds.siblings(".panel-segmentation");

        this.segmentationManager.picture.on("load-all-values", function () {
            this.enableLoader();
            setTimeout(function () {
                this.disableLoader();
            }.bind(this), 10);
        }.bind(this));

        $panelFragment.find("#thresholding form").on("submit", function (e) {
            var formData: any = new FormData(this);

            self.applyThresholdingToCanvas(formData.get("filterName"), parseInt(formData.get("thresholding")));

            return e.preventDefault();
        });
    }

    private loadCanvas() {
        var $canvasSection = this.fragment.$htmlLoadedWithChilds.find("#SEGMENTATION_CANVAS_SECTION");
        var canvas = CanvasUtil.createCustomCanvas(this.canvasWidth, this.canvasHeight, this.segmentationManager.picture.getHtmlImage(), "SEGMENTATION_CANVAS", "pdi-canvas");
        this.canvas = canvas;
        $canvasSection.append(canvas);
    }

    private loadSegmentations() {
        var self = this;

        this.segmentationManager.addSegmentation(new Segmentation("ORIGINAL", function (info: SegmentationInfo) {
            return info.color;
        }));

        this.segmentationManager.addSegmentation(new Segmentation("CINZA", function (info: SegmentationInfo) {
            return (info.red + info.blue + info.green) / 3;
        }));

        this.segmentationManager.addSegmentation(new Segmentation("FILTRO-DA-MEDIANA", function (info: SegmentationInfo) {
            var x = info.x, y = info.y, z = 0;
            var halfMascLenght = Math.floor(info.params.mask.length / 2), halfMascRowLenght: number;
            var arrayToCalcMedian = new Array<number>();

            (<Array<Array<number>>>info.params.mask).forEach(function (row, i) {
                halfMascRowLenght = Math.floor(row.length / 2);
                row.forEach(function (value, j) {
                    arrayToCalcMedian.push(getColorByCovolution(info.matrix, x + (i - halfMascLenght), y + (j - halfMascRowLenght), info.colorType));
                });
            });

            return Math.median(arrayToCalcMedian);
        }));

        this.segmentationManager.addSegmentation(new Segmentation("FILTRO-DA-MEDIANA-CINZA", function (info: SegmentationInfo) {
            var x = info.x, y = info.y, z = 0;
            var halfMascLenght = Math.floor(info.params.mask.length / 2), halfMascRowLenght: number;
            var arrayToCalcMedian = new Array<number>();

            (<Array<Array<number>>>info.params.mask).forEach(function (row, i) {
                halfMascRowLenght = Math.floor(row.length / 2);
                row.forEach(function (value, j) {
                    var red = getColorByCovolution(info.matrix, x + (i - halfMascLenght), y + (j - halfMascRowLenght), ColorType.RED);
                    var blue = getColorByCovolution(info.matrix, x + (i - halfMascLenght), y + (j - halfMascRowLenght), ColorType.BLUE);
                    var green = getColorByCovolution(info.matrix, x + (i - halfMascLenght), y + (j - halfMascRowLenght), ColorType.GREEN);
                    arrayToCalcMedian.push((red + blue + green) / 3);
                });
            });

            return Math.median(arrayToCalcMedian);
        }));

        this.segmentationManager.addSegmentation(new Segmentation("FILTRO-DE-GAUSS-CINZA", function (info: SegmentationInfo) {
            var x = info.x, y = info.y, z = 0;
            var newColor = 0;
            var halfMascLenght = Math.floor(info.params.mask.length / 2), halfMascRowLenght: number;

            (<Array<Array<number>>>info.params.mask).forEach(function (row, i) {
                halfMascRowLenght = Math.floor(row.length / 2);
                row.forEach(function (value, j) {
                    var red = getColorByCovolution(info.matrix, x + (i - halfMascLenght), y + (j - halfMascRowLenght), ColorType.RED) * self.gausMaskArray[i][j];
                    var blue = getColorByCovolution(info.matrix, x + (i - halfMascLenght), y + (j - halfMascRowLenght), ColorType.BLUE) * self.gausMaskArray[i][j];
                    var green = getColorByCovolution(info.matrix, x + (i - halfMascLenght), y + (j - halfMascRowLenght), ColorType.GREEN) * self.gausMaskArray[i][j];

                    newColor += (red + blue + green) / 3;
                });
            });

            return newColor / 16;
        }));

        this.segmentationManager.addSegmentation(new Segmentation("FILTRO-DE-LIMIARIZACAO", function (info: SegmentationInfo) {
            return info.color > info.params.thresholding ? 255 : 0;
        }));

        this.segmentationManager.addSegmentation(new Segmentation("FILTRO-DE-LIMIARIZACAO-CINZA", function (info: SegmentationInfo) {
            var cinza = (info.red + info.blue + info.green) / 3;
            return cinza > info.params.thresholding ? 255 : 0;
        }));

        function getColorByCovolution(matrix: Array<Array<Array<number>>>, x: number, y: number, colorType: ColorType): number {
            var realX = x, realY = y;
            var width = matrix[0].length - 2;
            var height = matrix.length - 2;

            if (x < 0) {
                realX = width - x;
            } else if (x >= width) {
                realX = x - width;
            }

            if (y < 0) {
                realY = height - y;
            } else if (y >= height) {
                realY = y - height;
            }

            return matrix[realY][realX][colorType];
        }
    }

    private applyThresholdingToCanvas(filtername: String, thresholding: number) {
        this.restoreCanvasImage();
        this.segmentationManager.applySegmentationByNameToCanvas(filtername, this.canvas, { thresholding: thresholding });
    }

    private restoreCanvasImage(canvas: HTMLCanvasElement = this.canvas) {
        CanvasUtil.reziseImageCanvas(this.canvas, this.segmentationManager.picture.getHtmlImage(), this.canvas.width, this.canvas.height);
    }

    private enableLoader() {
        var $icon = $("body").find(".icon-loading-shadow");

        if ($icon.length > 0) {
            $icon.remove();
        }

        $("body")
            .append(
            $("<div>")
                .addClass("icon-loading-shadow")
                .append(
                $("<i>").addClass("glyphicon glyphicon-repeat rotate-infinite icon-loading icon-loading-center")
                )
            );

    }

    private disableLoader() {
        var $icon = $("body").find(".icon-loading-shadow");
        if ($icon.length > 0) {
            $icon.remove();
        }
    }
}