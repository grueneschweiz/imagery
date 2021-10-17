import {Alignments} from "../../Constants";
import LogoLayer from "./LogoLayer";

const marginFactor = 0.2;

export default class LogoLayerYoung extends LogoLayer {
    constructor(canvas) {
        super(canvas)

        this.alignment = Alignments.left
    }

    set alignment(alignment) {
    }

    _setMargin() {
        this._margin = this._block.width * marginFactor;
    }
}
