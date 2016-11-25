/// <reference path="morphologyType.ts" />
/// <reference path="../references/jquery/main.ts" />
"use strict";

class Morphology {
    public name: String;
    public method: Function;
    public type: MorphologyType;
    public $icon: JQuery;

    public constructor(name: String, method: Function, type: MorphologyType = MorphologyType.RGB, $icon?: JQuery) {
        this.name = name;
        this.method = method;
        this.type = type;
        this.$icon = $icon;
    }
}