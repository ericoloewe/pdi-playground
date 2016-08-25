/// <reference path="../models/picture.ts" />
/// <reference path="view.ts" />
"use strict";

class StatisticsView extends View {
    private $canvas: JQuery;
    private image: Picture;

    public constructor() {
        super($(".statistics"));
        this.$canvas = $("#PDI_CANVAS");
        this.image = new Picture("media/img/Lenna.png", this.$canvas[0]);
        this.bindEvents();
    }

    private bindEvents() {
        var self = this;

        $(this.image.getHtmlImage()).on("load", function () {
            self.defineStatistics();
            self.openChart();
            self.render();
            console.log(self);
        });
    }

    private defineStatistics() {
        this.scope.statistics = {
            red: {
                average: this.image.red.average,
                median: this.image.red.median,
                mode: this.image.red.mode,
                variance: this.image.red.variance
            },
            green: {
                average: this.image.green.average,
                median: this.image.green.median,
                mode: this.image.green.mode,
                variance: this.image.green.variance
            },
            blue: {
                average: this.image.blue.average,
                median: this.image.blue.median,
                mode: this.image.blue.mode,
                variance: this.image.blue.variance
            },
            alpha: {
                average: this.image.alpha.average,
                median: this.image.alpha.median,
                mode: this.image.alpha.mode,
                variance: this.image.alpha.variance
            }
        };
    }

    private openChart() {
        new Chartist.Line(".chart-red-histogram", {
            series: [this.image.red.histogram]
        }, {
                showArea: true,
                showLine: false,
                showPoint: false,
                fullWidth: true,
                axisX: {
                    showLabel: false,
                    showGrid: false
                }
            });
    }
}