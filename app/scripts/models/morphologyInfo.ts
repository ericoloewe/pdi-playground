"use strict";

class MorphologyInfo {
    public red: number;
    public blue: number;
    public green: number;
    public alpha: number;
    public color: number;
    public x: number;
    public y: number;
    public colorType: ColorType;
    public matrix: Array<Array<Array<number>>>;
    public params: any;

    constructor(color: number, colorType: ColorType, matrix: Array<Array<Array<number>>>, params?: any, x?: number, y?: number, red?: number, blue?: number, green?: number, alpha?: number) {
        this.color = color;
        this.colorType = colorType;
        this.matrix = matrix;
        this.params = params;
        this.x = x;
        this.y = y;
        this.red = red;
        this.blue = blue;
        this.green = green;
        this.alpha = alpha;
    }
}