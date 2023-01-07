import {Alignments} from "../../Constants";
import DrawBase from "../../misc/DrawBase";

export default class BarBlock extends DrawBase {
    constructor(bars) {
        super();
        this._bars = bars;
        this._alignment = Alignments.left;
    }

    set alignment(alignment) {
        this._setProperty('_alignment', alignment);
    }

    get width() {
        return this._canvas.width;
    }

    _draw() {
        this._setWidth();
        this._setHeight();
        this._clear();
        this._drawBars();
    }

    _setWidth() {
        let width = 0;

        if (this._bars.length) {
            width = this._bars
                .map(bar => bar.width)
                .reduce((a, b) => Math.max(a, b), 0);
        }

        this._canvas.width = width;
    }

    _setHeight() {
        let height = 0;

        if (this._bars.length) {
            height = this._bars
                .map(bar => bar.height)
                .reduce((a, b) => a + b, 0);
        }

        this._canvas.height = height;
    }

    _clear() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    _drawBars() {
        let y = 0;

        this._bars.forEach(bar => {
            this._drawBar(bar, y);
            y += bar.height;
        });
    }

    _drawBar(bar, y) {
        let x;

        switch (this._alignment) {
            case Alignments.right:
                x = this._canvas.width - bar.width
                break
            case Alignments.center:
                x = (this._canvas.width - bar.width) / 2
                break
            case Alignments.left:
            default:
                x = 0
        }

        this._context.drawImage(bar, x, y);
    }
}
