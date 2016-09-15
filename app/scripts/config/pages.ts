
class Page {
    public view: View;
    public enabled: boolean;

    constructor(view: View, enabled: boolean = false) {
        this.view = view;
        this.enabled = enabled;
    }
}

class PageManager {
    private pages: Array<Page>;

    constructor(pages: Array<Page> = new Array<Page>()) {
        this.pages = new Array<Page>();
        this.addAllPages(pages);
        this.enableLinks();
    }

    public addAllPages(pages: Array<Page>) {
        pages.forEach(function (page) {
            this.addPage(page);
        }, this);
    }

    public addPage(page: Page) {
        if (page.enabled) {
            this.activePage(page);
        }
        this.pages.push(page);
    }

    public removeAllPages(pages: Array<Page>) {
        pages.forEach(function (page) {
            this.removePage(page);
        }, this);
    }

    public removePage(page: Page) {
        var index = this.pages.indexOf(page);
        if (index > -1) {
            this.pages.splice(index, 1);
        }
    }

    public activePageByName(name: String) {
        this.pages.forEach(function (page) {
            if (page.view.fragment.name === name) {
                this.activePage(page);
            }
        }, this);
    }

    public activePage(page: Page) {
        var self = this;
        var fatherFragment = page.view.fragment;

        fatherFragment.on("load-all", function () {
            if ($(self.buildSelectorPageFor(fatherFragment)).length) {
                $(self.buildSelectorPageFor(fatherFragment)).append(fatherFragment.$htmlLoadedWithChilds);
            } else {
                self.cleanPage();
                self.activeLink($(self.buildSelectorLinkFor(fatherFragment)));
                $("[data-pages]").attr("data-actual-page", fatherFragment.name.toString());
                $("[data-pages]").append(fatherFragment.$htmlLoadedWithChilds);
                $("[data-pages]").addClass(fatherFragment.name.toString());
            }
        });
    }

    public disablePage(page: Page) {
        var fatherFragment = page.view.fragment;

        if ($(String.format("[data-page='{0}']", fatherFragment.name)).length) {
            $(String.format("[data-page='{0}']", fatherFragment.name)).empty();
        } else {
            this.cleanPage();
        }
    }

    public cleanPage() {
        $("[data-pages]").empty();
        $("[data-pages]").attr("data-actual-page", "");

        this.pages.forEach(function (page) {
            $("[data-pages]").removeClass(page.view.fragment.name.toString());
        });
    }

    public refreshLinks() {
        $("[data-page-link]").unbind("click");
        this.enableLinks();
    }

    private buildSelectorPageFor(fragment: Fragment): String {
        return String.format("[data-page='{0}']", fragment.name);
    }

    private buildSelectorLinkFor(fragment: Fragment): String {
        return String.format("[data-page-link][href='#{0}']", fragment.name);
    }

    private enableLinks() {
        var self = this;

        $("[data-page-link]").click(function () {
            var link = $(this);
            self.activeLink(link);
            var href = link.attr("href");
            var pageName = href.substr(1, href.length);
            self.activePageByName(pageName);
        });
    }

    private activeLink(link: JQuery) {
        $("[data-page-link]").parent().removeClass("active");
        link.parent().addClass("active");
    }
}