import {Alignments, BarSchemes as Schemes, BarTypes as Types} from "./../../Constants"

export default class Bar {
    constructor() {
        this._canvas = document.createElement('canvas')
        this._context = this._canvas.getContext('2d')

        this._text = ''
        this._fontSize = 16
        this._alignment = Alignments.left
        this._schema = Schemes.green
        this._font = ''

        this._imageWidth = 0
        this._textDims = {
            width: null,
            height: null,
            padding: null,
        }
    }

    set text(text) {
        this._text = text.trim()
    }

    set fontSize(fontSize) {
        this._fontSize = fontSize
    }

    set alignment(alignment) {
        this._alignment = alignment
    }

    set schema(schema) {
        this._schema = schema
    }

    set type(type) {
        throw new Error("Method 'draw()' must be implemented.")
    }

    set imageWidth(width) {
        this._imageWidth = width
    }

    get padding() {
        return this._textDims.padding
    }

    draw() {
        throw new Error("Method 'draw()' must be implemented.")
        return this._canvas
    }
}
