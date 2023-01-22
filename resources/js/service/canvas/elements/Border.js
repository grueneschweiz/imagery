import DrawBase from "../misc/DrawBase";
import {BorderRadiusFactor, BorderWidthFactor} from "../Constants";

const borderColor = '#ffffff';

class Border extends DrawBase {
    constructor() {
        super();

        this._border = true;
    }

    set border(enabled) {
        this._setProperty('_border', enabled);
    }

    set width(width) {
        this._setProperty('_canvas.width', width);
    }

    set height(height) {
        this._setProperty('_canvas.height', height);
    }

    get borderWidth() {
        const area = this._canvas.width * this._canvas.height;
        return Math.sqrt(area) * BorderWidthFactor;
    }

    _draw() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        if (this._border) {
            this._drawBorder();
        }
    }

    _drawBorder() {
        this._context.fillStyle = borderColor;
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

        this._context.globalCompositeOperation = 'xor';
        this._setClippingArea();
    }

    _setClippingArea() {
        const ctx = this._context;
        const bWidth = this.borderWidth;
        const radius = bWidth * BorderRadiusFactor;
        const width = this._canvas.width - 2 * bWidth;
        const height = this._canvas.height - 2 * bWidth;

        ctx.beginPath();
        ctx.moveTo(bWidth, bWidth + radius);
        ctx.lineTo(bWidth, bWidth + height - radius);
        ctx.arcTo(bWidth, bWidth + height, bWidth + radius, bWidth + height, radius);
        ctx.lineTo(bWidth + width - radius, bWidth + height);
        ctx.arcTo(bWidth + width, bWidth + height, bWidth + width, bWidth + height - radius, radius);
        ctx.lineTo(bWidth + width, bWidth + radius);
        ctx.arcTo(bWidth + width, bWidth, bWidth + width - radius, bWidth, radius);
        ctx.lineTo(bWidth + radius, bWidth);
        ctx.arcTo(bWidth, bWidth, bWidth, bWidth + radius, radius);
        ctx.fill();
    }
}

export {
    Border
}
