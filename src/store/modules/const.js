const state = {
  buMen: "",
  zhiWei: ""
}
const mutations = {
  SET_BUMEN: (state, res) => {
    state.buMen = res
  },
  SET_ZHIWEI: (state, res) => {
    state.zhiWei = res
  },
}
const actions = {
  getBuMen({ commit }, res) {
    commit('SET_BUMEN', res.data)
  },
  getZhiWei({ commit }, res) {
    commit('SET_ZHIWEI', res.data)
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
