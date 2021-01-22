const state = {
  updateListFlagVisit: 1,
  updateListFlagPrescription: 1,
  updateListFlagPendingPrescription: 1,
  updateListAddNewDrugs: 1,
  updateListEditFooter: 1, //公告管理 信息查看 返回
  updateListFlagNavNotice: 1,
  // updateListInstitutionalConfiguration: 1, //机构端 业务刷新
}
const mutations = {
  CHANGE_FLAG: (state, type) => {
    state[type] += 1
  },
}
const actions = {
  changeFlag({ commit }, type) {
    commit('CHANGE_FLAG', type)
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
