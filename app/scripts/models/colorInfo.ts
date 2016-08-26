/// <reference path="color.ts" />
"use strict";

class ColorInfo {
    public pixels: Array<Color>;
    public histogram: Array<number>;
    public average: number;
    public median: number;
    public mode: number;
    public variance: number;
    private colorType: ColorType;

    constructor(colorType: ColorType, imageData: ImageData) {
        this.pixels = new Array<Color>();
        this.colorType = colorType;

        this.defineValues(imageData);
    }

    private defineValues(imageData: ImageData) {
        this.getColorPixels(imageData);
        this.defineHistogram();
        this.defineAverage();
        this.defineMedian();
        this.defineMode();
        this.defineVariance();
    }

    private getColorPixels(imageData: ImageData) {
        if (this.colorType === ColorType.GRAY) {
            var gray:number, red:number, green:number, blue:number;
            for (var i = 0; i < imageData.data.length; i += 4) {
                red = imageData.data[i + ColorType.RED];
                green = imageData.data[i + ColorType.GREEN];
                blue = imageData.data[i + ColorType.BLUE];
                gray = (red + green + blue) / 3;
                this.pixels.push(new Color(this.colorType, gray));
            }
        } else {
            for (var i = 0; i < imageData.data.length; i += 4) {
                this.pixels.push(new Color(this.colorType, imageData.data[i + this.colorType]));
            }
        }
    }

    private defineHistogram() {
        var histogram = new Array();

        for (var i = 0; i <= 255; i++) {
            histogram[i] = 0;
        }

        this.pixels.forEach(function (color) {
            histogram[color.value] += 1;
        });

        this.histogram = histogram;
    }

    private defineAverage() {
        var somaPixels = 0;

        this.pixels.forEach(function (color, i) {
            somaPixels += color.value;
        });

        this.average = somaPixels / this.pixels.length;
    }

    private defineMedian() {
        var simplePixels = new Array<number>();
        var pixel: any;

        this.pixels.forEach(function (color, i) {
            simplePixels[i] = color.value;
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

        this.pixels.forEach(function (color) {
            sumVariance += Math.pow((color.value - self.average), 2);
        });

        this.variance = sumVariance / this.pixels.length;
    }
}