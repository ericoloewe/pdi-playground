/// <reference path="../models/picture.ts" />
/// <reference path="../models/filter.ts" />
/// <reference path="../models/filterInfo.ts" />
"use strict";

class FilterManager {
    private filters: Array<Filter>;
    public picture: Picture;

    public constructor(picture: Picture) {
        this.filters = new Array<Filter>();
        this.picture = picture;
    }

    public addFilter(filter: Filter) {
        this.filters.push(filter);
    }

    public getFilters() {
        return this.filters;
    }

    public getFilterByName(filterName: String): Filter {
        return this.filters.filter(function (filter) {
            return filter.name === filterName;
        })[0];
    }

    public applyFilterByNameToCanvas(filterName: String, canvas: HTMLCanvasElement) {
        var filter = this.getFilterByName(filterName);

        if (filter === undefined) {
            throw String.format("Filter with name \"{0}\" doesn't exist.", filterName);
        } else {
            this.applyFilterToCanvas(filter, canvas);
        }
    }

    private applyFilterToCanvas(filter: Filter, canvas: HTMLCanvasElement) {
        var newImageData = this.applyFilterToImageData(filter);
        CanvasUtil.applyImageDataToCanvas(newImageData, canvas, this.picture.width, this.picture.height);
    }

    public applyFilterByNameToImageData(filterName: String): ImageData {
        var filter = this.getFilterByName(filterName);
        if (filter === undefined) {
            throw String.format("Filter with name \"{0}\" doesn't exist.", filterName);
        } else {
            return this.applyFilterToImageData(filter);
        }
    }

    private applyFilterToImageData(filter: Filter): ImageData {
        var oldImageData = this.picture.imageData;
        var newImageData = this.picture.context.createImageData(this.picture.width, this.picture.height);
        var red: number, blue: number, green: number, alpha: number;
        var x = 0;
        var y = 0;
        newImageData.data = oldImageData.data;

        switch (filter.type) {
            case FilterType.GENERAL: {
                this.applyGeneralFilter(filter, newImageData, oldImageData);
                break;
            };
            case FilterType.GENERAL_WITHOUT_ALPHA: {
                this.applyGeneralFilterWithoutAlpha(filter, newImageData, oldImageData);
                break;
            };
            case FilterType.RGB: {
                this.applyRGBFilter(filter, newImageData, oldImageData);
                break;
            };
            case FilterType.RGBA: {
                this.applyRGBAFilter(filter, newImageData, oldImageData);
                break;
            };
        }

        return newImageData;
    }
    
    private applyGeneralFilter(filter: Filter, imageData: ImageData, originalImageData: ImageData) {
        for (var i = 0; i < originalImageData.data.length; i++) {
            var color = originalImageData.data[i];
            imageData.data[i] = filter.method(new FilterInfo(color, i));
        }
    }

    private applyGeneralFilterWithoutAlpha(filter: Filter, imageData: ImageData, originalImageData: ImageData) {
        for (var i = 0, actualColor = 0; i < originalImageData.data.length; i++ , actualColor++) {
            var color = originalImageData.data[i];
            if (actualColor < 3) {
                imageData.data[i] = filter.method(new FilterInfo(color, i));
            } else {
                imageData.data[i] = color;
                actualColor = 0;
            }
        }
    }

    private applyRGBFilter(filter: Filter, imageData: ImageData, originalImageData: ImageData) {
        var red: number, blue: number, green: number, alpha: number;
        var x = 0, y = 0;
        for (var i = 0; i < originalImageData.data.length; i += 4, x++) {
            red = originalImageData.data[i];
            blue = originalImageData.data[i + 1];
            green = originalImageData.data[i + 2];
            alpha = originalImageData.data[i + 3];
            imageData.data[i] = filter.method(new FilterInfo(red, i, x, y, red, blue, green));
            imageData.data[i + 1] = filter.method(new FilterInfo(blue, i + 1, x, y, red, blue, green));
            imageData.data[i + 2] = filter.method(new FilterInfo(green, i + 2, x, y, red, blue, green));
            imageData.data[i + 3] = alpha;
            if (x > originalImageData.width - 1) {
                y++;
                x = 0;
            }
        }
    }

    private applyRGBAFilter(filter: Filter, imageData: ImageData, originalImageData: ImageData) {
        var red: number, blue: number, green: number, alpha: number;
        var x = 0, y = 0;
        for (var i = 0; i < originalImageData.data.length; i += 4, x++) {
            red = originalImageData.data[i];
            blue = originalImageData.data[i + 1];
            green = originalImageData.data[i + 2];
            alpha = originalImageData.data[i + 3];
            imageData.data[i] = filter.method(new FilterInfo(red, i, x, y, red, blue, green, alpha));
            imageData.data[i + 1] = filter.method(new FilterInfo(blue, i + 1, x, y, red, blue, green, alpha));
            imageData.data[i + 2] = filter.method(new FilterInfo(green, i + 2, x, y, red, blue, green, alpha));
            imageData.data[i + 3] = filter.method(new FilterInfo(alpha, i + 3, x, y, red, blue, green, alpha));
            if (x > originalImageData.width - 1) {
                y++;
                x = 0;
            }
        }
    }

    public restoreCanvasImage(canvas: HTMLCanvasElement) {
        CanvasUtil.reziseImageCanvas(canvas, this.picture.getHtmlImage(), canvas.width, canvas.height);
    }
}