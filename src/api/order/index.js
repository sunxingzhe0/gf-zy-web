import request from '@/utils'
export default {
  /**
   * @typedef {object} orderDoctorWebDetailResponse
   * @property {string} orderId - 订单号
   * @property {string} orderStatus - 订单状态:UNPAID("待付款"),PAID("已支付"),WAIT_TREAT("待接诊"),IN_TREAT("接诊中"),WAIT_TAKE("待自提"),WAIT_SEND("待发货"),WAIT_RECEIVE("待收货"),TO_EVALUATE("待评价"),IN_AFTER_SALE("售后中"),FINISHED("已完成"),CLOSED("已关闭")
   * @property {string} bizType - 业务类型:CONSULT("在线咨询"), REPEAT_CLINIC("在线复诊"), CARRYON_PRESC("慢病续方")
   * @property {string} wayType - 诊疗形式:GRAPHIC("图文"),VIDEO("视频"),PHONE("电话"),
   * @property {string} doctorName - 医生
   * @property {string} titleName - 职称
   * @property {string} deptName - 科室
   * @property {string} createTime - 下单时间
   * @property {string} memberName - 就诊人
   * @property {string} sex - 性别
   * @property {string} age - 年龄
   * @property {string} payFee - 订单金额
   *
   * 订单详情
   * @param {object} params
   * @param {string} params.orderId - 订单号
   * @returns {Promise<orderDoctorWebDetailResponse>}
   */
  webDetail(params) {
    return request({
      url: '/api/v1/order/doctor/webDetail',
      method: 'get',
      params,
    })
  },
}
