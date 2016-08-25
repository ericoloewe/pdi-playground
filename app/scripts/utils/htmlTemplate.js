"use strict";

var HtmlTemplate = function (path) {
    this.$father = $();
    this.$template = $();

    this.loadHtml(path);
    return this;
};

HtmlTemplate.prototype = {
    loadHtml: function (path) {
        var self = this;
        $.ajax({
            method: "GET",
            url: path,
            dataType: "html"
        }).done(function (template) {
            console.log(arguments);
            self.$template = $(template);
            self.$template.appendTo(self.$father);
        }).fail(function () {
            console.log(arguments);
        });
    }
};

$.prototype.T = function () {
    var self = this;
    console.log(this, $(this));
    
    $.ajax({
        method: "GET",
        url: path,
        dataType: "html"
    }).done(function (template) {
        console.log(arguments);
        self.$template = $(template);
        self.$template.appendTo(self.$father);
    }).fail(function () {
        console.log(arguments);
    });
}

window.$T = HtmlTemplate;