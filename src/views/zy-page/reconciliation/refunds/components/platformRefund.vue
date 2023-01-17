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
    </List>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { List, mixin } from '@/components'

import { sellData, exportSellData } from '@/api/zyapi/statistics'
import { orderItems } from '@/api/zyapi/payment'

export default {
  name: 'checkBill_refund',
  components: {
    List,
  },
  mixins: [
    mixin({
      fetchListFunction: async params => {
        const res = await sellData({
          ...params,
          orderState: 0,
        })
        res.headers[11].fieldName = '单据状态'
        res.headers[12].fieldName = '支付时间'
        return res
      },
    }),
  ],
  data() {
    return {
      noType: [],
      query: {
        pageSize: 10,
        currentNum: 1,
        timeType: 0,
        searchType: 0,
        startTime: dayjs().subtract(2, 'day').format('YYYYMMDD') + '000000',
        endTime: dayjs().format('YYYYMMDD') + '235959',
      },

      columns: {
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
        payId: { width: 240 },
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
      },
    }
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [{ label: '支付时间', value: 0 }],
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
                ...this.noType.map(_ => ({ label: _.name, value: _.id })),
              ],
            },
            keys: 'feeType',
          },
        ],
      }
    },
  },
  created() {
    this.getNoTyes()
  },
  methods: {
    async getNoTyes() {
      this.noType = await orderItems({ tree: false })
      console.log('noType', this.noType)
    },
    handleCommand(command) {
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
  },
}
</script>
<style lang="scss" scoped></style>
