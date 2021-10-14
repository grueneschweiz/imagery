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
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
