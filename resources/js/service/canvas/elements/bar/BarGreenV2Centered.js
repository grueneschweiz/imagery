import {BarSchemes as Schemes} from "./../../Constants"
import BarGreenCentered from "./BarGreenCentered";

export default class BarGreenV2Centered extends BarGreenCentered {

    constructor() {
        super();
        this._schema = Schemes.greenV2
    }
}
