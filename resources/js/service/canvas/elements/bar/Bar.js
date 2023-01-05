import {Alignments, BarSchemes as Schemes} from "./../../Constants"
import DrawBase from "../../DrawBase";

export default class Bar extends DrawBase {
    constructor() {
        super();

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
        this._setProperty('_text', text.trim());
    }

    set baseFontSize(fontSize) {
        this._setProperty('_fontSize', fontSize);
    }

    set alignment(alignment) {
        this._setProperty('_alignment', alignment);
    }

    set schema(schema) {
        this._setProperty('_schema', schema);
    }

    set type(type) {
        throw new Error("Setter 'type(type)' must be implemented.")
    }

    set imageWidth(width) {
        this._setProperty('_imageWidth', width);
    }

    get padding() {
        return this._textDims.padding
    }

    _draw() {
        throw new Error("Method '_draw()' must be implemented.")
    }
}
