
class StaticJsEvent {
    public type: String;
    public action: Function;
    public alreadyOccured: boolean;

    constructor(type?: String, action?: Function) {
        this.type = type;
        this.action = action;
        this.alreadyOccured = false;
    }
}

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

    public trigger(type: String) {
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

class StaticEventManager {
    public events: Array<StaticJsEvent>;
    public eventsTriggered: Array<String>;

    constructor() {
        this.events = new Array<StaticJsEvent>();
        this.eventsTriggered = new Array<String>();
    }

    public trigger(type: String) {
        if (!this.eventIsAlreadyOccured(type)) {
            this.eventsTriggered.push(type);
        }

        this.eventsOfType(type)
            .filter(function (event) {
                return !event.alreadyOccured;
            }).forEach(function (event) {
                event.alreadyOccured = true;
                event.action();
            });
    }

    public on(type: String, action: Function) {
        this.events.push(new StaticJsEvent(type, action));

        if (this.eventIsAlreadyOccured(type)) {
            this.trigger(type);
        }
    }

    private eventIsAlreadyOccured(type: String) {
        return this.eventsTriggered.filter(function (eventType) {
            return eventType === type;
        }).length > 0;
    }

    private eventsOfType(type: String) {
        return this.events.filter(function (event) {
            return event.type === type;
        });
    }
}