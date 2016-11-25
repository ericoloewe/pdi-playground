/// <reference path="controller.ts" />
/// <reference path="../resources/pictureResource.ts" />
"use strict";

class StatisticsController extends Controller {

    public constructor(view?: View) {
        super(view, new PictureResource());
    }
    
    public loadPicture() {

    }
}