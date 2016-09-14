/// <reference path="../models/picture.ts" />
/// <reference path="view.ts" />
"use strict";

class TransformView extends View {
    private transform: Transform;

    public constructor(fragment: Fragment) {
        super(fragment);
    }
}