/// <reference path="../resources/resource.ts" />
"use strict";

class Controller {
    private _view: View;
    private _resource: Resource;

    public constructor(view?: View, resource?: Resource) {
        this._view = view;
        this._resource = resource;
    }

    public get view(): View {
        return this._view;
    }

    public set view(v: View) {
        this._view = v;
    }

    public get resource(): Resource {
        return this._resource;
    }

    public set resource(v: Resource) {
        this._resource = v;
    }
}