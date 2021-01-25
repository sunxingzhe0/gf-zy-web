// 表头
const TableHeader = [
  { text: '处方号', key: 'checkbox' },
  { text: '序号', key: 'index' },
  {
    key: 'type',
    text: '类型',
    options: [],
    component: 'el-select',
  },
  {
    text: '药品名称',
    key: 'name',
    component: 'el-select',
    remote: true,
    filterable: true,
  },
  { text: '规格', key: 'spec' },
  {
    text: '用药途径',
    key: 'useWays',
    component: 'el-select',
  },
  {
    text: '单次剂量',
    key: 'singleDose',
    component: 'el-input',
    type: 'number',
  },
  {
    text: '用药频次',
    key: 'useFrequency',
    component: 'el-select',
  },
  {
    text: '疗程',
    type: 'number',
    key: 'treatment',
    component: 'el-input',
  },
  { text: '总量', key: 'total', component: 'el-input', type: 'number' },
  { text: '医保', key: 'medicare', filter: 'medicare' },
  { text: '单价', key: 'price', filter: 'money' },
  { text: '总价', key: 'totalPrice', filter: 'money' },
  {
    remote: true,
    text: '接收方',
    filterable: true,
    key: 'receivePharmacy',
    component: 'el-select',
  },
  { text: '备注', key: 'remark', component: 'el-input' },
  { text: '操作', key: 'operate' },
]

// 列宽
const ColumnWidth = {
  checkbox: '48px',
  target: 2,
  index: 1,
  type: 2,
  name: 3,
  spec: 3,
  useWays: 3,
  singleDose: 3,
  useFrequency: 3,
  treatment: 3,
  total: 3,
  medicare: 2,
  price: 2,
  totalPrice: 2,
  receivePharmacy: 3,
  remark: 4,
  operate: '140px',
}
// 药品项
const DrugItem = {
  seq: 0, // 排序[已弃用]
  type: '', // 药品类型
  name: '', // 药品名称
  spec: '', // 药品规格
  price: 0, // 药品单价[split ? 单量单位价格 : 总量单位价格]
  total: '', // 药品总量
  remark: '', // 药品备注
  useWays: '', // 用药途径
  groupId: '', // 药品组id
  medicare: '', // 药品医保
  split: false, // 是否拆零
  treatment: '', // 用药疗程
  orgDrugId: '', // 药品所在机构的药品id
  totalUnit: '', // 总量单位
  totalPrice: 0, // 药品总价
  singleDose: '', // 药品单量
  useFrequency: '', // 用药频次
  treatmentUnit: '', //用药疗程单位
  singleDoseUnit: '', // 单量单位
  receivePharmacy: '', // 药品药房
  receivePharmacyId: '', // 药品药房id
  singleDoseUnitText: '', // 药品单量单位文本
  // delte when submit
  edit: true, // 是否编辑
  target: '', // 调方目标
  unsaved: true, // 未保存
  basicDose: '', // 最小剂量单位
  checked: false, // 选中
  totalUnits: [], // 总量单位
  nameOptions: [], // 名称选项
  nameLoading: false, // 加载名称中
  regularPackVolume: '', // 药品包装规格
  receivePharmacyOptions: [], // 药房选项
}

const ValidateKeys = [
  'type',
  'name',
  'total',
  'treatment',
  'useWays',
  'singleDose',
  'useFrequency',
  'receivePharmacy',
]
export { TableHeader, ColumnWidth, DrugItem, ValidateKeys }
