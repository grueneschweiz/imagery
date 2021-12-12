import {Alignments} from "../../Constants";
import BarBlock from "./BarBlock";

const minFontSizeFactor = 0.0575
const maxFontSizeFactor = 0.9

export default class BarBlockYoung extends BarBlock {
    constructor(bars) {
        super(bars)
        this._alignment = Alignments.center
    }

    set alignment(alignment) {
    }

    get minFontSizeFactor() {
        return minFontSizeFactor
    }

    get maxFontSizeFactor() {
        return maxFontSizeFactor
    }
}
