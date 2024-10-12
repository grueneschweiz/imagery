import BarLayerGreenCenter from "./BarLayerGreenCenter";

export default class BarLayerGreenV2Center extends BarLayerGreenCenter {

    _getBlockXpos() {
        return (this._canvas.width - this._getBlockWidth()) / 2
    }
}
