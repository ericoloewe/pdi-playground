"use strict";

import { ipcMain } from "electron";

export class Controller {
    constructor() {
        this.bindIpcMainEvents();
    }

    private bindIpcMainEvents() {
        var constrollerName = this.constructor.toString().match(/\w+/g)[1].toLowerCase().split("controller")[0];

        for (var action in this) {
            if (typeof (this[action]) === "function" && action !== "constructor") {
                ipcMain.on(`electron-request:${constrollerName}:${action}`, (event, args) => event.sender.send(`electron-response:${constrollerName}:${action}`, this[action](args)));
            }
        }
    }
}