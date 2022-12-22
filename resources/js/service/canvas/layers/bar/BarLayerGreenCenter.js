import {Alignments} from "../../Constants";
import BarLayerGreen from "./BarLayerGreen";

export default class BarLayerGreenCenter extends BarLayerGreen {
    constructor(canvas) {
        super(canvas);

        this._alignment = Alignments.center;
    }

    set alignment(alignment) {
    }

    _getBlockXpos() {
        return (this._canvas.width - this._getRotatedFullWidth()) / 2
    }
}
