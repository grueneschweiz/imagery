import DrawBase from "../misc/DrawBase";

export default class Layer extends DrawBase {
    constructor(canvas) {
        super(canvas);

        this._block = null;
    }

    set block(block) {
        this._setProperty('_block', block);
    }

    _draw() {
        this._setContext();

        if (!this._block) {
            return;
        }

        this._drawBlock();
    }

    _setContext() {
        if (!this._context) {
            this._context = this._canvas.getContext('2d');
            this._context.imageSmoothingEnabled = true;
        }
    }

    _drawBlock() {
        throw new Error("Method '_drawBlock()' must be implemented.")
    }
}
