import LogoLayer from "./LogoLayer";

const marginFactor = 0.2;

export default class LogoLayerGreen extends LogoLayer {
    _setMargin() {
        this._margin = this._block.width * marginFactor;
    }
}
