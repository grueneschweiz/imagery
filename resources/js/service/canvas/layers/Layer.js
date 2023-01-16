import DrawBase from "../misc/DrawBase";

export default class Layer extends DrawBase {
    constructor(canvas, context) {
        super(canvas, context);

        this._block = null;
        this._bleed = 0;
    }

    set block(block) {
        this._setProperty('_block', block);
    }

    set bleed(value) {
        this._setProperty('_bleed', value);
    }

    _draw() {
        if (!this._block) {
            return;
        }

        this._drawBlock();
    }

    _drawBlock() {
        throw new Error("Method '_drawBlock()' must be implemented.")
    }
}
