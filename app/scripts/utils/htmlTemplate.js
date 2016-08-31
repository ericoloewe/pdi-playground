"use strict";

var HtmlTemplate = function (path) {
    var self = this;
    this.$father = $();
    this.$template = $();
    this.indexToReplace = 0;
    this.loadHtml(path);

    return function () {
        var i = 0;

        while ($(this).find("i[data-replace-id={0}]".format(i)).length) {
            i++;
        }

        self.indexToReplace = i;
        self.$father = $(this);
        return $("<i>").attr("data-replace-id", i);
    };
};

HtmlTemplate.prototype = {
    loadHtml: function (path) {
        var self = this;
        $.ajax({
            method: "GET",
            url: path,
            dataType: "html"
        }).done(function (template) {
            self.$template = $(template);
            self.$father
                .find("i[data-replace-id={0}]".format(self.indexToReplace))
                .replaceWith(self.$template);
        }).fail(function () {
            console.warn(arguments);
        });
    }
};

window.$T = HtmlTemplate;