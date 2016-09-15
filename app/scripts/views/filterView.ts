/// <reference path="../models/picture.ts" />
/// <reference path="view.ts" />
"use strict";

class FilterView extends View {
    private filter: Filter;

    public constructor(fragment: Fragment, image: Picture) {
        super(fragment);

        this.filter = new Filter(image);
    }
}