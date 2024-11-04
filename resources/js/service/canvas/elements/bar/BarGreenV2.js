import {
    BarSchemes as Schemes
} from "./../../Constants";

import BarGreen from "./BarGreen";

export default class BarGreenV2 extends BarGreen {

    constructor() {
        super();
        this._schema = Schemes.greenV2
    }

    _setBarOversize() {
        this._barOversize = this._textDims.padding;
    }

    _setGradientBackground() {
        this._context.fillStyle = this._schema.background;
    }
}
