import {Alignments} from "../../Constants";
import BarBlockGreen from "./BarBlockGreen";

export default class BarBlockGreenV2Center extends BarBlockGreen {
    constructor(bars) {
        super(bars)
        this._alignment = Alignments.center
    }

    set alignment(alignment) {
    }
}
