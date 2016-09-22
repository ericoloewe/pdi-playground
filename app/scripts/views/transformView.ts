/// <reference path="../models/picture.ts" />
/// <reference path="../managers/transformManager.ts" />
/// <reference path="view.ts" />
"use strict";

class TransformView extends View {
    private transform: TransformManager;

    public constructor(fragment: Fragment, picture: Picture) {
        super(fragment);
        this.transform = new TransformManager(picture);
    }
}