<template>
  <div class="handle-item" v-loading="loading">
    <div class="flex-between">
      <div>
        <span>No{{ labelIndex }}</span>
        <span>.[{{ this.tableData[0].id || '' }}]</span>
        <el-tag v-if="renderStatus()" size="mini" :type="renderStatus('color')">
          {{ renderStatus() }}
        </el-tag>
      </div>
    </div>
    <el-table border :data="tableData" style="with: 100%; margin-top: 10px;">
      <el-table-column
        v-for="(item, index) in colums"
        :min-width="minWidth(index, colums)"
        :width="item.width || 'auto'"
        :class-name="item.props"
        :label="item.label"
        :key="item.props"
      >
        <template slot-scope="scope">
          <template v-if="item.component">
            <component
              :is="item.component"
              :disabled="disabled"
              :remote="item.remote"
              :multiple="item.multiple"
              :component="item.component"
              :filterable="item.filterable"
              v-model="scope.row[item.props]"
              :placeholder="item.placeholder"
              :key="scope.row.type + item.props"
              :remote-method="item['remote-method']"
              collapse-tags
              @change="chanegHandler($event, item.props)"
            >
              <template v-if="item.component === 'el-select'">
                <el-option
                  v-for="(it, i) in options[item.props]"
                  :key="item.props + '-' + i"
                  :label="it.label"
                  :value="it.value"
                ></el-option>
              </template>
            </component>
          </template>
          <template v-else>
            <span v-if="item.props === 'price' && scope.row[item.props]"
              >¥</span
            >
            <span>{{ scope.row[item.props] || '--' }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="dispose-remark">
      <el-input
        :rows="2"
        type="textarea"
        maxlength="250"
        show-word-limit
        class="textarea"
        :disabled="disabled"
        v-model="tableData[0].remark"
        :placeholder="tableData[0].type === 'LAB' ? '备注' : '要求'"
      >
      </el-input>
    </div>
    <div class="footer-style flex-between">
      <div class="appointment">
        <div class="appointment-label">预约时间：</div>
        <div class="appointment-select">
          <el-select v-model="orderDate" :disabled="disabled">
            <i class="el-icon-date" slot="prefix"></i>
            <el-option
              v-for="(item, index) in orderDates"
              :key="'orderDates-' + index"
              class="space-between"
              :value="item.date"
            >
              <span>{{ item.date }}</span>
              <span v-if="tableData[0].type === 'LAB'">
                剩余（{{ item.sumNum }}）
              </span>
            </el-option>
          </el-select>
          <el-select
            v-if="tableData[0] && tableData[0].type === 'EXAMINE'"
            :disabled="disabled"
            v-model="orderTime"
          >
            <i class="el-icon-time" slot="prefix"></i>
            <el-option
              v-for="(item, index) in orderTimes[orderDate]"
              :key="'orderTimes-' + index"
              class="space-between"
              :value="item.date"
            >
              <span>{{ item.date }}</span>
              <span>剩余（{{ item.num }}）</span>
            </el-option>
          </el-select>
        </div>
      </div>
      {{ renderBtns() }}
      <slot></slot>
    </div>
  </div>
</template>

<script>
/*
@author         qiang
@name           Handle
@desc           处置详情/编辑
@props
                item        object    处置对象
                index       number    父级索引
                bizInfo     object    订单业务信息
                labelIndex  number    显示的label索引
@emit
*/
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash'
import PartsSelect from './PartsSelect'
import * as business from '@/api/business'

const Options = {
  type: [
    { label: '检验', value: 'LAB' },
    { label: '检查', value: 'EXAMINE' },
    // { label: '治疗', value: 'CURE' },
  ],
  anxious: [
    { label: '是', value: 'true' },
    { label: '否', value: 'false' },
  ],
  itemName: [],
  methodName: [],
  categoryName: [],
  specimenPartName: [],
}

export const Item = {
  id: '', //处置单id
  end: '', //预约结束时间
  name: '', //处置字典名称 多个按逗号分隔
  start: '', //预约开始时间
  remark: '', //备注
  userId: '', //购买业务用户id
  type: 'LAB', //类型 EXAMINE("检查"),LAB("检验"),CURE("治疗")
  orderId: '', //诊室业务id
  createId: '', //创建人id
  memberId: '', //就诊人id
  doctorId: '', //医生id
  price: '0.00', //价格
  anxious: false, //是否加急 是true/否false
  doctorName: '', //医生姓名
  documentId: '', //处置编码
  patientName: '', //就诊人姓名
  patientCard: '', //就诊卡号
  doctorTitle: '', //医生职称
  status: 'DRAFT', //状态 DRAFT("草稿"),SUBMITTED("已提交"),NONEXECUTION("未执行"),EXECUTED("已执行"),CANCELLATION("已作废")
  payStatus: '', //支付状态
  dictDisposeId: '', //选择的处置字典id 多个按逗号分隔
  dictDisList: [
    //选择的处置字典列表
    {
      id: 0,
      sex: '',
      unit: '',
      type: 'LAB',
      itemId: '',
      itemCode: '',
      itemName: '',
      stopTime: '',
      buildTime: '',
      categoryJm: '',
      itemNameJm: '',
      methodCode: '',
      methodName: '',
      status: 'DRAFT',
      anxious: 'false',
      categoryCode: '',
      categoryName: '',
      execDeptCode: '',
      execDeptName: '',
      specimenPartName: [],
      specimenPartCode: '',
    },
  ],
}

export const Status = {
  NONPAID: { color: '', text: '未缴费' },
  DRAFT: { color: 'info', text: '草稿' },
  PAID: { color: 'success', text: '已缴费' },
  EXPIRED: { color: 'danger', text: '已作废' },
  RETURNPAID: { color: 'danger', text: '已退费' },
  CANCELLATION: { color: 'danger', text: '已作废' },
}

export const PayStatus = [
  'NONPAID',
  'PAID',
  'EXPIRED',
  'RETURNPAID',
  'RETURNPAID',
]

export default {
  name: 'Handle',
  components: {
    PartsSelect,
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    // 父级列表索引
    index: {
      type: Number,
      default: 0,
    },
    // 业务参数
    bizInfo: {
      type: Object,
      default: () => {},
    },
    labelIndex: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      rules: {
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        specimen: [{ required: true, message: '请选择标本', trigger: 'blur' }],
        position: [{ required: true, message: '请选择部位', trigger: 'blur' }],
        sonPosition: [
          { required: true, message: '请选择子部位', trigger: 'blur' },
        ],
        course: [{ required: true, message: '请选择疗程', trigger: 'blur' }],
        frequency: [{ required: true, message: '请选择频次', trigger: 'blur' }],
        dept: [{ required: true, message: '请选择科室', trigger: 'blur' }],
      },
      parts: [],
      orderDate: '', // 预约日期
      orderTime: '', // 预约时间
      loading: false, // 加载状态
      orderDates: [], // 可预约日期
      orderTimes: [], // 可预约时间
      options: cloneDeep(Options), // 选项
      tableData: [cloneDeep(Item)], // 数据
    }
  },
  computed: {
    colums() {
      const colums = [
        { label: '类型', props: 'type', component: 'el-select' },
        {
          label: '类别',
          remote: true,
          filterable: true,
          props: 'categoryName',
          component: 'el-select',
          'remote-method': this.loadProjectByCategory,
        },
        {
          label: '名称',
          // remote: true,
          filterable: true,
          props: 'itemName',
          component: 'el-select',
          placeholder: '请先选择项目类别',
          // 'remote-method': this.loadProjectByName,
        },
        // { label: '是否加急', props: 'anxious', component: 'el-select' },
        { label: '执行科室', props: 'execDeptName', width: '80px' },
        { label: '费用', props: 'price' },
      ]
      const options = {
        // 检验
        LAB: [
          {
            label: '标本',
            remote: true,
            multiple: true,
            filterable: true,
            component: 'el-select',
            props: 'specimenPartName',
            placeholder: '请先选择检验名称',
          },
        ],
        // 检查
        EXAMINE: [
          {
            label: '检查方法',
            filterable: true,
            props: 'methodName',
            component: 'el-select',
            placeholder: '请先选择检查名称',
          },
          {
            label: '部位',
            multiple: true,
            filterable: true,
            component: 'el-select',
            props: 'specimenPartName',
            placeholder: '请先选择检查方法',
          },
        ],
        // 治疗
        CURE: [
          {
            label: '部位',
            multiple: true,
            props: 'partIds',
            component: 'el-select',
          },
          { label: '频次', props: 'frequencyId', component: 'el-select' },
          { label: '疗程', props: 'treatmentId', component: 'el-select' },
        ],
      }
      colums.splice(3, 0, ...options[this.tableData[0].type])
      return colums
    },
    disabled() {
      const { status, payStatus } = this.tableData[0]
      if (payStatus) return true
      return Boolean(status && status !== 'DRAFT')
    },
  },
  methods: {
    minWidth(index, colums) {
      if (index === 0 || index === colums.length - 1) {
        return '2'
      } else {
        return '3'
      }
    },
    // validate
    validate() {
      const data = this.structure()
      if (!data.name) return '请选择项目名称！'
      switch (data.type) {
        case 'LAB': {
          if (!data.specimenPartName.length) return '请选择检验标本！'
          break
        }
        case 'EXAMINE':
          if (!data.methodName) return '请选择检查方法！'
          if (!data.specimenPartName.length) return '请选择检查部位！'
          break
        case 'CURE':
          if (!data.treatmentName) return '请选择治疗名称！'
          if (!data.frequencyId) return '请选择治疗疗程！'
          break
      }
      if (!data.execDeptName) return '请选择执行科室！'
      if (!data.start || !data.end) return '请选择预约执行时间'
      return data
    },
    // submit && save data
    structure() {
      const OrderType = {
        CONSULT: 'Z',
        REPEAT_CLINIC: 'F',
        CARRYON_PRESC: 'X',
      }
      const { start, end } = this.computedTime([this.orderDate, this.orderTime])
      const data = {
        end,
        start,
        id: this.tableData[0].id,
        type: this.tableData[0].type,
        price: this.tableData[0].price,
        remark: this.tableData[0].remark,
        status: this.tableData[0].status,
        anxious: this.tableData[0].anxious,
        methodName: this.tableData[0].methodName,
        execDeptName: this.tableData[0].execDeptName,
        name: this.tableData.map(item => item.itemName).join(),
        dictDisposeId: this.tableData.map(item => item.dictDisposeId).join(),
        specimenPartName: this.tableData
          .map(item => item.specimenPartName)
          .join(),
        userId: this.bizInfo.userId,
        orderId: this.bizInfo.orderId,
        memberId: this.bizInfo.memberId,
        sessionId: this.bizInfo.sessionId,
        doctorTitle: this.bizInfo.titleName,
        patientName: this.bizInfo.memberName,
        patientCard: this.bizInfo.patientCard,
        orderType:
          this.tableData[0].orderType || OrderType[this.bizInfo.bizType],
      }
      return data
    },
    // computedTime
    computedTime(val) {
      let end = ''
      let start = ''
      const date = val[0] || ''
      const time = val[1] || ''
      if (this.tableData[0].type === 'LAB') {
        if (date) {
          end = dayjs(date + '17:30').format('YYYYMMDDHHmmss')
          start = dayjs(date + ' 08:00').format('YYYYMMDDHHmmss')
        }
      } else if (this.tableData[0].type === 'EXAMINE') {
        if (date && time) {
          const arr = time.split('~')
          end = dayjs(date + ' ' + arr[0]).format('YYYYMMDDHHmmss')
          start = dayjs(date + ' ' + arr[1]).format('YYYYMMDDHHmmss')
        }
      }
      return { end, start }
    },
    // findItemName
    findItemName(key, value) {
      const item = this.options[key].find(it => it.value === value)
      return item ? item.label : ''
    },
    // async
    async init() {
      if (this.id) {
        try {
          this.loading = true
          const res = await business.disposeDetail(this.id)
          this.initHandler(res)
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      } else {
        this.initHandler(cloneDeep(Item))
        this.options = cloneDeep(Options)
      }
    },
    initHandler(res) {
      let arr = []
      if (!res) return
      res.end = res.end || res.endTime
      res.anxious = String(res.anxious)
      res.start = res.start || res.startTime
      const list = cloneDeep(res.dictDisList)
      delete res.endTime
      delete res.startTime
      delete res.dictDisList
      if (res.start && res.end) {
        const end = dayjs(res.end).format('YYYY-MM-DD HH:mm')
        const start = dayjs(res.start).format('YYYY-MM-DD HH:mm')
        arr.push(start.substring(0, 10))
        if (res.type === 'EXAMINE') {
          const str = start.substring(11) + '~' + end.substring(11)
          arr.push(str)
        } else {
          arr.push('')
        }
      }
      this.orderDate = arr[0]
      this.orderTime = arr[1]
      this.tableData = list.map(item => ({
        ...item,
        ...res,
      }))
      this.loadOptions(this.tableData[0])
      this.loadProjectInfo('categoryName', '')
      this.loadProjectTime()
    },
    loadOptions(res) {
      this.loadProjectInfo('itemName', res.itemName, 1)
      this.loadProjectInfo('methodName', res.methodName, 1)
      this.loadProjectInfo('categoryName', res.categoryName, 1)
    },
    fillDispose(key, option) {
      const keys = [
        'itemId',
        'itemCode',
        'itemName',
        'categoryJm',
        'itemNameJm',
        'methodCode',
        'methodName',
        'categoryName',
        'execDeptCode',
        'execDeptName',
        'categoryCode',
        'specimenPartCode',
        'specimenPartName',
      ]
      const item = cloneDeep(this.tableData[0])
      keys.forEach(key => {
        if (key === 'specimenPartName') {
          item[key] = [option[key]]
        } else {
          item[key] = option[key]
        }
      })
      item.dictDisposeId = option.id
      this.tableData = [item]
      this.loadProjectTime()
      this.loadPrice()
    },
    async loadPrice() {
      const price = await business.disposeGetPrice({
        id: this.tableData[0].itemId, //处置字典id
      })
      this.$set(this.tableData[0], 'price', price)
    },
    async loadProjectTime() {
      const type = this.tableData[0].type
      if (!this.tableData[0].itemId) return
      const res = await business.disposeDate({
        id: this.tableData.map(it => it.itemId).join(),
        type: this.tableData[0].type,
      })
      const orderTimes = {}
      this.orderDates = res.map(item => {
        if (type === 'EXAMINE') {
          item.list = item.list || []
          orderTimes[item.date] = item.list.map(_item => ({
            ..._item,
            date: _item.startTime + '~' + _item.endTime,
          }))
        }
        return {
          date: item.date,
          sumNum: item.sumNum,
        }
      })
      this.orderTimes = orderTimes
    },
    // 加载处置字典
    // loadProjectByName
    loadProjectByName(keyword) {
      this.loadProjectInfo('itemName', keyword)
    },
    // loadProjectByCategory
    loadProjectByCategory(keyword) {
      this.loadProjectInfo('categoryName', keyword)
    },
    // loadProjectInfo
    async loadProjectInfo(key, keyword, options) {
      let {
        type,
        itemName,
        methodName,
        categoryName,
        // specimenPartName,
      } = this.tableData[0]
      let params = {
        type: type,
        itemName: itemName,
        methodName: methodName,
        categoryName: categoryName,
        // specimenPartName: specimenPartName,
      }
      params[key] = keyword
      for (let p in params) {
        if (!params[p]) delete params[p]
      }
      if (options) {
        switch (key) {
          case 'itemName':
            delete params.itemName
            delete params.methodName
            break
          case 'methodName':
            break
          case 'categoryName':
            delete params.itemName
            delete params.methodName
            delete params.categoryName
            break
        }
        console.log(key, params)
      }
      const res = await business.disposeChooseList({
        ...params,
        pageSize: 999, //每页数量
        currentNum: 1, //当前页码
        // sex: this.bizInfo.sex === '男' ? 1 : 0, //就诊人性别 男1/女0
      })
      const set = new Set()
      const arr = res
        .filter(item => {
          const has = set.has(item[key])
          if (!has) set.add(item[key])
          return !has
        })
        .map(item => ({
          ...item,
          value: item[key],
          label: item[key],
        }))
      this.$set(this.options, key, arr)
      // 只有一条数据则自动填充
      if (res.length === 1 && !options) this.fillDispose(key, res[0])
    },
    // render
    /*
      未提交[未暂存的草稿、已暂存的草稿]
      已提交[未缴费的处置、其他状态处置]
    */
    renderBtns() {
      const btns = []
      const { status, payStatus } = this.tableData[0]
      if (payStatus) {
        if (payStatus === 'NONPAID') {
          btns.push({ type: 3, text: '撤回' })
          btns.push({ type: 4, text: '作废' })
        }
      } else {
        if (!status || status === 'DRAFT') {
          btns.push({ type: 6, text: '暂存', className: 'el-button--primary' })
          btns.push({ type: 7, text: '提交', className: 'el-button--primary' })
        }
        if (status === 'DRAFT') {
          btns.unshift({
            type: 5,
            text: '删除',
          })
        }
      }
      this.$slots.default = (
        <div>
          {btns.map(it => (
            <el-button
              size="mini"
              class={it.className}
              plain={it.type !== 7}
              onClick={() => this.clickHandler(it.type)}
            >
              {it.text}
            </el-button>
          ))}
        </div>
      )
    },
    renderStatus(type = 'text') {
      const { status, payStatus } = this.tableData[0]
      if (PayStatus.includes(payStatus)) {
        return Status[payStatus][type]
      }
      if (status === 'DRAFT' || status === 'CANCELLATION') {
        return Status[status][type]
      }
    },
    // events
    clickHandler(type) {
      switch (type) {
        case 3: // 撤回
          this.withdraw('DRAFT')
          break
        case 4: // 作废
          this.withdraw('CANCELLATION')
          break
        case 5: // 删除
          this.$confirm('您确定要删除该处置单？', '提示', {
            type: 'warning',
          }).then(() => {
            this.delHandler()
          })
          break
        case 6: // 暂存
          this.saveHandler()
          break
        case 7: // 提交
          this.submitHandler()
          break
      }
    },
    chanegHandler(event, key) {
      this.orderDate = ''
      this.orderTime = ''
      this.orderTimes = []
      this.orderDates = []
      let data = cloneDeep(Item)
      let id = this.tableData[0].id
      // 更新类型 =》重置全部(除id)
      if (key === 'type') {
        let type = event
        this.options = cloneDeep(Options)
        this.tableData = [{ ...data, id, type }]
        this.loadProjectInfo('categoryName', '')
      } else {
        // 根据选择重置对应表单
        switch (key) {
          case 'itemName': {
            this.options.methodName = []
            this.options.specimenPartName = []
            const {
              id,
              type,
              itemName,
              execDeptName,
              categoryName,
            } = this.tableData[0]
            this.tableData = [
              { ...data, id, type, itemName, execDeptName, categoryName },
            ]
            if (this.tableData[0].type === 'LAB') {
              this.loadProjectInfo('specimenPartName', '')
            } else {
              this.loadProjectInfo('methodName', '')
            }
            break
          }
          case 'methodName': {
            this.options.specimenPartName = []
            const {
              id,
              type,
              itemName,
              methodName,
              execDeptName,
              categoryName,
            } = this.tableData[0]
            this.tableData = [
              {
                ...data,
                id,
                type,
                itemName,
                methodName,
                execDeptName,
                categoryName,
              },
            ]
            this.loadProjectInfo('specimenPartName', '')
            break
          }
          case 'categoryName': {
            this.options.itemName = []
            this.options.methodName = []
            this.options.specimenPartName = []
            const item = this.options[key].find(item => item.label === event)
            const { id, type, categoryName } = this.tableData[0]
            this.tableData = [
              {
                ...data,
                id,
                type,
                categoryName,
                execDeptName: item.execDeptName,
              },
            ]
            this.loadProjectByName()
            break
          }
          case 'specimenPartName': {
            this.loadProjectTime()
            this.loadPrice()
            break
          }
        }
      }
    },
    // operatorHandler [撤回：DRAFT 作废：CANCELLATION]
    async withdraw(type) {
      const parent = this.$parent.$parent.$parent
      if (type === 'DRAFT' && parent.disabled) {
        const res = await this.$confirm(
          '已存在其他草稿处置单，是否覆盖？',
          '提示',
        )
        if (res !== 'confirm') return
      }
      const loading = this.$loading({
        background: 'rgba(255, 255, 255, .6)',
      })
      try {
        await business.doctorUpdateStatus({
          id: this.tableData[0].id,
          status: type,
        })
        this.$set(this.tableData[0], 'payStatus', '')
        this.$set(this.tableData[0], 'status', type)
        this.$message.success('操作成功！')
        this.emiter('update')
        parent.delDraft(this.tableData[0].id)
        loading.close()
      } catch (e) {
        loading.close()
      }
    },
    async delHandler() {
      const loading = this.$loading({
        background: 'rgba(255, 255, 255, .6)',
      })
      try {
        await business.doctorBatchOpera({
          batchOperaType: 1,
          ids: [this.tableData[0].id],
        })
        this.$message.success('操作成功！')
        this.emiter('del')
        loading.close()
      } catch (e) {
        loading.close('del')
      }
    },
    async saveHandler() {
      const loading = this.$loading({
        background: 'rgba(255,255,255,.6)',
      })
      try {
        let res
        const data = { ...this.structure(), status: 'DRAFT' }
        if (data.id) {
          res = await business.doctorUpdateDetail(data)
        } else {
          res = await business.disposeInsert(data)
        }
        this.tableData = this.tableData.map(item => ({
          ...item,
          id: res,
          end: data.end,
          status: 'DRAFT',
          start: data.start,
        }))
        this.$message.success('操作成功！')
        this.emiter('update')
        loading.close()
      } catch (e) {
        console.log(e)
        loading.close()
      }
    },
    async submitHandler() {
      let loading
      try {
        let res
        const data = this.validate()
        if (typeof data === 'string') {
          return this.$message.warning(data)
        }
        loading = this.$loading({
          background: 'rgba(255,255,255,.6)',
        })
        data.status = 'SUBMITTED'
        if (data.id) {
          res = await business.doctorUpdateDetail(data)
        } else {
          res = await business.disposeInsert(data)
        }
        this.tableData = this.tableData.map(item => ({
          ...item,
          id: res,
          end: data.end,
          start: data.start,
          status: 'SUBMITTED',
          payStatus: 'NONPAID',
        }))
        this.$message.success('操作成功！')
        this.emiter('update')
        loading.close()
      } catch (e) {
        console.log(e)
        loading && loading.close()
      }
    },
    // emiter
    emiter(type) {
      const datas = {}
      for (let p in Item) {
        if (p === 'dictDisList') {
          datas[p] = this.tableData.map(item => {
            const _item = {}
            for (let _p in Item.dictDisList[0]) {
              _item[_p] = item[_p]
            }
            return _item
          })
        } else {
          datas[p] = this.tableData[0][p]
        }
      }
      this.$emit('customEvent', {
        type,
        datas: datas,
        index: this.index,
      })
    },
  },
  watch: {
    item: {
      immediate: true,
      handler(newVal, oldVal) {
        if (!newVal && oldVal) return
        const res = cloneDeep(newVal)
        res.orderType = res.documentId ? res.documentId[1] : ''
        this.initHandler(res)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';
.handle-item ::v-deep {
  .mini .el-tabs__item {
    padding: 0 5px;
  }

  .el-table {
    .cell {
      padding: 3px;
    }
  }
  .sonPartIds {
    padding: 0;
    .cell {
      padding: 0;
    }
  }
  .el-select__tags {
    max-width: 116px !important;

    .el-select__input {
      width: 0 !important;
      margin: 0 !important;
    }
  }
  .el-select {
    .el-tag {
      display: inline-block;
      max-width: 64%;
      margin-left: 4px;
      padding-left: 4px;
      overflow: hidden;
    }
    .el-tag:first-child .el-select__tags-text {
      display: inline-block;
      max-width: 76%;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: bottom;
    }
  }
}
.textarea {
  resize: none;
  & ::v-deep {
    .el-textarea__inner {
      padding: 5px;
      border-top: none;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      &:focus {
        border-color: #dcdfe6;
      }
    }
  }
}
.el-input.is-disabled .el-input__inner {
  border: none;
  color: #333;
  cursor: default;
  background: transparent;
}
.footer-style {
  margin: 10px 0;
}
.flex-end {
  display: flex;
  justify-content: flex-end;
}
.appointment {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-family: PingFang SC;
}
.appointment-select {
  width: 300px;
  height: 32px;
  display: flex;
  line-height: 32px;
  border-radius: 4px;
  border: 1px solid #cccccc;
  & ::v-deep {
    .el-select {
      flex: 1;
      &:nth-child(2) {
        border-left: 1px solid #ccc;
      }
    }
    .el-input__inner {
      max-height: 30px !important;
      border: none;
      display: block;
      font-size: 14px;
      line-height: 30px;
      font-weight: normal;
    }
    .el-icon-arrow-up {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.el-button--danger.is-plain,
.el-button--primary.is-plain {
  background: #fff;
}
.el-button--primary.is-plain:hover,
.el-button--primary.is-plain:focus {
  color: $--color-primary;
}
.space-between {
  display: flex;
  justify-content: space-between;
}
</style>
