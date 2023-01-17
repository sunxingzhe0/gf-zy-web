import request from '@/utils/request'
import downloadFile from '@/utils/download-file'

// -------------------------------------药品字典--------------------------------------------------------

// 药房适用范围
export function getPharmacyList(params) {
  return request({
    url: '/api/v1/drugStore/chooseList',
    method: 'get',
    params,
  })
}

// 列表获取查询
export function getDrugsList(params) {
  return request({
    url: '/api/v1/orgDrug/pageDrug',
    method: 'get',
    params,
  })
}

// 新增药品字典
export function addDrug(data) {
  return request({
    url: '/api/v1/orgDrug/saveDrug',
    method: 'post',
    data,
  })
}

// 编辑药品字典
export function editDrug(data) {
  return request({
    url: '/api/v1/orgDrug/editDrug',
    method: 'post',
    data,
  })
}

// 删除药品字典
export function delDrug(data) {
  return request({
    url: '/api/v1/orgDrug/deleteDrug',
    method: 'post',
    data,
  })
}

// -------------------------------------诊断字典--------------------------------------------------------

// 列表获取
export function getDiagnosisList(params) {
  return request({
    url: '/api/v1/diagnosis/findDiagnosisDirList',
    method: 'get',
    params,
  })
}

// -------------------------------------单位管理--------------------------------------------------------

// 单位列表
export function getUnitList(params) {
  return request({
    url: '/api/v1/orgDrug/pageUnit',
    method: 'get',
    params,
  })
}

// 新增单位
export function addUnit(data) {
  return request({
    url: '/api/v1/orgDrug/saveUnit',
    method: 'post',
    data,
  })
}

// 编辑单位
export function editUnit(data) {
  return request({
    url: '/api/v1/orgDrug/editUnit',
    method: 'post',
    data,
  })
}

// 排序
export function sortUnit(data) {
  return request({
    url: '/api/v1/orgDrug/optionUnit',
    method: 'post',
    data,
  })
}

// 修改状态
export function setStatetUnit(data) {
  return request({
    url: '/api/v1/orgDrug/optionUnit',
    method: 'post',
    data,
  })
}

// 修改状态(药品的药房状态)
export function updateStatus(data) {
  return request({
    url: '/api/v1/orgDrug/updateStatus',
    method: 'post',
    data,
  })
}

// -------------------------------------诊断字典--------------------------------------------------------
export const dispose = {
  /*
  @name       webList
  @desc       处置字典列表
  @params
              token: //token
              timeType:    // 时间类型 1创建时间 2预约执行时间
              startTime:    //开始时间，示例20200101123030
              endTime:      //结束时间，示例20200303122222
              doctorType:   //类型 (1:草稿 2:未缴费 3:已缴费 4:已失效)
              documentId:   //单据号
              name:   //处置单名称
              patientName:   //就诊人姓名
              patientCard:   //就诊人卡号
              orderId:   //订单号
              deptName:   //执行科室名称
              status:   //处置单状态 DRAFT("草稿"),SUBMITTED("已提交"),NONEXECUTION("未执行"),EXECUTED("已执行"),CANCELLATION("已作废")
              payStatus:   //支付状态 NONPAID("未缴费"),PAID("已缴费"),RETURNPAID("已退费"),EXPIRED("已失效")
              currentNum:1    //当前页码
              pageSize:10    //每页数量
              field:create_time    //排序字段
              sorted:DESC        //排序方向
  @return
  */
  webList(params) {
    return request({
      url: '/api/v1/dictDispose/list',
      method: 'get',
      params,
    })
  },
  /*
  @name       updateStatus
  @desc       修改处置字典状态
  @params
              "id":"B13686229E084762A87C9140D4ACF1E6", 处置单id
              "status":true 状态 true：启用，false：停用
  @return
  */
  updateStatus(data) {
    return request({
      url: '/api/v1/dictDispose/updateStatus',
      method: 'post',
      data,
    })
  },
}

//机构单位字典批量导入
export function importUnitExcel(data) {
  return request({
    url: '/api/v1/orgDrug/importUnitExcel',
    method: 'post',
    timeout: '',
    data,
  })
}
//字典 药品字典批量导入
export function importDrugExcel(data) {
  return request({
    url: '/api/v1/orgDrug/importDrugExcel',
    method: 'post',
    timeout: '',
    data,
  })
}

//账号批量导入
export function importExcelAccount(data) {
  return request({
    url: '/api/v1/account/importExcel',
    method: 'post',
    timeout: '',
    data,
  })
}

//下载导入模板
export function modularLexcel(params) {
  return downloadFile({
    url: `/api/v1/file/download/templates/${params}`,
    method: 'get',
    name: params,
  })
}
