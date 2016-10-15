/// <reference path="../references/node/main.ts" />
/// <reference path="../references/electron/main.ts" />

let BrowserWindow = Electron.BrowserWindow;

module components {
    export class Window {
        private own: Electron.BrowserWindow;

        constructor() {
            var self = this;

            this.own = new BrowserWindow({ width: 1200, height: 800, icon: `${__dirname}/app/media/img/pdi.ico` });
            this.own.loadURL(`file://${__dirname}/app/index.html`);
            this.own.webContents.openDevTools();

            this.own.on("closed", function () {
                self.own = null;
            });
        }

        public maximize() {
            this.own.maximize();
        }
    }
}