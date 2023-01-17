const state = {
  previewQery: {},
}

const mutations = {
  SET_PREVIEWQERY: (state, data) => {
    state.previewQery = data
  },
}

const actions = {
  setPreviewQery({ commit }, data) {
    commit('SET_PREVIEWQERY', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
