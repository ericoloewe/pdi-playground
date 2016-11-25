/// <reference path="../utils/string.ts" />
/// <reference path="../models/picture.ts" />
/// <reference path="../models/morphology.ts" />
/// <reference path="../models/morphologyType.ts" />
/// <reference path="../models/morphologyInfo.ts" />
"use strict";

class MorphologyManager {
    private morphologies: Array<Morphology>;
    public picture: Picture;

    public constructor(picture: Picture) {
        this.picture = picture;
        this.morphologies = new Array<Morphology>();
    }

    public addMorphology(morphology: Morphology) {
        this.morphologies.push(morphology);
    }

    public getMorphologies() {
        return this.morphologies;
    }

    public getMorphologyByName(morphologyName: String): Morphology {
        return this.morphologies.filter(function (morphology) {
            return morphology.name === morphologyName;
        })[0];
    }

    public applyMorphologyByNameToCanvas(morphologyName: String, canvas: HTMLCanvasElement, params?: any) {
        var morphology = this.getMorphologyByName(morphologyName);

        if (morphology === undefined) {
            throw String.format("Morphology with name \"{0}\" doesn't exist.", morphologyName);
        } else {
            this.applyMorphologyToCanvas(morphology, canvas, params);
        }
    }

    private applyMorphologyToCanvas(morphology: Morphology, canvas: HTMLCanvasElement, params?: any) {
        var newImageData = this.applyMorphologyToImageData(morphology, params);
        CanvasUtil.applyImageDataToCanvas(newImageData, canvas, this.picture.width, this.picture.height);
    }

    public applyMorphologyByNameToImageData(morphologyName: String, params?: any): ImageData {
        var morphology = this.getMorphologyByName(morphologyName);
        if (morphology === undefined) {
            throw String.format("Morphology with name \"{0}\" doesn't exist.", morphologyName);
        } else {
            return this.applyMorphologyToImageData(morphology, params);
        }
    }

    private applyMorphologyToImageData(morphology: Morphology, params?: any): ImageData {
        var newImageData: ImageData;

        switch (morphology.type) {
            case MorphologyType.RGB: {
                newImageData = this.applyRGBMorphology(morphology, params);
                break;
            };
            case MorphologyType.RGBA: {
                newImageData = this.applyRGBAMorphology(morphology, params);
                break;
            };
        }

        return newImageData;
    }

    private applyRGBMorphology(morphology: Morphology, params?: any): ImageData {
        var originalImageData = this.picture.imageData;
        var newImageData: ImageData = this.picture.context.createImageData(this.picture.width, this.picture.height);
        var x = 0;
        var y = 0;

        for (var i = 0; i < originalImageData.data.length; i += 4, x++) {
            newImageData.data[i + ColorType.RED] = this.getNewColorByMorphology(morphology, originalImageData, ColorType.RED, i, x, y, params);
            newImageData.data[i + ColorType.BLUE] = this.getNewColorByMorphology(morphology, originalImageData, ColorType.BLUE, i, x, y, params);
            newImageData.data[i + ColorType.GREEN] = this.getNewColorByMorphology(morphology, originalImageData, ColorType.GREEN, i, x, y, params);
            newImageData.data[i + ColorType.ALPHA] = originalImageData.data[i + ColorType.ALPHA];

            if (x > originalImageData.width - 1) {
                y++;
                x = 0;
            }
        }

        return newImageData;
    }

    private applyRGBAMorphology(morphology: Morphology, params?: any): ImageData {
        var originalImageData = this.picture.imageData;
        var newImageData: ImageData = this.picture.context.createImageData(this.picture.width, this.picture.height);
        var red: number, blue: number, green: number, alpha: number;
        var x = 0;
        var y = 0;

        for (var i = 0; i < originalImageData.data.length; i += 4, x++) {
            newImageData.data[i + ColorType.RED] = this.getNewColorByMorphology(morphology, originalImageData, ColorType.RED, i, x, y, params);
            newImageData.data[i + ColorType.BLUE] = this.getNewColorByMorphology(morphology, originalImageData, ColorType.BLUE, i, x, y, params);
            newImageData.data[i + ColorType.GREEN] = this.getNewColorByMorphology(morphology, originalImageData, ColorType.GREEN, i, x, y, params);
            newImageData.data[i + ColorType.ALPHA] = this.getNewColorByMorphology(morphology, originalImageData, ColorType.ALPHA, i, x, y, params);

            if (x > originalImageData.width - 1) {
                y++;
                x = 0;
            }
        }

        return newImageData;
    }

    private getNewColorByMorphology(morphology: Morphology, imageData: ImageData, colorType: ColorType, index: number, x: number, y: number, params?: any): number {
        var matrix = this.picture.imageMatrix;
        var newColor: number, actualColor: number;
        var red: number, blue: number, green: number, alpha: number;

        actualColor = imageData.data[index + colorType];
        red = imageData.data[index];
        blue = imageData.data[index + 1];
        green = imageData.data[index + 2];
        alpha = imageData.data[index + 3];

        newColor = morphology.method(new MorphologyInfo(actualColor, colorType, matrix, params, x, y, red, blue, green, alpha));

        return newColor;
    }
}