/// <reference path="../config/fragments.ts" />

"use strict";

class View {
    protected scope: any;
    protected $scope: JQuery;
    private isRefreshingScope: Boolean;
    public fragment: Fragment;

    public constructor(fragment: Fragment) {
        var self = this;
        this.scope = new Object();
        this.$scope = $();
        this.fragment = fragment;
        this.isRefreshingScope = false;

        this.fragment.on("load-all", function () {
            setTimeout(function () {
                self.setScopes();
                setInterval(function () {
                    if (!self.isRefreshingScope) {
                        self.refreshScopes();
                    }
                }, 500);
            }, 100);
        });
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
}