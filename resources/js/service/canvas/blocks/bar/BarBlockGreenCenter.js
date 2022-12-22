import {Alignments} from "../../Constants";
import BarBlockGreen from "./BarBlockGreen";

const maxFontSizeFactor = 0.9

export default class BarBlockGreenCenter extends BarBlockGreen {
    constructor(bars) {
        super(bars)
        this._alignment = Alignments.center
    }

    set alignment(alignment) {
    }

    get maxFontSizeFactor() {
        return maxFontSizeFactor
    }
}
