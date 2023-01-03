export const StyleSetTypes = {
    green: 'green',
    greenCentered: 'greenCentered',
    young: 'young'
}

export const Media = {
    screen: 'screen',
    print: 'print',
}

export const Formats = {
    digital: 'digital',
    printSelf: 'printSelf',
    printProfessional: 'printProfessional',
}

export const FileFormats = {
    png: 'png',
    pdf: 'pdf',
}

export const ColorEncodings = {
    sRGB: 'sRGB',
    FOGRA51: 'FOGRA51', // FOGRA51 === PSO Coated v3
}

export const Alignments = {
    left: -1,
    center: 0,
    right: 1,
};

export const BackgroundTypes = {
    placeholder: 'placeholder',
    gradient: 'gradient',
    transparent: 'transparent',
    image: 'custom'
};

export const PrintingBleed = 3; // mm

export const Inch2mm = 25.4; // 1inch = 25.4mm

export const BarSchemes = {
    white: {
        background: '#ffffff',
        text: '#84b414',
    },
    green: {
        background: '#84b414',
        text: '#ffffff',
    },
    magenta: {
        background: '#e10078',
        text: '#ffffff',
    },
    transparent: {
        background: 'rgba(0,0,0,0)',
        text: '#ffffff',
    },
};

export const ColorSchemes = {
    white: 'white',
    green: 'green',
    greengreen: 'green-green',
};

export const BarTypes = {
    headline: 'headline',
    subline: 'subline',
};

export const LogoTypes = {
    alternative: 'alternative',
    'alternative-baar': 'alternative-baar',
    'alternative-cham': 'alternative-cham',
    'alternative-risch': 'alternative-risch',
    'alternative-stadt-zug': 'alternative-stadt-zug',
    'alternative-unteraegeri': 'alternative-unteraegeri',
    basta: 'basta',
    'giovani-verdi': 'giovani-verdi',
    gruene: 'gruene',
    'gruene-vert-e-s': 'gruene-vert-e-s',
    'gruene-verts': 'gruene-verts',
    'jeunes-vert-e-s': 'jeunes-vert-e-s',
    'junge-gruene': 'junge-gruene',
    verda: 'verda',
    verdi: 'verdi',
    'vert-e-s': 'vert-e-s',
    verts: 'verts',
};

/**
 * Specifies the oversize of the bar in relation to the canvas width.
 *
 * 0.2 means that we'll add 20% of the canvas width to the bar.
 *
 * @type {number}
 */
export const BarSizeFactor = 0.2;

/**
 * If anything is rotated use this angle.
 *
 * @type {number}
 */
export const RotationAngle = -0.0872664626; // 5 degrees ccw in radians cw
