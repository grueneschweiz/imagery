export default class EngineEvents {
    _listeners;

    _lastEventName;
    _lastEventValue;

    constructor() {
        this._listeners = new Map();
    }

    on(eventName, listener) {
        if (!this._listeners.has(eventName)) {
            this._listeners.set(eventName, new Set());
        }

        this._listeners.get(eventName).add(listener);
    }

    off(eventName, listener) {
        if (!this._listeners.has(eventName)) {
            return;
        }

        this._listeners.get(eventName).delete(listener);
    }

    trigger(eventName, value, force = false) {
        if (!force && this._lastEventName === eventName && this._lastEventValue === value) {
            return;
        }

        this._lastEventName = eventName;
        this._lastEventValue = value;

        if (!this._listeners.has(eventName)) {
            return;
        }

        this._listeners.get(eventName).forEach(listener => listener(value));
    }
}
