import {Alignments, BarSchemes as Schemes} from "./../../Constants"
import DrawBase from "../../misc/DrawBase";

export default class Bar extends DrawBase {
    constructor() {
        super();

        this._text = ''
        this._fontSize = 16
        this._alignment = Alignments.left
        this._schema = Schemes.green
        this._font = ''

        this._imageWidth = 0
        this._imageHeight = 0
        this._textDims = {
            width: null,
            height: null,
            padding: null,
        }

        this._markSelected = false
        this._previewDims = {
            width: 0,
            height: 0,
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

    set imageHeight(height) {
        this._setProperty('_imageHeight', height);
    }

    set markSelected(mark) {
        this._setProperty('_markSelected', mark);
    }

    set previewDims(dims) {
        this._setProperty('_previewDims', dims)
    }

    get padding() {
        return this._textDims.padding
    }

    calculateWidth(fontSize) {
        throw new Error("Method 'calculateWidth()' must be implemented.")
    }

    _draw() {
        this._drawConcrete();

        if (this._markSelected) {
            this._drawSelectedMark();
        }
    }

    _drawConcrete() {
        throw new Error("Method '_draw()' must be implemented.")
    }

    _drawSelectedMark() {
        throw new Error("Method '_drawSelectedMark()' must be implemented.")
    }
}
