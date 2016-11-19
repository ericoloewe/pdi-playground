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

        $panelFragment.find("#matrix form").on("submit", function (e) {
            var formData: any = new FormData(this);
            var matrix = new Array<Array<number>>([], [], []);

            matrix[0][0] = parseFloat(formData.get("pos00"));
            matrix[0][1] = parseFloat(formData.get("pos01"));
            matrix[0][2] = parseFloat(formData.get("pos02"));
            matrix[1][0] = parseFloat(formData.get("pos10"));
            matrix[1][1] = parseFloat(formData.get("pos11"));
            matrix[1][2] = parseFloat(formData.get("pos12"));
            matrix[2][0] = parseFloat(formData.get("pos20"));
            matrix[2][1] = parseFloat(formData.get("pos21"));
            matrix[2][2] = parseFloat(formData.get("pos22"));

            self.applyCovolutionToCanvas(formData.get("filterName"), matrix);

            return e.preventDefault();
        });

        $panelFragment.find("#matrix .btn-load-gauss-matrix").on("click", function (e) {
            var $form = $panelFragment.find("#matrix form");

            $form.find("[name=pos00]").val(self.gausMaskArray[0][0]);
            $form.find("[name=pos01]").val(self.gausMaskArray[0][1]);
            $form.find("[name=pos02]").val(self.gausMaskArray[0][2]);
            $form.find("[name=pos10]").val(self.gausMaskArray[1][0]);
            $form.find("[name=pos11]").val(self.gausMaskArray[1][1]);
            $form.find("[name=pos12]").val(self.gausMaskArray[1][2]);
            $form.find("[name=pos20]").val(self.gausMaskArray[2][0]);
            $form.find("[name=pos21]").val(self.gausMaskArray[2][1]);
            $form.find("[name=pos22]").val(self.gausMaskArray[2][2]);

            $form.find("[name=filterName]").val("FILTRO-DE-GAUSS");

            return e.preventDefault();
        });

        $panelFragment.find("#border form").on("submit", function (e) {
            var formData: any = new FormData(this);
            e.preventDefault()
            self.applyBorderToCanvas(formData.get("filterName"), parseInt(formData.get("thresholding")));

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

        this.segmentationManager.addSegmentation(new Segmentation("FILTRO-DE-GAUSS", function (info: SegmentationInfo) {
            var x = info.x, y = info.y, z = 0;
            var newColor = 0;
            var halfMascLenght = Math.floor(info.params.mask.length / 2), halfMascRowLenght: number;

            (<Array<Array<number>>>info.params.mask).forEach(function (row, i) {
                halfMascRowLenght = Math.floor(row.length / 2);
                row.forEach(function (value, j) {
                    newColor += getColorByCovolution(info.matrix, x + (i - halfMascLenght), y + (j - halfMascRowLenght), info.colorType) * self.gausMaskArray[i][j];
                });
            });

            return newColor / 16;
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

        this.segmentationManager.addSegmentation(new Segmentation("FILTRO-DE-BORDAS-DE-SOBEL", function (info: SegmentationInfo) {
            var x = info.x, y = info.y;
            var newColor = 0, newColorX = 0, newColorY = 0, actualColor: number;

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    actualColor = getColorByCovolution(info.matrix, x + (i - 1), y + (j - 1), info.colorType);
                    newColorX += actualColor * info.params.xMatrix[i][j];
                    newColorY += actualColor * info.params.yMatrix[i][j];
                }
            }

            newColor = Math.sqrt(Math.pow(newColorX, 2) + Math.pow(newColorY, 2));

            return (newColor > info.params.thresholding) ? 255 : 0;
        }));

        this.segmentationManager.addSegmentation(new Segmentation("FILTRO-DE-BORDAS-DE-SOBEL-CINZA", function (info: SegmentationInfo) {
            var x = info.x, y = info.y;
            var newColor = 0, newColorX = 0, newColorY = 0, red: number, blue: number, green: number, cinza: number;

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    red = getColorByCovolution(info.matrix, x + (i - 1), y + (j - 1), ColorType.RED);
                    blue = getColorByCovolution(info.matrix, x + (i - 1), y + (j - 1), ColorType.BLUE);
                    green = getColorByCovolution(info.matrix, x + (i - 1), y + (j - 1), ColorType.GREEN);

                    cinza = (red + blue + green) / 3;

                    newColorX += cinza * info.params.xMatrix[i][j];
                    newColorY += cinza * info.params.yMatrix[i][j];
                }
            }

            newColor = Math.sqrt(Math.pow(newColorX, 2) + Math.pow(newColorY, 2));

            return (newColor > info.params.thresholding) ? 255 : 0;
        }));

        this.segmentationManager.addSegmentation(new Segmentation("FILTRO-DE-BORDAS-DE-ROBERTS", function (info: SegmentationInfo) {
            var x = info.x, y = info.y;
            var newColor = 0, newColorX = 0, newColorY = 0, actualColor: number;

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    actualColor = getColorByCovolution(info.matrix, x + (i - 1), y + (j - 1), info.colorType);
                    newColorX += actualColor * info.params.xMatrix[i][j];
                    newColorY += actualColor * info.params.yMatrix[i][j];
                }
            }

            newColor = Math.sqrt(Math.pow(newColorX, 2) + Math.pow(newColorY, 2));

            return (newColor > info.params.thresholding) ? 255 : 0;
        }));

        this.segmentationManager.addSegmentation(new Segmentation("FILTRO-DE-BORDAS-DE-ROBERTS-CINZA", function (info: SegmentationInfo) {
            var x = info.x, y = info.y;
            var newColor = 0, newColorX = 0, newColorY = 0, red: number, blue: number, green: number, cinza: number;

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    red = getColorByCovolution(info.matrix, x + (i - 1), y + (j - 1), ColorType.RED);
                    blue = getColorByCovolution(info.matrix, x + (i - 1), y + (j - 1), ColorType.BLUE);
                    green = getColorByCovolution(info.matrix, x + (i - 1), y + (j - 1), ColorType.GREEN);

                    cinza = (red + blue + green) / 3;

                    newColorX += cinza * info.params.xMatrix[i][j];
                    newColorY += cinza * info.params.yMatrix[i][j];
                }
            }

            newColor = Math.sqrt(Math.pow(newColorX, 2) + Math.pow(newColorY, 2));

            return (newColor > info.params.thresholding) ? 255 : 0;
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

    private applyCovolutionToCanvas(filtername: String, matrix: Array<Array<number>>) {
        this.restoreCanvasImage();
        this.segmentationManager.applySegmentationByNameToCanvas(filtername, this.canvas, { mask: matrix });
    }

    private applyBorderToCanvas(filtername: String, thresholding: number) {
        var params: any = this.getParamsForBorderFilter(filtername);
        params.thresholding = thresholding;
        this.restoreCanvasImage();
        this.segmentationManager.applySegmentationByNameToCanvas(filtername, this.canvas, params);
    }

    private getParamsForBorderFilter(filtername: String): Object {
        var params: any = {};

        switch (filtername) {
            case "FILTRO-DE-BORDAS-DE-ROBERTS-CINZA":
            case "FILTRO-DE-BORDAS-DE-ROBERTS": {
                params.xMatrix = [[0, 0, 0], [0, -1, 0], [0, 0, 1]];
                params.yMatrix = [[0, 0, 0], [0, 0, -1], [0, 1, 0]];
                break;
            }

            case "FILTRO-DE-BORDAS-DE-SOBEL-CINZA":
            case "FILTRO-DE-BORDAS-DE-SOBEL": {
                params.xMatrix = [[1, 0, -1], [2, 0, -2], [1, 0, -1]];
                params.yMatrix = [[1, 2, 1], [0, 0, 0], [-1, -2, -1]];
                break;
            }

            default: {
                throw new Error(String.format("no params for filter: {0}", filtername));
            }
        }

        return params;
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