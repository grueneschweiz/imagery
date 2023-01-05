import Layer from "./Layer";

export default class DraggableLayer extends Layer {
    constructor(canvas) {
        super(canvas);

        this._touching = false;
        this._dragging = true;
        this._mousePos = {
            x: 0,
            y: 0,
        };
    }

    set mousePos(mousePos) {
        this._mousePos = mousePos; // do not use setProperty as it must not trigger a repaint
        this._setProperty('_touching', this._isHover());
    }

    set dragging(value) {
        this._setProperty('_dragging', value);
    }

    get touching() {
        return this._touching;
    }

    get draggable() {
        return true;
    }

    _isHover() {
        throw new Error("Method '_isHover()' must be implemented.")
    }
}
