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

        this.segmentationManager.picture.on("load-all-values", function() {
            this.applyMedianFilterSegmentation();
        }.bind(this));
    }

    private loadCanvas() {
        var $canvasSection = this.fragment.$htmlLoadedWithChilds.find("#SEGMENTATION_CANVAS_SECTION");
        var canvas = CanvasUtil.createCustomCanvas(this.canvasWidth, this.canvasHeight, this.segmentationManager.picture.getHtmlImage(), "SEGMENTATION_CANVAS", "pdi-canvas");
        this.canvas = canvas;
        $canvasSection.append(canvas);
    }

    private loadSegmentations() {
        this.segmentationManager.addSegmentation(new Segmentation("FILTRO-DA-MEDIANA", function(info: SegmentationInfo) {
            var x = info.x, y = info.y, z = 0;
            var halfMascLenght = Math.floor(info.mask.length / 2), halfMascRowLenght: number;
            var arrayToCalcMedian = new Array<number>();

            info.mask.forEach(function(row, i) {
                halfMascRowLenght = Math.floor(row.length / 2);
                row.forEach(function(value, j) {
                    arrayToCalcMedian.push(getColorByCovolution(info.matrix, x + (i - halfMascLenght), y + (j - halfMascRowLenght), info.colorType));
                });
            });

            return Math.median(arrayToCalcMedian);
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

            if (realX >= matrix[0].length || realX < 0 || realY >= matrix.length || realY < 0) {
                debugger;
            }

            return matrix[realY][realX][colorType];
        }
    }

    private applyMedianFilterSegmentation() {
        var maskArray = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
        this.restoreCanvasImage();
        this.segmentationManager.applySegmentationByNameToCanvas("FILTRO-DA-MEDIANA", this.canvas, maskArray);
    }

    private restoreCanvasImage() {
        CanvasUtil.reziseImageCanvas(this.canvas, this.segmentationManager.picture.getHtmlImage(), this.canvas.width, this.canvas.height);
    }
}