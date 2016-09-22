/// <reference path="picture.ts" />
/// <reference path="filterType.ts" />
"use strict";

class Filter {
    public name: String;
    public method: Function;
    public type: FilterType;

    public constructor(name: String, method: Function, type: FilterType = FilterType.GENERAL_WITHOUT_ALPHA) {
        this.name = name;
        this.method = method;
        this.type = type;
    }
}