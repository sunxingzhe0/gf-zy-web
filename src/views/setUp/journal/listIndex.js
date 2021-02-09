const optionsIG = [
  { label: '全部', value: '', name: ['JG', 'YF', 'YSD', 'YS', 'GR'] }, //YSD 医生端
  { label: '机构', value: 'ORG', name: 'JG' }, //机构端
  { label: '员工', value: 'STAFF', name: 'JG' }, //机构端
  { label: '业务', value: 'BUSINESS', name: ['JG', 'GR'] }, //机构医生
  { label: '订单', value: 'ORDER', name: ['JG', 'YF'] }, //机构药房
  { label: '排班', value: 'SCHEDULE', name: ['JG', 'YS', 'GR'] }, //机构医生
  { label: '字典', value: 'DICT', name: 'JG' }, //机构
  { label: '权限', value: 'AUTH', name: 'JG' }, //机构
  { label: '设置', value: 'SETTING', name: ['JG', 'YF', 'YSD', 'YS', 'GR'] }, //全部端
  { label: '患者', value: 'PATIENT', name: ['YSD', 'GR'] }, //医生
  { label: '模板', value: 'MODEL', name: ['YSD', 'YS', 'GR'] }, //医生药师
  { label: '处方', value: 'RP', name: 'YS' }, //药师
  { label: '消息', value: 'MSG', name: 'YS' }, //药师
  { label: '首页', value: 'INDEX', name: 'YF' }, //药房
  { label: '药品', value: 'DRUG', name: 'YF' }, //药房
  { label: '统计', value: 'COUNT', name: 'YF' }, //药房
]

const options = function (type) {
  let wholeAons = optionsIG.filter(val => {
    return val.name.indexOf(type) > -1
  })
  return wholeAons
}
export default options
