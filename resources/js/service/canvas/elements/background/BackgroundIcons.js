import BackgroundImage from "./BackgroundImage";

export default class BackgroundIcons extends BackgroundImage {
    
    constructor() {
        super();
        this._image = new Image();
        this._image.src = 'images/iconsBackground.png';
    }
    
    _drawBackground() {
        super._drawBackground();
    }
}
