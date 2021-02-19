
const state = {
  uploadHost: ''
}

const mutations = {
  SET_HOST: (state, host) => {
    state.uploadHost = host
  }
}

const actions = {
  setHost({ commit }, host) {
    console.log('host:', host)
    commit('SET_HOST', host)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
