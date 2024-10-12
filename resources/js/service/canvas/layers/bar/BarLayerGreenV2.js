import BarLayerGreen from "./BarLayerGreen";

export default class BarLayerGreenV2 extends BarLayerGreen {
 
    _getBlockXpos() {
        return (this._canvas.width - this._getBlockWidth()) / 2
    }
}
