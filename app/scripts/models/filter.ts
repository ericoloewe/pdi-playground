/// <reference path="picture.ts" />
"use strict";

class Filter {
    private picture: Picture;

    public constructor(picture: Picture) {
        this.picture = picture;
    }

    public applyFilter(filter: Function) {
        var data = new Array<number>();        

        this.picture.imageData.data.forEach(function(color, index) {
            data.push(filter(color));
        });
    }
}