import Layer from "../Layer";

const shadowColorMouseOver = 'rgba(0,0,0,0.5)';
const shadowMouseOverSize = 0.01;

export default class BarLayer extends Layer {
    constructor(canvas) {
        super(canvas);

        this._borderWidth = null;
        this._textPadding = 0;
        this._y = this._canvas.height;

        this._touching = false;
        this._dragging = true;
        this._mousePos = {
            x: 0,
            y: 0,
        };
    }

    set alignment(alignment) {
        this._alignment = alignment;
    }

    set mousePos(mousePos) {
        this._mousePos = mousePos;
        this._touching = this._isHover();
    }

    set dragging(value) {
        this._dragging = value;
    }

    set borderWidth(value) {
        this._borderWidth = value;
    }

    set textPadding(value) {
        this._textPadding = value;
    }

    get touching() {
        return this._touching;
    }

    get boundingRect() {
        if (!this._hasBlock()) {
            return null;
        }

        return {
            x0: this._getXstart(),
            y0: this._getYstart(),
            x1: this._getXend(),
            y1: this._getYend(),
        };
    }

    drag(pos) {
        const deltaY = pos.y - this._mousePos.y;
        const y = this._y + deltaY;

        const topLimit = this._getTopLimit();
        const bottomLimit = this._getBottomLimit();

        if (y < topLimit) {
            this._y = topLimit;
        } else if (y > bottomLimit) {
            this._y = bottomLimit;
        } else {
            this._y = y;
        }
    }

    _getTopLimit() {
        throw new Error("Method '_getTopLimit()' must be implemented.")
        return 0
    }

    _getBottomLimit() {
        throw new Error("Method '_getBottomLimit()' must be implemented.")
        return 0
    }

    _drawBlock() {
        if (!this._hasBlock()) {
            return;
        }

        this._setTouchEffect()

        this._drawBlockConcrete()

        this._context.filter = 'none'
    }

    _drawBlockConcrete() {
        throw new Error("Method '_drawBlockConcrete()' must be implemented.")
    }

    _hasBlock() {
        return this._block && 0 < this._block.width && 0 < this._block.height;
    }

    _setTouchEffect() {
        if (this._touching) {
            const shadowSize = Math.sqrt(this._canvas.width * this._canvas.height) * shadowMouseOverSize;

            this._context.filter = `drop-shadow(0 0 ${shadowSize}px ${shadowColorMouseOver})`;
        } else {
            this._context.filter = 'none';
        }
    }

    _getBlockXpos() {
        throw new Error("Method '_getBlockXpos()' must be implemented.")
        return 0
    }

    _getBlockYpos() {
        const y = this._y

        const topLimit = this._getTopLimit();
        const bottomLimit = this._getBottomLimit();

        if (y < topLimit) {
            return topLimit;
        }

        if (y > bottomLimit) {
            return bottomLimit;
        }

        return y;
    }

    _isHover() {
        const mouseX = this._mousePos.x;
        const mouseY = this._mousePos.y;

        const posXstart = this._getXstart();
        const posXend = this._getXend();

        const posYstart = this._getYstart();
        const posYend = this._getYend();

        const xTouch = mouseX >= posXstart && mouseX <= posXend;
        const yTouch = mouseY >= posYstart && mouseY <= posYend;

        return xTouch && yTouch;
    }

    _getXstart() {
        throw new Error("Method '_getXstart()' must be implemented.")
        return 0
    }

    _getXend() {
        throw new Error("Method '_getXend()' must be implemented.")
        return 0
    }

    _getYstart() {
        throw new Error("Method '_getYstart()' must be implemented.")
        return 0
    }

    _getYend() {
        throw new Error("Method '_getYend()' must be implemented.")
        return 0
    }
}
