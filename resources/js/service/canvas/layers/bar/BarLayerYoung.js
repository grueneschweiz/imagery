import {Alignments} from "../../Constants";
import BarLayer from "./BarLayer";

/**
 * Defines, how close to the border (y-axis) the bar block may be dragged.
 * Applied, if the closest point is in the middle of the image.
 *
 * @type {number}
 */
const borderMarginFactor = 3;

export default class BarLayerYoung extends BarLayer {
    constructor(canvas, context) {
        super(canvas, context);

        this._alignment = Alignments.center;
    }

    set alignment(alignment) {
    }

    _getTopLimit() {
        return borderMarginFactor * this._borderWidth
    }

    _getBottomLimit() {
        const margin = borderMarginFactor * this._borderWidth
        return this._canvas.height
            - this._bleed
            - margin
            - this._getBlockHeight()
    }

    _drawBlockConcrete() {
        const x = this._getBlockXpos()
        const y = this._getBlockYpos()

        this._context.drawImage(this._block, x, y);
    }

    _getBlockXpos() {
        return (this._canvas.width - this._getBlockWidth()) / 2
    }

    _getXstart() {
        return this._getBlockXpos()
    }

    _getXend() {
        return this._getBlockXpos() + this._getBlockWidth()
    }

    _getYstart() {
        return this._getBlockYpos()
    }

    _getYend() {
        return this._getYstart() + this._getBlockHeight();
    }
}
