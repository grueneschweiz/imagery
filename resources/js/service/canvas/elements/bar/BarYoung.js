import Bar from "./Bar";
import {BarTypes} from "../../Constants";

/**
 * If we multiply the font size with factor we should get the height of
 * the LOWER CASE character M in pixels (without any padding).
 *
 * @type {number}
 */
const realCharHeightFactor = 0.7;

/**
 * The design guide specifies to have a padding of one whitespace character.
 * This the exact value here was determined by eye.
 *
 * @type {number}
 */
const charPaddingFactor = 0.275;

/**
 * Specifies the margin above each subline in relation to the subline's height.
 *
 * @type {number}
 */
const marginFactor = 0.4;

const fontFamily = {
    headline: 'Bowlby One SC',
    subline: 'Mada',
}

const sublineHeadlineSizeRatio = 0.5;

export default class BarYoung extends Bar {
    constructor() {
        super();
        this._font = fontFamily.headline;
    }

    set type(type) {
        switch (type) {
            case BarTypes.headline:
                this._font = fontFamily.headline
                break;
            case BarTypes.subline:
                this._font = fontFamily.subline
                break;
            default:
                throw new Error(`BarType ${type} is not implemented.`)
        }
    }

    set baseFontSize(fontSize) {
        if (this._font === fontFamily.subline) {
            this._fontSize = fontSize * sublineHeadlineSizeRatio
            return
        }

        this._fontSize = fontSize
    }

    set isFirstSubline(val) {
        this._hasMargin = val
    }

    draw() {
        this._setFont();
        this._setTextDims();
        this._setCanvasWidth();
        this._setCanvasHeight();
        this._setFont(); // the resizing kills the font settings

        this._drawBackground();
        this._drawFont();

        return this._canvas;
    }

    _setFont() {
        this._context.font = `${this._fontSize}px ${this._font}`;
    }

    _setTextDims() {
        this._textDims.width = this._context.measureText(this._text).width;
        this._textDims.height = parseInt(this._fontSize) * realCharHeightFactor;
        this._textDims.padding = parseInt(this._fontSize) * charPaddingFactor;
    }

    _setCanvasWidth() {
        const textWidth = this._textDims.width;
        const padding = this._textDims.padding;

        this._canvas.width = textWidth + 2 * padding;
    }

    _setCanvasHeight() {
        const innerHeight = this._getBarHeight();

        this._canvas.height = innerHeight * (1 + this._getBarMarginFactor());
    }

    _getBarHeight() {
        const textHeight = this._textDims.height;
        const padding = this._textDims.padding;

        return textHeight + 2 * padding;
    }

    _drawBackground() {
        this._context.fillStyle = this._schema.background;
        this._context.fillRect(0, 0, this._canvas.width, this._getBarHeight());
    }

    _drawFont() {
        const y = this._getBarHeight() - this._textDims.padding;
        const x = this._textDims.padding;

        this._context.fillStyle = this._schema.text;
        this._context.textAlign = 'left';
        this._context.textBaseline = 'alphabetic';

        this._context.fillText(this._text, x, y);
    }

    _getBarMarginFactor() {
        if (this._schema === BarSchemes.magenta) {
            return sublineMarginFactor
        }

        return 0
    }
}
