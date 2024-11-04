import {Alignments} from "../../Constants";
import BarLayerGreenV2 from "./BarLayerGreenV2";

export default class BarLayerGreenV2Center extends BarLayerGreenV2 {

    constructor(canvas, context) {
        super(canvas, context);

        this._alignment = Alignments.center;
    }

    set alignment(alignment) {
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
