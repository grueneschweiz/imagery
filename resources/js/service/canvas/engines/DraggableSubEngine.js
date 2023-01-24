import SubEngine from "./SubEngine";

export default class DraggableSubEngine extends SubEngine {
    _mousePos;
    _dragging;

    constructor(events, canvas, drawingContext) {
        super(events, canvas, drawingContext);

        this._events.on('_mousePos', value => this._setMousePos(value));
    }

    _setMousePos(value) {
        if (this._dragging) {
            this._setProperty('_mousePos', value);
            return;
        }

        const touchingBefore = this.getTouching();
        this._mousePos = value;
        const touchingAfter = this.getTouching();

        if (touchingBefore !== touchingAfter) {
            this._events.trigger('dirty', true);
        }
    }

    getTouching() {
        throw new Error('getTouching() must be overridden.');
    }
}
