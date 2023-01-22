import Background from "./Background";

const bgColor = '#dadada'
const textColor = '#666666'
const watermarkAngle = Math.PI / 16
const fontSizeFactor = 30
const fontFamily = 'Arial, sans-serif'

export default class BackgroundPlaceholder extends Background {
    constructor() {
        super();

        this._watermarkText = 'Upload Image';
    }

    set watermarkText(val) {
        this._setProperty('_watermarkText', val);
    }

    _drawBackground() {
        const width = this._canvas.width;
        const height = this._canvas.height;

        this._context.fillStyle = bgColor;
        this._context.fillRect(0, 0, width, height);

        this._drawWatermark()
    }

    _drawWatermark() {
        const [width, height] = this._calcEnclosingRect(
            this._canvas.width,
            this._canvas.height,
            watermarkAngle
        )

        const fontSize = Math.sqrt(width * height) / fontSizeFactor;

        const watermark = document.createElement('canvas')
        watermark.width = width
        watermark.height = height

        const context = watermark.getContext('2d')

        context.translate(this._canvas.width / 2, this._canvas.height / 2)
        context.rotate(-watermarkAngle)
        context.translate(-width / 2, -height / 2)

        context.font = `${fontSize}px ${fontFamily}`
        context.textBaseline = 'top'
        context.fillStyle = textColor

        const textWidth = context.measureText(this._watermarkText).width
        const textHeight = fontSize
        const textPadding = fontSize / 2

        let shift = 0
        for (let y = textPadding; y < height; y += textHeight + 2 * textPadding) {
            shift += textWidth / 3
            for (let x = textPadding - shift; x < width + shift; x += textWidth + 2 * textPadding) {
                context.fillText(this._watermarkText, x, y);
            }
        }

        this._context.drawImage(watermark, 0, 0)
    }

    _calcEnclosingRect(width, height, angle) {
        /**
         * @see {@link https://raw.githubusercontent.com/grueneschweiz/cd.gruene.ch_v2/main/docs/enclosing-rect-calc.pdf|docs/enclosing-rect-calc.pdf}
         */
        const a1 = this._calcOppositeSideLen(width, angle)
        const a2 = this._calcOppositeSideLen(height, angle)
        const b1 = this._calcAdjacentSideLen(width, angle)
        const b2 = this._calcAdjacentSideLen(height, angle)

        const enclosingWidth = a2 + b1
        const enclosingHeight = a1 + b2

        return [enclosingWidth, enclosingHeight]
    }

    _calcAdjacentSideLen(hypotenuse, angle) {
        /**
         * @see {@link https://raw.githubusercontent.com/grueneschweiz/cd.gruene.ch_v2/main/docs/enclosing-rect-calc.pdf|docs/enclosing-rect-calc.pdf}
         */
        return Math.sqrt(hypotenuse ** 2 / (Math.tan(angle) ** 2 + 1))
    }

    _calcOppositeSideLen(hypotenuse, angle) {
        /**
         * @see {@link https://raw.githubusercontent.com/grueneschweiz/cd.gruene.ch_v2/main/docs/enclosing-rect-calc.pdf|docs/enclosing-rect-calc.pdf}
         */
        return Math.sqrt(hypotenuse ** 2 * Math.tan(angle) / (Math.tan(angle) ** 2 + 1))
    }
}
