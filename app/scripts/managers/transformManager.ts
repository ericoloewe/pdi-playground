/// <reference path="../models/picture.ts" />
/// <reference path="../utils/string.ts" />
/// <reference path="../models/transform.ts" />
/// <reference path="../models/transformInfo.ts" />
"use strict";

class TransformManager {
    private transforms: Array<Transform>;
    public picture: Picture;

    constructor(picture: Picture) {
        this.picture = picture;
        this.transforms = new Array<Transform>();
    }

    public addTransform(transform: Transform) {
        this.transforms.push(transform);
    }

    public getTransforms() {
        return this.transforms;
    }

    public getTransformByName(transformName: String): Transform {
        return this.transforms.filter(function (transform) {
            return transform.name === transformName;
        })[0];
    }

    public applyTransformByNameToCanvas(transformName: String, canvas: HTMLCanvasElement, params?: any) {
        var transform = this.getTransformByName(transformName);

        if (transform === undefined) {
            throw String.format("Transform with name \"{0}\" doesn't exist.", transformName);
        } else {
            this.applyTransformToCanvas(transform, canvas, params);
        }
    }

    private applyTransformToCanvas(transform: Transform, canvas: HTMLCanvasElement, params?: any) {
        var newImageData = this.applyTransformToImageData(transform, params);
        CanvasUtil.applyImageDataToCanvas(newImageData, canvas, this.picture.width, this.picture.height);
    }

    public applyTransformByNameToImageData(transformName: String, params?: any): ImageData {
        var transform = this.getTransformByName(transformName);
        if (transform === undefined) {
            throw String.format("Transform with name \"{0}\" doesn't exist.", transformName);
        } else {
            return this.applyTransformToImageData(transform, params);
        }
    }

    private applyTransformToImageData(transform: Transform, params?: any): ImageData {
        var originalImageData = this.picture.imageData;
        var newImageData = this.picture.context.createImageData(this.picture.width, this.picture.height);
        var newRedIndex: number, blue: number, green: number, alpha: number;
        var x = 0;
        var y = 0;

        for (var i = 0; i < originalImageData.data.length; i += 4, x++) {
            newImageData.data[i + ColorType.RED] = this.getNewColorIndexByColorType(ColorType.RED, originalImageData, transform, i, x, y, params);
            newImageData.data[i + ColorType.GREEN] = this.getNewColorIndexByColorType(ColorType.GREEN, originalImageData, transform, i, x, y, params);
            newImageData.data[i + ColorType.BLUE] = this.getNewColorIndexByColorType(ColorType.BLUE, originalImageData, transform, i, x, y, params);
            newImageData.data[i + ColorType.ALPHA] = this.getNewColorIndexByColorType(ColorType.ALPHA, originalImageData, transform, i, x, y, params);
            if (x > originalImageData.width - 1) {
                y++;
                x = 0;
            }
        }

        return newImageData;
    }

    private getNewColorIndexByColorType(type: ColorType, imageData: ImageData, transform: Transform, index: number, x: number, y: number, params?: any) {
        var info = new TransformInfo(type, index, x, y, imageData.width, imageData.height, params);
        var newIndex = transform.method(info);
        if (newIndex === undefined) {
            return undefined;
        }
        return imageData.data[newIndex];
    }

    public restoreCanvasImage(canvas: HTMLCanvasElement) {
        CanvasUtil.reziseImageCanvas(canvas, this.picture.getHtmlImage(), canvas.width, canvas.height);
    }
}