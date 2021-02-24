const optionsIG = [
  { label: '全部', value: '', name: ['JG', 'YF', 'GR'] },
  { label: '首页', value: 'INDEX', name: ['YF', 'GR'] },
  { label: '处方', value: 'RP', name: ['YF', 'GR'] },
  { label: '业务', value: 'BUSINESS', name: ['JG', 'GR'] },
  { label: '用户', value: 'USER', name: ['JG', 'GR'] },
  { label: '模板', value: 'MODEL', name: ['GR'] },
  { label: '机构', value: 'ORG', name: ['JG', 'GR'] },
  { label: '药品', value: 'DRUG', name: ['YF', 'GR'] },
  { label: '字典', value: 'DICT', name: ['JG', 'GR'] },
  { label: '订单', value: 'ORDER', name: ['JG', 'YF', 'GR'] },
  { label: '排班', value: 'SCHEDULE', name: ['JG', 'GR'] },
  { label: '统计', value: 'COUNT', name: ['JG', 'YF', 'GR'] },
  { label: '权限', value: 'AUTH', name: ['JG', 'GR'] },
  { label: '设置', value: 'SETTING', name: ['JG', 'YF', 'GR'] },
]

const options = function (type) {
  let wholeAons = optionsIG.filter(val => {
    return val.name.indexOf(type) > -1
  })
  return wholeAons
}
export default options
