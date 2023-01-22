import Layer from "./Layer";

export default class BorderLayer extends Layer {
    constructor(canvas, context) {
        super(canvas, context);

        this._hasBorder = true;
    }

    set hasBorder(value) {
        this._setProperty('_hasBorder', value);
    }

    _drawBlock() {
        if (!this._hasBorder) {
            return;
        }

        this._context.drawImage(this._block, this._bleed, this._bleed);
        this._whiteoutBleed();
    }

    _whiteoutBleed() {
        if (this._bleed) {
            this._context.lineWidth = this._bleed;
            this._context.strokeStyle = 'white';
            this._context.strokeRect(
                this._bleed / 2,
                this._bleed / 2,
                this._canvas.width - this._bleed,
                this._canvas.height - this._bleed
            );
        }
    }
}
