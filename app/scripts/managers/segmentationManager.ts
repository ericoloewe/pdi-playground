/// <reference path="../models/picture.ts" />
/// <reference path="../models/segmentation.ts" />
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

    public applySegmentationByNameToCanvas(segmentationName: String, canvas: HTMLCanvasElement, params?: any) {
        var segmentation = this.getSegmentationByName(segmentationName);

        if (segmentation === undefined) {
            throw String.format("Segmentation with name \"{0}\" doesn't exist.", segmentationName);
        } else {
            this.applySegmentationToCanvas(segmentation, canvas, params);
        }
    }

    private applySegmentationToCanvas(segmentation: Segmentation, canvas: HTMLCanvasElement, params?: any) {
        var newImageData = this.applySegmentationToImageData(segmentation, params);
        CanvasUtil.applyImageDataToCanvas(newImageData, canvas, this.picture.width, this.picture.height);
    }

    public applySegmentationByNameToImageData(segmentationName: String, params?: any): ImageData {
        var segmentation = this.getSegmentationByName(segmentationName);
        if (segmentation === undefined) {
            throw String.format("Segmentation with name \"{0}\" doesn't exist.", segmentationName);
        } else {
            return this.applySegmentationToImageData(segmentation, params);
        }
    }

    private applySegmentationToImageData(segmentation: Segmentation, params?: any): ImageData {
        return null;
    }
}