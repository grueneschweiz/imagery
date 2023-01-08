import SubEngine from "./SubEngine";
import ShadowLayer from "../layers/ShadowLayer";
import {Shadow} from "../elements/Shadow";

export default class ShadowEngine extends SubEngine {
    _topShadow;
    _bottomShadow;

    constructor(events, canvas, drawingContext) {
        super(events, canvas, drawingContext);

        this._events.on('_topShadow', value => this._setProperty('_topShadow', value));
        this._events.on('_bottomShadow', value => this._setProperty('_bottomShadow', value));

        this._element = new Shadow();
        this._layer = new ShadowLayer(canvas, drawingContext);
    }

    draw(forceRepaint = false) {
        let changed = forceRepaint;

        changed = this._drawElement(changed);
        this._drawLayer(true);

        this._events.trigger('shadowEngineDrawn', changed);
    }

    _drawElement(forceRepaint = false) {
        this._element.width = this._canvasWidth;
        this._element.height = this._canvasHeight;
        this._element.top = this._topShadow;
        this._element.bottom = this._bottomShadow;

        const repaint = this._element.isDirty() || forceRepaint;
        this._element.draw(repaint);

        this._events.trigger('shadowElementDrawn', repaint);

        return repaint;
    }

    _drawLayer(forceRepaint = false) {
        this._layer.block = this._element.draw();

        const repaint = this._layer.isDirty() || forceRepaint;
        this._layer.draw(repaint);

        this._events.trigger('shadowLayerDrawn', repaint);

        return repaint;
    }
}
