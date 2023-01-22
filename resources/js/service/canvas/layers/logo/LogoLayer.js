import {Alignments} from "../../Constants";
import Layer from "../Layer";

export default class LogoLayer extends Layer {
    constructor(canvas, context) {
        super(canvas, context);

        this._alignment = Alignments.left;
        this._barPos = {
            x0: 0,
            y0: 0,
            x1: 0,
            y1: 0,
        };

        this._x = 0;
        this._y = 0;
        this._margin = 0;
    }

    set barPos(pos) {
        this._setProperty('_barPos', pos);
    }

    set alignment(alignment) {
        this._setProperty('_alignment', alignment);
    }

    _drawBlock() {
        this._setPos();
        this._context.drawImage(this._block, this._x, this._y);
    }

    _setPos() {
        this._setMargin();

        if (!this._barPos) {
            this._x = this._margin + this._bleed;
            this._y = this._margin + this._bleed;
            return;
        }

        let pos = this._determinePos(true);

        if (this._intersects(pos, this._barPos)) {
            pos = this._determinePos(false);
        }

        this._x = pos.x0;
        this._y = pos.y0;
    }

    _setMargin() {
        throw new Error("Method '_setMargin()' must be implemented.")
    }

    _determinePos(top = true) {
        const x0 = this._determineX0();
        const y0 = this._determineY0(top);
        const x1 = x0 + this._block.width;
        const y1 = y0 + this._block.height;

        return {x0, y0, x1, y1};
    }

    _determineX0() {
        if (this._alignment === Alignments.left) {
            return this._canvas.width
                - this._bleed
                - this._block.width
                - this._margin;
        }
        return this._margin
            + this._bleed;
    }

    _determineY0(top) {
        if (top) {
            return this._margin + this._bleed;
        }

        return this._canvas.height
            - this._bleed
            - this._block.height
            - this._margin;
    }


    _intersects(a, b) {
        // inspired by https://stackoverflow.com/a/16012490
        const aLeftOfB = a.x1 < b.x0;
        const aRightOfB = a.x0 > b.x1;
        const aAboveB = a.y0 > b.y1;
        const aBelowB = a.y1 < b.y0;

        return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
    }
}
