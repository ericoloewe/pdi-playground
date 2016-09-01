/// <reference path="../utils/string.ts" />
"use strict";

class Fragment {
    public name: String;
    public urlTemplate: String;
    public htmlLoaded: String;
    public childs: Array<Fragment>;

    constructor(name: String, urlTemplate: String, childs: Array<Fragment> = new Array<Fragment>()) {
        this.name = name;
        this.urlTemplate = urlTemplate;
        this.childs = childs;
    }

    public hasChilds(): boolean {
        return this.childs.length >= 0;
    }
}

class FragmentEvent {
    public type: String;
    public action: Function;

    constructor(type?: String, action?: Function) {
        this.type = type;
        this.action = action;
    }
}

class Fragments {
    private fragments: Array<Fragment>;
    private currentFragmentLoaded: number;
    private numberOfFragments: number;
    private static events: Array<FragmentEvent>

    constructor(fragments: Array<Fragment>) {
        Fragments.events = new Array<FragmentEvent>();
        this.currentFragmentLoaded = 0;
        this.numberOfFragments = this.countFragments(fragments);
        this.fragments = fragments;
        this.loadFragments();
    }

    private countFragments(fragments: Array<Fragment>): number {
        var self = this;

        return fragments.reduce(function (f1, f2) {
            return f1 + 1 + (f2.hasChilds() ? self.countFragments(f2.childs) : 0);
        }, 0);
    }

    private loadFragments() {
        var self = this;

        this.fragments.forEach(function (fragment) {
            if ($("[data-fragment={0}]".format(fragment.name)).length) {
                $("[data-fragment={0}]".format(fragment.name)).append(self.loadFragmentHtmlTemplate(fragment));
            } else {
                console.error("fragment without html bind");
            }
        });
    }

    private loadFragmentChilds(childs: Array<Fragment>) {
        var self = this;

        childs.forEach(function (fragment) {
            if ($("[data-fragment={0}]".format(fragment.name)).length) {
                $("[data-fragment={0}]".format(fragment.name)).append(self.loadFragmentHtmlTemplate(fragment));
            } else {
                console.error("fragment without html bind");
            }
        });
    }

    private loadFragmentHtmlTemplate(fragment: Fragment) {
        var self = this;
        var $template = $();
        var $father = $();
        var indexToReplace = 0;

        var loadHtml = function (fragment: Fragment) {
            $.ajax({
                method: "GET",
                url: fragment.urlTemplate.toString(),
                dataType: "html"
            }).done(function (template) {
                $template = $(template);
                $father
                    .find("i[data-replace-id={0}]".format(indexToReplace))
                    .replaceWith($template);

                self.currentFragmentLoaded++;

                if (self.currentFragmentLoaded === self.numberOfFragments) {
                    self.triggerEvent("load-all");
                }

                if (fragment.childs.length) {
                    self.loadFragmentChilds(fragment.childs);
                }
            }).fail(function () {
                console.warn(arguments);
            });
        }

        return function () {
            var i = 0;

            while ($(this).find("i[data-replace-id={0}]".format(i)).length) {
                i++;
            }

            loadHtml(fragment);

            indexToReplace = i;
            $father = $(this);
            return $("<i>").attr("data-replace-id", i);
        };
    }

    private triggerEvent(type: String) {
        var events = Fragments.events.filter(function (event) {
            return event.type === type;
        });

        events.forEach(function (event) {
            event.action();
        });
    }

    public static on(type: String, action: Function) {
        Fragments.events.push(new FragmentEvent(type, action));
    }
}