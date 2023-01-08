import {Alignments} from "../../Constants";
import LogoLayer from "./LogoLayer";

const marginFactor = 0.04;

export default class LogoLayerYoung extends LogoLayer {
    constructor(canvas, context) {
        super(canvas, context)

        this.alignment = Alignments.left
    }

    set alignment(alignment) {
    }

    _setMargin() {
        const area = Math.sqrt(this._canvas.width * this._canvas.height )
        this._margin = area * marginFactor;
    }
}
