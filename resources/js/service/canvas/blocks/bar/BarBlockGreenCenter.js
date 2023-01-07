import {Alignments} from "../../Constants";
import BarBlockGreen from "./BarBlockGreen";

export default class BarBlockGreenCenter extends BarBlockGreen {
    constructor(bars) {
        super(bars)
        this._alignment = Alignments.center
    }

    set alignment(alignment) {
    }
}
