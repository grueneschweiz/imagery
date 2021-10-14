import {Alignments, ColorSchemes, StyleSetTypes} from "../../service/canvas/Constants";

const state = {
    styleSet: StyleSetTypes.young,
    alignment: Alignments.left,
    imageHeight: 0,
    imageWidth: 0,
    colorSchema: ColorSchemes.white,
};

const getters = {
    getStyleSet: state => state.styleSet,
    getAlignment: state => state.alignment,
    getImageHeight: state => state.imageHeight,
    getImageWidth: state => state.imageWidth,
    getColorSchema: state => state.colorSchema,
};

const mutations = {
    setStyleSet: (state, styleSet) => state.styleSet = styleSet,
    setAlignment: (state, alignment) => state.alignment = alignment,
    setImageHeight: (state, height) => state.imageHeight = height,
    setImageWidth: (state, width) => state.imageWidth = width,
    setColorSchema: (state, schema) => state.colorSchema = schema,
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
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
