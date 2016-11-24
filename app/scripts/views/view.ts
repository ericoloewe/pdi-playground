/// <reference path="../references/jquery/main.ts" />
/// <reference path="../config/fragments.ts" />
/// <reference path="../config/pages.ts" />

"use strict";

class View implements PageableView {
    protected scope: any;
    protected $scope: JQuery;
    private isRefreshingScope: Boolean;
    private scopeInterval: number;
    public fragment: Fragment;

    public constructor(fragment: Fragment) {
        this.scope = new Object();
        this.$scope = $();
        this.fragment = fragment;
        this.isRefreshingScope = false;
    }

    public load() {
        this.fragment.on("load-all", function () {
            setTimeout(function () {
                this.setScopes();
                this.scopeInterval = setInterval(function () {
                    if (!this.isRefreshingScope) {
                        this.refreshScopes();
                    }
                }.bind(this), 500);
            }.bind(this), 100);
        }.bind(this));
    }

    public unload() {
        clearInterval(this.scopeInterval);
    }

    public setScopes() {
        this.$scope = this.fragment.$htmlLoadedWithChilds.find("[data-scope]");

        this.$scope.each(function () {
            var $element = $(this);
            $element.attr("data-scope", $element.html());
        });

        this.render();
    }

    public render() {
        this.print(this.scope);
    }

    private refreshScopes() {
        this.isRefreshingScope = true;
        this.$scope.each(function () {
            var $element = $(this);
            var dataScope = $element.attr("data-scope");
            $element.html(dataScope);
        });
        this.render();
        this.isRefreshingScope = false;
    }

    private print(data: any, parents?: string) {
        for (var d in data) {
            if (typeof (data[d]) === "object") {
                if (parents === undefined) {
                    this.print(data[d], `${d}`);
                } else {
                    this.print(data[d], `${parents}.${d}`);
                }
            } else {
                var selector = `{{${parents}.${d}}}`;
                this.$scope.each(function () {
                    var $element = $(this);
                    $element.html($element.html().replace(selector, data[d]));
                });
            }
        }
    }

    private enableLoader() {
        var $icon = $("body").find(".icon-loading-shadow");

        if ($icon.length > 0) {
            $icon.remove();
        }

        $("body")
            .append(
            $("<div>")
                .addClass("icon-loading-shadow")
                .append(
                $("<i>").addClass("glyphicon glyphicon-repeat rotate-infinite icon-loading icon-loading-center")
                )
            );
    }

    private disableLoader() {
        var $icon = $("body").find(".icon-loading-shadow");
        if ($icon.length > 0) {
            $icon.remove();
        }
    }
}