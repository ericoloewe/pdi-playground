/// <reference path="../config/events.ts" />
/// <reference path="../utils/canvas.ts" />
/// <reference path="colorInfo.ts" />
"use strict";

class Picture {
    public canvas: Fragment;
    public context: any;
    private image: HTMLImageElement;
    public imageData: ImageData;
    private imageMatrix: Array<Array<Array<number>>>;
    public red: ColorInfo;
    public green: ColorInfo;
    public blue: ColorInfo;
    public alpha: ColorInfo;
    public gray: ColorInfo;
    public width: number;
    public height: number;
    private eventManager: StaticEventManager;

    constructor(src: string, canvas: Fragment) {
        this.eventManager = new StaticEventManager();
        this.canvas = canvas;
        this.context = (<HTMLCanvasElement>this.canvas.$htmlLoaded[0]).getContext("2d");
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
            var canvas = <HTMLCanvasElement>self.canvas.$htmlLoaded[0];
            self.context.drawImage(self.image, 0, 0);

            self.imageData = self.context.getImageData(0, 0, canvas.width, canvas.height);

            self.context.clearRect(0, 0, canvas.width, canvas.height);
            self.context.putImageData(self.imageData, 0, 0);

            self.width = self.image.width;
            self.height = self.image.height;

            self.defineValues();
        });
    }

    private defineValues() {
        var self = this;
        setTimeout(function() {
            self.definePictureMatrix();
            self.trigger("load-all-values");
        }, 10);
    }

    private defineColorsInfo(redArray: Array<Array<Color>>, blueArray: Array<Array<Color>>, greenArray: Array<Array<Color>>, alphaArray: Array<Array<Color>>, grayArray: Array<Array<Color>>) {
        this.red = new ColorInfo(ColorType.RED, redArray);
        this.blue = new ColorInfo(ColorType.BLUE, blueArray);
        this.green = new ColorInfo(ColorType.GREEN, greenArray);
        this.alpha = new ColorInfo(ColorType.ALPHA, alphaArray);
        this.gray = new ColorInfo(ColorType.GRAY, grayArray);
    }

    private definePictureMatrix() {
        var redArray = new Array<Array<Color>>(), blueArray = new Array<Array<Color>>(), greenArray = new Array<Array<Color>>(), alphaArray = new Array<Array<Color>>(), grayArray = new Array<Array<Color>>();
        var red: number, blue: number, green: number, alpha: number;
        var y = 0;
        var x = 0;
        var i = 0;

        while (i < this.imageData.data.length) {
            if (this.imageMatrix[y] === undefined) {
                this.imageMatrix[y] = new Array<Array<number>>();
                redArray[y] = new Array<Color>();
                blueArray[y] = new Array<Color>();
                greenArray[y] = new Array<Color>();
                alphaArray[y] = new Array<Color>();
                grayArray[y] = new Array<Color>();
            }

            red = this.imageData.data[i];
            blue = this.imageData.data[i + 1];
            green = this.imageData.data[i + 2];
            alpha = this.imageData.data[i + 3];

            this.imageMatrix[y][x] = [red, blue, green, alpha];

            redArray[y][x] = new Color(ColorType.RED, red);
            blueArray[y][x] = new Color(ColorType.BLUE, blue);
            greenArray[y][x] = new Color(ColorType.GREEN, green);
            alphaArray[y][x] = new Color(ColorType.ALPHA, alpha);
            grayArray[y][x] = new Color(ColorType.GRAY, (red + green + blue) / 3);

            x++;
            i += 4;
            if (x > this.imageData.width - 1) {
                y++;
                x = 0;
            }
        }

        this.defineColorsInfo(redArray, blueArray, greenArray, alphaArray, grayArray);
    }

    public on(type: String, action: Function) {
        this.eventManager.on(type, action);
    }

    public trigger(event: String) {
        this.eventManager.trigger(event);
    }
}