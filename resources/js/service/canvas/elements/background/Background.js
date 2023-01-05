import DrawBase from "../../DrawBase";

export default class Background extends DrawBase {
    set width(width) {
        this._setProperty('_canvas.width', width);
    }

    set height(height) {
        this._setProperty('_canvas.height', height);
    }

    _draw() {
        this._drawBackground();
    }
}
