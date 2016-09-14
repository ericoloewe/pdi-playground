/// <reference path="../utils/string.ts" />
/// <reference path="events.ts" />
"use strict";

class Fragment {
    public name: String;
    public urlTemplate: String;
    public $htmlLoaded: JQuery;
    public childs: Array<Fragment>;
    private childsLoaded: number;
    private eventManager: StaticEventManager;

    constructor(name: String, urlTemplate: String, childs: Array<Fragment> = new Array<Fragment>()) {
        this.eventManager = new StaticEventManager();
        this.name = name;
        this.urlTemplate = urlTemplate;
        this.$htmlLoaded = $();
        this.childs = childs;
        this.childsLoaded = 0;
        this.loadHtml();
    }

    public loadHtml() {
        var self = this;

        $.ajax({
            method: "GET",
            url: this.urlTemplate.toString(),
            dataType: "html"
        }).done(function (htmlTemplate) {
            self.$htmlLoaded = $(htmlTemplate);
            self.trigger("load");
            self.checkChildrenLoading();
        });
    }

    public checkChildrenLoading() {
        var self = this;

        this.childs.forEach(function (child) {
            child.on("load", function () {
                self.childsLoaded++;
                if (self.childsLoaded === self.childs.length) {
                    self.trigger("load-all");
                }
            });
        });

        if (this.childs.length === 0) {
            this.trigger("load-all");
        }
    }

    public joinHtmls() {
        return this.$htmlLoaded;
    }

    public hasChilds(): boolean {
        return this.childs.length >= 0;
    }

    public on(type: String, action: Function) {
        this.eventManager.on(type, action);
    }

    public trigger(event: String) {
        this.eventManager.trigger(event);
    }
}