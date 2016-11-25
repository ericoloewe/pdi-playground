"use strict";

import { Color } from "color";
import { ColorInfo } from "colorInfo";
import { ColorType } from "colorType";

export class Picture {
    public src: string;
    public imageMatrix: Array<Array<Array<number>>>;
    public imageData: ImageData;
    public red: ColorInfo;
    public green: ColorInfo;
    public blue: ColorInfo;
    public alpha: ColorInfo;
    public gray: ColorInfo;
    public width: number;
    public height: number;

    constructor(src: string, imageData: ImageData) {
        this.imageData = imageData;
        this.imageMatrix = new Array<Array<Array<number>>>();
    }

    private definePictureMatrix() {
        var redArray = new Array<Array<Color>>(), blueArray = new Array<Array<Color>>(), greenArray = new Array<Array<Color>>(), alphaArray = new Array<Array<Color>>(), grayArray = new Array<Array<Color>>();
        var red: number, blue: number, green: number, alpha: number;
        var y = 0;
        var x = 0;
        var i = 0;

        while (i < this.imageData.data.length) {
            if (this.imageMatrix[y] === undefined) {
                this.imageMatrix[y] = new Array<Array<number>>();
                redArray[y] = new Array<Color>();
                blueArray[y] = new Array<Color>();
                greenArray[y] = new Array<Color>();
                alphaArray[y] = new Array<Color>();
                grayArray[y] = new Array<Color>();
            }

            red = this.imageData.data[i];
            blue = this.imageData.data[i + 1];
            green = this.imageData.data[i + 2];
            alpha = this.imageData.data[i + 3];

            this.imageMatrix[y][x] = [red, blue, green, alpha];

            redArray[y][x] = new Color(ColorType.RED, red);
            blueArray[y][x] = new Color(ColorType.BLUE, blue);
            greenArray[y][x] = new Color(ColorType.GREEN, green);
            alphaArray[y][x] = new Color(ColorType.ALPHA, alpha);
            grayArray[y][x] = new Color(ColorType.GRAY, (red + green + blue) / 3);

            x++;
            i += 4;
            if (x > this.imageData.width - 1) {
                y++;
                x = 0;
            }
        }

        this.defineColorsInfo(redArray, blueArray, greenArray, alphaArray, grayArray);
    }

    private defineColorsInfo(redArray: Array<Array<Color>>, blueArray: Array<Array<Color>>, greenArray: Array<Array<Color>>, alphaArray: Array<Array<Color>>, grayArray: Array<Array<Color>>) {
        this.red = new ColorInfo(ColorType.RED, redArray);
        this.blue = new ColorInfo(ColorType.BLUE, blueArray);
        this.green = new ColorInfo(ColorType.GREEN, greenArray);
        this.alpha = new ColorInfo(ColorType.ALPHA, alphaArray);
        this.gray = new ColorInfo(ColorType.GRAY, grayArray);
    }
}