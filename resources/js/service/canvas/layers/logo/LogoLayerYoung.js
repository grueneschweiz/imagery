import {Alignments} from "../../Constants";
import LogoLayer from "./LogoLayer";

const marginFactor = 0.055;

export default class LogoLayerYoung extends LogoLayer {
    constructor(canvas) {
        super(canvas)

        this.alignment = Alignments.left
    }

    set alignment(alignment) {
    }

    _setMargin() {
        const area = Math.sqrt(this._canvas.width * this._canvas.height )
        this._margin = area * marginFactor;
    }
}
