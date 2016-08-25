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
            self.openChart();
            
            self.scope.statistics = {
                average: self.image.average,
                median: self.image.median,
                mode: self.image.mode,
                variance: self.image.variance
            };

            console.log(self.image);

            self.render();
        });
    }

    private openChart() {
        new Chartist.Line(".chart-histogram", {
            series: [this.image.histograma]
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