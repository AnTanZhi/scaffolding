import system from "@/api/system"

const state = {
  buMen: "",
  zhiWei: "",
  userInfo: "",
  userImg: "",
  isLog: false,
}
const mutations = {
  SET_BUMEN: (state, res) => {
    state.buMen = res
  },
  SET_ZHIWEI: (state, res) => {
    state.zhiWei = res
  },
  SET_USERINFO: (state, res) => {
    state.userInfo = res
  },
  SET_USERIMG: (state, res) => {
    state.userImg = res
  },
  SET_ISLOG: (state, res) => {
    state.isLog = res
  },
}
const actions = {
  getBuMen({ commit }, res) {
    commit('SET_BUMEN', res.data)
  },
  getZhiWei({ commit }, res) {
    commit('SET_ZHIWEI', res.data)
  },
  getUserInfo({ commit }, res) {
    commit('SET_USERINFO', res.data)
  },
  getUserImg({ commit }, res) {
    commit('SET_USERIMG', res)
  },
  getIsLog({ commit }, res) {
    commit('SET_ISLOG', res)
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
