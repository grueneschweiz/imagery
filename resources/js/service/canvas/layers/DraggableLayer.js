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
        this._mousePos = mousePos;
        this._touching = this._isHover();
    }

    set dragging(value) {
        this._dragging = value;
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
