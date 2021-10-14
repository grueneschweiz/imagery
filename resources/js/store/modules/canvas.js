import {StyleSetTypes} from "../../service/canvas/Constants";

const state = {
    styleSet: StyleSetTypes.young
};

const getters = {
    getStyleSet: state => state.styleSet,
};

const actions = {
    setStyleSet({commit}, styleSet) {
        commit('setStyleSet', styleSet);
    },
};

const mutations = {
    setStyleSet: (state, styleSet) => state.styleSet = styleSet,
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
