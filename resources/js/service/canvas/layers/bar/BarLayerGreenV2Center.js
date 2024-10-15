import BarLayerGreenCenter from "./BarLayerGreenCenter";

export default class BarLayerGreenV2Center extends BarLayerGreenCenter {
    constructor(canvas, context) {
        super(canvas, context);
        this._rotationAngle = 0;
    } 

    set alignment(alignment) {
    }

    _getBlockXpos() {
        return (this._canvas.width - this._getBlockWidth()) / 2
    }
}
