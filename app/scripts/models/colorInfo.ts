/// <reference path="color.ts" />
"use strict";

class ColorInfo {
    public pixels: Array<Color>;
    private colorType: ColorType;

    constructor(colorType: ColorType, imageData: ImageData) {
        this.pixels = new Array<Color>();
        this.colorType = colorType;
        this.getColorPixels(imageData);
    }

    private getColorPixels(imageData: ImageData) {
        for (var i = 0; i < imageData.data.length; i += 4) {
            this.pixels.push(new Color(this.colorType, imageData.data[i + this.colorType]));
        }
    }

    public histogram() {
        var histogram = new Array();

        for (var i = 0; i <= 255; i++) {
            histogram[i] = 0;
        }

        this.pixels.forEach(function (color) {
            histogram[color.value] += 1;
        });

        return histogram;
    }

    public average() {
        var somaPixels = 0;

        this.pixels.forEach(function (color, i) {
            somaPixels += color.value;
        });

        return somaPixels / this.pixels.length;
    }

    public median() {
        var simplePixels = new Array<number>();
        var pixel: any;

        this.pixels.forEach(function (color, i) {
            simplePixels[i] = color.value;
        });

        simplePixels.sort();
        return simplePixels[Math.floor(simplePixels.length / 2)];
    }

    public mode() {
        return Math.max.apply(Math, this.histograma());
    }

    public variance() {
        var sumVariance = 0;

        this.pixels.forEach(function (color) {
            sumVariance += Math.pow((color.value - this.average), 2);
        });

        return sumVariance / this.pixels.length;
    }
}