import {MaxFontSizeFactors, MinFontSizeFactors, MinToMaxFontSizeFactors} from "../Constants";
import isEqual from "lodash/isEqual";

const defaultMinFontSizeFactor = 0.1
const defaultMaxFontSizeFactor = 0.9
const defaultMinToMaxFontSizeFactor = 4

export default class FontSizeHelper {
    _events;

    _visibleWidth;
    _visibleHeight;
    _fontSizePercent;
    _styleSet;
    _borderWidth;
    _bars;

    _baseFontSize;
    _minFontSize;
    _maxFontSize;
    _cappedMaxFontSize;
    _dirty = true;
    _elements;

    constructor(events) {
        this._events = events;

        this._events.on('_visibleWidth', value => this._setProperty('_visibleWidth', value));
        this._events.on('_visibleHeight', value => this._setProperty('_visibleHeight', value));
        this._events.on('_fontSizePercent', value => this._setProperty('_fontSizePercent', value));
        this._events.on('_styleSet', value => this._setProperty('_styleSet', value));
        this._events.on('_borderWidth', value => this._setProperty('_borderWidth', value));
        this._events.on('_bars', value => this._setProperty('_bars', value));

        this._events.on('_bars', () => this._dirty = true);
    }

    _textFitsImage;

    get textFitsImage() {
        return this._textFitsImage;
    }

    getBaseFontSize(elements) {
        if (!this._dirty){
            return this._baseFontSize;
        }

        this._elements = elements;
        this._minFontSize = undefined;
        this._maxFontSize = undefined;
        this._cappedMaxFontSize = undefined;

        const min = this._getMinFontSize();
        const max = Math.min(this._getCappedMaxFontSize(), this._getMaxFontSize());

        if (max <= min) {
            // there is too much text
            this._textFitsImage = false;

            // set font size to the minimum
            this._fontSizePercent = 1;
        } else {
            // there is enough space for the text
            this._textFitsImage = true;
        }

        // calculate absolute font size
        this._baseFontSize = min + (max - min) * (this._fontSizePercent / 100);

        this._dirty = false;

        return this._baseFontSize;
    }

    /**
     * The absolute minimum font size is defined by the image size only.
     *
     * @returns {number}
     * @private
     */
    _getMinFontSize() {
        if (this._minFontSize) {
            return this._minFontSize;
        }

        // base the minimal font size on a normalized side length of
        // the image.
        //
        // to get a normalized side length, square the image width,
        // and multiply it with the height, then take the third root.
        // this way we only violate the corporate design rules on slim
        // portrait images (without violation, we can't write anything
        // meaning full on an instagram story)
        const cube = this._visibleHeight * this._visibleWidth ** 2;
        const sideNormalized = Math.pow(cube, 1 / 3);
        this._minFontSize = sideNormalized * this._minFontSizeFactor();

        return this._minFontSize;
    }

    /**
     * The absolute max font size is defined by the minimal font size times a factor.
     *
     * You're probably looking for _getCappedMaxFontSize(), which depends also
     * on the bar content.
     *
     * @returns {number}
     * @private
     */
    _getMaxFontSize() {
        if (this._maxFontSize) {
            return this._maxFontSize;
        }

        return this._getMinFontSize() * this._minToMaxFontSizeFactor();
    }

    /**
     * The absolute maximum font size, so the bars still fit the image.
     *
     * @returns {number}
     * @private
     */
    _getCappedMaxFontSize() {
        if (this._cappedMaxFontSize) {
            return this._cappedMaxFontSize;
        }

        const maxFontSize = this._getMaxFontSize();
        const widestBarWidth = this._getWidestBarWidth(maxFontSize);

        const maxWidth = this._visibleWidth * this._maxFontSizeFactor();
        const maxToEffectiveRatio = maxWidth / widestBarWidth;
        this._cappedMaxFontSize = maxFontSize * maxToEffectiveRatio;

        return this._cappedMaxFontSize;
    }

    _getWidestBarWidth(fontSize) {
        return this._elements
            .map(bar => bar.calculateWidth(fontSize))
            .reduce((a, b) => Math.max(a, b), 0);
    }

    _minFontSizeFactor() {
        return MinFontSizeFactors[this._styleSet] || defaultMinFontSizeFactor;
    }

    _maxFontSizeFactor() {
        return MaxFontSizeFactors[this._styleSet] || defaultMaxFontSizeFactor;
    }

    _minToMaxFontSizeFactor() {
        return MinToMaxFontSizeFactors[this._styleSet] || defaultMinToMaxFontSizeFactor;
    }

    _setProperty(property, value) {
        if (!(property in this)) {
            throw new Error(`Property '${property}' does not exist.`);
        }

        if (isEqual(this[property], value)) {
            return;
        }

        this[property] = value;
        this._dirty = true;
    }
}
