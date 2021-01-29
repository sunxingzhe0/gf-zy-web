const state = {
  version: '',
  messageTicket: {
    sequence: 0,
    ticket: 0,
    msgId: -1,
  },
}

const mutations = {
  SET_VERSION: (state, version) => {
    state.version = version
  },
  SET_MESSAGETICKET: (state, ticket) => {
    state.messageTicket = { ...ticket }
  },
  UPDATE_SEQUENCE: (state, sequence) => {
    state.messageTicket.sequence = sequence
  },
}

const actions = {
  setUserSyncVersion({ commit }, data) {
    commit('SET_VERSION', data)
  },
  setMessageTicket({ commit }, data) {
    commit('SET_MESSAGETICKET', data)
  },
  updateSequence({ commit }, data) {
    commit('UPDATE_SEQUENCE', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
