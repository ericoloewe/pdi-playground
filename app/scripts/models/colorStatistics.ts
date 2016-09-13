/// <reference path="../utils/convert.ts" />
/// <reference path="../utils/math.ts" />
/// <reference path="color.ts" />
"use strict";

class ColorStatistics {
    public average: number;
    public median: number;
    public mode: number;
    public variance: number;

    public constructor(colorMatrix: Array<Array<Color>>, simpleNumbersArray: Array<number>) {
        this.defineValues(colorMatrix, simpleNumbersArray);
    }

    private defineValues(colorMatrix: Array<Array<Color>>, simpleNumbersArray: Array<number>) {
        this.defineAverage(simpleNumbersArray);
        this.defineMedian(simpleNumbersArray);
        this.defineMode(simpleNumbersArray);
        this.defineVariance(simpleNumbersArray);
    }

    private defineAverage(simpleNumbersArray: Array<number>) {
        this.average = Math.average(simpleNumbersArray);
    }

    private defineMedian(simpleNumbersArray: Array<number>) {
        this.median = Math.median(simpleNumbersArray);
    }

    private defineMode(simpleNumbersArray: Array<number>) {
        this.mode = Math.mode(simpleNumbersArray);
    }

    private defineVariance(simpleNumbersArray: Array<number>) {
        this.variance = Math.variance(simpleNumbersArray);
    }

    public averageRightHalf(matrix: Array<Array<Color>>) {
        var pixelsRightHalf = new Array<number>();

        matrix.forEach(function (arrayX, i) {
            var half = Math.round(arrayX.length / 2);
            for (var j = half; j < arrayX.length; j++) {
                pixelsRightHalf.push(arrayX[j].value);
            }
        });

        return Math.average(pixelsRightHalf);
    }

    public medianLeftHalf(matrix: Array<Array<Color>>) {
        var pixelsLeftHalf = new Array<number>();

        matrix.forEach(function (arrayX, i) {
            var half = Math.round(arrayX.length / 2);
            for (var j = 0; j < half; j++) {
                pixelsLeftHalf[i + j] = arrayX[j].value;
            }
        });

        return Math.median(pixelsLeftHalf);
    }

    public modeAboveMainDiagonal(matrix: Array<Array<Color>>) {
        var pixelsAboveMainDiagonal = new Array<number>();

        matrix.forEach(function (arrayX, i) {
            for (var j = i; j < arrayX.length; j++) {
                pixelsAboveMainDiagonal.push(arrayX[j].value);
            }
        });

        return Math.mode(pixelsAboveMainDiagonal);
    }

    public varianceBelowMainDiagonal(matrix: Array<Array<Color>>) {
        var pixelsAboveMainDiagonal = new Array<number>();

        matrix.forEach(function (arrayX, i) {
            for (var j = 0; j < i; j++) {
                pixelsAboveMainDiagonal.push(arrayX[j].value);
            }
        });

        return Math.variance(pixelsAboveMainDiagonal);
    }
}