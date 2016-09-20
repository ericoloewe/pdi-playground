/// <reference path="../models/picture.ts" />
/// <reference path="../models/filter.ts" />
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

    public getFilterByName(filterName: String) : Filter {
        return this.filters.filter(function(filter) {
            return filter.name === filterName;
        })[0];
    }

    public applyFilterByNameToCanvas(filterName: String, canvas: HTMLCanvasElement) {
        var filter = this.getFilterByName(filterName);
        if(filter === undefined) {
            throw String.format("Filter with name \"{0}\" doesn't exist.", filterName);            
        } else {
            this.applyFilterToCanvas(filter, canvas);
        }
    }

    private applyFilterToCanvas(filter: Filter, canvas: HTMLCanvasElement) {
        var newImageData = this.applyFilterToImageData(filter);
        CanvasUtil.applyImageDataToCanvas(newImageData, canvas, this.picture.width, this.picture.height);
    }

    public applyFilterByNameToImageData(filterName: String) : ImageData {
        var filter = this.getFilterByName(filterName);
        if(filter === undefined) {
            throw String.format("Filter with name \"{0}\" doesn't exist.", filterName);
        } else {
            return this.applyFilterToImageData(filter);
        }
    }

    private applyFilterToImageData(filter: Filter) : ImageData {
        var newImageData = this.picture.imageData;

        this.picture.imageData.data.forEach(function(color, index) {
            newImageData.data[index] = filter.method(color, index);
        });

        return newImageData;
    }
}