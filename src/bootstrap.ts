"use strict";

import { ElectronApp } from "./components/exports";
import { PictureController, Controller } from "./controllers/exports";

class Bootstrap {
    private mainApp: ElectronApp;
    private controllers: Array<Controller>;

    constructor() {
        this.startApp();
        this.startControllers();
    }

    public startApp() {
        this.mainApp = new ElectronApp();
    }

    public startControllers() {
        this.controllers.push(new PictureController());
    }
}

new Bootstrap();