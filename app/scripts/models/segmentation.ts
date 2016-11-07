/// <reference path="segmentationType.ts" />
/// <reference path="../references/jquery/main.ts" />
"use strict";

class Segmentation {
    public name: String;
    public method: Function;
    public type: SegmentationType;
    public $icon: JQuery;

    public constructor(name: String, method: Function, type: SegmentationType = SegmentationType.RGB, $icon?: JQuery) {
        this.name = name;
        this.method = method;
        this.type = type;
        this.$icon = $icon;
    }
}