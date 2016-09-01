/// <reference path="../utils/convert.ts" />
/// <reference path="../utils/math.ts" />
/// <reference path="color.ts" />
"use strict";

class ColorInfo {
    public matrix: Array<Array<Color>>;
    public simpleNumbersArray: Array<number>;
    public histogram: Array<number>;
    public average: number;
    public median: number;
    public mode: number;
    public variance: number;
    private colorType: ColorType;

    constructor(colorType: ColorType, imageMatrix: Array<Array<Array<number>>>) {
        this.matrix = new Array<Array<Color>>();
        this.simpleNumbersArray = Array<number>();
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
                    self.simpleNumbersArray.push(gray);
                });
            });
        } else {
            imageMatrix.forEach(function (arrayX, i) {
                self.matrix[i] = new Array<Color>();
                arrayX.forEach(function (color, j) {
                    self.matrix[i][j] = new Color(self.colorType, color[self.colorType]);
                    self.simpleNumbersArray.push(color[self.colorType]);
                });
            });
        }
    }

    private defineHistogram() {
        this.histogram = Math.histogram(255, this.simpleNumbersArray);
    }

    private defineAverage() {
        this.average = Math.average(this.simpleNumbersArray);
    }

    private defineMedian() {
        this.median = Math.median(this.simpleNumbersArray);
    }

    private defineMode() {
        this.mode = Math.mode(this.simpleNumbersArray);
    }

    private defineVariance() {
        this.variance = Math.variance(this.simpleNumbersArray);
    }

    public averageRightHalf() {
        var pixelsRightHalf = new Array<number>();

        this.matrix.forEach(function (arrayX, i) {
            var half = Math.round(arrayX.length / 2);
            for (var j = half; j < arrayX.length; j++) {
                pixelsRightHalf.push(arrayX[j].value);
            }
        });

        return Math.average(pixelsRightHalf);
    }

    public medianLeftHalf() {
        var pixelsLeftHalf = new Array<number>();

        this.matrix.forEach(function (arrayX, i) {
            var half = Math.round(arrayX.length / 2);
            for (var j = 0; j < half; j++) {
                pixelsLeftHalf[i + j] = arrayX[j].value;
            }
        });

        return Math.median(pixelsLeftHalf);
    }

    public modeAboveMainDiagonal() {
        var pixelsAboveMainDiagonal = new Array<number>();

        this.matrix.forEach(function (arrayX, i) {
            for (var j = i; j < arrayX.length; j++) {
                pixelsAboveMainDiagonal.push(arrayX[j].value);
            }
        });

        return Math.mode(pixelsAboveMainDiagonal);
    }
}