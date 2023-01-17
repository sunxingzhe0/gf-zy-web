<template>
  <section class="view__card" :class="intoId ? 'hide-filter' : ''">
    <List
      ref="list"
      v-model="query"
      :filter="filter"
      :tableData="tableData"
      :columns="{
        fixed: { width: 160 },
        index: { hidden: true },
        type: { formatter: typeFilter },
        price: { formatter: priceFilter },
        status: { formatter: statusFilter },
      }"
    >
      <template v-slot:fixed="{ $index, row }">
        {{ renderBtns($index, row) }}
        <slot :name="'row-' + $index"></slot>
      </template>
      <div v-if="item" class="edit_box" slot="footerTable">
        <!-- :id="item.id" -->
        <Handle
          ref="handle"
          :item="item"
          :bizInfo="bizInfo"
          @customEvent="customEventHandler"
        ></Handle>
      </div>
    </List>
    <QrCode ref="qrcode" />
  </section>
</template>

<script>
import dayjs from 'dayjs'
import QrCode from '@/components/QrCode'

import { cloneDeep } from 'lodash'
import * as business from '@/api/business'
import { List, mixin } from '@/components'
import Handle, { Status, PayStatus } from '@/components/Handle/Handle'

export default {
  name: 'business_myHandle',
  components: {
    List,
    Handle,
    QrCode,
  },
  props: {
    intoId: String,
  },
  watch: {
    intoId: {
      handler(val) {
        console.log(val, 'intoId--------')
        this.query = {
          id: val,
        }
        // this.query.id = val
      },
      immediate: true,
    },
  },
  mixins: [
    mixin({
      fetchListFunction: function (params) {
        const keys = [
          'name',
          'orderId',
          'documentId',
          'patientName',
          'patientCard',
        ]
        const _params = Object.assign({}, params)
        keys.forEach(item => (_params[item] = ''))
        if (_params.key) {
          _params[_params.key] = _params.keyword
        }
        delete _params.key
        delete _params.keyword
        delete _params['undefined']
        return business.disposeWebList(_params)
      },
    }),
  ],
  data() {
    return {
      query: {
        key: 'documentId', // 关键字的key
        keyword: '', // 关键字
        token: '', //token
        timeType: 1, // 时间类型 1创建时间 2预约执行时间
        startTime: '', //开始时间，示例20200101123030
        endTime: '', //结束时间，示例20200303122222
        type: '', //处置单类型 EXAMINE("检查"),LAB("检验"),CURE("治疗")
        doctorType: '', //类型 (1:草稿 2:未缴费 3:已缴费 4:已失效)
        documentId: '', //单据号
        name: '', //处置单名称
        patientName: '', //就诊人姓名
        patientCard: '', //就诊人卡号
        orderId: '', //订单号
        deptName: '', //执行科室名称
        currentNum: 1, //当前页码
        pageSize: 10, //每页数量
        field: 'create_time', //排序字段
        sorted: 'DESC', //排序方向
        webType: '', //webType：1.草稿 2.未缴费 3.已缴费 4.已退费 5.已作废
      },
      filter: {
        date: {
          props: {
            options: [
              { label: '创建时间', value: 1 },
              { label: '预约执行时间', value: 2 },
            ],
          },
          keys: ['timeType'],
        },
        search: {
          props: {
            options: [
              // 单据号/名称/患者姓名/就诊卡号/关联订单号
              { label: '单据号', value: 'documentId' },
              { label: '名称', value: 'name' },
              { label: '患者姓名', value: 'patientName' },
              { label: '就诊卡号', value: 'patientCard' },
              { label: '关联订单号', value: 'orderId' },
            ],
          },
          keys: ['key', 'keyword'],
        },
        popover: [
          //处置单类型 EXAMINE("检查"),LAB("检验"),CURE("治疗")
          {
            props: {
              label: '类型',
              options: [
                { label: '不限', value: '' },
                { label: '检查', value: 'EXAMINE' },
                { label: '检验', value: 'LAB' },
                // { label: '治疗', value: 'CURE' },
              ],
            },
            keys: ['type'],
          },
          // 执行科室：不限/科室
          {
            props: {
              label: '执行科室',
              is: 'el-input',
            },
            keys: ['deptName'],
          },
          // 单据状态：不限/草稿/未缴费/已缴费/已退费/已作废
          {
            props: {
              label: '单据状态',
              options: [
                { label: '不限', value: '' },
                { label: '草稿', value: 1 },
                { label: '未缴费', value: 2 },
                { label: '已缴费', value: 3 },
                { label: '已退费', value: 4 },
                { label: '已作废', value: 5 },
              ],
            },
            keys: ['webType'],
          },
        ],
      },
      item: null,
      bizInfo: {},
      activeIndex: 0, // 当前激活项索引
      popoverShow: false,
    }
  },
  methods: {
    typeFilter(row, column, cellValue) {
      const Type = {
        LAB: '检验',
        EXAMINE: '检查',
        CURE: '治疗',
      }
      return Type[cellValue] || '--'
    },
    priceFilter(row, column, cellValue) {
      return cellValue ? '¥ ' + cellValue : '--'
    },
    statusFilter(row) {
      const { status, payStatus } = row
      if (PayStatus.includes(payStatus)) {
        return Status[payStatus].text
      }
      if (status === 'DRAFT' || status === 'CANCELLATION') {
        return Status[status].text
      }
      return '--'
    },
    fetchDataHook() {
      if (this.activeIndex) {
        this.item = this.tableData.list[this.activeIndex]
      } else {
        this.item = null
      }
    },
    renderBtns(index, item) {
      const btns = [{ type: 1, text: '查看' }]
      const { status, payStatus } = item
      if (payStatus) {
        if (payStatus === 'NONPAID') {
          btns.push({ type: 3, text: '撤回' })
          btns.push({ type: 4, text: '作废' })
        }
      } else {
        if (status === 'DRAFT') {
          btns.shift()
          btns.push({ type: 2, text: '编辑', className: 'el-button--primary' })
          btns.push({ type: 7, text: '提交', className: 'el-button--primary' })
          btns.push({
            type: 5,
            text: '删除',
            className: 'del el-button--danger',
          })
        }
      }
      this.$slots['row-' + index] = (
        <div>
          {btns.map(it => (
            <el-button
              size="mini"
              class={it.className}
              type={index !== 'footer' ? 'text' : ''}
              onClick={() => this.rowClick(index, it.type)}
            >
              {it.text}
            </el-button>
          ))}
        </div>
      )
    },
    rowClick(index, type) {
      if (typeof index === 'number') {
        this.activeIndex = index
        this.bizInfo = {
          userId: this.tableData.list[index].userId,
          orderId: this.tableData.list[index].orderId,
          memberId: this.tableData.list[index].memberId,

          sessionId: this.tableData.list[index].sessionId,
          titleName: this.tableData.list[index].titleName,
          memberName: this.tableData.list[index].memberName,

          bizType: this.tableData.list[index].documentId[1],
          patientCard: this.tableData.list[index].patientCard,
        }
      }
      switch (type) {
        case 1: // 查看
        case 2: // 编辑
          this.item = this.tableData.list[index]
          break
        case 3: // 撤回
          this.$confirm('您确定要撤回该处置单？', '提示', {
            type: 'warning',
          })
            .then(() => {
              this.withdraw('DRAFT')
            })
            .catch(() => {})
          break
        case 4: // 作废
          this.$confirm('您确定要作废该处置单？', '提示', {
            type: 'warning',
          })
            .then(() => {
              this.withdraw('CANCELLATION')
            })
            .catch(() => {})
          break
        case 5: // 删除
          this.$confirm('您确定要删除该处置单？', '提示', {
            type: 'warning',
          })
            .then(() => {
              this.delTemp()
            })
            .catch(() => {})
          break
        case 7: // 提交
          this.$confirm('您确定要提交该处置单？', '提示', {
            type: 'warning',
          })
            .then(() => {
              this.submit()
            })
            .catch(() => {})
      }
    },
    customEventHandler({ type }) {
      switch (type) {
        case 'del':
          this.activeIndex = ''
          break
        case 'update':
          break
      }
      this.$_fetchTableData()
    },
    // validate
    validate() {
      const data = this.structure()
      if (!data.name) return '项目名称不能为空！'
      if (!data.name) return '项目名称不能为空！'
      switch (data.type) {
        case 'LAB': {
          if (!data.specimenPartName.length) return '检验标本不能为空！'
          break
        }
        case 'EXAMINE':
          if (!data.methodName) return '检查方法不能为空！'
          if (!data.specimenPartName.length) return '检查部位不能为空！'
          break
        case 'CURE':
          if (!data.treatmentName) return '治疗名称不能为空！'
          if (!data.frequencyId) return '治疗疗程不能为空！'
          break
      }
      if (!data.execDeptName) return '执行科室不能为空！'
      if (!data.start || !data.end) return '预约执行时间不能为空'
      return data
    },
    // submit && save data
    structure() {
      let row = cloneDeep(this.tableData.list[this.activeIndex])
      row.start = row.start || row.startTime
      let list = cloneDeep(row.dictDisList)
      row.anxious = String(row.anxious)
      row.end = row.end || row.endTime
      delete row.dictDisList
      delete row.startTime
      delete row.endTime
      if (row.end) row.end = dayjs(row.end).format('YYYYMMDDHHmmss')
      if (row.start) row.start = dayjs(row.start).format('YYYYMMDDHHmmss')
      const data = {
        id: row.id,
        end: row.end,
        type: row.type,
        start: row.end,
        price: row.price,
        remark: row.remark,
        status: row.status,
        userId: row.userId,
        anxious: row.anxious,
        orderId: row.orderId,
        memberId: row.memberId,
        doctorTitle: row.titleName,
        patientName: row.memberName,
        patientCard: row.patientCard,
        // list
        methodName: list[0].methodName,
        execDeptName: list[0].execDeptName,
        name: list.map(item => item.itemName).join(),
        dictDisposeId: list.map(item => item.id).join(),
        specimenPartName: list.map(item => item.specimenPartName).join(),
      }
      return data
    },
    // 提交
    async submit() {
      let loading
      try {
        let data = this.validate()
        if (typeof data === 'string') {
          this.$confirm(`${data},是否进行编辑？`, '提示', {
            type: 'warning',
          })
            .then(() => {
              this.item = this.tableData.list[this.activeIndex]
            })
            .catch(() => {})
          return
        }
        loading = this.$loading({
          background: 'rgba(255,255,255,.6)',
        })
        const id = this.tableData.list[this.activeIndex].id
        await business.doctorUpdateDetail({ ...data, status: 'SUBMITTED' })
        if (this.item && this.item.id === id) this.$refs.handle.init()
        this.$set(this.tableData.list[this.activeIndex], 'status', 'SUBMITTED')
        this.$message.success('操作成功！')
        this.$_fetchTableData()
        loading.close()
      } catch (e) {
        loading?.close()
        console.log(e, '错误信息')
        const reg = new RegExp('CA-SIGN-ERROR')
        if (reg.test(e)) {
          this.$refs.qrcode.open() //打开二维码
        }
      }
    },
    // 删除
    async delTemp() {
      const loading = this.$loading({
        background: 'rgba(255,255,255,.6)',
      })
      try {
        const id = this.tableData.list[this.activeIndex].id
        await business.doctorBatchOpera({
          batchOperaType: 1,
          ids: [id],
        })
        if (this.item && this.item.id === id) this.item = null
        this.$message.success('操作成功！')
        this.$_fetchTableData()
        loading.close()
      } catch (e) {
        console.log(e)
        loading.close()
      }
    },
    // operatorHandler [撤回：DRAFT 作废：CANCELLATION]
    async withdraw(type) {
      const loading = this.$loading({
        background: 'rgba(255, 255, 255, .6)',
      })
      try {
        const id = this.tableData.list[this.activeIndex].id
        await business.doctorUpdateStatus({
          status: type,
          id: id,
        })
        if (this.item && this.item.id === id) this.$refs.handle.init()
        this.$set(this.tableData.list[this.activeIndex], 'status', type)
        this.$message.success('操作成功！')
        this.$_fetchTableData()
        loading.close()
      } catch (e) {
        console.log(e)
        loading.close()
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.view__card {
  overflow: hidden;
  height: calc(100vh - 40px - 5px);
}
.edit_box {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #e5e5e5;
}
.del {
  color: #f74a4a;
  &:hover {
    color: #fa838f;
  }
}
.el-button--mini {
  font-size: 14px;
}
.hide-filter {
  .c__filter {
    display: none;
  }
}
</style>
