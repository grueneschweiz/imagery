import {Copyright} from "../elements/Copyright";
import CopyrightLayer from "../layers/CopyrightLayer";
import {CopyrightColors} from "../Constants";
import SubEngine from "./SubEngine";

export default class CopyrightEngine extends SubEngine {
    _hasBorder;
    _copyrightText;

    _borderWidth;

    constructor(events, canvas, drawingContext) {
        super(events, canvas, drawingContext);

        this._events.on('_hasBorder', value => this._setProperty('_hasBorder', value));
        this._events.on('_copyrightText', value => this._setProperty('_copyrightText', value));

        this._element = new Copyright();
        this._layer = new CopyrightLayer(canvas, drawingContext);
    }

    draw(forceRepaint = false) {
        let changed = forceRepaint;

        changed = this._drawElement(changed);
        this._drawLayer(true);

        this._events.trigger('copyrightEngineDrawn', changed);
    }

    _drawElement(forceRepaint = false) {
        this._element.width = this._visibleWidth;
        this._element.height = this._visibleHeight;
        this._element.text = this._copyrightText;
        this._element.color = this._hasBorder
            ? CopyrightColors.withBorder
            : CopyrightColors.noBorder;

        const repaint = this._element.isDirty() || forceRepaint;
        this._element.draw(repaint);

        this._events.trigger('copyrightElementDrawn', repaint);

        return repaint;
    }

    _drawLayer(forceRepaint = false) {
        this._layer.block = this._element.draw();

        const repaint = this._layer.isDirty() || forceRepaint;
        this._layer.draw(repaint);

        this._events.trigger('copyrightLayerDrawn', repaint);

        return repaint;
    }
}
