"use strict";

import { ipcMain } from "electron";

export class Controller {
    constructor() {
        this.bindIpcMainEvents();
    }

    private bindIpcMainEvents() {
        for (var prop in this) {
            if (typeof (this[prop]) === "function") {
                console.log(`electron-request:${prop}`);
                ipcMain.on(`electron-request:${prop}`, function () {

                });
            }
        }
    }
}