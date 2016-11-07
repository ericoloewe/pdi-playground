"use strict";

class SegmentationInfo {
    public red: number;
    public blue: number;
    public green: number;
    public alpha: number;
    public color: number;
    public x: number;
    public y: number;
    public colorType: ColorType;
    public matrix: Array<Array<Array<number>>>;
    public mask: Array<Array<number>>;

    constructor(color: number, colorType: ColorType, matrix: Array<Array<Array<number>>>, mask: Array<Array<number>>, x?: number, y?: number, red?: number, blue?: number, green?: number, alpha?: number) {
        this.color = color;
        this.colorType = colorType;
        this.matrix = matrix;
        this.mask = mask;
        this.x = x;
        this.y = y;
        this.red = red;
        this.blue = blue;
        this.green = green;
        this.alpha = alpha;
    }
}