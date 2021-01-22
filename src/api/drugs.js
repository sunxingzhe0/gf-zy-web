import request from '@/utils/request'
import { get } from 'lodash'

// -------------------------------------药品管理-------------------------------------------------------

// 药品列表
export function getDrugList(params) {
  return request({
    url: '/api/v1/drug/pageDrug',
    method: 'get',
    params,
  })
}
//单位详情
export function Unitdetails(params) {
  return request({
    url: '/api/v1/drug/singleOrigin',
    methods: get,
    params,
  })
}
// 修改状态
export function setDrugsState(data) {
  return request({
    url: '/api/v1/drug/optionDrug',
    method: 'post',
    data,
  })
}

// 编辑
export function editDrugs(params) {
  return request({
    url: '/api/v1/drug/singleDrug',
    method: 'get',
    params,
  })
}

// 批量导入
export function batchUpload(data, params) {
  return request({
    url: '/api/v1/drug/importDrugExcel',
    method: 'post',
    data,
    params,
  })
}

// 单位管理 批量导入
export function orgDrugImportUnitExcel(data) {
  return request({
    url: '/api/v1/orgDrug/importUnitExcel',
    method: 'post',
    data,
  })
}
//产地管理 批量导入
export function importOriginExcel(data, params) {
  return request({
    url: '/api/v1/drug/importOriginExcel',
    method: 'post',
    data,
    params,
  })
}

// -------------------------------------产地管理-------------------------------------------------------

// 产地列表
export function getOriginList(params) {
  return request({
    url: '/api/v1/drug/pageOrigin',
    method: 'get',
    params,
  })
}

// 新增单位
export function addOrigin(data) {
  return request({
    url: '/api/v1/drug/saveOrigin',
    method: 'post',
    data,
  })
}

// 编辑
export function editOrigin(data) {
  return request({
    url: '/api/v1/drug/editOrigin',
    method: 'post',
    data,
  })
}

// 修改状态
export function setStateOrigin(data) {
  return request({
    url: '/api/v1/drug/optionOrigin',
    method: 'post',
    data,
  })
}

// -------------------------------------单位管理-------------------------------------------------------

// 单位列表
export function getComList(params) {
  return request({
    url: '/api/v1/drug/pageUnit',
    method: 'get',
    params,
  })
}

// 药品管理新增保存
export function preserVation(data) {
  return request({
    url: '/api/v1/drug/saveDrug',
    method: 'post',
    data,
  })
}
// 药品管理修改
export function modify(data) {
  return request({
    url: '/api/v1/drug/editDrug',
    method: 'post',
    data,
  })
}
// 获取类型列表
export function typeLists(params) {
  return request({
    url: '/api/v1/syncInfo/getListByType',
    method: 'get',
    params,
  })
}

//药品属性筛选
export function attriBute(params) {
  return request({
    url: '/api/v1/drug/searchQuery',
    method: 'get',
    params,
  })
}
// 新增单位
export function addCom(data) {
  return request({
    url: '/api/v1/drug/saveUnit',
    method: 'post',
    data,
  })
}

// 修改状态
export function setState(data) {
  return request({
    url: '/api/v1/drug/optionUnit',
    method: 'post',
    data,
  })
}

// 编辑
export function editCom(data) {
  return request({
    url: '/api/v1/drug/editUnit',
    method: 'post',
    data,
  })
}
//药品管理 产地

export function PlaceOrigin(params) {
  return request({
    url: '/api/v1/drug/pageOrigin',
    method: 'get',
    params,
  })
}
// 使用药品--弹窗（与药品列表相同，同上）
