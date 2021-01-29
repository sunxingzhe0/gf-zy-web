<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :table-data="tableData"
    >
      <template v-slot:slot_timeSize="{ row }">
        <el-popover
          v-if="row.timeSize > 0"
          placement="right"
          width="400"
          trigger="hover"
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

      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="goto(row)">查看</el-button>
      </template>
    </List>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { tjFeeRecord } from '@/api/zyapi/payment'
export default {
  name: 'TableList',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: tjFeeRecord })],
  data() {
    return {
      query: {
        pageSize: 10,
        timeType: 0,
        searchType: 0,
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
              // { label: '预约时间', value: 2 },
            ],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '单据号', value: 0 },
              { label: '套餐名', value: 1 },
              { label: '体检人', value: 2 },
              { label: '就诊卡号', value: 3 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          // {
          //   props: {
          //     label: '数量',
          //     is: 'InputRange',
          //   },
          //   keys: ['beginNum', 'endNum'],
          // },
          {
            props: {
              label: '体检项目数',
              is: 'InputRange',
            },
            keys: ['beginNum', 'endNum'],
          },
          {
            props: {
              label: '缴纳金额',
              is: 'InputRange',
            },
            keys: ['beginFee', 'endFee'],
          },
          {
            props: {
              label: '支付方式',
              options: [
                { label: '不限', value: '' },
                // { label: '银联', value: 'UNION' },
                { label: '微信', value: 'WX' },
              ],
            },
            keys: 'payWay',
          },
          {
            props: {
              label: '单据状态',
              options: [
                { label: '不限', value: '' },
                { label: '已退费', value: 0 },
                { label: '已付款', value: 1 },
              ],
            },
            keys: 'payment',
          },
        ],
      }
    },
    columns() {
      return {
        createDate: {
          minWidth: 160,
        },
        opt: {
          hidden: true,
        },
        index: {
          hidden: true,
        },
        regDate: {
          minWidth: 160,
        },
        orderNo: {
          minWidth: 100,
        },
        fixed: {
          minWidth: 60,
        },
        totalFee: {
          formatter(row) {
            return `￥${row.totalFee}`
          },
        },
      }
    },
  },
  methods: {
    goto(row) {
      this.$router.push(
        `/payment/body/detail?checkupNo=${row.checkupNo}&patientId=${
          row.patientId
        }&type=${row.state == '已付款' ? 1 : row.state == '已退费' ? 2 : ''}`,
      )
    },
  },
}
</script>
