import SubEngine from "./SubEngine";
import {Border} from "../elements/Border";
import BorderLayer from "../layers/BorderLayer";

export default class BorderEngine extends SubEngine {
    _hasBorder;

    _borderWidth;

    constructor(events, canvas, drawingContext) {
        super(events, canvas, drawingContext);

        this._events.on('_hasBorder', value => this._setProperty('_hasBorder', value));

        this._element = new Border();
        this._layer = new BorderLayer(canvas, drawingContext);
    }

    draw(forceRepaint = false) {
        let changed = forceRepaint;

        changed = this._drawElement(changed);
        this._drawLayer(true);

        this._events.trigger('borderEngineDrawn', changed);
    }

    _drawElement(forceRepaint = false) {
        this._element.width = this._visibleWidth;
        this._element.height = this._visibleHeight;
        this._element.border = this._hasBorder;

        const repaint = this._element.isDirty() || forceRepaint;
        this._element.draw(repaint);

        this._events.trigger('borderElementDrawn', repaint);

        if (this._borderWidth !== this._element.borderWidth) {
            this._borderWidth = this._element.borderWidth;
            this._events.trigger('_borderWidth', this._element.borderWidth);
        }

        return repaint;
    }

    _drawLayer(forceRepaint = false) {
        this._layer.block = this._element.draw();

        const repaint = this._layer.isDirty() || forceRepaint;
        this._layer.draw(repaint);

        this._events.trigger('borderLayerDrawn', repaint);

        return repaint;
    }
}
