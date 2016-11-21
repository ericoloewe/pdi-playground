/// <reference path="../config/events.ts" />
/// <reference path="../utils/canvas.ts" />
/// <reference path="colorInfo.ts" />
"use strict";

class Picture {
    public canvas: HTMLCanvasElement;
    public context: any;
    private image: HTMLImageElement;
    public imageData: ImageData;
    public imageMatrix: Array<Array<Array<number>>>;
    public red: ColorInfo;
    public green: ColorInfo;
    public blue: ColorInfo;
    public alpha: ColorInfo;
    public gray: ColorInfo;
    public width: number;
    public height: number;
    private eventManager: StaticEventManager;

    constructor(src: string, canvas: HTMLCanvasElement) {
        this.eventManager = new StaticEventManager();
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
            var canvas = <HTMLCanvasElement>self.canvas;
            self.width = self.image.width;
            self.height = self.image.height;
            canvas.width = self.width;
            canvas.height = self.height;

            self.context.drawImage(self.image, 0, 0);
            self.imageData = self.context.getImageData(0, 0, canvas.width, canvas.height);
            self.context.clearRect(0, 0, canvas.width, canvas.height);
            self.context.putImageData(self.imageData, 0, 0);

            self.defineValues();
        });
    }

    private defineValues() {
        var self = this;
        setTimeout(function() {
            self.trigger("load-all-values");
        }, 10);
    }

    public on(type: String, action: Function) {
        this.eventManager.on(type, action);
    }

    public trigger(event: String) {
        this.eventManager.trigger(event);
    }
}