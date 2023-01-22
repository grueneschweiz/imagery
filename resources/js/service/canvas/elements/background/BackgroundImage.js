import Background from "./Background";

export default class BackgroundImage extends Background {
    constructor() {
        super();

        this._image = null;

        this._containerWidth = 0; // width of the imagery canvas (!= background image width)
        this._containerHeight = 0; // height of the imagery canvas (!= background image width)

        this._zoom = 0;
    }

    set width(width) {
        this._setProperty('_containerWidth', width);
    }

    set height(height) {
        this._setProperty('_containerHeight', height);
    }

    set image(image) {
        this._setProperty('_image', image);
    }

    set zoom(zoom) {
        this._setProperty('_zoom', zoom);
    }

    _drawBackground() {
        this._setCanvasSize();

        const width = Math.min(this._canvas.width, this._image.width);
        const height = Math.min(this._canvas.height, this._image.height);

        if (this._image) {
            this._context.drawImage(this._image, 0, 0, width, height);

            // if we just draw the image, we dont get an error if the uploaded
            // document isn't a processable image. if we, however repaint it
            // using the following line, an error is thrown as expected.
            this._context.drawImage(this._canvas, 0, 0);
        }
    }

    _setCanvasSize() {
        const aspectRatioImage = this._image.width / this._image.height;

        const wRatio = this._image.width / this._containerWidth;
        const hRatio = this._image.height / this._containerHeight;

        let dW = this._image.width - this._containerWidth;
        let dH = this._image.height - this._containerHeight;

        dW = dW > 0 ? dW : 0;
        dH = dH > 0 ? dH : 0;

        let width, height;

        if (wRatio < hRatio) {
            const w = dW ? this._containerWidth : this._image.width;
            width = w + this._zoom * dW;
            height = width / aspectRatioImage;
        } else {
            const h = dH ? this._containerHeight : this._image.height;
            height = h + this._zoom * dH;
            width = height * aspectRatioImage;
        }

        this._canvas.width = width;
        this._canvas.height = height;
    }
}
