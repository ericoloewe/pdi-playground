"use strict";

class TransformInfo {
    public colorType: ColorType;
    public x: number;
    public y: number;
    public index: number;
    public matrixWidth: number;
    public matrixHeight: number;
    public params: any;

    constructor(colorType: ColorType, index: number, x?: number, y?: number, matrixWidth?: number, matrixHeight?: number, params?: any) {
        this.colorType = colorType;
        this.x = x;
        this.y = y;
        this.index = index;
        this.matrixWidth = matrixWidth;
        this.matrixHeight = matrixHeight;
        this.params = params;
    }
}