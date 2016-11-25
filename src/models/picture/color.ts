"use strict";

import { ColorType } from "colorType";

export class Color {
    public value: number;
    private colorType: ColorType;

    constructor(colorType: ColorType, value: number) {
        this.colorType = colorType;
        this.value = value;
    }
}