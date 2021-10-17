import LogoLayer from "./LogoLayer";

const marginFactor = 0.2;

export default class LogoLayerGreen extends LogoLayer {
    constructor(canvas) {
        super(canvas)
    }

    _setMargin() {
        this._margin = this._block.width * marginFactor;
    }
}
