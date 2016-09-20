/// <reference path="picture.ts" />
"use strict";

class Filter {
    public name: String;
    public method: Function;

    public constructor(name: String, method: Function) {
        this.name = name;
        this.method = method;
    }
}