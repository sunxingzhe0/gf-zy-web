<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="info(row.orderId)">
          查看
        </el-button>
      </template>
      <template v-slot:slot_payFee="{ row }">
        <span>￥{{ row.payFee }}</span>
      </template>
      <!-- 业务类型 -->
      <template v-slot:slot_bizType="{ row }">
        <div v-if="row.bizType == 'CONSULT'">在线咨询</div>
        <div v-if="row.bizType == 'REPEAT_CLINIC'">在线复诊</div>
        <div v-if="row.bizType == 'CARRYON_PRESC'">慢病续方</div>
      </template>
      <!-- 业务形式 -->
      <template v-slot:slot_wayType="{ row }">
        <div v-if="row.wayType == 'GRAPHIC'">图文</div>
        <div v-if="row.wayType == 'VIDEO'">视频</div>
        <div v-if="row.wayType == 'PHONE'">电话</div>
      </template>
      <!-- 业务形式 -->
      <template v-slot:slot_orderStatus="{ row }">
        <div v-if="row.orderStatus == 'UNPAID'">待付款</div>
        <div v-if="row.orderStatus == 'PAID'">已支付</div>
        <div v-if="row.orderStatus == 'WAIT_TREAT'">待接诊</div>
        <div v-if="row.orderStatus == 'IN_TREAT'">接诊中</div>
        <div v-if="row.orderStatus == 'WAIT_TAKE'">待自提</div>
        <div v-if="row.orderStatus == 'WAIT_SEND'">待发货</div>
        <div v-if="row.orderStatus == 'WAIT_RECEIVE'">待收货</div>
        <div v-if="row.orderStatus == 'TO_EVALUATE'">待评价</div>
        <div v-if="row.orderStatus == 'IN_AFTER_SALE'">售后中</div>
        <div v-if="row.orderStatus == 'FINISHED'">已完成</div>
        <div v-if="row.orderStatus == 'CLOSED'">已关闭</div>
      </template>
    </List>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import { getBusOrderList } from '@/api/order'
import {
  roleChooseList,
  deptChooseList,
  drugStoreChooseList,
  titleChooseList,
} from '@/api'

const pre = {
  role: [],
  dept: [],
  store: [],
  title: [],
}
export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: getBusOrderList }])],
  data() {
    this.filter = {
      date: {
        props: {
          options: [
            { label: '创建时间', value: 0 },
            { label: '支付时间', value: 1 },
          ],
        },
        keys: ['timeType', 'startTime', 'endTime'],
      },
      search: {
        props: {
          options: [
            { label: '订单号', value: 0 },
            { label: '患者姓名', value: 1 },
            { label: '员工姓名', value: 2 },
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
              { label: '在线咨询', value: 'CONSULT' },
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
              { label: '电话', value: 'PHONE' },
            ],
          },
          keys: 'wayType',
        },
        {
          props: {
            label: '员工职称',
            options: [
              { label: '不限', value: '' },
              ...pre.title.map(_ => ({ label: _.name, value: _.id })),
            ],
          },
          keys: 'titleId',
        },
        {
          props: {
            label: '员工科室',
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
            label: '年龄',
            is: 'InputRange',
          },
          keys: ['startAge', 'endAge'],
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
            label: '订单状态',
            options: [
              { label: '不限', value: '' },
              { label: '待付款', value: 'UNPAID' },
              { label: '待接诊', value: 'WAIT_TREAT' },
              { label: '接诊中', value: 'IN_TREAT' },
              { label: '已支付', value: 'PAID' },
              { label: '待自提', value: 'WAIT_TAKE' },
              { label: '待发货', value: 'WAIT_SEND' },
              { label: '待收货', value: 'WAIT_RECEIVE' },
              { label: '待评价', value: 'TO_EVALUATE' },
              { label: '售后中', value: 'IN_AFTER_SALE' },
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
        sex: {
          hidden: true,
        },
        age: {
          hidden: true,
        },
        op: {
          hidden: true,
        },

        createTime: { minWidth: 120 },
        doctorName: { minWidth: 120 },
        memberName: { minWidth: 120 },

        bizType: {
          prop: 'slot_bizType',
          minWidth: 120,
        },
        wayType: {
          prop: 'slot_wayType',
          minWidth: 120,
        },
        orderStatus: {
          prop: 'slot_orderStatus',
          minWidth: 120,
        },
        payFee: {
          prop: 'slot_payFee',
          minWidth: 120,
        },
      },
    }
  },
  async beforeRouteEnter(to, from, next) {
    ;[pre.role, pre.dept, pre.store, pre.title] = await Promise.all([
      roleChooseList({ showUser: true }),
      deptChooseList({ tree: false }),
      drugStoreChooseList(),
      titleChooseList(),
    ])
    next()
  },
  methods: {
    info(id) {
      console.log(id)
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
