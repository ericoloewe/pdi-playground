
class Pages {
    private links: JQuery;

    constructor() {
        this.links = $("[data-page-link]");
        this.bindEvents();
        this.activePage($(this.links[0]));
    }

    private bindEvents() {
        var self = this;
        this.links.click(function () {
            self.activePage($(this));
        });
    }

    private activePage(link: JQuery) {
        var page = link.attr("href").substr(1, link.attr("href").length);
        $(".pages > *").removeClass("active");
        this.links.parent().removeClass("active");
        $(String.format("[data-fragment={0}]", page)).addClass("active");
        link.parent().addClass("active");
    }
}