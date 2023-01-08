import DraggableSubEngine from "./DraggableSubEngine";
import BackgroundLayer from "../layers/BackgroundLayer";
import BackgroundGradient from "../elements/background/BackgroundGradient";
import BackgroundTransparent from "../elements/background/BackgroundTransparent";
import BackgroundImage from "../elements/background/BackgroundImage";
import BackgroundPlaceholder from "../elements/background/BackgroundPlaceholder";
import {BackgroundTypes} from "../Constants";

export default class BackgroundEngine extends DraggableSubEngine {
    _backgroundType;
    _backgroundImage;
    _backgroundZoom;
    _backgroundWatermarkText;

    _currentElementType;

    constructor(events, canvas, drawingContext) {
        super(events, canvas, drawingContext);

        this._events.on('_backgroundType', value => this._setProperty('_backgroundType', value));
        this._events.on('_backgroundImage', value => this._setProperty('_backgroundImage', value));
        this._events.on('_backgroundZoom', value => this._setProperty('_backgroundZoom', value));
        this._events.on('_backgroundWatermarkText', value => this._setProperty('_backgroundWatermarkText', value));
        this._events.on('_backgroundDragging', value => this._setProperty('_dragging', value));

        this._layer = new BackgroundLayer(canvas, drawingContext);
    }

    draw(forceRepaint = false) {
        let changed = forceRepaint;

        changed = this._drawElement(changed);
        this._drawLayer(true);

        this._events.trigger('backgroundEngineDrawn', changed);
    }

    getDraggable() {
        return this._layer?.draggable || false;
    }

    getTouching() {
        if (!this._layer) {
            return false;
        }

        this._layer.mousePos = this._mousePos;

        return this._layer.touching;
    }

    _setElement() {
        if (this._currentElementType === this._backgroundType) {
            return;
        }

        this._element = this._createElement();
        this._currentElementType = this._backgroundType;
    }

    _createElement() {
        switch (this._backgroundType) {
            case BackgroundTypes.placeholder:
                return this._elementFactory(BackgroundPlaceholder);

            case BackgroundTypes.gradient:
                return this._elementFactory(BackgroundGradient);

            case BackgroundTypes.transparent:
                return this._elementFactory(BackgroundTransparent);

            case BackgroundTypes.image:
                return this._elementFactory(BackgroundImage);
        }
    }

    _elementFactory(type) {
        const bg = new type();
        bg.width = this._canvasWidth;
        bg.height = this._canvasHeight;

        return bg;
    }

    _drawElement(forceRepaint = false) {
        this._setElement();

        this._element.width = this._canvasWidth;
        this._element.height = this._canvasHeight;

        if (this._backgroundType === BackgroundTypes.placeholder) {
            this._element.watermarkText = this._backgroundWatermarkText;
        }

        if (this._backgroundType === BackgroundTypes.image) {
            this._element.image = this._backgroundImage;
            this._element.zoom = this._backgroundZoom;
        }

        const repaint = this._element.isDirty() || forceRepaint;
        this._element.draw(repaint);

        this._events.trigger('backgroundElementDrawn', repaint);

        return repaint;
    }

    _drawLayer(forceRepaint = false) {
        this._layer.mousePos = this._mousePos;
        this._layer.dragging = this._dragging;
        this._layer.block = this._element.draw();

        const repaint = this._layer.isDirty() || forceRepaint;
        this._layer.draw(repaint);

        this._events.trigger('backgroundLayerDrawn', repaint);

        return repaint;
    }
}
