/// <reference path="../utils/string.ts" />
/// <reference path="../utils/jquery.ts" />
/// <reference path="events.ts" />
"use strict";

class Fragment {
    public name: String;
    public urlTemplate: String;
    public $htmlLoaded: JQuery;
    public $htmlLoadedWithChilds: JQuery;
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
        this.bindEvents();
    }

    private bindEvents() {
        var self = this;

        this.on("load", function() {
            self.childs.forEach(function(child) {
                child.on("load", function() {
                    self.loadChildHtmlToOwnHtml(child);
                });
            }, self);
        });        
    }

    public loadHtml() {
        var self = this;

        $.ajax({
            method: "GET",
            url: this.urlTemplate.toString(),
            dataType: "html"
        }).done(function (htmlTemplate) {
            self.$htmlLoaded = $(htmlTemplate);
            self.$htmlLoadedWithChilds = $(htmlTemplate);
            self.checkChildrenLoading();
            self.trigger("load");
        });
    }

    public checkChildrenLoading() {
        var self = this;

        this.childs.forEach(function (child) {
            child.on("load-all", function () {
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

    public loadChildHtmlToOwnHtml(child: Fragment) {
        if(child.$htmlLoaded.tagName().toLowerCase().equals("canvas")) {
            this.$htmlLoadedWithChilds
                    .find(this.buildSelectorFor(child))
                    .append(child.$htmlLoaded.cloneCanvas());
        } else {
            this.$htmlLoadedWithChilds
                    .find(this.buildSelectorFor(child))
                    .append(child.$htmlLoaded.clone());
        }
    }

    public findChildByName(childName: String) : Fragment {
        var child = this.childs.filter(function(child) {
            return child.name === childName;
        })[0];

        if(child === undefined) {
            throw String.format("fragment no has child with name={0}", childName);            
        }

        return child;
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

    private buildSelectorFor(fragment: Fragment) {
        return String.format("[data-fragment='{0}']", fragment.name);
    }
}