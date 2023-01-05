import {LogoTypes} from "../Constants";
import DrawBase from "../DrawBase";

const LogoTypeRatios = {
    [LogoTypes.alternative]: 4,
    [LogoTypes['alternative-baar']]: 4,
    [LogoTypes['alternative-cham']]: 4,
    [LogoTypes['alternative-risch']]: 4,
    [LogoTypes['alternative-stadt-zug']]: 4,
    [LogoTypes['alternative-unteraegeri']]: 4,
    [LogoTypes['giovani-verdi']]: 3.45,
    [LogoTypes.basta]: 4,
    [LogoTypes.gruene]: 4,
    [LogoTypes['gruene-vert-e-s']]: 4,
    [LogoTypes['gruene-verts']]: 4,
    [LogoTypes['jeunes-vert-e-s']]: 3,
    [LogoTypes['junge-gruene']]: 3.2,
    [LogoTypes.verda]: 4,
    [LogoTypes.verdi]: 4,
    [LogoTypes['vert-e-s']]: 4,
    [LogoTypes.verts]: 4,
};

class Logo extends DrawBase {
    constructor() {
        super();

        this._logo = null;
        this._type = null;

        this._imageWidth = 0;
        this._imageHeight = 0;
    }

    set logo(logo) {
        this._setProperty('_logo', logo);
    }

    set imageWidth(width) {
        this._setProperty('_imageWidth', width);
    }

    set imageHeight(height) {
        this._setProperty('_imageHeight', height);
    }

    get height() {
        return this._canvas.height;
    }

    set type(type) {
        this._setProperty('_type', type);
    }

    get logoWidth() {
        let imgEdgeLen;

        // for portrait images the width is authoritative for landscape images
        // the surface. this increases the logo on landscape images, but doesn't
        // break the rules for portrait formats.
        if (this._imageWidth < this._imageHeight) {
            imgEdgeLen = this._imageWidth;
        } else {
            imgEdgeLen = Math.sqrt(this._imageHeight * this._imageWidth);
        }

        const logoWidthRatio = LogoTypeRatios[this._type];
        const logoWidth = imgEdgeLen / logoWidthRatio;

        return Math.round(logoWidth);
    }

    _draw() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        if (this._logo) {
            this._drawLogo();
        }
    }

    _drawLogo() {
        this._setSize();

        this._context.drawImage(this._logo, 0, 0, this._canvas.width, this._canvas.height);
    }

    _setSize() {
        this._canvas.width = Math.round(this._logo.width);
        this._canvas.height = Math.round(this._logo.height);
    }
}

export {
    Logo
}
