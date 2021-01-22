import request from '@/utils/request'

/**
 * 医生排班日程信息
 * @param {object} params
 * @param {string} params.doctorId - 医生id
 * @param {number} [params.dayType] - 今日(0),次日(1)
 * @param {string} [params.datetime] - 月份(格式:yyyy-MM)
 * @param {string} [params.searchKeyWords] - 患者姓名
 * @returns {Promise<{ date: string, leftInfo: { beginRange: string }[], select: number, workDay: Boolean }[]>}
 */
export function singelDocSchedual(params) {
  return request({
    url: '/api/v1/schedual/singelDocSchedual',
    method: 'get',
    params,
  })
}

/**
 * @typedef {object} workTime
 * @property {string} timeConfId - 时段配置id
 * @property {string} timeRange - 时间范围
 * @property {string[]} userName - 患者姓名集合
 * @property {string[]} orderId - 订单id集合
 * @property {number} currentNum - 当前时间预约人数
 * @property {string} grade - 预约人数占比
 * @property {string} freeType - 预约描述
 * @property {number} configType - 当前时间段关闭状态 0:关闭/1:开启
 *
 * @typedef {object} findScheInfoByDateResponse
 * @property {workTime[]} workTimeList
 * @property {string[]} restTimeList - 休息时间段集合
 * @property {string} allConfId - 主配置id
 * @property {number} select
 * @property {boolean} workDay - 是否为工作日 true:是.false:不是
 *
 * 当天排班详情
 * @param {object} params
 * @param {string} params.doctorId - 医生id
 * @param {string} params.deptid - 科室id
 * @param {int} [params.dayType] - 今日(0),次日(1)
 * @param {string} [params.date] - 日期(格式:yyyy-MM-dd)
 * @returns {Promise<findScheInfoByDateResponse>}
 */
export function findScheInfoByDate(params) {
  return request({
    url: '/api/v1/schedual/findScheInfoByDate',
    method: 'get',
    params,
  })
}
