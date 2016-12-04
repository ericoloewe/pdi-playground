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
            case MorphologyType.GRAY: {
                newImageData = this.applyGrayMorphology(morphology, params);
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
            newImageData.data[i + ColorType.ALPHA] = originalImageData.data[i + ColorType.ALPHA];

            if (x > originalImageData.width - 1) {
                y++;
                x = 0;
            }
        }

        return newImageData;
    }

    private applyGrayMorphology(morphology: Morphology, params?: any): ImageData {
        var originalImageData = this.picture.imageData;
        var newImageData: ImageData = this.picture.context.createImageData(this.picture.width, this.picture.height);
        var red: number, blue: number, green: number, gray: number;
        var x = 0;
        var y = 0;

        for (var i = 0; i < originalImageData.data.length; i++) {
            newImageData.data[i] = originalImageData.data[i];
        }

        for (var i = 0; i < originalImageData.data.length; i += 4, x++) {
            red = originalImageData.data[i + ColorType.RED];
            blue = originalImageData.data[i + ColorType.BLUE];
            green = originalImageData.data[i + ColorType.GREEN];

            gray = Math.round((red + blue + green) / 3);

            newImageData = this.getDataFromMorphologyMatrix(morphology, newImageData, gray, ColorType.GRAY, i, x, y, params);

            if (x > originalImageData.width - 1) {
                y++;
                x = 0;
            }
        }

        return newImageData;
    }

    private getDataFromMorphologyMatrix(morphology: Morphology, imageData: ImageData, actualColor: number, colorType: ColorType, index: number, x: number, y: number, params?: any): ImageData {
        var matrix = this.picture.imageMatrix;
        var newColor: number;
        var morphologyMatrix: Array<Array<number>>
        var red: number, blue: number, green: number, alpha: number;

        red = imageData.data[index + ColorType.RED];
        blue = imageData.data[index + ColorType.BLUE];
        green = imageData.data[index + ColorType.GREEN];
        alpha = imageData.data[index + ColorType.ALPHA];

        morphologyMatrix = morphology.method(new MorphologyInfo(actualColor, colorType, matrix, params, x, y, red, blue, green, alpha));
        this.applyMorphologyForColorToData(matrix, morphologyMatrix, imageData, colorType, x, y);

        return imageData;
    }

    private applyMorphologyForColorToData(matrix: Array<Array<Array<number>>>, morphologyMatrix: Array<Array<number>>, imageData: ImageData, colorType: ColorType, x: number, y: number) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                imageData.data[this.convertXYToIndex(x + (i - 1), y + (j - 1), imageData.width, imageData.height, colorType)] = morphologyMatrix[i][j];
            }
        }
    }

    private convertXYToIndex(x: number, y: number, matrixWidth: number, matrixHeight: number, colorType: ColorType): number {
        var realX = x, realY = y;
        var width = matrixWidth - 2;
        var height = matrixHeight - 2;

        if (x < 0) {
            realX = width - x;
        } else if (x >= width) {
            realX = x - width;
        }

        if (y < 0) {
            realY = height - y;
        } else if (y >= height) {
            realY = y - height;
        }

        return (realX + realY * matrixWidth) * 4 * colorType;
    }
}