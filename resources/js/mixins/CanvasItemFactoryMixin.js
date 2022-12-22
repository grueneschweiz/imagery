import {StyleSetTypes} from "../service/canvas/Constants";
import BarGreen from "../service/canvas/elements/bar/BarGreen";
import BarYoung from "../service/canvas/elements/bar/BarYoung";
import BarLayerGreen from "../service/canvas/layers/bar/BarLayerGreen";
import BarLayerYoung from "../service/canvas/layers/bar/BarLayerYoung";
import BarBlockYoung from "../service/canvas/blocks/bar/BarBlockYoung";
import BarBlockGreen from "../service/canvas/blocks/bar/BarBlockGreen";
import LogoLayerYoung from "../service/canvas/layers/logo/LogoLayerYoung";
import LogoLayerGreen from "../service/canvas/layers/logo/LogoLayerGreen";
import BarBlockGreenCenter from "../service/canvas/blocks/bar/BarBlockGreenCenter";
import BarLayerGreenCenter from "../service/canvas/layers/bar/BarLayerGreenCenter";
import BarGreenCentered from "../service/canvas/elements/bar/BarGreenCentered";


export default {
    methods: {
        createBar() {
            switch (this._getStyleSet()) {
                case StyleSetTypes.young:
                    return new BarYoung();
                case StyleSetTypes.greenCentered:
                    return new BarGreenCentered();
                default:
                    return new BarGreen();
            }
        },

        createBarBlock(bars) {
            switch (this._getStyleSet()) {
                case StyleSetTypes.young:
                    return new BarBlockYoung(bars);
                case StyleSetTypes.greenCentered:
                    return new BarBlockGreenCenter(bars);
                default:
                    return new BarBlockGreen(bars);
            }
        },

        createBarLayer(canvas) {
            switch (this._getStyleSet()) {
                case StyleSetTypes.young:
                    return new BarLayerYoung(canvas);
                case StyleSetTypes.greenCentered:
                    return new BarLayerGreenCenter(canvas);
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

