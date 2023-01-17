<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_payFee="{ row }"> ¥{{ row.payFee }} </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="info(row.orderId)"> 查看 </el-button>
      </template>
    </List>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import { getRpList } from '@/api/order'
import {
  roleChooseList,
  deptOuterChooseList,
  drugStoreChooseList,
  titleChooseList,
} from '@/api'
const serviceModeMap = {
  GRAPHIC: '图文',
  VIDEO: '视频',
  PHONE: '电话',
}
const serviceTypeMap = {
  CONSULT: '在线资讯',
  REPEAT_CLINIC: '在线复诊',
  CARRYON_PRESC: '慢病续方',
}
const statusMap = {
  UNPAID: '待付款',
  PAID: '已支付',
  WAIT_TREAT: '待接诊',
  IN_TREAT: '接诊中',
  WAIT_TAKE: '待自提',
  WAIT_SEND: '待发货',
  WAIT_RECEIVE: '待收货',
  TO_EVALUATE: '待评价',
  IN_AFTER_SALE: '售后中',
  FINISHED: '已完成',
  CLOSED: '已关闭',
}
const expressModeMap = {
  0: '自提',
  1: '邮寄',
}
const pre = {
  role: [],
  dept: [],
  store: [],
  title: [],
}
export default {
  name: 'order_prescriptionOrder',
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: getRpList }])],
  data() {
    this.filter = {
      date: {
        props: {
          options: [
            { label: '创建时间', value: 0 },
            { label: '发货时间', value: 1 },
            { label: '自提时间', value: 2 },
          ],
        },
        keys: ['timeType', 'startTime', 'endTime'],
      },
      search: {
        props: {
          options: [
            { label: '订单号', value: 0 },
            { label: '患者姓名', value: 1 },
            { label: '开立医师', value: 2 },
          ],
        },
        keys: ['searchType', 'searchKeywords'],
      },
      popover: [
        {
          props: {
            label: '业务类型',
            options: [
              { label: '不限', value: '' },
              { label: '在线复诊', value: 'REPEAT_CLINIC' },
              { label: '慢病续方', value: 'CARRYON_PRESC' },
            ],
          },
          keys: 'bizType',
        },
        {
          props: {
            label: '业务形式',
            options: [
              { label: '不限', value: '' },
              { label: '图文', value: 'GRAPHIC' },
              { label: '视频', value: 'VIDEO' },
            ],
          },
          keys: 'wayType',
        },
        {
          props: {
            label: '职称',
            options: [
              { label: '不限', value: '' },
              ...pre.title.map(_ => ({ label: _.name, value: _.id })),
            ],
          },
          keys: 'titleId',
        },
        {
          props: {
            label: '科室',
            options: [
              { label: '不限', value: '' },
              ...pre.dept.map(_ => ({ label: _.name, value: _.id })),
            ],
          },
          keys: 'deptId',
        },
        {
          props: {
            label: '患者性别',
            options: [
              { label: '不限', value: '' },
              { label: '男', value: 1 },
              { label: '女', value: 0 },
            ],
          },
          keys: 'sex',
        },
        {
          props: {
            label: '患者年龄',
            is: 'InputRange',
          },
          keys: ['startAge', 'endAge'],
        },
        {
          props: {
            label: '关联处方',
            is: 'InputRange',
          },
          keys: ['startRpNumber', 'endRpNumber'],
        },
        {
          props: {
            label: '药品数量',
            is: 'InputRange',
          },
          keys: ['startDrugNumber', 'endDrugNumber'],
        },
        {
          props: {
            label: '订单金额',
            is: 'InputRange',
          },
          keys: ['startPayFee', 'endPayFee'],
        },
        {
          props: {
            label: '物流类型',
            options: [
              { label: '不限', value: '' },
              { label: '自提', value: 0 },
              { label: '邮寄', value: 1 },
            ],
          },
          keys: 'expressMode',
        },
        {
          props: {
            label: '接收方',
            options: [
              { label: '不限', value: '' },
              ...pre.store.map(_ => ({ label: _.name, value: _.id })),
            ],
          },
          keys: 'pharmacyId',
        },
        {
          props: {
            label: '订单状态',
            options: [
              { label: '不限', value: '' },
              { label: '待自提', value: 'WAIT_TAKE' },
              { label: '待发货', value: 'WAIT_SEND' },
              { label: '待收货', value: 'WAIT_RECEIVE' },
              { label: '已完成', value: 'FINISHED' },
              { label: '已关闭', value: 'CLOSED' },
            ],
          },
          keys: 'orderStatus',
        },
      ],
    }
    return {
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
        field: 'create_time',
        sorted: 'DESC',
      },
      columns: {
        index: {
          hidden: true,
        },
        createDate: {
          minWidth: 180,
        },
        fixed: {
          minWidth: 60,
        },
        rpNumber: { minWidth: 120 },
        drugNumber: { minWidth: 120 },
        doctorName: { minWidth: 120 },
        memberName: { minWidth: 120 },
        wayType: {
          formatter: (row, col, cell) => {
            return serviceModeMap[cell]
          },
          minWidth: 120,
        },
        bizType: {
          formatter: (row, col, cell) => {
            return serviceTypeMap[cell]
          },
          minWidth: 120,
        },
        orderStatus: {
          formatter: (row, col, cell) => {
            return statusMap[cell]
          },
          minWidth: 120,
        },
        expressMode: {
          formatter: (row, col, cell) => {
            return expressModeMap[cell]
          },
          minWidth: 120,
        },
        payFee: {
          prop: 'slot_payFee',
          minWidth: 120,
        },
        appointmentTime: { minWidth: 150 },
        createTime: {
          minWidth: 140,
        },
      },
      isFirstEnter: false,
    }
  },
  async beforeRouteEnter(to, from, next) {
    ;[pre.role, pre.dept, pre.store, pre.title] = await Promise.all([
      roleChooseList({ showUser: true }),
      deptOuterChooseList({ tree: false }),
      drugStoreChooseList(),
      titleChooseList(),
    ])
    next()
  },
  methods: {
    info(id) {
      let str = this.$route.fullPath.replace('list', 'detail')
      console.log(str)
      this.$router.push(`${str}/${id}`)
    },
  },
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
</style>
