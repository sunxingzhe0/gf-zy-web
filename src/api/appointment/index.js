import request from '@/utils/request'

export const appointment = {
  /*
  @name            getHospInfo
  @desc            获取院区列表
  @params
  @return
  */
  getHospInfo() {
    return request({
      url: '/api/v1/appointment/getHospInfo',
    })
  },
  /*
    @name           getDeptList
    @desc           获取预约科室列表
    @params
                    orgId: "xxxxxxxx"//机构id
    @return
    */
  getDeptList(orgId, hospCode) {
    return request({
      url: '/api/v1/appointment/getDeptList',
      method: 'get',
      params: { orgId, hospCode },
    })
  },
  /*
    @name           getDeptByCondition
    @desc           根据条件查询科室
    @params
                    name: "xxxxxxxx"//医生名字或者科室名称
                    orgId:"xxx"//机构id
    @return
    */
  getDeptByCondition(params) {
    return request({
      url: '/api/v1/appointment/getDeptByCondition',
      method: 'get',
      params,
    })
  },
  /*
  @name           getReverseDeptDate
  @desc           获取预约科室可预约日期
  @params
                  deptId: "xxxxxxxx"//科室id
                  orgId:"xxx"//机构id
  @return
  */
  getReverseDeptDate(params) {
    return request({
      url: '/api/v1/appointment/getReverseDeptDate',
      method: 'get',
      params,
    })
  },
  /*
  @name           getDoctorList
  @desc           根据科室获取医生列表 pc端
  @params
                  orgId: "xxxxxxxx"//机构id
                  deptId: "xxxxxxxx"//科室id
  @return
  */
  getDoctorList(params) {
    return request({
      url: '/api/v1/appointment/getDoctorList',
      method: 'get',
      params,
    })
  },
  /*
  @name           getReverseDocInfo
  @desc           获取预约医生信息
  @params
                  deptId: "xxxxxxxx"//科室id
                  orgId:"xxx"//机构id
                  doctorId:"xxx"//医生id（不是必填）
                  beginDate：//预约开始时间"
                  endDate：//预约结束时间"
                  resource:""//来源1-web 2-小程序
  @return
  */
  getReverseDocInfo(params) {
    return request({
      url: '/api/v1/appointment/getReverseDocInfo',
      method: 'get',
      params,
    })
  },
  /*
  @name           refreshDoctorNo
  @desc           刷新医生号源
  @params
                  orgId: "xxxxxxxx"//机构id
                  deptId: "xxxxxxxx"//科室id
                  doctorId: "xxxxxxxx"//医生id
                  regDate: "xxxxxxxx"//预约时间
  @return
  */
  refreshDoctorNo(params) {
    return request({
      url: '/api/v1/appointment/refreshDoctorNo',
      method: 'get',
      params,
    })
  },
  /*
    @name           save
    @desc           保存诊间预约信息
    @params
                    {
                        deptId: "xxxxxxxx"//科室id
                        orgId:"xxx"//机构id
                        doctorId:"xxx"//医生id
                        memberId:"xxx"//成员id
                        userId:"xxx"//用户id
                        diagnoseNo:"xxx"//就诊号
                        resourceNo:"xxx"//号源类型
                        startTime:"xxx"//预约开始日期
                        endTime:"xxx"//预约结束日期
                        fee:"xxx"//诊疗费用
                        creator:"xxx"//创建人id
                    }
    @return
    */
  save(data) {
    return request({
      url: '/api/v1/appointment/save',
      method: 'post',
      data: data,
    })
  },
  /***
   *PC端预约平台-检验列表
   */
  webJyList(params, headers) {
    return request({
      url: '/api/v1/dispose/webJyList',
      method: 'get',
      params,
      headers: headers,
    })
  },
  /***
   * PC端预约平台-检查列表
   */
  webJcList(params, headers) {
    return request({
      url: '/api/v1/dispose/webJcList',
      method: 'get',
      params,
      headers: headers,
    })
  },

  /***
   * PC端预约平台-治疗列表
   */
  webZlList(params, headers) {
    return request({
      url: '/api/v1/dispose/webZlList',
      method: 'get',
      params,
      headers: headers,
    })
  },
  /***
   * PC端预约平台-修改预约时间
   */
  changeOrderTimec(data, headers) {
    return request({
      url: '/api/v1/dispose/changeOrderTime',
      method: 'post',
      data: data,
      headers: headers,
    })
  },

  /***
   * PC端预约平台-停诊通知
   */
  cancelRemind(data, headers) {
    return request({
      url: '/api/v1/dispose/cancelRemind',
      method: 'post',
      data: data,
      headers: headers,
    })
  },
  /***
   * PC端预约平台-选择时间段
   */
  chooseDisTime(headers) {
    return request({
      url: '/api/v1/dictDispose/chooseDisTime',
      method: 'get',
      headers: headers,
    })
  },
  /***
   * PC端预约平台-取消单条预约数据
   */
  cancelSingle(data, headers) {
    return request({
      url: '/api/v1/dispose/cancelSingle',
      method: 'post',
      data: data,
      headers: headers,
    })
  },
  /***
   * PC端预约平台-权限获取
   */
  disposeMenu(params, headers) {
    return request({
      url: '/api/v1/dispose/disposeMenu',
      method: 'post',
      params,
      headers: headers,
    })
  },

  /***
   * 获取号源
   */
  getDocFsInfo(params, headers) {
    return request({
      url: '/api/v1/appointment/getDocFsInfo',
      method: 'get',
      params,
      headers: headers,
    })
  },
}
