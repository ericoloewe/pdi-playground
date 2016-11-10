/// <reference path="../utils/string.ts" />
/// <reference path="../models/picture.ts" />
/// <reference path="../models/segmentation.ts" />
/// <reference path="../models/segmentationType.ts" />
/// <reference path="../models/segmentationInfo.ts" />
"use strict";

class SegmentationManager {
    private segmentations: Array<Segmentation>;
    public picture: Picture;

    public constructor(picture: Picture) {
        this.picture = picture;
        this.segmentations = new Array<Segmentation>();
    }

    public addSegmentation(segmentation: Segmentation) {
        this.segmentations.push(segmentation);
    }

    public getSegmentations() {
        return this.segmentations;
    }

    public getSegmentationByName(segmentationName: String): Segmentation {
        return this.segmentations.filter(function (segmentation) {
            return segmentation.name === segmentationName;
        })[0];
    }

    public applySegmentationByNameToCanvas(segmentationName: String, canvas: HTMLCanvasElement, mask: Array<Array<number>>) {
        var segmentation = this.getSegmentationByName(segmentationName);

        if (segmentation === undefined) {
            throw String.format("Segmentation with name \"{0}\" doesn't exist.", segmentationName);
        } else {
            this.applySegmentationToCanvas(segmentation, canvas, mask);
        }
    }

    private applySegmentationToCanvas(segmentation: Segmentation, canvas: HTMLCanvasElement, mask: Array<Array<number>>) {
        var newImageData = this.applySegmentationToImageData(segmentation, mask);
        CanvasUtil.applyImageDataToCanvas(newImageData, canvas, this.picture.width, this.picture.height);
    }

    public applySegmentationByNameToImageData(segmentationName: String, mask: Array<Array<number>>): ImageData {
        var segmentation = this.getSegmentationByName(segmentationName);
        if (segmentation === undefined) {
            throw String.format("Segmentation with name \"{0}\" doesn't exist.", segmentationName);
        } else {
            return this.applySegmentationToImageData(segmentation, mask);
        }
    }

    private applySegmentationToImageData(segmentation: Segmentation, mask: Array<Array<number>>): ImageData {
        var newImageData: ImageData;

        switch (segmentation.type) {
            case SegmentationType.RGB: {
                newImageData = this.applyRGBSegmentation(segmentation, mask);
                break;
            };
            case SegmentationType.RGBA: {
                newImageData = this.applyRGBASegmentation(segmentation, mask);
                break;
            };
        }

        return newImageData;
    }

    private applyRGBSegmentation(segmentation: Segmentation, mask: Array<Array<number>>): ImageData {
        var originalImageData = this.picture.imageData;
        var newImageData: ImageData = this.picture.context.createImageData(this.picture.width, this.picture.height);
        var x = 0;
        var y = 0;

        for (var i = 0; i < originalImageData.data.length; i += 4, x++) {
            newImageData.data[i + ColorType.RED] = this.getNewColorBySegmentation(segmentation, originalImageData, ColorType.RED, i, x, y, mask);
            newImageData.data[i + ColorType.BLUE] = this.getNewColorBySegmentation(segmentation, originalImageData, ColorType.BLUE, i, x, y, mask);
            newImageData.data[i + ColorType.GREEN] = this.getNewColorBySegmentation(segmentation, originalImageData, ColorType.GREEN, i, x, y, mask);
            newImageData.data[i + ColorType.ALPHA] = originalImageData.data[i + ColorType.ALPHA];

            if (x > originalImageData.width - 1) {
                y++;
                x = 0;
            }
        }

        return newImageData;
    }

    private applyRGBASegmentation(segmentation: Segmentation, mask: Array<Array<number>>): ImageData {
        var originalImageData = this.picture.imageData;
        var newImageData: ImageData = this.picture.context.createImageData(this.picture.width, this.picture.height);
        var red: number, blue: number, green: number, alpha: number;
        var x = 0;
        var y = 0;

        for (var i = 0; i < originalImageData.data.length; i += 4, x++) {
            newImageData.data[i + ColorType.RED] = this.getNewColorBySegmentation(segmentation, originalImageData, ColorType.RED, i, x, y, mask);
            newImageData.data[i + ColorType.BLUE] = this.getNewColorBySegmentation(segmentation, originalImageData, ColorType.BLUE, i, x, y, mask);
            newImageData.data[i + ColorType.GREEN] = this.getNewColorBySegmentation(segmentation, originalImageData, ColorType.GREEN, i, x, y, mask);
            newImageData.data[i + ColorType.ALPHA] = this.getNewColorBySegmentation(segmentation, originalImageData, ColorType.ALPHA, i, x, y, mask);

            if (x > originalImageData.width - 1) {
                y++;
                x = 0;
            }
        }

        return newImageData;
    }

    private getNewColorBySegmentation(segmentation: Segmentation, imageData: ImageData, colorType: ColorType, index: number, x: number, y: number, mask: Array<Array<number>>): number {
        var matrix = this.picture.imageMatrix;
        var newColor: number, actualColor: number;
        var red: number, blue: number, green: number, alpha: number;

        actualColor = imageData.data[index + colorType];
        red = imageData.data[index];
        blue = imageData.data[index + 1];
        green = imageData.data[index + 2];
        alpha = imageData.data[index + 3];

        newColor = segmentation.method(new SegmentationInfo(actualColor, colorType, matrix, mask, x, y, red, blue, green, alpha));

        return newColor;
    }
}