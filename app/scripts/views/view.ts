"use strict";

class View {
    protected scope: any;
    private fragment: JQuery;

    public constructor(fragment: any = $("body")) {
        this.scope = new Object();
        this.fragment = fragment;
    }

    public render() {
        this.print(this.scope);
    }

    public print(data: any, parents?: string) {
        for (var d in data) {
            if (typeof (data[d]) === "object") {
                if (parents === undefined) {
                    this.print(data[d], `${d}`);
                } else {
                    this.print(data[d], `${parents}.${d}`);
                }
            } else {
                var selector = `{{${parents}.${d}}}`;
                if (this.fragment.html().contains(`<!--START${selector}START-->`) && this.fragment.html().contains(`<!--END${selector}END-->`)) {
                    var expression = `(?<=<!--START${selector}START-->)(.*)(?=<!--END${selector}END-->)`;
                    this.fragment.html(
                        this.fragment
                            .html()
                            .replace(expression, data[d])
                    );
                } else {
                    this.fragment.html(
                        this.fragment
                            .html()
                            .replace(selector, `<!--START${selector}START-->${data[d]}<!--END${selector}END-->`)
                    );
                }

            }
        }
    }
}