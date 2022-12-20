import BarBlock from "./BarBlock";

const minFontSizeFactor = 0.0625 // the correct 175% would be 0.0925
const maxFontSizeFactor = 1.08

export default class BarBlockGreen extends BarBlock {
    get minFontSizeFactor() {
        return minFontSizeFactor
    }

    get maxFontSizeFactor() {
        return maxFontSizeFactor
    }
}
