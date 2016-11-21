/// <reference path="../references/node/main.ts" />
"use strict";

const {ipcRenderer} = require('electron');

class Resource {

    protected loadResource(params: any, controller: string, action: string): Promise<any> {
        return new Promise(function (resolve, reject) {
            ipcRenderer.on(`electron-response:${controller}:${action}`, resolve);
            ipcRenderer.send(`electron-request:${controller}:${action}`, params);
        });
    }

    protected saveResource(params: any, controller: string, action: string): Promise<any> {
        return new Promise(function (resolve, reject) {
            ipcRenderer.on(`electron-response:${controller}:${action}`, resolve);
            ipcRenderer.send(`electron-request:${controller}:${action}`, params);
        });
    }
}