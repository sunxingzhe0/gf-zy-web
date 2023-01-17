import request from '@/utils/request'

const apiScheduleTemplate = {
  /**
   * 新增模板
   * @param {object} params
   * @param {string} params.name 模板名称
   * @param {string} params.periodList 午别
   * @param {number} params.deptUserList 科室医生
   *
   */
  addTemplate(data) {
    return request({
      url: '/api/v1/counseling/schedule/temp/addTemplate',
      method: 'post',
      data,
    })
  },
  /**
   * 编辑模板
   * @param {object} params
   * @param {string} params.name 模板名称
   * @param {string} params.id
   * @param {string} params.periodList 午别
   * @param {number} params.deptUserList 科室医生
   *
   */
  editTemplate(data) {
    return request({
      url: '/api/v1/counseling/schedule/temp/editTemplate',
      method: 'post',
      data,
    })
  },
  /**
   * 复制模板
   * @param {object} params
   * @param {string} params.name 模板名称
   * @param {string} params.periodList 午别
   * @param {number} params.deptUserList 科室医生
   *
   */
  copyTemplate(data) {
    return request({
      url: '/api/v1/counseling/schedule/temp/copyTemplate',
      method: 'post',
      data,
    })
  },
  /**
   * 删除模板
   * @param {string} id
   *
   */
  delTemplate(id) {
    return request({
      url: `/api/v1/counseling/schedule/temp/delTemplate/${id}`,
      method: 'post',
    })
  },
  /**
   * 选择模板列表
   * @param {object} params
   * @param {string} params.name 模板名称
   *
   */
  chooseScheduleTemplate(params) {
    return request({
      url: '/api/v1/counseling/schedule/temp/chooseScheduleTemplate',
      method: 'get',
      params,
    })
  },
  /**
   * 科室医生选择列表
   * @param {object} params
   * @param {string} params.deptId 科室id
   *
   */
  accountChooseList(params) {
    return request({
      url: '/api/v1/account/chooseList',
      method: 'get',
      params,
    })
  },
  /**
   * 排班模板科室+医生树结构
   * @param {object} params
   * @param {string} params.id 模板id
   *
   */
  doctorScheduleList(params) {
    return request({
      url: '/api/v1/counseling/schedule/temp/doctorScheduleList',
      method: 'get',
      params,
    })
  },
  /**
   * 排班模板科室+医生+时段分组统计信息
   * @param {object} params
   * @param {string} params.id 模板id
   *
   */
  tempStatistics(params) {
    return request({
      url: '/api/v1/counseling/schedule/temp/statistics',
      method: 'get',
      params,
    })
  },
  //获取模板基本信息
  getTemplate(id) {
    return request({
      url: `/api/v1/counseling/schedule/temp/getTemplate/${id}`,
      method: 'get',
    })
  },
  /**
   * 排班模板科室+医生+工作日项目列表
   * @param {object} params
   * @param {string} params.deptId 科室id
   * @param {string} params.scheduleId 模板id
   * @param {string} params.userId 医生id
   * @param {number} params.weekDay 工作日星期MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY
   *
   */
  doctorWeekDayScheduleList(params) {
    return request({
      url: `/api/v1/counseling/schedule/temp/doctorWeekDayScheduleList`,
      method: 'get',
      params,
    })
  },
  /**
   * 新增医生排班内容
   * @param {object} params
   * @param {string} params.clinicName 诊室名称
   * @param {string} params.endTime 结束时间 HH:mm
   * @param {string} params.itemId 项目id
   * @param {string} params.periodId 时段id
   * @param {string} params.sourceNumber 号源数 默认：1
   * @param {string} params.startTime 开始时间 HH:mm
   * @param {string} params.deptId 科室id
   * @param {string} params.scheduleId 模板id
   * @param {string} params.userId 医生id
   * @param {number} params.weekDay 工作日星期MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY
   *
   */
  addDoctorSchedule(data) {
    return request({
      url: '/api/v1/counseling/schedule/temp/addDoctorSchedule',
      method: 'post',
      data,
    })
  },
  /**
   * 编辑医生排班内容
   * @param {object} params
   * @param {string} params.detailId 排班内容id 编辑时不能为null
   * @param {string} params.clinicName 诊室名称
   * @param {string} params.endTime 结束时间 HH:mm
   * @param {string} params.itemId 项目id
   * @param {string} params.periodId 时段id
   * @param {string} params.sourceNumber 号源数 默认：1
   * @param {string} params.startTime 开始时间 HH:mm
   * @param {string} params.deptId 科室id
   * @param {string} params.scheduleId 模板id
   * @param {string} params.userId 医生id
   * @param {number} params.weekDay  编辑时不能为null 工作日星期MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY 周日期
   *
   */
  editDoctorSchedule(data) {
    return request({
      url: '/api/v1/counseling/schedule/temp/editDoctorSchedule',
      method: 'post',
      data,
    })
  },
  /**
   * 删除医生排班内容
   * @param {string} id
   *
   */
  delDoctorSchedule(id) {
    return request({
      url: `/api/v1/counseling/schedule/temp/delDoctorSchedule/${id}`,
      method: 'post',
    })
  },
  /**
   * 预览排班
   * @param {object} params
   * @param {Array} params.deptUserList 科室/医生集合
   * @param {string} params.endDate 结束日期 格式：yyyyMMdd
   * @param {string} params.shiftName 班次
   * @param {string} params.startDate 开始日期 格式：yyyyMMdd weekDay为空时，startDate不能为空
   * @param {string} params.type 预览模式 1：按日预览/2：按月预览/默认：1
   * @param {string} params.scheduleId 模板id
   * @param {number} params.weekDay 工作日星期MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY
   *
   */
  previewSchedule(data) {
    return request({
      url: '/api/v1/counseling/schedule/temp/previewSchedule',
      method: 'post',
      data,
    })
  },
  /**
   * 发布排班
   * @param {object} params
   * @param {Array} params.detailList 排班明细列表
   * @param {string} params.endDate 结束日期 格式：yyyyMMdd
   * @param {string} params.startDate 开始日期 格式：yyyyMMdd weekDay为空时，startDate不能为空
   * @param {string} params.scheduleId 模板id
   */
  publishSchedule(data) {
    return request({
      url: '/api/v1/counseling/schedule/publishSchedule',
      method: 'post',
      data,
    })
  },
  /**
   * 根据日期获取科室+医生+排班记录树
   * @param {object} params
   * @param {string} params.scheduleDate 排班日期 格式：yyyyMMdd
   *
   */
  doctorScheduleTree(params) {
    return request({
      url: `/api/v1/counseling/schedule/doctorScheduleTree`,
      method: 'get',
      params,
    })
  },
  /**
   * 根据日期分组统计
   * @param {object} params
   * @param {string} params.startDate 排班日期 格式：yyyyMMdd
   * @param {string} params.endDate 排班日期 格式：yyyyMMdd
   * @param {string} params.itemId 排班日期 格式：yyyyMMdd
   * @param {string} params.keywords 排班日期 格式：yyyyMMdd
   * @param {string} params.reserved 排班日期 格式：yyyyMMdd
   * @param {string} params.type 排班日期 格式：yyyyMMdd
   *
   */
  statistics(params) {
    return request({
      url: `/api/v1/counseling/schedule/statistics`,
      method: 'get',
      params,
    })
  },
  /**
   * 停诊
   * @param {object} params
   * @param {string} params.scheduleId 排班id
   * @param {string} params.memberId
   * @param {string} params.newScheduleId 新排班id
   * @param {string} params.patientId 患者id
   * @param {string} params.applyRemark 退款原因
   * @param {string} params.stopRefundMethod 退款方式 1/2/3 不退款/原路退回/线下退款
   *
   */
  stopInquiry(data) {
    return request({
      url: `/api/v1/counseling/scheduleStop/stopInquiry`,
      method: 'post',
      data,
    })
  },
  /**
   * 停诊申请
   * @param {object} params
   * @param {string} params.scheduleId 排班id
   * @param {string} params.memberId
   * @param {string} params.newScheduleId 新排班id
   * @param {string} params.patientId 患者id
   * @param {string} params.applyRemark 退款原因
   * @param {string} params.stopRefundMethod 退款方式 1/2/3 不退款/原路退回/线下退款
   *
   */
  stopApply(data) {
    return request({
      url: `/api/v1/counseling/scheduleStop/stopApply`,
      method: 'post',
      data,
    })
  },

  /* 停诊记录 */
  stopPageList(params) {
    return request({
      url: `/api/v1/counseling/scheduleStop/stopPageList`,
      method: 'get',
      params,
    })
  },
  /* 停诊申请撤回 */
  //stopId
  stopWithdraw(data) {
    return request({
      url: `/api/v1/counseling/scheduleStop/stopWithdraw`,
      method: 'post',
      data,
    })
  },

  /* 停诊审批 */
  // auditResult 审批状态 true：同意/false：驳回
  stopAudit(data) {
    return request({
      url: `/api/v1/counseling/scheduleStop/stopAudit`,
      method: 'post',
      data,
    })
  },
  /**
   * 替诊
   * @param {object} params
   * @param {string} params.id 排班id
   * @param {string} params.replaceDeptId 替诊医生科室id
   * @param {string} params.replaceUserId 替诊医生id
   * @param {string} params.replaceRemark 替班原因
   *
   */
  replaceInquiry(data) {
    return request({
      url: `/api/v1/counseling/schedule/replaceInquiry`,
      method: 'post',
      data,
    })
  },
  /**
   * 根据类型获取业务配置详情
   * @param {string} options MANAGER_REFUND_METHOD管理退款选项 DOCTOR_REFUND_METHOD医生退款选项 SHIFT_INTERVAL排班间隔
   *
   */
  getByOptions(options) {
    return request({
      url: `/api/v1/counseling/basicConf/getByOptions/${options}`,
      method: 'get',
    })
  },
  /**
   * 我的工作日程
   * @param {object} params
   * @param {string} params.startDate 排班日期 格式：yyyyMMdd
   * @param {string} params.endDate 排班日期 格式：yyyyMMdd
   * @param {string} params.itemId 排班日期 格式：yyyyMMdd
   * @param {string} params.keywords 排班日期 格式：yyyyMMdd
   * @param {string} params.reserved 排班日期 格式：yyyyMMdd
   * @param {string} params.type 排班日期 格式：yyyyMMdd
   *
   */
  myWorkSchedule(params) {
    return request({
      url: `/api/v1/counseling/schedule/myWorkSchedule`,
      method: 'get',
      params,
    })
  },
  /**
   * 获取可提前预约患者列表
   * @param {object} params
   * @param {string} params.keywords 关键字 姓名/身份证
   *
   */
  getAdvanceAppointmentList(params) {
    return request({
      url: `/api/v1/patient/chooseList`,
      method: 'get',
      params,
    })
  },
  /**
   * 添加可提前预约患者
   * @param {object} params
   * @param {number} params.cost 诊疗费用
   * @param {string} params.deptName 科室名称
   * @param {string} params.doctor 医生
   * @param {string} params.doctorId 医生id
   * @param {number} params.entryId 预约项目编码
   * @param {string} params.entryName 预约项目名称
   * @param {string} params.memberId
   * @param {string} params.orgId 机构ID
   * @param {string} params.periodName 时段名称
   * @param {string} params.reservationDate 预约日期
   * @param {string} params.reservationDtime 预约时段
   * @param {string} params.scheduleId 排班ID
   *
   */
  addAdvanceAppointment(data) {
    return request({
      url: `/api/v1/counseling/schedule/addAdvanceAppointment`,
      method: 'post',
      data,
    })
  },
  /**
   * 删除可提前预约患者
   * @param {string} id
   *
   */
  delAdvanceAppointment(id) {
    return request({
      url: `/api/v1/counseling/schedule/delAdvanceAppointment/${id}`,
      method: 'post',
    })
  },
  /**
   * 获取同科室同医生同项目同时间段的排班项目列表
   * @param {object} params
   * @param {string} params.deptId 科室id
   * @param {string} params.doctorId 医生id
   * @param {string} params.endTime 结束时间 格式：10:00
   * @param {string} params.itemId 项目id
   * @param {string} params.startTime 开始时间 格式：09:00
   *
   */
  getScheduleListByDeptDoctorPeriod(params) {
    return request({
      url: `/api/v1/counseling/schedule/getScheduleListByDeptDoctorPeriod`,
      method: 'get',
      params,
    })
  },
  /**
   * 替诊记录
   *
   */
  replaceInquiryList(id) {
    return request({
      url: `/api/v1/counseling/schedule/replaceInquiryList/${id}`,
      method: 'get',
    })
  },
  /**
   * 编辑排班号源属性
   *
   */
  editSchedule(data) {
    return request({
      url: `/api/v1/counseling/schedule/editSchedule`,
      method: 'post',
      data,
    })
  },
  /**
   * 锁号
   */
  scheduleLock(id) {
    return request({
      url: `/api/v1/counseling/schedule/lock/${id}`,
      method: 'post',
    })
  },
  /**
   * 解除锁号
   */
  removeLock(id) {
    return request({
      url: `/api/v1/counseling/schedule/removeLock/${id}`,
      method: 'post',
    })
  },
  /**
   * 改期
   */
  reschedule(data) {
    return request({
      url: `/api/v1/counseling/schedule/reschedule`,
      method: 'post',
      data,
    })
  },
  /**
   * 导入医生排班内容模板
   * file
   * scheduleTempId
   */
  importScheduleTempDoctorDetail(data, params) {
    return request({
      url: `/api/v1/counseling/schedule/temp/importScheduleTempDoctorDetail`,
      method: 'post',
      data,
      params,
    })
  },
}
export default apiScheduleTemplate
