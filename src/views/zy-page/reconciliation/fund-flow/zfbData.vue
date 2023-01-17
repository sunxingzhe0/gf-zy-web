<template>
  <section class="view__card">
    <List
      :treeSet="{}"
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:footertool>
        <el-button @click="zfbExportData">导出</el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="goDetail(row)"> 明细 </el-button>
      </template>
    </List>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { List, mixin } from '@/components'
import { zfbTotalList, zfbExportData } from '@/api/zyapi/statistics'
export default {
  name: 'zfbData',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: zfbTotalList })],
  data() {
    return {
      query: {
        pageSize: 10,
        currentNum: 1,
        timeType: 0,
        searchType: 0,
        startTime: dayjs().subtract(30, 'day').format('YYYYMMDD000000'),
        endTime: dayjs().format('YYYYMMDD235959'),
        searchKeywords: '', //模糊查询内容
        // field: 'bill_date',
        // sorted: 'DESC', //排序方向
      },
      filter: {
        date: {
          props: {
            options: [{ label: '交易日期', value: 0 }],
            format: 'yyyy-MM-dd',
            type: 'daterange',
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
      },
      columns: {
        billDate: {
          minWidth: 120,
        },
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
        payCount: {
          minWidth: 120,
        },
        refundCount: {
          minWidth: 120,
        },
        tradeAmount: {
          minWidth: 120,
        },
        actualAmount: {
          minWidth: 120,
        },
        alipayDiscountsAmount: {
          minWidth: 140,
        },
        outDiscountsAmount: {
          minWidth: 120,
        },
        cardAmount: {
          minWidth: 140,
        },
        coverChargeAmount: {
          minWidth: 120,
        },
        shareBenefitAmount: {
          minWidth: 120,
        },
        netAmount: {
          minWidth: 120,
        },

        fixed: {
          minWidth: 120,
        },
      },
    }
  },
  mounted() {
    this.$EventBus.$on('changeTab', () => {
      this.$_fetchTableData()
    })
  },
  methods: {
    goDetail(item) {
      this.$router.push({
        path: '/checkBill/fund-flow/zfbDetail',
        query: {
          billDate: item.billDate,
        },
      })
    },
    zfbExportData() {
      zfbExportData(this.query)
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .table-wrap .cell:empty::before {
  content: '';
}
</style>
