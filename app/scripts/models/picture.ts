/// <reference path="colorInfo.ts" />
"use strict";

class Picture {
    private canvas: any;
    private context: any;
    private image: HTMLImageElement;
    private imageData: ImageData;
    private imageMatrix: Array<Array<Array<number>>>;
    public red: ColorInfo;
    public green: ColorInfo;
    public blue: ColorInfo;
    public alpha: ColorInfo;
    public gray: ColorInfo;
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
        this.gray = new ColorInfo(ColorType.GRAY, this.imageData);
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
}