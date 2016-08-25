/// <reference path="colorType.ts" />
"use strict";

class Color {
    public value: number;
    private colorType: ColorType;

    constructor(colorType: ColorType, value: number) {
        this.colorType = colorType;
        this.value = value;
    }
}