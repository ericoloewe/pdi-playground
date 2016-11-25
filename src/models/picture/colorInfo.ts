"use strict";

import { Color } from "color";
import { ColorType } from "colorType";
import { ColorStatistics } from "colorStatistics";
import { Math } from "../../utils/mathUtils";

export class ColorInfo {
    public matrix: Array<Array<Color>>;
    public simpleNumbersArray: Array<number>;
    public histogram: Array<number>;
    private type: ColorType;
    public statistics: ColorStatistics;

    constructor(type: ColorType, colorMatrix: Array<Array<Color>>) {
        this.simpleNumbersArray = Array<number>();
        this.matrix = colorMatrix;
        this.type = type;
        this.defineValues();
        this.statistics = new ColorStatistics(colorMatrix, this.simpleNumbersArray);
    }

    private defineValues() {
        this.defineSimpleArray();
        this.defineHistogram();
    }

    private defineSimpleArray() {
        var self = this;

        this.matrix.forEach(function (arrayX, i) {
            arrayX.forEach(function (color, j) {
                self.simpleNumbersArray.push(color.value);
            });
        });
    }

    private defineHistogram() {
        this.histogram = Math.histogram(255, this.simpleNumbersArray);
    }
}