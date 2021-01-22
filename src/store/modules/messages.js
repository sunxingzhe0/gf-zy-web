const state = {}

const mutations = {
  ADD_MESSAGES: (state, { sessionId, message }) => {
    const has = state[sessionId]?.find(
      ({ info }) => (message.info?.msgId || message.msgId) === info.msgId,
    )
    if (has) return

    state[sessionId]
      ? state[sessionId].push({ ...message })
      : (state[sessionId] = [{ ...message }])
  },
  CLEAR_MESSAGES: (state, sessionId) => {
    state[sessionId] && (state[sessionId] = [])
  },
}

const actions = {
  addMessages({ commit }, data) {
    commit('ADD_MESSAGES', data)
  },
  clearMessages({ commit }, data) {
    commit('CLEAR_MESSAGES', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
