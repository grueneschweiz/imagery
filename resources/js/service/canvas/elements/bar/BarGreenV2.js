import {
    BarSchemes as Schemes,
    BarSizeFactorV2
} from "./../../Constants";

import BarGreen from "./BarGreen";

export default class BarGreenV2 extends BarGreen {

    constructor() {
        super();
        this._schema = Schemes.greenV2
    }

    _setBarOversize() {
        const shorterSide = Math.min(this._imageWidth, this._imageHeight);
        this._barOversize = shorterSide * BarSizeFactorV2;
    }

    // _setBarOversize() {
    //     this._barOversize = this._textDims.padding;
    // }

    _setBarPosition() {
        const shorterSide = Math.min(this._imageWidth, this._imageHeight);
        const offset = shorterSide * 0.05;

        this._barPosition = offset;
        // Assuming we have a property to determine the side (left or right)
        // if (this._barSide === 'left') {
        //     this._barPosition = offset;
        // } else if (this._barSide === 'right') {
        //     this._barPosition = this._imageWidth - offset;
        // }
    }

    _drawBackground() {
        if (this._schema === Schemes.white) {
            this._setGradientBackground();
        } else {
            this._context.fillStyle = this._schema.background;
        }

        this._context.fillRect(0, 0, this._canvas.width, this._getBarHeight());
    }
}
