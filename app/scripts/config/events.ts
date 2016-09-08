
class JsEvent {
    public type: String;
    public action: Function;

    constructor(type?: String, action?: Function) {
        this.type = type;
        this.action = action;
    }
}

class EventManager {
    public events: Array<JsEvent>;

    constructor() {
        this.events = new Array<JsEvent>();
    }

    public triggerEvent(type: String) {
        var events = this.events.filter(function (event) {
            return event.type === type;
        });

        events.forEach(function (event) {
            event.action();
        });
    }

    public on(type: String, action: Function) {
        this.events.push(new JsEvent(type, action));
    }
}