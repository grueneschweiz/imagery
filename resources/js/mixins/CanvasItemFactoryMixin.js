import {StyleSetTypes} from "../service/canvas/Constants";
import BarGreen from "../service/canvas/elements/bar/BarGreen";
import BarYoung from "../service/canvas/elements/bar/BarYoung";
import BarLayerGreen from "../service/canvas/layers/bar/BarLayerGreen";
import BarLayerYoung from "../service/canvas/layers/bar/BarLayerYoung";


export default {
    methods: {
        createBar() {
            switch (this._getStyleSet()) {
                case StyleSetTypes.young:
                    return new BarYoung();
                default:
                    return new BarGreen();
            }
        },

        createBarLayer(canvas) {
            switch (this._getStyleSet()) {
                case StyleSetTypes.young:
                    return new BarLayerYoung(canvas);
                default:
                    return new BarLayerGreen(canvas);
            }
        },

        _getStyleSet() {
            return this.$store.getters['canvas/getStyleSet']
        }
    }
}

