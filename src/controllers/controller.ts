"use strict";

import { ipcMain } from "electron";

export class Controller {
    constructor() {
        this.bindIpcMainEvents();
    }

    private bindIpcMainEvents() {
        var constrollerName = this.constructor.toString().match(/\w+/g)[1].toLowerCase().split("controller")[0];

        for (var prop in this) {
            if (typeof (this[prop]) === "function" && prop !== "constructor") {
                ipcMain.on(`electron-request:${constrollerName}:${prop}`, function () {

                });
            }
        }
    }
}