import {StyleSetTypes} from "../service/canvas/Constants";
import BarGreen from "../service/canvas/elements/bar/BarGreen";
import BarYoung from "../service/canvas/elements/bar/BarYoung";


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

        _getStyleSet() {
            return this.$store.getters['canvas/getStyleSet']
        }
    }
}

