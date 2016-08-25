/// <reference path="../references/electron/main.ts"/>

module components {
    export class App {
        private own: any;
        private windows: Array<Window>;

        constructor() {
            this.own = Electron.app;
            this.windows = new Array<Window>();
            this.bindEvents();
        }

        private bindEvents() {
            var self: App = this;

            this.own.on("ready", function () {
                var window:Window = new Window();
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
                    self.windows.push(new Window());
                }
            });
        }
    }
}