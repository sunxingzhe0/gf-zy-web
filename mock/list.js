const body = {
  headers: [
    {
      field: 'address', //当sorted为true时，字段名用于传递到后台进行排序查询使用
      dataField: 'address',
      fieldName: '籍贯', //列表头名
      fixed: true, //true固定必须显示,false放到3个点中备用显示
      sorted: false, //true可以进行排序，false不可进行排序
      index: 1,
    },
    {
      field: 'education',
      dataField: 'education',
      fieldName: '学历',
      fixed: true,
      sorted: false,
      index: 1,
    },
    {
      field: 'gender',
      dataField: 'gender',
      fieldName: '性别',
      fixed: true,
      sorted: false,
      index: 1,
    },
    {
      field: 'zodiac',
      dataField: 'zodiac',
      fieldName: '生肖',
      fixed: true,
      sorted: false,
      index: 1,
    },
    {
      field: 'nurseId',
      dataField: 'nurseId',
      fieldName: '护工编号',
      fixed: true,
      sorted: false,
      index: 1,
    },
    {
      field: 'index',
      dataField: 'index',
      fieldName: '序号',
      fixed: true,
      sorted: false,
      index: 1,
    },
    {
      field: 'userName',
      dataField: 'userName',
      fieldName: '账号',
      fixed: true,
      sorted: false,
      index: 1,
    },
    {
      field: 'blood',
      dataField: 'blood',
      fieldName: '血型',
      fixed: true,
      sorted: false,
      index: 1,
    },
    {
      field: 'marital',
      dataField: 'marital',
      fieldName: '婚姻状态',
      fixed: true,
      sorted: false,
      index: 1,
    },
    {
      field: 'constellation',
      dataField: 'constellation',
      fieldName: '星座',
      fixed: true,
      sorted: false,
      index: 1,
    },
    {
      field: 'create_time',
      dataField: 'createTime',
      fieldName: '创建时间',
      fixed: true,
      sorted: true,
      index: 1,
    },
    {
      field: 'phone',
      dataField: 'phone',
      fieldName: '手机号',
      fixed: true,
      sorted: false,
      index: 1,
    },
    {
      field: 'maritalType',
      dataField: 'maritalType',
      fieldName: '婚姻状态',
      fixed: true,
      sorted: false,
      index: 1,
    },
    {
      field: 'name',
      dataField: 'name',
      fieldName: '姓名',
      fixed: true,
      sorted: false,
      index: 1,
    },
    {
      field: 'state',
      dataField: 'state',
      fieldName: '用户状态',
      fixed: true,
      sorted: false,
      index: 1,
    },
    {
      field: 'age',
      dataField: 'age',
      fieldName: '年龄',
      fixed: true,
      sorted: true,
      index: 1,
    },
  ],
  pages: 1,
  total: 13,
  pageNum: 1,
  pageSize: 10,
  list: [
    {
      index: 1,
      id: '14735AB83D5B4ECABBACA7DB03B0D1B7', // 护工id
      nurseId: '1', //护工编号
      pic: null, //护工头像
      name: 'xxx', //姓名
      age: 0, //年龄
      gender: '男', //性别
      address: '重庆市', //籍贯
      marital: '未婚', //婚姻
      education: '小学', //学历
      blood: 'A', //血型
      constellation: '白羊座', //星座
      zodiac: '鼠', //生肖
      state: '启用', //状态
      createTime: '2020-02-22T13:16:58.284+0000', //创建时间
      userName: null, //账号名称
      phone: null, //手机
      stateType: 1, //状态码
      genderType: 1,
      maritalType: null,
      educationType: 'PRIMARYSCHOOL',
      bloodType: 'BLOOD_A',
      constellationType: 'BAIYANG',
      zodiacType: null,
      children: [
        {
          index: 1,
          id: '14735AB83D5B4ECABBACAB03B0D1B7', // 护工id
          nurseId: '1', //护工编号
          pic: null, //护工头像
          name: 'xxx', //姓名
          age: 0, //年龄
          gender: '男', //性别
          address: '重庆市', //籍贯
          marital: '未婚', //婚姻
          education: '小学', //学历
          blood: 'A', //血型
          constellation: '白羊座', //星座
          zodiac: '鼠', //生肖
          state: '启用', //状态
          createTime: '2020-02-22T13:16:58.284+0000', //创建时间
          userName: null, //账号名称
          phone: null, //手机
          stateType: 1, //状态码
          genderType: 1,
          maritalType: null,
          educationType: 'PRIMARYSCHOOL',
          bloodType: 'BLOOD_A',
          constellationType: 'BAIYANG',
          zodiacType: null,
        },
        {
          index: 1,
          id: '14735AB83D5B234ECABBACAB03B0D1B7', // 护工id
          nurseId: '1', //护工编号
          pic: null, //护工头像
          name: 'xxx', //姓名
          age: 0, //年龄
          gender: '男', //性别
          address: '重庆市', //籍贯
          marital: '未婚', //婚姻
          education: '小学', //学历
          blood: 'A', //血型
          constellation: '白羊座', //星座
          zodiac: '鼠', //生肖
          state: '启用', //状态
          createTime: '2020-02-22T13:16:58.284+0000', //创建时间
          userName: null, //账号名称
          phone: null, //手机
          stateType: 1, //状态码
          genderType: 1,
          maritalType: null,
          educationType: 'PRIMARYSCHOOL',
          bloodType: 'BLOOD_A',
          constellationType: 'BAIYANG',
          zodiacType: null,
        },
      ],
    },
    {
      index: 1,
      id: '14735AB83D5B4', // 护工id
      nurseId: '2', //护工编号
      pic: null, //护工头像
      name: '卢本伟', //姓名
      age: 0, //年龄
      gender: '女', //性别
      address: '重庆市', //籍贯
      marital: '未婚', //婚姻
      education: '小学', //学历
      blood: 'A', //血型
      constellation: '白羊座', //星座
      zodiac: '鼠', //生肖
      state: '启用', //状态
      createTime: '2020-02-22T13:16:58.284+0000', //创建时间
      userName: null, //账号名称
      phone: null, //手机
      stateType: 1, //状态码
      genderType: 1,
      maritalType: null,
      educationType: 'PRIMARYSCHOOL',
      bloodType: 'BLOOD_A',
      constellationType: 'BAIYANG',
      zodiacType: null,
    },
    {
      index: 1,
      id: '14735AB83D5B4ECABBACA7DB0', // 护工id
      nurseId: '2', //护工编号
      pic: null, //护工头像
      name: '卢本伟', //姓名
      age: 0, //年龄
      gender: '女', //性别
      address: '重庆市', //籍贯
      marital: '未婚', //婚姻
      education: '小学', //学历
      blood: 'A', //血型
      constellation: '白羊座', //星座
      zodiac: '鼠', //生肖
      state: '启用', //状态
      createTime: '2020-02-22T13:16:58.284+0000', //创建时间
      userName: null, //账号名称
      phone: null, //手机
      stateType: 1, //状态码
      genderType: 1,
      maritalType: null,
      educationType: 'PRIMARYSCHOOL',
      bloodType: 'BLOOD_A',
      constellationType: 'BAIYANG',
      zodiacType: null,
    },
    {
      index: 1,
      id: '14735AB83D5B4ECAB', // 护工id
      nurseId: '2', //护工编号
      pic: null, //护工头像
      name: '卢本伟', //姓名
      age: 0, //年龄
      gender: '女', //性别
      address: '重庆市', //籍贯
      marital: '未婚', //婚姻
      education: '小学', //学历
      blood: 'A', //血型
      constellation: '白羊座', //星座
      zodiac: '鼠', //生肖
      state: '启用', //状态
      createTime: '2020-02-22T13:16:58.284+0000', //创建时间
      userName: null, //账号名称
      phone: null, //手机
      stateType: 1, //状态码
      genderType: 1,
      maritalType: null,
      educationType: 'PRIMARYSCHOOL',
      bloodType: 'BLOOD_A',
      constellationType: 'BAIYANG',
      zodiacType: null,
    },
    {
      index: 1,
      id: '14735AB83D5B4ECA', // 护工id
      nurseId: '2', //护工编号
      pic: null, //护工头像
      name: '卢本伟', //姓名
      age: 0, //年龄
      gender: '女', //性别
      address: '重庆市', //籍贯
      marital: '未婚', //婚姻
      education: '小学', //学历
      blood: 'A', //血型
      constellation: '白羊座', //星座
      zodiac: '鼠', //生肖
      state: '启用', //状态
      createTime: '2020-02-22T13:16:58.284+0000', //创建时间
      userName: null, //账号名称
      phone: null, //手机
      stateType: 1, //状态码
      genderType: 1,
      maritalType: null,
      educationType: 'PRIMARYSCHOOL',
      bloodType: 'BLOOD_A',
      constellationType: 'BAIYANG',
      zodiacType: null,
    },
    {
      index: 1,
      id: '14735AB83D5B4ECABBACA', // 护工id
      nurseId: '2', //护工编号
      pic: null, //护工头像
      name: '卢本伟', //姓名
      age: 0, //年龄
      gender: '女', //性别
      address: '重庆市', //籍贯
      marital: '未婚', //婚姻
      education: '小学', //学历
      blood: 'A', //血型
      constellation: '白羊座', //星座
      zodiac: '鼠', //生肖
      state: '启用', //状态
      createTime: '2020-02-22T13:16:58.284+0000', //创建时间
      userName: null, //账号名称
      phone: null, //手机
      stateType: 1, //状态码
      genderType: 1,
      maritalType: null,
      educationType: 'PRIMARYSCHOOL',
      bloodType: 'BLOOD_A',
      constellationType: 'BAIYANG',
      zodiacType: null,
    },
    {
      index: 1,
      id: '14735AB83D5B4ECABBACA7D', // 护工id
      nurseId: '2', //护工编号
      pic: null, //护工头像
      name: '卢本伟', //姓名
      age: 0, //年龄
      gender: '女', //性别
      address: '重庆市', //籍贯
      marital: '未婚', //婚姻
      education: '小学', //学历
      blood: 'A', //血型
      constellation: '白羊座', //星座
      zodiac: '鼠', //生肖
      state: '启用', //状态
      createTime: '2020-02-22T13:16:58.284+0000', //创建时间
      userName: null, //账号名称
      phone: null, //手机
      stateType: 1, //状态码
      genderType: 1,
      maritalType: null,
      educationType: 'PRIMARYSCHOOL',
      bloodType: 'BLOOD_A',
      constellationType: 'BAIYANG',
      zodiacType: null,
    },
    {
      index: 1,
      id: '14735AB83D5B4ECABBA', // 护工id
      nurseId: '2', //护工编号
      pic: null, //护工头像
      name: '卢本伟', //姓名
      age: 0, //年龄
      gender: '女', //性别
      address: '重庆市', //籍贯
      marital: '未婚', //婚姻
      education: '小学', //学历
      blood: 'A', //血型
      constellation: '白羊座', //星座
      zodiac: '鼠', //生肖
      state: '启用', //状态
      createTime: '2020-02-22T13:16:58.284+0000', //创建时间
      userName: null, //账号名称
      phone: null, //手机
      stateType: 1, //状态码
      genderType: 1,
      maritalType: null,
      educationType: 'PRIMARYSCHOOL',
      bloodType: 'BLOOD_A',
      constellationType: 'BAIYANG',
      zodiacType: null,
    },
    {
      index: 1,
      id: '14735AB83D5B4EC', // 护工id
      nurseId: '2', //护工编号
      pic: null, //护工头像
      name: '卢本伟', //姓名
      age: 0, //年龄
      gender: '女', //性别
      address: '重庆市', //籍贯
      marital: '未婚', //婚姻
      education: '小学', //学历
      blood: 'A', //血型
      constellation: '白羊座', //星座
      zodiac: '鼠', //生肖
      state: '启用', //状态
      createTime: '2020-02-22T13:16:58.284+0000', //创建时间
      userName: null, //账号名称
      phone: null, //手机
      stateType: 1, //状态码
      genderType: 1,
      maritalType: null,
      educationType: 'PRIMARYSCHOOL',
      bloodType: 'BLOOD_A',
      constellationType: 'BAIYANG',
      zodiacType: null,
    },
    {
      index: 1,
      id: '14735AB83D5B4', // 护工id
      nurseId: '2', //护工编号
      pic: null, //护工头像
      name: '卢本伟', //姓名
      age: 0, //年龄
      gender: '女', //性别
      address: '重庆市', //籍贯
      marital: '未婚', //婚姻
      education: '小学', //学历
      blood: 'A', //血型
      constellation: '白羊座', //星座
      zodiac: '鼠', //生肖
      state: '启用', //状态
      createTime: '2020-02-22T13:16:58.284+0000', //创建时间
      userName: null, //账号名称
      phone: null, //手机
      stateType: 1, //状态码
      genderType: 1,
      maritalType: null,
      educationType: 'PRIMARYSCHOOL',
      bloodType: 'BLOOD_A',
      constellationType: 'BAIYANG',
      zodiacType: null,
    },
    {
      index: 1,
      id: '14735AB83D5B4ECABBACA7DB03B', // 护工id
      nurseId: '2', //护工编号
      pic: null, //护工头像
      name: '卢本伟', //姓名
      age: 0, //年龄
      gender: '女', //性别
      address: '重庆市', //籍贯
      marital: '未婚', //婚姻
      education: '小学', //学历
      blood: 'A', //血型
      constellation: '白羊座', //星座
      zodiac: '鼠', //生肖
      state: '启用', //状态
      createTime: '2020-02-22T13:16:58.284+0000', //创建时间
      userName: null, //账号名称
      phone: null, //手机
      stateType: 1, //状态码
      genderType: 1,
      maritalType: null,
      educationType: 'PRIMARYSCHOOL',
      bloodType: 'BLOOD_A',
      constellationType: 'BAIYANG',
      zodiacType: null,
    },
    {
      index: 1,
      id: '14735AB83D5B4ECABBACA7DB0', // 护工id
      nurseId: '2', //护工编号
      pic: null, //护工头像
      name: '卢本伟', //姓名
      age: 0, //年龄
      gender: '女', //性别
      address: '重庆市', //籍贯
      marital: '未婚', //婚姻
      education: '小学', //学历
      blood: 'A', //血型
      constellation: '白羊座', //星座
      zodiac: '鼠', //生肖
      state: '启用', //状态
      createTime: '2020-02-22T13:16:58.284+0000', //创建时间
      userName: null, //账号名称
      phone: null, //手机
      stateType: 1, //状态码
      genderType: 1,
      maritalType: null,
      educationType: 'PRIMARYSCHOOL',
      bloodType: 'BLOOD_A',
      constellationType: 'BAIYANG',
      zodiacType: null,
    },
    {
      index: 1,
      id: '14735AB83D5B4EC', // 护工id
      nurseId: '2', //护工编号
      pic: null, //护工头像
      name: '卢本伟', //姓名
      age: 0, //年龄
      gender: '女', //性别
      address: '重庆市', //籍贯
      marital: '未婚', //婚姻
      education: '小学', //学历
      blood: 'A', //血型
      constellation: '白羊座', //星座
      zodiac: '鼠', //生肖
      state: '启用', //状态
      createTime: '2020-02-22T13:16:58.284+0000', //创建时间
      userName: null, //账号名称
      phone: null, //手机
      stateType: 1, //状态码
      genderType: 1,
      maritalType: null,
      educationType: 'PRIMARYSCHOOL',
      bloodType: 'BLOOD_A',
      constellationType: 'BAIYANG',
      zodiacType: null,
    },
  ],
  prePage: 0,
  nextPage: 0,
}

export default [
  {
    url: '/vue-element-admin/list',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        body: body,
      }
    },
  },
]
