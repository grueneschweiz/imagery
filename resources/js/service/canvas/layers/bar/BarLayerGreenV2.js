import BarLayerGreen from "./BarLayerGreen";

/**
 * Defines the distance of the text to the border (x-axis).
 *
 * @type {number}
 */
const textPadding = 110;

export default class BarLayerGreenV2 extends BarLayerGreen {
 
    constructor(canvas, context) {
        super(canvas, context);
        this._rotationAngle = 0;
    }

    _getBlockXpos() {
        return textPadding
    }
}
