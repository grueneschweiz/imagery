import Bar from "./Bar";

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

const fontFamily = 'Bowlby One SC';

export default class BarYoung extends Bar {
    constructor() {
        super();
        this._font = fontFamily;
    }

    set type(type) {
        this._font = fontFamily;
    }

    draw() {
        console.log('sub: '+ this._font, this instanceof BarYoung)
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
        const textHeight = this._textDims.height;
        const padding = this._textDims.padding;

        this._canvas.height = textHeight + 2 * padding;
    }

    _drawBackground() {
        this._context.fillStyle = this._schema.background;
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }

    _drawFont() {
        const y = this._canvas.height - this._textDims.padding;
        const x = this._textDims.padding;

        this._context.fillStyle = this._schema.text;
        this._context.textAlign = 'left';
        this._context.textBaseline = 'alphabetic';

        this._context.fillText(this._text, x, y);
    }
}
