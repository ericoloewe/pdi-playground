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

        this.fragment.on("load-all", function() {
            this.loadSegmentations();
            this.loadCanvas();
            this.bindEvents();
        }.bind(this));
    }

    public unload() {
        super.unload();
        var imageSelf = this.segmentationManager.picture;

        this.segmentationManager = new SegmentationManager(imageSelf);
    }

    private bindEvents() {
        var self = this;

        this.segmentationManager.picture.on("load-all-values", function() {
            this.loadSegmentationsAtScreen();
        }.bind(this));
    }

    private loadCanvas() {
        var $canvasSection = this.fragment.$htmlLoadedWithChilds.find("#SEGMENTATION_CANVAS_SECTION");
        var canvas = CanvasUtil.createCustomCanvas(this.canvasWidth, this.canvasHeight, this.segmentationManager.picture.getHtmlImage(), "SEGMENTATION_CANVAS", "pdi-canvas");
        this.canvas = canvas;
        $canvasSection.append(canvas);
    }

    private loadSegmentations() {
        var self = this;

        this.segmentationManager.addSegmentation(new Segmentation("ORIGINAL", function(info: SegmentationInfo) {
            return info.color;
        }));

        this.segmentationManager.addSegmentation(new Segmentation("CINZA", function(info: SegmentationInfo) {
            return (info.red + info.blue + info.green) / 3;
        }));

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

        this.segmentationManager.addSegmentation(new Segmentation("FILTRO-DA-MEDIANA-CINZA", function(info: SegmentationInfo) {
            var x = info.x, y = info.y, z = 0;
            var halfMascLenght = Math.floor(info.mask.length / 2), halfMascRowLenght: number;
            var arrayToCalcMedian = new Array<number>();

            info.mask.forEach(function(row, i) {
                halfMascRowLenght = Math.floor(row.length / 2);
                row.forEach(function(value, j) {
                    var red = getColorByCovolution(info.matrix, x + (i - halfMascLenght), y + (j - halfMascRowLenght), ColorType.RED);
                    var blue = getColorByCovolution(info.matrix, x + (i - halfMascLenght), y + (j - halfMascRowLenght), ColorType.BLUE);
                    var green = getColorByCovolution(info.matrix, x + (i - halfMascLenght), y + (j - halfMascRowLenght), ColorType.GREEN);
                    arrayToCalcMedian.push((red + blue + green) / 3);
                });
            });

            return Math.median(arrayToCalcMedian);
        }));

        this.segmentationManager.addSegmentation(new Segmentation("FILTRO-DE-GAUSS-CINZA", function(info: SegmentationInfo) {
            var x = info.x, y = info.y, z = 0;
            var newColor = 0;
            var halfMascLenght = Math.floor(info.mask.length / 2), halfMascRowLenght: number;

            self.gausMaskArray.forEach(function(row, i) {
                halfMascRowLenght = Math.floor(row.length / 2);
                row.forEach(function(value, j) {
                    var red = getColorByCovolution(info.matrix, x + (i - halfMascLenght), y + (j - halfMascRowLenght), ColorType.RED) * self.gausMaskArray[i][j];
                    var blue = getColorByCovolution(info.matrix, x + (i - halfMascLenght), y + (j - halfMascRowLenght), ColorType.BLUE) * self.gausMaskArray[i][j];
                    var green = getColorByCovolution(info.matrix, x + (i - halfMascLenght), y + (j - halfMascRowLenght), ColorType.GREEN) * self.gausMaskArray[i][j];

                    newColor += (red + blue + green) / 3;
                });
            });

            return newColor / 16;
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

    private loadSegmentationsAtScreen() {
        var self = this;
        var segmentationList = this.fragment.$htmlLoadedWithChilds.find(".segmentation-list");

        segmentationList.append(this.segmentationManager.getSegmentations().map(function(segmentation) {
            return $("<li>")
                .append(this.createCanvasForSegmentation(segmentation, 100, 100))
                .attr("data-segmentation-name", <string>segmentation.name)
                .attr("title", <string>segmentation.name)
                .click(function(e) {
                    var $canvas = $(this);
                    self.restoreCanvasImage();
                    self.segmentationManager.applySegmentationByNameToCanvas($canvas.data("segmentation-name"), self.canvas, self.maskArray);
                    return e.preventDefault();
                });
        }, this));
    }

    private createCanvasForSegmentation(segmentation: Segmentation, width: number, height: number): HTMLCanvasElement {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        this.segmentationManager.applySegmentationByNameToCanvas(segmentation.name, canvas, this.maskArray);
        return canvas;
    }

    private restoreCanvasImage(canvas: HTMLCanvasElement = this.canvas) {
        CanvasUtil.reziseImageCanvas(this.canvas, this.segmentationManager.picture.getHtmlImage(), this.canvas.width, this.canvas.height);
    }
}