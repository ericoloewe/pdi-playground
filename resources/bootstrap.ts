/// <reference path="references/electron/main.ts"/>
/// <reference path="components/window.ts" />
/// <reference path="components/app.ts" />

let App = components.App;

class Bootstrap {
    private mainApp: components.App;

    constructor() {
        this.mainApp = new App();
    }
}

new Bootstrap();