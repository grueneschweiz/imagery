import {
    Alignments,
    BackgroundTypes,
    BarSchemes,
    BarTypes,
    ColorSchemes, Formats, ImageSizes,
    StyleSetTypes
} from "../../service/canvas/Constants";

const state = {
    styleSet: StyleSetTypes.green,
    alignment: Alignments.left,
    imageHeight: 0,
    imageWidth: 0,
    selectedImageSize: ImageSizes[10],
    colorSchema: ColorSchemes.white,
    logoId: null,
    backgroundType: BackgroundTypes.gradient,
    backgroundImage: null,
    hasBorder: true,
    borderWidth: 0,
    fontSize: 100,
    hasTopShadow: true,
    hasBottomShadow: true,
    format: Formats.digital,
    bars: [
        {
            type: BarTypes.headline,
            schema: BarSchemes.white,
            text: 'Headline 1',
            canvas: null,
            padding: 0,
        },
        {
            type: BarTypes.headline,
            schema: BarSchemes.magenta,
            text: 'Headline 2',
            canvas: null,
            padding: 0,
        },
        {
            type: BarTypes.subline,
            schema: BarSchemes.white,
            text: 'Subline',
            canvas: null,
            padding: 0,
        },
    ],
};

const getters = {
    getStyleSet: state => state.styleSet,
    getAlignment: state => state.alignment,
    getImageHeight: state => state.imageHeight,
    getImageWidth: state => state.imageWidth,
    getSelectedImageSize: state => state.selectedImageSize,
    getColorSchema: state => state.colorSchema,
    getLogoId: state => state.logoId,
    getBackgroundType: state => state.backgroundType,
    getBackgroundImage: state => state.backgroundImage,
    getHasBorder: state => state.hasBorder,
    getBorderWidth: state => state.borderWidth,
    getFontSize: state => state.fontSize,
    getBars: state => state.bars,
    getHasTopShadow: state => state.hasTopShadow,
    getHasBottomShadow: state => state.hasBottomShadow,
    hasBars: state => !!state.bars.filter(bar => bar.text.length).length,
    getFormat: state => state.format,
};

const mutations = {
    setStyleSet: (state, styleSet) => state.styleSet = styleSet,
    setAlignment: (state, alignment) => state.alignment = alignment,
    setImageHeight: (state, height) => state.imageHeight = height,
    setImageWidth: (state, width) => state.imageWidth = width,
    setSelectedImageSize: (state, size) => state.selectedImageSize = size,
    setColorSchema: (state, schema) => state.colorSchema = schema,
    setLogoId: (state, logoId) => state.logoId = logoId,
    setBackgroundType: (state, type) => state.backgroundType = type,
    setBackgroundImage: (state, image) => state.backgroundImage = image,
    setHasBorder: (state, border) => state.hasBorder = border,
    setBorderWidth: (state, width) => state.borderWidth = width,
    setFontSize: (state, size) => state.fontSize = size,
    addBar: (state, payload) => state.bars.splice(payload.index, 0, payload.bar),
    removeBar: (state, payload) => state.bars.splice(payload.index, 1),
    setBar: (state, payload) => state.bars.splice(payload.index, 1, payload.bar),
    setHasTopShadow: (state, shadow) => state.hasTopShadow = shadow,
    setHasBottomShadow: (state, shadow) => state.hasBottomShadow = shadow,
    setFormat: (state, format) => state.format = format,
};

const actions = {
    setStyleSet({commit}, styleSet) {
        commit('setStyleSet', styleSet);
    },
    setAlignment({commit}, alignment) {
        commit('setAlignment', alignment)
    },
    setImageHeight({commit}, height) {
        commit('setImageHeight', height)
    },
    setImageWidth({commit}, width) {
        commit('setImageWidth', width)
    },
    setSelectedImageSize({commit}, size) {
        commit('setSelectedImageSize', size)
    },
    setColorSchema({commit}, schema) {
        commit('setColorSchema', schema)
    },
    setLogoId({commit}, logoId) {
        commit('setLogoId', logoId)
    },
    setBackgroundType({commit}, type) {
        commit('setBackgroundType', type)
    },
    setBackgroundImage({commit}, image) {
        commit('setBackgroundImage', image)
    },
    setHasBorder({commit}, border) {
        commit('setHasBorder', border)
    },
    setBorderWidth({commit}, width) {
        commit('setBorderWidth', width)
    },
    setFontSize({commit}, size) {
        commit('setFontSize', size)
    },
    addBar({commit}, payload) {
        commit('addBar', payload)
    },
    removeBar({commit}, payload) {
        commit('removeBar', payload)
    },
    setBar({commit}, payload) {
        commit('setBar', payload)
    },
    setHasTopShadow({commit}, shadow) {
        commit('setHasTopShadow', shadow)
    },
    setHasBottomShadow({commit}, shadow) {
        commit('setHasBottomShadow', shadow)
    },
    setFormat({commit}, format) {
        commit('setFormat', format)
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
