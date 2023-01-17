<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:footertool>
        <el-button @click="zfbExportDetail">导出</el-button>
        <div
          style="
            display: inline-block;
            font-size: 14px;
            position: relative;
            top: 8px;
            line-height: 18px;
            margin-left: 20px;
          "
        >
          <span>
            交易合计：<span>{{ totalData.payCount }}</span
            >笔，商家实收共<span>{{ totalData.outTotalAmount }}</span
            >元，商家优惠共<span>{{ totalData.outDiscountsAmount }}</span
            >元
          </span>
          <br />
          <span
            >退款合计：<span>{{ totalData.refundCount }}</span
            >笔，商家实收退款共<span>{{ totalData.outRefundTotalAmount }}</span
            >元，商家优惠退款共<span>{{
              totalData.outRefundDiscountsAmount
            }}</span
            >元</span
          >
        </div>
      </template>
    </List>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { List, mixin } from '@/components'
import {
  zfbDetailList,
  zfbExportDetail,
  zfbDetailTotal,
} from '@/api/zyapi/statistics'
export default {
  name: 'zfbEdit',
  components: {
    List,
  },

  mixins: [mixin({ fetchListFunction: zfbDetailList })],

  created() {
    const billDate = this.$route.query.billDate
    const date = dayjs(billDate, 'YYYY-MM-DD')
    this.query = Object.assign(this.query, {
      startTime: date.format('YYYYMMDD000000'),
      endTime: date.format('YYYYMMDD235959'),
    })
    this.zfbDetailTotal(this.query)
  },
  data() {
    return {
      totalData: {},
      query: {
        pageSize: 10,
        currentNum: 1,
        timeType: 0,
        searchType: 0,
        // startTime: dayjs().subtract(30, 'day').format('YYYYMMDD'),
        // endTime: dayjs().format('YYYYMMDD'),
        startTime: '',
        endTime: '',
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
            options: [
              { label: '支付宝交易号', value: 0 },
              { label: '商户订单号', value: 1 },
              { label: '商品名称', value: 2 },
              { label: '门店编号', value: 3 },
              { label: '门店名称', value: 4 },
              { label: '退款批次号', value: 5 },
            ],
            placeholder: '请输入',
          },
          keys: ['searchType', 'searchKeywords'],
        },
      },
      columns: {
        index: { hidden: true },
        tradeNo: { minWidth: 200 },
        outTradeNo: { minWidth: 200 },
        goodsName: { minWidth: 200 },
        tradeCreateTime: { minWidth: 200 },
        tradeFinishTime: { minWidth: 200 },
        storeId: {
          minWidth: 120,
          formatter(row) {
            return row.storeId || '-'
          },
        },
        storeName: {
          minWidth: 120,
          formatter(row) {
            return row.storeName || '-'
          },
        },
        terminalId: { minWidth: 120 },
        transNo: { minWidth: 140 },
        totalAmount: { minWidth: 120 },
        outTotalAmount: { minWidth: 120 },
        alipayRedAmount: { minWidth: 140 },
        pointAmount: { minWidth: 120 },
        couponAmount: { minWidth: 140 },
        alipayDiscountsAmount: { minWidth: 140 },
        outDiscountsAmount: { minWidth: 120 },
        outRedAmount: { minWidth: 180 },
        cardAmount: { minWidth: 140 },
        refundNo: { minWidth: 140 },
        coverChargeAmount: { minWidth: 140 },
        shareBenefitAmount: { minWidth: 140 },
      },
    }
  },

  mounted() {
    this.$EventBus.$on('currentNumChange', data => {
      this.zfbDetailTotal(data)
    })
  },
  methods: {
    //导出
    zfbExportDetail(params) {
      zfbExportDetail(params)
    },
    //统计
    async zfbDetailTotal() {
      this.totalData = await zfbDetailTotal(this.query)
    },
  },
}
</script>
<style lang="scss" scoped></style>
