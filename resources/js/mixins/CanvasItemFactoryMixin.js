import {StyleSetTypes} from "../service/canvas/Constants";
import BarGreen from "../service/canvas/elements/bar/BarGreen";
import BarYoung from "../service/canvas/elements/bar/BarYoung";
import BarLayerGreen from "../service/canvas/layers/bar/BarLayerGreen";
import BarLayerYoung from "../service/canvas/layers/bar/BarLayerYoung";
import BarBlockYoung from "../service/canvas/blocks/bar/BarBlockYoung";
import BarBlockGreen from "../service/canvas/blocks/bar/BarBlockGreen";
import LogoLayerYoung from "../service/canvas/layers/logo/LogoLayerYoung";
import LogoLayerGreen from "../service/canvas/layers/logo/LogoLayerGreen";


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

        createBarBlock(bars) {
            switch (this._getStyleSet()) {
                case StyleSetTypes.young:
                    return new BarBlockYoung(bars);
                default:
                    return new BarBlockGreen(bars);
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

        createLogoLayer(canvas) {
            switch (this._getStyleSet()) {
                case StyleSetTypes.young:
                    return new LogoLayerYoung(canvas);
                default:
                    return new LogoLayerGreen(canvas);
            }
        },

        _getStyleSet() {
            return this.$store.getters['canvas/getStyleSet']
        }
    }
}

