/*
  interface Emums {
    id: number,
    name: string,
    code: string,
    label: string,  => name
    value: string,  => id
  }
  interface Unit {
    id: string
    seq: number
    type: string
    index: number
    status: false
    number: number
    unitName: string
    typeList: Array<string>
  }
  interface Treatment {
    val: number
    type: number
    label: string
    value: string
    attrId: string
    attrName: string
  }
*/
import { getUnitList } from '@/api/dictionary'
import { attriBute, typeLists } from '@/api/drugs'
export default {
  namespaced: true,
  state: {
    drugWays: [], // 使用途径 Array<Emums>
    drugTypes: [], // 药品类型 Array<Emums>
    orgDrugUnits: [], // 机构药品单位 Array<Unit>
    drugFrequencys: [], // 使用频次 Array<Emums>
    drugTreatments: [], // 药品使用疗程 Array<>
  },
  actions: {
    init({ rootState, dispatch }) {
      //平台端不请求下面几个接口  没有角色也不请求
      console.log(arguments)
      if (
        (rootState.user.identityType &&
          rootState.user.identityType === 'PLATFORM') ||
        !rootState.user.roleName
      ) {
        return
      }
      dispatch('getDrugWays')
      dispatch('getDrugTypes')
      dispatch('getDrugTreatments')
      dispatch('getDrugFrequencys')
    },
    // 获取药品使用途径
    async getDrugWays({ commit }) {
      const res = await typeLists({ type: 6 })
      const drugWays = res.map(item => ({
        ...item,
        label: item.name,
        id: String(item.id),
        value: String(item.name),
      }))
      commit('SET_DRUG_WAYS', drugWays)
    },
    // 获取药品类型
    async getDrugTypes({ commit }) {
      const res = await typeLists({ type: 3 })
      const drugTypes = res.map(item => ({
        ...item,
        label: item.name,
        id: String(item.id),
        value: String(item.id),
      }))
      commit('SET_DRUG_TYPES', drugTypes)
    },
    // 获取机构药品单位列表
    async getOrgDrugUnits({ commit }) {
      const res = await getUnitList({
        status: false,
        pageSize: 200,
      })
      commit('SET_ORG_DRUG_UNITS', res)
    },
    // 获取药品疗程单位
    async getDrugTreatments({ commit }) {
      const res = await attriBute({ type: 5 })
      const drugTreatments = res.map(item => ({
        ...item,
        label: item.attrName,
        value: String(item.attrName),
      }))
      commit('SET_DRUG_TREATMENTS', drugTreatments)
    },
    // 获取药品使用频次
    async getDrugFrequencys({ commit }) {
      const res = await typeLists({ type: 5 })
      const drugFrequencys = res.map(item => ({
        ...item,
        label: item.name,
        value: String(item.code),
      }))
      commit('SET_DRUG_FREQUENCYS', drugFrequencys)
    },
  },
  mutations: {
    SET_DRUG_WAYS(state, paylod) {
      state.drugWays = paylod || []
    },
    SET_DRUG_TYPES(state, paylod) {
      state.drugTypes = paylod || []
    },
    SET_ORG_DRUG_UNITS(state, paylod) {
      state.orgDrugUnits = paylod || []
    },
    SET_DRUG_TREATMENTS(state, paylod) {
      state.drugTreatments = paylod || []
    },
    SET_DRUG_FREQUENCYS(state, paylod) {
      state.drugFrequencys = paylod || []
    },
  },
}
