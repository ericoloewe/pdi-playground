"use strict";

class View {
    protected scope: any;
    protected $scope: JQuery;
    private $fragment: JQuery;

    public constructor($fragment: JQuery = $("body")) {
        this.scope = new Object();
        this.$fragment = $fragment;
        this.setScopes();
    }

    public setScopes() {
        var self = this;

        this.$scope = this.$fragment.find("[data-scope]");
        this.$scope.each(function () {
            $(this).attr("data-scope", $(this).html());
        });
        this.render();
    }

    public render() {
        this.refreshScopes();
        this.print(this.scope);
    }

    private refreshScopes() {
        this.$scope.each(function () {
            $(this).html($(this).attr("data-scope"));
        });
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
                    $(this).html($(this).html().replace(selector, data[d]));
                });
            }
        }
    }
}