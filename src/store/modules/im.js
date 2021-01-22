const state = {
  version: '',
}

const mutations = {
  SET_VERSION: (state, version) => {
    state.version = version
  },
}

const actions = {
  setUserSyncVersion({ commit }, data) {
    commit('SET_VERSION', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
