/// <reference path="resource.ts" />
/// <reference path="../models/picture.ts" />
"use strict";

class PictureResource extends Resource {

    public loadPicture(src: string, canvas: HTMLCanvasElement): Promise<Picture> {
        return this.loadResource({ src: src, canvas: canvas }, "picture", "loadPicture");
    }
}