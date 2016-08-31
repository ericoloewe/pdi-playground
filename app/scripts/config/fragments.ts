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
}

class Fragments {
    private fragments: Array<Fragment>;

    constructor(fragments: Array<Fragment>) {
        this.fragments = fragments;
        this.loadFragments();
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
}