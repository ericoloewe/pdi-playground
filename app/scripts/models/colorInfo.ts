/// <reference path="color.ts" />
"use strict";

class ColorInfo {
    public matrix: Array<Array<Color>>;
    public histogram: Array<number>;
    public average: number;
    public median: number;
    public mode: number;
    public variance: number;
    private colorType: ColorType;

    constructor(colorType: ColorType, imageMatrix: Array<Array<Array<number>>>) {
        this.matrix = new Array<Array<Color>>();
        this.colorType = colorType;

        this.defineValues(imageMatrix);
    }

    private defineValues(imageMatrix: Array<Array<Array<number>>>) {
        this.getColorPixels(imageMatrix);
        this.defineHistogram();
        this.defineAverage();
        this.defineMedian();
        this.defineMode();
        this.defineVariance();
    }

    private getColorPixels(imageMatrix: Array<Array<Array<number>>>) {
        var self = this;
        if (this.colorType === ColorType.GRAY) {
            var gray: number, red: number, green: number, blue: number;
            imageMatrix.forEach(function (arrayX, i) {
                self.matrix[i] = new Array<Color>();
                arrayX.forEach(function (color, j) {
                    red = color[ColorType.RED];
                    green = color[ColorType.GREEN];
                    blue = color[ColorType.BLUE];
                    gray = (red + green + blue) / 3;
                    self.matrix[i][j] = new Color(self.colorType, gray);
                });
            });
        } else {
            imageMatrix.forEach(function (arrayX, i) {
                self.matrix[i] = new Array<Color>();
                arrayX.forEach(function (color, j) {
                    self.matrix[i][j] = new Color(self.colorType, color[self.colorType]);
                });
            });
        }
    }

    private defineHistogram() {
        var histogram = new Array();

        for (var i = 0; i <= 255; i++) {
            histogram[i] = 0;
        }

        this.matrix.forEach(function (arrayX, i) {
            arrayX.forEach(function (color, j) {
                histogram[color.value] += 1;
            });
        });

        this.histogram = histogram;
    }

    private defineAverage() {
        var sum = 0, arrayLenght = 0;

        this.matrix.forEach(function (arrayX, i) {
            arrayX.forEach(function (color, j) {
                sum += color.value;
                arrayLenght++;
            });
        });

        this.average = sum / arrayLenght;
    }

    private defineMedian() {
        var simplePixels = new Array<number>();
        var pixel: any;

        this.matrix.forEach(function (arrayX, i) {
            arrayX.forEach(function (color, j) {
                simplePixels[i + j] = color.value;
            });
        });

        simplePixels.sort();
        this.median = simplePixels[Math.floor(simplePixels.length / 2)];
    }

    private defineMode() {
        this.mode = Math.max.apply(Math, this.histogram);
    }

    private defineVariance() {
        var sumVariance = 0;
        var self = this;

        this.matrix.forEach(function (arrayX, i) {
            arrayX.forEach(function (color, j) {
                sumVariance += Math.pow((color.value - self.average), 2);
            });
        });

        this.variance = sumVariance / this.matrix.length;
    }

    public averageRightHalf() {
        var sum = 0, arrayLenght = 0;

        this.matrix.forEach(function (arrayX, i) {
            var half = Math.round(arrayX.length / 2);
            for (var j = half; j < arrayX.length; j++) {
                sum += arrayX[j].value;
                arrayLenght++;
            }
        });

        return sum / arrayLenght;
    }

    public medianLeftHalf() {
        var medianArray = new Array<number>(), arrayLenght = 0;

        this.matrix.forEach(function (arrayX, i) {
            var half = Math.round(arrayX.length / 2);
            for (var j = 0; j < half; j++) {
                medianArray[i + j] = arrayX[j].value;
                arrayLenght++;
            }
        });

        medianArray.sort();
        return medianArray[Math.floor(medianArray.length / 2)];
    }

    public modeAboveMainDiagonal() {
        var self = this;
        var maxValue = this.matrix[0][0].value;

        this.matrix.forEach(function (arrayX, i) {
            for (var j = i; j < arrayX.length; j++) {
                if (maxValue < arrayX[j].value) {
                    maxValue = arrayX[j].value;
                }
            }
        });

        return maxValue;
    }
}