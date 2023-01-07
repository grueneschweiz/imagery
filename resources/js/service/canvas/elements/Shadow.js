import DrawBase from "../misc/DrawBase";

const sizeFactor = 0.2
const fadeStart = 0

const color = 'rgba(0, 0, 0, 0.33)'

export class Shadow extends DrawBase {
    constructor() {
        super();

        this._top = false
        this._bottom = false
        this._shadowHeight = 0
    }

    set top(enabled) {
        this._setProperty('_top', enabled);
    }

    set bottom(enabled) {
        this._setProperty('_bottom', enabled);
    }

    set width(width) {
        this._setProperty('_canvas.width', width);
    }

    set height(height) {
        this._setProperty('_canvas.height', height);
    }

    _draw() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height)

        this._setShadowHeight()

        if (this._top) {
            this._drawTop()
        }

        if (this._bottom) {
            this._drawBottom()
        }
    }

    _setShadowHeight() {
        const area = this._canvas.height * this._canvas.width
        const height = Math.sqrt(area) * sizeFactor;
        this._shadowHeight = Math.round(height);
    }

    _drawTop() {
        const gradient = this._context.createLinearGradient(0, 0, 0, this._shadowHeight)

        gradient.addColorStop(0, color)
        gradient.addColorStop(fadeStart, color)
        gradient.addColorStop(1, 'transparent')

        this._context.fillStyle = gradient
        this._context.fillRect(0, 0, this._canvas.width, this._shadowHeight)
    }

    _drawBottom() {
        const start = this._canvas.height - this._shadowHeight
        const end = this._canvas.height

        const gradient = this._context.createLinearGradient(0, start, 0, end)

        gradient.addColorStop(0, 'transparent')
        gradient.addColorStop(1 - fadeStart, color)
        gradient.addColorStop(1, color)

        this._context.fillStyle = gradient
        this._context.fillRect(0, start, this._canvas.width, this._shadowHeight)
    }
}
