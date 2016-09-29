/// <reference path="../references/jquery/main.ts" />
"use strict";

class Transform {
    public name: String;
    public method: Function;
    public $icon: JQuery;

    public constructor(name: String, method: Function, $icon: JQuery) {
        this.name = name;
        this.method = method;
        this.$icon = $icon;
    }
}