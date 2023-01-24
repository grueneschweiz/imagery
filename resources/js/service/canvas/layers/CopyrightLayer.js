import {Alignments} from "../Constants";
import Layer from "./Layer";

const orthogonal = -Math.PI / 2;

export default class CopyrightLayer extends Layer {
    constructor(canvas, context) {
        super(canvas, context);

        this._alignment = Alignments.left;
        this._border = true;
        this._borderWidth = 0;

        this._x = 0;
        this._y = 0;
    }

    set border(bool) {
        this._setProperty('_border', bool);
    }

    set alignment(alignment) {
        this._setProperty('_alignment', alignment);
    }

    set borderWidth(width) {
        this._setProperty('_borderWidth', width);
    }

    _drawBlock() {
        // rotate the canvas
        const [x, y] = this._getRotationOrigin();
        this._context.translate(x, y);
        this._context.rotate(orthogonal);

        // place the block
        this._determinePos();
        this._context.drawImage(this._block, this._x, this._y);

        // reset the transformation matrix
        this._context.setTransform(1, 0, 0, 1, 0, 0);
    }

    _getRotationOrigin() {
        const x = this._alignment === Alignments.right ? 0 : this._canvas.width;
        const y = this._canvas.height;

        return [x, y];
    }

    _determinePos() {
        let borderX, borderY;

        if (this._border) {
            borderX = this._borderWidth;
            borderY = 0;
        } else {
            borderX = 0;
            borderY = this._borderWidth;
        }

        this._x = this._borderWidth + borderX + this._bleed;

        if (this._alignment === Alignments.right) {
            this._y = borderY + this._bleed;
        } else {
            this._y = -this._block.height - borderY - this._bleed;
        }
    }
}
