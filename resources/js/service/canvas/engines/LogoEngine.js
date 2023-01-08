import SubEngine from "./SubEngine";
import {Logo} from "../elements/Logo";
import {LogoBlock} from "../blocks/LogoBlock";
import {StyleSetTypes} from "../Constants";
import LogoLayerYoung from "../layers/logo/LogoLayerYoung";
import LogoLayerGreen from "../layers/logo/LogoLayerGreen";

export default class LogoEngine extends SubEngine {
    _logoImage;
    _logoType;
    _barPos;
    _alignment;
    _styleSet;

    _currentStyleSet;


    constructor(events, canvas, drawingContext) {
        super(events, canvas, drawingContext);

        this._events.on('_logoImage', value => this._setProperty('_logoImage', value));
        this._events.on('_logoType', value => this._setProperty('_logoType', value));
        this._events.on('_barPos', value => this._setProperty('_barPos', value));
        this._events.on('_alignment', value => this._setProperty('_alignment', value));
        this._events.on('_styleSet', value => this._setProperty('_styleSet', value));

        this._element = new Logo();
        this._block = new LogoBlock();
    }

    draw(forceRepaint = false) {
        let changed = forceRepaint;
        changed = this._drawElement(changed);
        changed = this._drawBlock(changed);
        this._drawLayer(true);

        this._events.trigger('logoEngineDrawn', changed);
    }

    getLogoWidth() {
        this._element.imageWidth = this._visibleWidth;
        this._element.imageHeight = this._visibleHeight;
        this._element.type = this._logoType;

        return this._element.logoWidth;
    }

    _drawElement(forceRepaint = false) {
        this._element.logo = this._logoImage;
        this._element.imageWidth = this._visibleWidth;
        this._element.imageHeight = this._visibleHeight;
        this._element.type = this._logoType;

        const repaint = this._element.isDirty() || forceRepaint;
        this._element.draw(repaint);

        this._events.trigger('logoElementDrawn', repaint);

        return repaint;
    }

    _drawBlock(forceRepaint = false) {
        this._block.logo = this._element.draw();

        const repaint = this._block.isDirty() || forceRepaint;
        this._block.draw(repaint);

        this._events.trigger('logoBlockDrawn', repaint);

        return repaint;
    }

    _drawLayer(forceRepaint = false) {
        this._setLayer();

        this._layer.block = this._block.draw();
        this._layer.barPos = this._barPos;
        this._layer.alignment = this._alignment;

        const repaint = this._layer.isDirty() || forceRepaint;
        this._layer.draw(repaint);

        this._events.trigger('logoLayerDrawn', repaint);

        return repaint;
    }

    _setLayer() {
        if (this._currentStyleSet === this._styleSet) {
            return;
        }

        this._layer = this._createLayer();
        this._currentStyleSet = this._styleSet;
    }

    _createLayer() {
        switch (this._styleSet) {
            case StyleSetTypes.young:
                return new LogoLayerYoung(this._canvas, this._context);
            default:
                return new LogoLayerGreen(this._canvas, this._context);
        }
    }
}
