<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_payPrice="{ row }">
        <div><span>￥</span>{{ row.payPrice }}</div>
      </template>
      <template v-slot:footertool>
        <el-button @click="exportFoundFlowDetail">导出</el-button>
      </template>
    </List>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { List, mixin } from '@/components'
import { deptChooseList } from '@/api/index'
import { orderItems } from '@/api/zyapi/payment'
import { foundFlowDetail, exportFoundFlowDetail } from '@/api/zyapi/statistics'
const pre = {
  dept: [],
  noType: [],
}
export default {
  name: 'TableList',
  components: {
    List,
  },

  mixins: [
    mixin({
      fetchListFunction: async params => {
        const res = await foundFlowDetail(params)
        console.log(res, '=1')
        return res
      },
    }),
  ],

  created() {
    const tradeDate = this.$route.query.tradeDate
    const date = dayjs(tradeDate, 'YYYY-MM-DD')
    this.query = Object.assign(this.query, {
      startTime: date.format('YYYYMMDD000000'),
      endTime: date.format('YYYYMMDD235959'),
    })
  },
  data() {
    return {
      query: {
        pageSize: 10,
        currentNum: 1,
        timeType: 0,
        searchType: 0,
        startTime: dayjs().subtract(2, 'day').format('YYYYMMDD'),
        endTime: dayjs().format('YYYYMMDD'),
      },
      filter: {
        date: {
          props: {
            options: [{ label: '查询日期', value: 0 }],
            format: 'yyyy-MM-dd',
            type: 'daterange',
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [{ label: '关键字', value: 0 }],
            placeholder: '商户订单号/第三方订单号/工行订单号/关联订单号',
          },
          keys: ['searchType', 'searchKeywords'],
        },
      },
      columns: {
        index: { hidden: true },
        billDate: { width: 240 },
        bankTrxNo: { width: 300 },
        wxNo: { width: 160 },
        aliNo: { width: 300 },
        onOffMark: { width: 160 },
        tradeDate: { width: 160 },
        tradeTime: { width: 120 },
        outTradeNo: { width: 300 },
        thirdOrderNo: { width: 300 },
        relOutTradeNo: { width: 300 },
        orderAmount: {
          width: 120,
          formatter(row) {
            return `￥${row.orderAmount}`
          },
        },
        tradeAmount: {
          width: 120,
          formatter(row) {
            return `￥${row.tradeAmount}`
          },
        },
        billAmount: {
          width: 120,
          formatter(row) {
            return `￥${row.billAmount}`
          },
        },
        payCardNo: { width: 240 },
        payBankName: { width: 160 },
        debitCredit: { width: 120 },
        buyerId: { width: 300 },
        productName: { width: 300 },
      },
    }
  },
  methods: {
    exportFoundFlowDetail() {
      exportFoundFlowDetail(this.query)
    },
  },
  async beforeRouteEnter(to, from, next) {
    ;[pre.dept, pre.noType] = await Promise.all([
      deptChooseList({ tree: false }),
      orderItems(),
    ])
    next()
  },
}
</script>
<style lang="scss" scoped></style>
