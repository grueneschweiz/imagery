import DraggableLayer from "../DraggableLayer";
import {Alignments} from "../../Constants";

const shadowColorMouseOver = 'rgba(0,0,0,0.5)';
const shadowMouseOverSize = 0.01;

export default class BarLayer extends DraggableLayer {
    constructor(canvas, context) {
        super(canvas, context);

        this._borderWidth = null;
        this._textPadding = 0;
        this._y = this._canvas.height;
        this._alignment = Alignments.left;
    }

    set alignment(alignment) {
        this._setProperty('_alignment', alignment);
    }

    set borderWidth(value) {
        this._setProperty('_borderWidth', value);
    }

    set textPadding(value) {
        this._setProperty('_textPadding', value);
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

    _drag(pos) {
        const deltaY = pos.y - this._mousePos.y;
        const y = this._y + deltaY;

        const topLimit = this._getTopLimit();
        const bottomLimit = this._getBottomLimit();

        if (y < topLimit) {
            this._setProperty('_y', topLimit);
        } else if (y > bottomLimit) {
            this._setProperty('_y', bottomLimit);
        } else {
            this._setProperty('_y', y);
        }
    }

    _getTopLimit() {
        throw new Error("Method '_getTopLimit()' must be implemented.")
    }

    _getBottomLimit() {
        throw new Error("Method '_getBottomLimit()' must be implemented.")
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

        const posXstart = Math.max(0, this._getXstart());
        const posXend = Math.min(this._canvas.width - 1, this._getXend());

        const posYstart = this._getYstart();
        const posYend = this._getYend();

        const xTouch = mouseX >= posXstart && mouseX <= posXend;
        const yTouch = mouseY >= posYstart && mouseY <= posYend;

        return xTouch && yTouch;
    }

    _getXstart() {
        throw new Error("Method '_getXstart()' must be implemented.")
    }

    _getXend() {
        throw new Error("Method '_getXend()' must be implemented.")
    }

    _getYstart() {
        throw new Error("Method '_getYstart()' must be implemented.")
    }

    _getYend() {
        throw new Error("Method '_getYend()' must be implemented.")
    }
}
