/// <reference path="../models/picture.ts" />
/// <reference path="../controllers/controller.ts" />
/// <reference path="view.ts" />
"use strict";

class HeaderView extends View {

    public constructor(fragment: Fragment) {
        super(new Controller(), fragment);
    }
}