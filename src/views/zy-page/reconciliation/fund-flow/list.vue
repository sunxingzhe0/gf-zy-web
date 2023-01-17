<template>
  <section class="view__card">
    <List
      :treeSet="{}"
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_payPrice="{ row }">
        <div><span>￥</span>{{ row.payPrice }}</div>
      </template>
      <template v-slot:slot_timeSize="{ row }">
        <el-popover
          width="400"
          trigger="hover"
          placement="right"
          v-if="row.timeSize > 0"
        >
          <div>
            <div v-for="(item, index) in row.timeList" :key="index">
              {{ index + 1 }}.{{ `${item.startTime}~${item.endTime}` }}
            </div>
          </div>
          <el-button slot="reference" type="text">{{ row.timeSize }}</el-button>
        </el-popover>
        <el-button v-else type="text">{{ row.timeSize }}</el-button>
      </template>
      <template v-slot:fixed="{ row, $index }">
        <template v-if="row.dataType === 'all'">
          <el-button type="text" @click="goDetail(row)"> 明细 </el-button>
          <el-button type="text" @click="toggleExpand($index)">
            {{ row.expand ? '收起' : '展开' }}</el-button
          >
        </template>
      </template>
      <template v-slot:footertool>
        <el-button @click="exportFoundFlow">导出</el-button>
      </template>
    </List>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { List, mixin } from '@/components'
// import { deptChooseList } from '@/api/index'
// import { orderItems } from '@/api/zyapi/payment'
import { foundFlow, exportFoundFlow } from '@/api/zyapi/statistics'
// const pre = {
//   dept: [],
//   noType: [],
//   extends: [], // 展开的交易日期
// }
export default {
  name: 'TableList',
  components: {
    List,
  },
  mixins: [
    mixin({
      fetchListFunction: async params => {
        const list = []
        const res = await foundFlow(params)
        res.list.forEach(item => {
          item.expand = false
          item.dataType = 'all'
          item.billDate = item.billDate.substring(0, 10)
          item.tradeDate = item.billDate
          list.push(item)
          const details = JSON.parse(item.context)
          details.forEach(_item => {
            _item.dataType = 'detail'
            list.push(_item)
          })
        })
        res.list = list
        // 排序
        // res.list.sort((a, b) => {
        //   return new Date(b.billDate) - new Date(a.billDate)
        // })
        return res
      },
    }),
  ],
  data() {
    return {
      query: {
        pageSize: 10,
        currentNum: 1,
        timeType: 0,
        searchType: 0,
        startTime: dayjs().subtract(30, 'day').format('YYYYMMDD'),
        endTime: dayjs().format('YYYYMMDD'),
        searchKeywords: '', //模糊查询内容
        field: 'bill_date',
        sorted: 'DESC', //排序方向
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
        // search: {
        //   props: {
        //     options: [{ label: '患者姓名', value: 0 }],
        //   },
        //   keys: ['searchType', 'searchKeywords'],
        // },
        // popover: [
        //   {
        //     props: {
        //       label: '费用类型',
        //       options: [
        //         { label: '不限', value: '' },
        //         ...pre.noType.map(_ => ({ label: _.name, value: _.id })),
        //       ],
        //     },
        //     keys: 'feeType',
        //   },
        // ],
      },
      columns: {
        billDate: {
          minWidth: 100,
          formatter(row) {
            return row.dataType === 'all' ? row.billDate || '-' : ''
          },
        },
        payType: {
          minWidth: 120,
          formatter(row) {
            return row.payType || '-'
          },
        },
        tradeDate: {
          minWidth: 160,
          formatter(row) {
            return row.dataType === 'all' ? '-' : row.tradeDate || '-'
          },
        },
        payWay: {
          minWidth: 120,
        },
        payCount: {
          minWidth: 120,
        },
        refundCount: {
          minWidth: 120,
        },
        tradeAmount: {
          minWidth: 120,
          formatter(row) {
            return `￥${row.tradeAmount}`
          },
        },
        actualAmount: {
          minWidth: 120,
          formatter(row) {
            return `￥${row.actualAmount}`
          },
        },
        fixed: {
          minWidth: 120,
        },
      },
      extpands: [],
    }
  },
  methods: {
    goDetail(item) {
      this.$router.push({
        path: '/checkBill/fund-flow/detail',
        query: {
          tradeDate: item.billDate,
        },
      })
    },
    toggleExpand(index) {
      const item = this.tableData.list[index]
      item.expand = !item.expand
      if (item.expand) {
        this.extpands.push(item.tradeDate)
      } else {
        this.extpands = this.extpands.filter(it => it != item.tradeDate)
      }
      this.$set(this.tableData.list, index, item)
    },
    exportFoundFlow() {
      exportFoundFlow(this.query)
    },
    $_resolveRowClassName({ row }) {
      if (row.dataType === 'detail') {
        return this.extpands.includes(row.tradeDate) ? '' : 'hide'
      }
      return ''
    },
  },
  // async beforeRouteEnter(to, from, next) {
  //   ;[pre.dept, pre.noType] = await Promise.all([
  //     deptChooseList({ tree: false }),
  //     orderItems(),
  //   ])
  //   next()
  // },
}
</script>
<style lang="scss" scoped>
/deep/ .hide {
  display: none;
}
::v-deep .table-wrap .cell:empty::before {
  content: '';
}
</style>
