"use strict";

import { app } from "electron";
import { ElectronWindow } from "./electronWindow";

export class ElectronApp {
    private own: any;
    private windows: Array<ElectronWindow>;

    constructor() {
        this.own = app;
        this.windows = new Array<ElectronWindow>();
        this.bindEvents();
    }

    private bindEvents() {
        var self = this;

        this.own.on("ready", function () {
            var window = new ElectronWindow();
            window.maximize();
            self.windows.push(window);
        });

        this.own.on("window-all-closed", function () {
            if (process.platform !== "darwin") {
                self.own.quit();
            }
        });

        this.own.on("activate", function () {
            // On OS X it"s common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (self.windows.length === 0) {
                self.windows.push(new ElectronWindow());
            }
        });
    }
}
