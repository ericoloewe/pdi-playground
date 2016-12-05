/// <reference path="view.ts" />
/// <reference path="../managers/morphologyManager.ts" />
/// <reference path="../models/morphologyInfo.ts" />
/// <reference path="../managers/segmentationManager.ts" />
/// <reference path="../models/segmentationInfo.ts" />
/// <reference path="../utils/math.ts" />
"use strict";

class MorphologyView extends View {
    private canvas: HTMLCanvasElement;
    private canvasWidth: number;
    private canvasHeight: number;
    private morphologyManager: MorphologyManager;
    private segmentationManager: SegmentationManager;
    private maskArray: Array<Array<number>>;
    private gausMaskArray: Array<Array<number>>;

    public constructor(fragment: Fragment, picture: Picture) {
        super(fragment);

        this.morphologyManager = new MorphologyManager(picture);
        this.segmentationManager = new SegmentationManager(picture);

        this.canvasHeight = 650;
        this.canvasWidth = 650;
    }

    public load() {
        super.load();
        var matrixTeste = [[undefined, 10, undefined], [10, 10, 10], [undefined, 10, undefined]];

        this.fragment.on("load-all", function () {
            this.loadMorphologies();
            this.loadSegmentations();
            this.loadCanvas();
            this.bindEvents();
            // this.applyDilatationToCanvas(matrixTeste);
            this.applyErosionToCanvas(matrixTeste);
            this.applyErosionToCanvas(matrixTeste);
            this.applyErosionToCanvas(matrixTeste);
        }.bind(this));
    }

    public unload() {
        super.unload();
    }

    private bindEvents() {
        var self = this;

        var $panelFragment = this.fragment.$htmlLoadedWithChilds.siblings(".panel-morphology");
    }

    private loadCanvas() {
        var $canvasSection = this.fragment.$htmlLoadedWithChilds.find("#MORPHOLOGY_CANVAS_SECTION");
        $canvasSection.find("canvas").remove();
        var canvas = CanvasUtil.createCustomCanvas(this.canvasWidth, this.canvasHeight, this.morphologyManager.picture.getHtmlImage(), "MORPHOLOGY_CANVAS", "pdi-canvas");
        this.canvas = canvas;
        $canvasSection.append(canvas);
    }

    private loadMorphologies() {
        var self = this;

        this.morphologyManager.addMorphology(new Morphology("DILATACAO-CINZA", function (info: MorphologyInfo) {
            var x = info.x, y = info.y, matrix: Array<Array<number>> = info.params.matrix;
            var dilatationMatrix = new Array([], [], []);
            var covolution: number;
            var max = getColorByCovolution(info.matrix, x, y, info.colorType);

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    covolution = getColorByCovolution(info.matrix, x + (i - 1), y + (j - 1), info.colorType);

                    if (matrix[i][j] !== undefined && max < (matrix[i][j] + covolution)) {
                        max = matrix[i][j] + covolution;
                    } else if (max < covolution) {
                        max = covolution;
                    }
                }
            }

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    dilatationMatrix[i][j] = max;
                }
            }

            return dilatationMatrix;
        }, MorphologyType.GRAY));

        this.morphologyManager.addMorphology(new Morphology("EROCAO-CINZA", function (info: MorphologyInfo) {
            var x = info.x, y = info.y, matrix: Array<Array<number>> = info.params.matrix;
            var dilatationMatrix = new Array([], [], []);
            var covolution: number;
            var min = getColorByCovolution(info.matrix, x, y, info.colorType);

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    covolution = getColorByCovolution(info.matrix, x + (i - 1), y + (j - 1), info.colorType);

                    if (matrix[i][j] !== undefined && min > (matrix[i][j] + covolution)) {
                        min = matrix[i][j] + covolution;
                    } else if (min > covolution) {
                        min = covolution;
                    }
                }
            }

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    dilatationMatrix[i][j] = min;
                }
            }

            return dilatationMatrix;
        }, MorphologyType.GRAY));

        function getColorByCovolution(matrix: Array<Array<Array<number>>>, x: number, y: number, colorType: ColorType) {
            var realX = x, realY = y;
            var width = matrix[0].length - 1;
            var height = matrix.length - 1;

            if (x < 0) {
                realX = width - Math.abs(x);
            } else if (x >= width) {
                realX = x - width;
            }

            if (y < 0) {
                realY = height - Math.abs(y);
            } else if (y >= height) {
                realY = y - height;
            }

            return matrix[realY][realX][colorType];
        }
    }

    private loadSegmentations() {
        this.segmentationManager.addSegmentation(new Segmentation("CINZA", function (info: SegmentationInfo) {
            return (info.red + info.green + info.blue) / 3;
        }));
    }

    private applyDilatationToCanvas(matrix: number) {
        this.morphologyManager.applyMorphologyByNameToCanvas("DILATACAO-CINZA", this.canvas, { matrix: matrix });
    }

    private applyErosionToCanvas(matrix: number) {
        this.morphologyManager.applyMorphologyByNameToCanvas("EROCAO-CINZA", this.canvas, { matrix: matrix });
    }

    private restoreCanvasImage(canvas: HTMLCanvasElement = this.canvas) {
        CanvasUtil.reziseImageCanvas(this.canvas, this.morphologyManager.picture.getHtmlImage(), this.canvas.width, this.canvas.height);
    }
}