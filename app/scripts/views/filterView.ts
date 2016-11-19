/// <reference path="../models/picture.ts" />
/// <reference path="../models/filter.ts" />
/// <reference path="../models/filterInfo.ts" />
/// <reference path="../utils/canvas.ts" />
/// <reference path="../managers/filterManager.ts" />
/// <reference path="../references/jquery/main.ts" />
/// <reference path="view.ts" />
"use strict";

class FilterView extends View {
    private filterManager: FilterManager;
    private canvas: HTMLCanvasElement;
    private canvasWidth: number;
    private canvasHeight: number;
    private $canvasSection: JQuery;

    public constructor(fragment: Fragment, image: Picture) {
        super(fragment);

        this.filterManager = new FilterManager(image);
        this.canvasHeight = 650;
        this.canvasWidth = 650;
    }

    public load() {
        super.load();

        this.loadFilters();
        this.loadCanvas();
    }

    public unload() {
        super.unload();
    }

    private loadCanvas() {
        var self = this;
        this.fragment.on("load-all", function() {
            self.$canvasSection = self.fragment.$htmlLoadedWithChilds.find("#FILTER_CANVAS_SECTION");
            var canvas = CanvasUtil.createCustomCanvas(self.canvasWidth, self.canvasHeight, self.filterManager.picture.getHtmlImage(), "FILTER_CANVAS", "pdi-canvas");
            self.canvas = canvas;
            self.$canvasSection.append(canvas);
        });
    }

    private loadFiltersAtScreen() {
        var self = this;
        var filterList = this.fragment.$htmlLoadedWithChilds.find(".filters-list");

        filterList.append(this.filterManager.getFilters().map(function(filter) {
            return $("<li>")
                .append(self.createCanvasForFilter(filter, 100, 100))
                .attr("data-filter-name", filter.name.toString())
                .attr("title", filter.name.toString())
                .click(function(e) {
                    var $canvas = $(this);
                    self.filterManager.restoreCanvasImage(self.canvas);
                    self.filterManager.applyFilterByNameToCanvas($canvas.data("filter-name"), self.canvas);
                    return e.preventDefault();
                });
        }));
    }

    private createCanvasForFilter(filter: Filter, width: number, height: number): HTMLCanvasElement {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        this.filterManager.applyFilterByNameToCanvas(filter.name, canvas);
        return canvas;
    }

    private loadFilters() {
        var self = this;

        this.filterManager.picture.on("load-all-values", function() {
            var picture = self.filterManager.picture;
            var average = picture.gray.statistics.average;
            var median = picture.gray.statistics.median;
            var mode = picture.gray.statistics.mode;

            self.filterManager.addFilter(new Filter("ORIGINAL", function(info: FilterInfo) {
                return info.color;
            }));

            self.filterManager.addFilter(new Filter("GRAY", function(info: FilterInfo) {
                return (info.red + info.green + info.blue) / 3;
            }, FilterType.RGB));

            self.filterManager.addFilter(new Filter("GRAY-LIGHT", function(info: FilterInfo) {
                var gray = (info.red + info.green + info.blue) / 3;
                if (gray >= 128) {
                    gray = average;
                }
                return gray;
            }, FilterType.RGB));

            self.filterManager.addFilter(new Filter("GRAY-CONTRAST", function(info: FilterInfo) {
                var gray = (info.red + info.green + info.blue) / 3;
                if (gray >= 128) {
                    gray = mode;
                }
                return gray;
            }, FilterType.RGB));

            self.filterManager.addFilter(new Filter("GRAY-CONTRAST-2", function(info: FilterInfo) {
                var gray = (info.red + info.green + info.blue) / 3;
                if (gray >= 128) {
                    gray = median;
                }
                return gray;
            }, FilterType.RGB));

            self.filterManager.addFilter(new Filter("GRAY-HOT", function(info: FilterInfo) {
                var gray = (info.red + info.green + info.blue) / 3;
                if (gray < average) {
                    gray = 0;
                }
                return gray;
            }, FilterType.RGB));

            self.filterManager.addFilter(new Filter("GRAY-HOT-2", function(info: FilterInfo) {
                var gray = (info.red + info.green + info.blue) / 3;
                if (gray < average) {
                    gray = 0;
                } else if (gray > median) {
                    gray = 255;
                }
                return gray;
            }, FilterType.RGB));

            self.filterManager.addFilter(new Filter("BLUE-LIGHT", function(info: FilterInfo) {
                if (info.color >= 128) {
                    info.color = average;
                }

                return info.color;
            }));

            self.filterManager.addFilter(new Filter("CONTRAST", function(info: FilterInfo) {
                if (info.color >= 128) {
                    info.color = mode;
                }

                return info.color;
            }));

            self.filterManager.addFilter(new Filter("CONTRAST-2", function(info: FilterInfo) {
                if (info.color >= 128) {
                    info.color = median;
                }

                return info.color;
            }));

            self.filterManager.addFilter(new Filter("HOT", function(info: FilterInfo) {
                if (info.color < average) {
                    info.color = 0;
                }

                return info.color;
            }));

            self.filterManager.addFilter(new Filter("HOT-2", function(info: FilterInfo) {
                if (info.color < average) {
                    info.color = 0;
                } else if (info.color > median) {
                    info.color = 255;
                }

                return info.color;
            }));

            var hotFilter = self.filterManager.getFilterByName("HOT");
            var grayHotFilter = self.filterManager.getFilterByName("GRAY-HOT");

            self.filterManager.addFilter(new Filter("RED", function(info: FilterInfo) {
                return info.red;
            }, FilterType.RGB));

            self.filterManager.addFilter(new Filter("BLUE", function(info: FilterInfo) {
                return info.blue;
            }, FilterType.RGB));

            self.filterManager.addFilter(new Filter("GREEN", function(info: FilterInfo) {
                return info.green;
            }, FilterType.RGB));

            self.filterManager.addFilter(new Filter("ALPHA", function(info: FilterInfo) {
                return info.alpha;
            }, FilterType.RGB));

            self.filterManager.addFilter(new Filter("HALF-GREEN", function(info: FilterInfo) {
                if (info.x < info.y) {
                    return grayHotFilter.method(info);
                }
                return hotFilter.method(info);
            }, FilterType.RGB));

            self.filterManager.addFilter(new Filter("HALF-GREEN-2", function(info: FilterInfo) {
                if (info.x > info.y) {
                    return grayHotFilter.method(info);
                }
                return hotFilter.method(info);
            }, FilterType.RGB));

            self.loadFiltersAtScreen();
        });
    }
}