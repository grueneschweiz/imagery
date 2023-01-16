import isEqual from "lodash/isEqual";

export default class SubEngine {
    _events;
    _canvas;
    _context;

    _visibleWidth;
    _visibleHeight;
    _canvasWidth;
    _canvasHeight;
    _bleed;

    _element;
    _block;
    _layer;

    constructor(events, canvas, drawingContext) {
        this._events = events;
        this._canvas = canvas;
        this._context = drawingContext;

        this._events.on('_visibleWidth', value => this._setProperty('_visibleWidth', value));
        this._events.on('_visibleHeight', value => this._setProperty('_visibleHeight', value));
        this._events.on('_canvasWidth', value => this._setProperty('_canvasWidth', value));
        this._events.on('_canvasHeight', value => this._setProperty('_canvasHeight', value));
        this._events.on('_bleed', value => this._setProperty('_bleed', value));
    }

    draw(forceRepaint = false) {
        throw new Error('SubEngine.draw() must be overridden.');
    }

    _setProperty(property, value) {
        if (!(property in this)) {
            throw new Error(`Property '${property}' does not exist.`);
        }

        if (isEqual(this[property], value)) {
            return;
        }

        this[property] = value;
        this._events.trigger('dirty', true);
    }
}
