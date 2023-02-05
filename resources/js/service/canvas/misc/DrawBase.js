import isEqual from 'lodash/isEqual';

export default class DrawBase {
    constructor(canvas = null, context = null) {
        if (canvas) {
            this._canvas = canvas;

            // deferred loading because we may have to create this
            // object before the canvas in the dom is ready
            this._context = context;
        } else {
            this._canvas = document.createElement('canvas');
            this._context = this._canvas.getContext('2d');
            this._context.imageSmoothingEnabled = true;
            this._context.imageSmoothingQuality = 'high';
        }

        this._dirty = true;
    }

    draw(forceRepaint = false) {
        if (!this._dirty && ! forceRepaint) {
            return this._canvas;
        }

        this._draw();
        this._dirty = false;

        return this._canvas;
    }

    isDirty() {
        return this._dirty;
    }

    _draw() {
        throw new Error("Method '_draw()' must be implemented.")
    }

    _setProperty(property, value) {
        const path = property.split('.');
        const lastKey = path.pop();

        let object = this;
        for (const key of path) {
            object = object[key];
        }

        if (!isEqual(object[lastKey], value)) {
            object[lastKey] = value;
            this._dirty = true;
        }
    }
}
