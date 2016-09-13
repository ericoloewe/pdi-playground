/// <reference path="../models/picture.ts" />
/// <reference path="view.ts" />
"use strict";

class FilterView extends View {
    private filter: Filter;

    public constructor() {
        super($(".filter"));
    }
}