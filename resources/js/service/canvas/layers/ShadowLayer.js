import Layer from "./Layer";

export default class ShadowLayer extends Layer {
    _drawBlock() {
        this._context.drawImage(this._block, 0, 0);
    }
}
