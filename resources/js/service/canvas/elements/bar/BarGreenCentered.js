import BarGreen from "./BarGreen";

export default class BarGreenCentered extends BarGreen {
    _setBarOversize() {
        this._barOversize = this._textDims.padding;
    }

    _setGradientBackground() {
        this._context.fillStyle = this._schema.background;
    }
}
