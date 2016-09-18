/// <reference path="../models/picture.ts" />
/// <reference path="view.ts" />
"use strict";

class StatisticsView extends View {
    private picture: Picture;
    private canvas: HTMLCanvasElement;
    private $canvasSection: JQuery;

    public constructor(fragment: Fragment, picture: Picture) {
        super(fragment);

        this.picture = picture;
        this.bindEvents();
        this.loadCanvas();
    }

    private loadCanvas() {
        var self = this;
        this.fragment.on("load-all", function() {
            self.$canvasSection = self.fragment.$htmlLoadedWithChilds.find("#STATISTICS_CANVAS_SECTION"); 
            var canvas = <HTMLCanvasElement>document.createElement('canvas');
            canvas.id = "STATISTICS_CANVAS";
            canvas.className = "pdi-canvas";
            canvas.width = 512;
            canvas.height = 512;

            var context = canvas.getContext("2d");
            context.drawImage(self.picture.getHtmlImage(), 0, 0);

            var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.putImageData(imageData, 0, 0);

            self.canvas = canvas;
            self.$canvasSection.append(canvas);
            console.log(self.$canvasSection);
        });
    }

    private bindEvents() {
        var self = this;
        
        this.picture.on("load-values", function () {
            self.defineStatistics();
            self.openCharts();
            self.render();
        });
    }

    private defineStatistics() {
        this.scope.statistics = {
            gray: {
                average: this.picture.gray.statistics.average,
                averageRightHalf: this.picture.gray.statistics.averageRightHalf(this.picture.gray.matrix),
                medianLeftHalf: this.picture.gray.statistics.medianLeftHalf(this.picture.gray.matrix),
                modeAboveMainDiagonal: this.picture.gray.statistics.modeAboveMainDiagonal(this.picture.gray.matrix),
                varianceBelowMainDiagonal: this.picture.gray.statistics.varianceBelowMainDiagonal(this.picture.gray.matrix),
                median: this.picture.gray.statistics.median,
                mode: this.picture.gray.statistics.mode,
                variance: this.picture.gray.statistics.variance
            },
            red: {
                average: this.picture.red.statistics.average,
                median: this.picture.red.statistics.median,
                mode: this.picture.red.statistics.mode,
                variance: this.picture.red.statistics.variance
            },
            green: {
                average: this.picture.green.statistics.average,
                median: this.picture.green.statistics.median,
                mode: this.picture.green.statistics.mode,
                variance: this.picture.green.statistics.variance
            },
            blue: {
                average: this.picture.blue.statistics.average,
                median: this.picture.blue.statistics.median,
                mode: this.picture.blue.statistics.mode,
                variance: this.picture.blue.statistics.variance
            },
            alpha: {
                average: this.picture.alpha.statistics.average,
                median: this.picture.alpha.statistics.median,
                mode: this.picture.alpha.statistics.mode,
                variance: this.picture.alpha.statistics.variance
            }
        };
    }

    private openCharts() {
        new Chartist.Line(".chart-gray-histogram", {
            series: [this.picture.gray.histogram]
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
            series: [this.picture.red.histogram]
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
            series: [this.picture.green.histogram]
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
            series: [this.picture.blue.histogram]
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
            series: [this.picture.alpha.histogram]
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