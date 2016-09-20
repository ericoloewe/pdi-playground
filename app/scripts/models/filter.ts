/// <reference path="picture.ts" />
"use strict";

class Filter {
    public picture: Picture;

    public constructor(picture: Picture) {
        this.picture = picture;
    }

    public applyFilter(filter: Function) : ImageData {
        var newImageData = this.picture.imageData;        

        this.picture.imageData.data.forEach(function(color, index) {
            newImageData.data[index] = filter(color, index);
        });

        return newImageData;
    }
}