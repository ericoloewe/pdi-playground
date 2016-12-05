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
        var newImageData = this.applyMorphologyToImageData(morphology, canvas, params);
        CanvasUtil.applyImageDataToCanvas(newImageData, canvas, newImageData.width, newImageData.height);
    }

    public applyMorphologyByNameToImageData(morphologyName: String, params?: any): ImageData {
        var morphology = this.getMorphologyByName(morphologyName);
        if (morphology === undefined) {
            throw String.format("Morphology with name \"{0}\" doesn't exist.", morphologyName);
        } else {
            return this.applyMorphologyToImageData(morphology, params);
        }
    }

    private applyMorphologyToImageData(morphology: Morphology, canvas: HTMLCanvasElement, params?: any): ImageData {
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
                newImageData = this.applyGrayMorphology(morphology, canvas, params);
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

    private applyGrayMorphology(morphology: Morphology, canvas: HTMLCanvasElement, params?: any): ImageData {
        var matrix = new Array<Array<Array<number>>>();
        var originalImageData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
        var newImageData: ImageData = canvas.getContext("2d").createImageData(canvas.width, canvas.height);
        var red: number, blue: number, green: number, gray: number;
        var x = 0;
        var y = 0;

        for (var i = 0; i < newImageData.data.length; i += 4, x++) {
            if (x === newImageData.width - 1) {
                y++;
                x = 0;
            }

            red = newImageData.data[i + ColorType.RED] = originalImageData.data[i + ColorType.RED];
            blue = newImageData.data[i + ColorType.GREEN] = originalImageData.data[i + ColorType.GREEN];
            green = newImageData.data[i + ColorType.BLUE] = originalImageData.data[i + ColorType.BLUE];
            newImageData.data[i + ColorType.ALPHA] = originalImageData.data[i + ColorType.ALPHA];

            gray = Math.round((red + blue + green) / 3);

            if (matrix[y] === undefined) {
                matrix[y] = new Array<Array<number>>();
            }

            matrix[y][x] = new Array<number>();
            matrix[y][x][ColorType.GRAY] = gray;
        }

        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                this.getDataFromMorphologyMatrix(morphology, newImageData, matrix[i][j][ColorType.GRAY], ColorType.GRAY, j, i, matrix, params);
            }
        }

        return newImageData;
    }

    private getDataFromMorphologyMatrix(morphology: Morphology, imageData: ImageData, actualColor: number, colorType: ColorType, x: number, y: number, matrix: Array<Array<Array<number>>> = this.picture.imageMatrix, params?: any): ImageData {
        var newColor: number;
        var morphologyMatrix: Array<Array<number>>;

        morphologyMatrix = morphology.method(new MorphologyInfo(actualColor, colorType, matrix, params, x, y));
        this.applyMorphologyForColorToData(morphologyMatrix, imageData, x, y);

        return imageData;
    }

    private applyMorphologyForColorToData(morphologyMatrix: Array<Array<number>>, imageData: ImageData, x: number, y: number) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                imageData.data[this.convertXYToIndex(x + (i - 1), y + (j - 1), imageData.width, imageData.height, ColorType.RED)] = morphologyMatrix[i][j];
                imageData.data[this.convertXYToIndex(x + (i - 1), y + (j - 1), imageData.width, imageData.height, ColorType.GREEN)] = morphologyMatrix[i][j];
                imageData.data[this.convertXYToIndex(x + (i - 1), y + (j - 1), imageData.width, imageData.height, ColorType.BLUE)] = morphologyMatrix[i][j];
            }
        }
    }

    private convertXYToIndex(x: number, y: number, matrixWidth: number, matrixHeight: number, colorType: ColorType): number {
        var realX = x, realY = y;
        var width = matrixWidth - 1;
        var height = matrixHeight - 1;

        if (x < 0) {
            realX = width - Math.abs(x);
        } else if (x >= width) {
            realX = x - width;
        }

        if (y < 0) {
            realY = height - Math.abs(y);
        } else if (y >= height) {
            realY = y - height;
        }

        return (realX + realY * width) * 4 + colorType;
    }
}