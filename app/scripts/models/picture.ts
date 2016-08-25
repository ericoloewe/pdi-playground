/// <reference path="colorInfo.ts" />
"use strict";

class Picture {
    private canvas: any;
    private context: any;
    private image: HTMLImageElement;
    private imageData: ImageData;
    private imageMatrix: Array<Array<Array<number>>>;
    private red: ColorInfo;
    private green: ColorInfo;
    private blue: ColorInfo;
    private alpha: ColorInfo;
    public width: number;
    public height: number;

    constructor(src: string, canvas: any) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.image = new Image();
        this.image.src = src;
        this.imageMatrix = new Array<Array<Array<number>>>();
        this.bindEvents();
    }

    public getHtmlImage() {
        return this.image;
    }

    private bindEvents() {
        var self = this;

        $(this.image).on("load", function () {
            self.context.drawImage(self.image, 0, 0);

            self.imageData = self.context.getImageData(0, 0, self.canvas.width, self.canvas.height);

            self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
            self.context.putImageData(self.imageData, 0, 0);

            self.width = self.image.width;
            self.height = self.image.height;

            self.defineValues();
        });
    }

    private defineValues() {
        this.defineColorsInfo();
        this.definePictureMatrix();
    }

    private defineColorsInfo() {
        this.red = new ColorInfo(ColorType.RED, this.imageData);
        this.blue = new ColorInfo(ColorType.BLUE, this.imageData);
        this.green = new ColorInfo(ColorType.GREEN, this.imageData);
        this.alpha = new ColorInfo(ColorType.ALPHA, this.imageData);
    }

    private definePictureMatrix() {
        var y = 0;
        var x = 0;

        for (var i = 0, j = this.imageData.data.length; i < j; i += 4) {

            if (!this.imageMatrix[y]) {
                this.imageMatrix[y] = new Array<Array<number>>();
            }

            this.imageMatrix[y][x] = [
                this.imageData.data[i],
                this.imageData.data[i + 1],
                this.imageData.data[i + 2],
                this.imageData.data[i + 3]
            ];

            x++;
            if (x > this.imageData.width - 1) {
                y++;
                x = 0;
            }
        }
    }

    public histograma(pixels: Array<Color>) {
        var histograma = new Array();

        for (var i = 0; i <= 255; i++) {
            histograma[i] = 0;
        }

        pixels.forEach(function (color) {
            histograma[color.value] += 1;
        });

        return histograma;
    }

    public average(pixels: Array<Color>) {
        var somaPixels = 0;

        pixels.forEach(function (color, i) {
            somaPixels += color.value;
        });

        return somaPixels / pixels.length;
    }

    public median(pixels: Array<Color>) {
        var simplePixels = new Array<number>();
        var pixel: any;

        pixels.forEach(function (color, i) {
            simplePixels[i] = color.value;
        });

        simplePixels.sort();
        return simplePixels[Math.floor(simplePixels.length / 2)];
    }

    public mode(pixels: Array<Color>) {
        return Math.max.apply(Math, this.histograma(pixels));
    }

    public variance(pixels: Array<Color>) {
        var sumVariance = 0;

        pixels.forEach(function (color) {
            sumVariance += Math.pow((color.value - this.average), 2);
        });

        return sumVariance / pixels.length;
    }
}