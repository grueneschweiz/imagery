import {Alignments, BackgroundTypes, ColorSchemes, StyleSetTypes} from "../../service/canvas/Constants";

const state = {
    styleSet: StyleSetTypes.young,
    alignment: Alignments.left,
    imageHeight: 0,
    imageWidth: 0,
    colorSchema: ColorSchemes.white,
    logoId: null,
    backgroundType: BackgroundTypes.gradient,
    backgroundImage: null,
    hasBorder: true,
    borderWidth: 0,
    fontSize: 100,
    // bars: [],
};

const getters = {
    getStyleSet: state => state.styleSet,
    getAlignment: state => state.alignment,
    getImageHeight: state => state.imageHeight,
    getImageWidth: state => state.imageWidth,
    getColorSchema: state => state.colorSchema,
    getLogoId: state => state.logoId,
    getBackgroundType: state => state.backgroundType,
    getBackgroundImage: state => state.backgroundImage,
    getHasBorder: state => state.hasBorder,
    getBorderWidth: state => state.borderWidth,
    getFontSize: state => state.fontSize,
    // getBars: state => state.bars,
};

const mutations = {
    setStyleSet: (state, styleSet) => state.styleSet = styleSet,
    setAlignment: (state, alignment) => state.alignment = alignment,
    setImageHeight: (state, height) => state.imageHeight = height,
    setImageWidth: (state, width) => state.imageWidth = width,
    setColorSchema: (state, schema) => state.colorSchema = schema,
    setLogoId: (state, logoId) => state.logoId = logoId,
    setBackgroundType: (state, type) => state.backgroundType = type,
    setBackgroundImage: (state, image) => state.backgroundImage = image,
    setHasBorder: (state, border) => state.hasBorder = border,
    setBorderWidth: (state, width) => state.borderWidth = width,
    setFontSize: (state, size) => state.fontSize = size,
    // setBars: (state, bars) => state.bars = bars,
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
    // setBars({commit}, bars) {
    //     commit('setBars', bars)
    // },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
