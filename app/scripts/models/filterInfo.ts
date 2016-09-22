"use strict";

class FilterInfo {
    public red: number;
    public blue: number;
    public green: number;
    public alpha: number;
    public color: number;
    public x: number;
    public y: number;
    public index: number;

    constructor(color: number, index: number, x?: number, y?: number, red?: number, blue?: number, green?: number, alpha?: number) {
        this.red = red;
        this.blue = blue;
        this.green = green;
        this.alpha = alpha;
        this.x = x;
        this.y = y;
        this.index = index;
        this.color = color;
    }
}