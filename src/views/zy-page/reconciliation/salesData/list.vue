<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      has-export
      @handleCommand="handleCommand"
    >
      <template v-slot:slot_payPrice="{ row }">
        <div><span>￥</span>{{ row.payPrice }}</div>
      </template>
      <template v-slot:slot_timeSize="{ row }">
        <el-popover
          placement="right"
          width="400"
          trigger="hover"
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
      <template v-slot:footertool>
        <!-- <el-button type="primary" @click="toQuery"> 对账 </el-button> -->
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
            合计缴纳金额：￥{{ parseFloat(feeAll.totalFee).toFixed(2) }} </span
          ><br />
          <span>
            合计退费：￥{{ parseFloat(feeAll.refundFee).toFixed(2) }}
          </span>
          <br />
          <span>
            合计实缴金额：￥{{ parseFloat(feeAll.amount).toFixed(2) }}
          </span>
        </div>
      </template>
      <!-- <template v-slot:fixed="{ row }">
        <el-button type="text" @click="goto('detail', row.id, row.docId)">查看</el-button>
      </template> -->
    </List>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { orderItems } from '@/api/zyapi/payment'
import { sellData, exportSellData, feeCount } from '@/api/zyapi/statistics'
import { deptChooseList } from '@/api/index'
import dayjs from 'dayjs'
const pre = {
  dept: [],
  noType: [],
}
export default {
  name: 'checkBill_salesData',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: sellData })],
  data() {
    return {
      query: {
        pageSize: 10,
        currentNum: 1,
        timeType: 0,
        searchType: 0,
        startTime: dayjs().subtract(2, 'day').format('YYYYMMDD') + '000000',
        endTime: dayjs().format('YYYYMMDD') + '235959',
      },
      feeAll: {},
    }
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [{ label: '交易时间', value: 0 }],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '患者姓名', value: 0 },
              { label: '支付流水号', value: 1 },
              { label: '就诊卡号', value: 2 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '费用类型',
              options: [
                { label: '不限', value: '' },
                ...pre.noType.map(_ => ({ label: _.name, value: _.id })),
              ],
            },
            keys: 'feeType',
          },
          {
            props: {
              label: '交易状态',
              options: [
                { label: '不限', value: '' },
                { label: '付款', value: 1 },
                { label: '退款', value: 0 },
              ],
            },
            keys: 'orderState',
          },
        ],
      }
    },
    columns() {
      return {
        payTime: {
          minWidth: 160,
        },
        opt: {
          hidden: true,
        },
        index: {
          hidden: true,
        },
        docName: {
          hidden: true,
        },
        titleName: {
          hidden: true,
        },
        hospital: {
          hidden: true,
        },
        deptName: {
          minWidth: 100,
        },
        orderRange: {
          minWidth: 160,
        },
        createDate: {
          minWidth: 160,
        },
        visitNo: {
          minWidth: 100,
        },
        payPrice: {
          formatter(row) {
            return `￥${row.payPrice}`
          },
          minWidth: 120,
          prop: 'slot_payPrice',
        },
        feeType: { minWidth: 100 },
        patientName: { minWidth: 100 },
        cardNo: { minWidth: 100 },
        payWay: { minWidth: 100 },
        payState: {
          minWidth: 100,
          formatter(row) {
            switch (row.payState) {
              case '已支付':
                return '已付款'
              case '已退款':
                return '已退费'
              default:
                return row.payState
            }
          },
        },
      }
    },
  },
  async beforeRouteEnter(to, from, next) {
    ;[pre.dept, pre.noType] = await Promise.all([
      deptChooseList({ tree: false }),
      orderItems(),
    ])
    next()
  },
  created() {
    this.getfeeCount()
  },
  watch: {
    query() {
      this.getfeeCount()
    },
  },
  methods: {
    //对账
    toQuery() {
      this.$router.push('/reconciliation/salesData/query')
    },
    async getfeeCount() {
      let res = await feeCount(this.query)
      if (res) {
        this.feeAll = res
      }
    },
    handleCommand(command) {
      console.log(command)
      let selecData = this.tableData.multipleSelection
      if (selecData.length == 0 && command != 'query') {
        this.$message({
          type: 'warning',
          message: '请选择需要操作的数据',
        })
        return false
      }
      let ids = []
      selecData.forEach(i => {
        ids.push({ id: i.id })
      })
      if (command == 'query') {
        exportSellData(this.query)
      }
      if (command == 'selection') {
        let select = []
        ids.forEach(i => [select.push(i.id)])

        exportSellData({ ids: select })
      }
    },
    goto(type, id, docId) {
      this.$router.push(
        `/shift/doctor-rules/${type}?id=${id}${docId ? '&docId=' + docId : ''}`,
      )
    },
  },
}
</script>
<style lang="scss" scoped></style>
