<template>
  <section class="view__card" v-loading="loading">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:fixed="{ row }">
        <router-link
          class="el-button el-button--text el-button--mini"
          :to="`detail/${row.orderId}`"
        >
          查看
        </router-link>
      </template>
    </List>
  </section>
</template>

<script>
import { currency } from '@/filters'
import { List, mixin } from '@/components'
import { OrderDoctorWebList } from '@/api/business'

export default {
  name: 'business_order',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: OrderDoctorWebList })],
  data() {
    return {
      query: {
        pageSize: 10,
        timeType: 0,
        searchType: 0,
        field: 'create_time',
        sorted: 'desc',
      },

      columns: {
        index: {
          hidden: true,
        },
        bizType: {
          formatter(row) {
            return row.bizType === 'CONSULT'
              ? '在线咨询'
              : row.bizType === 'REPEAT_CLINIC'
              ? '在线复诊'
              : row.bizType === 'CARRYON_PRESC'
              ? '慢病续方'
              : ''
          },
          minWidth: 100,
        },
        wayType: {
          formatter(row) {
            return row.wayType === 'GRAPHIC'
              ? '图文'
              : row.wayType === 'VIDEO'
              ? '视频'
              : row.wayType === 'PHONE'
              ? '电话'
              : ''
          },
          minWidth: 100,
        },
        age: {
          formatter(row) {
            return row.age + '岁'
          },
        },
        deptName: { hidden: true },
        titleName: { hidden: true },
        doctorName: { hidden: true },
        memberName: { minWidth: 100 },
        payFee: {
          formatter(row) {
            return currency(row.payFee, '¥', 2)
          },
          minWidth: 100,
        },
        orderStatus: {
          formatter(row) {
            return row.orderStatus === 'UNPAID'
              ? '待付款'
              : row.orderStatus === 'PAID'
              ? '已支付'
              : row.orderStatus === 'WAIT_TREAT'
              ? '待接诊'
              : row.orderStatus === 'IN_TREAT'
              ? '接诊中'
              : row.orderStatus === 'WAIT_TAKE'
              ? '待自提'
              : row.orderStatus === 'WAIT_SEND'
              ? '待发货'
              : row.orderStatus === 'WAIT_RECEIVE'
              ? '待收货'
              : row.orderStatus === 'TO_EVALUATE'
              ? '待评价'
              : row.orderStatus === 'IN_AFTER_SALE'
              ? '售后中'
              : row.orderStatus === 'FINISHED'
              ? '已完成'
              : row.orderStatus === 'CLOSED'
              ? '已关闭'
              : ''
          },
          minWidth: 100,
        },
        createTime: {
          minWidth: 160,
        },
        op: {
          hidden: true,
        },
      },
    }
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [
              { label: '创建时间', value: 0 },
              { label: '支付时间', value: 1 },
            ],
          },
          keys: ['timeType'],
        },
        search: {
          props: {
            options: [
              { label: '订单号', value: 0 },
              { label: '患者姓名', value: 1 },
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
                // { label: '已支付', value: 'PAID' },
                { label: '待接诊', value: 'WAIT_TREAT' },
                { label: '接诊中', value: 'IN_TREAT' },
                // { label: '待自提', value: 'WAIT_TAKE' },
                // { label: '待发货', value: 'WAIT_SEND' },
                // { label: '待收货', value: 'WAIT_RECEIVE' },
                { label: '待评价', value: 'TO_EVALUATE' },
                { label: '已完成', value: 'FINISHED' },
                { label: '已关闭', value: 'CLOSED' },
              ],
            },
            keys: 'orderStatus',
          },
        ],
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.el-button--mini {
  font-size: 14px;
}
</style>
