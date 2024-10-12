import {
    BarSchemes as Schemes
} from "./../../Constants";

import BarGreen from "./BarGreen";

export default class BarGreenV2 extends BarGreen {

    constructor() {
        super();
        this._schema = Schemes.greenV2
    }
}
