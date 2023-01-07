import {Alignments} from "../../Constants";
import BarBlock from "./BarBlock";

export default class BarBlockYoung extends BarBlock {
    constructor(bars) {
        super(bars)
        this._alignment = Alignments.center
    }

    set alignment(alignment) {
    }
}
