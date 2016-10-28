"use strict";

import { ElectronApp } from "./components/exports";

class Bootstrap {
    private mainApp: ElectronApp;

    constructor() {
        this.mainApp = new ElectronApp();
    }
}

new Bootstrap();