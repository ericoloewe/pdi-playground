/// <reference path="../models/picture.ts" />
/// <reference path="view.ts" />
"use strict";

class StatisticsView extends View {
    private image: Picture;

    public constructor(fragment: Fragment, image: Picture) {
        super(fragment);

        this.image = image;
        this.bindEvents();
    }

    private bindEvents() {
        $(this.image.getHtmlImage()).on("load", function () {
            this.defineStatistics();
            this.openCharts();
            this.render();
        });
    }

    private defineStatistics() {
        this.scope.statistics = {
            gray: {
                average: this.image.gray.statistics.average,
                averageRightHalf: this.image.gray.statistics.averageRightHalf(this.image.gray.matrix),
                medianLeftHalf: this.image.gray.statistics.medianLeftHalf(this.image.gray.matrix),
                modeAboveMainDiagonal: this.image.gray.statistics.modeAboveMainDiagonal(this.image.gray.matrix),
                varianceBelowMainDiagonal: this.image.gray.statistics.varianceBelowMainDiagonal(this.image.gray.matrix),
                median: this.image.gray.statistics.median,
                mode: this.image.gray.statistics.mode,
                variance: this.image.gray.statistics.variance
            },
            red: {
                average: this.image.red.statistics.average,
                median: this.image.red.statistics.median,
                mode: this.image.red.statistics.mode,
                variance: this.image.red.statistics.variance
            },
            green: {
                average: this.image.green.statistics.average,
                median: this.image.green.statistics.median,
                mode: this.image.green.statistics.mode,
                variance: this.image.green.statistics.variance
            },
            blue: {
                average: this.image.blue.statistics.average,
                median: this.image.blue.statistics.median,
                mode: this.image.blue.statistics.mode,
                variance: this.image.blue.statistics.variance
            },
            alpha: {
                average: this.image.alpha.statistics.average,
                median: this.image.alpha.statistics.median,
                mode: this.image.alpha.statistics.mode,
                variance: this.image.alpha.statistics.variance
            }
        };
    }

    private openCharts() {
        new Chartist.Line(".chart-gray-histogram", {
            series: [this.image.gray.histogram]
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
        new Chartist.Line(".chart-green-histogram", {
            series: [this.image.green.histogram]
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
        new Chartist.Line(".chart-blue-histogram", {
            series: [this.image.blue.histogram]
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
        new Chartist.Line(".chart-alpha-histogram", {
            series: [this.image.alpha.histogram]
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