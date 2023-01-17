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
        <router-link
          class="el-button el-button--text"
          :to="`/payment/appointment/detail?orderId=${row.orderId}&cardNo=${row.cardNo}&state=${row.state}`"
        >
          查看
        </router-link>
      </template>
    </List>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { orderTjPayList } from '@/api/zyapi/payment'
export default {
  name: 'payment_appointment',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: orderTjPayList })],
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
              { label: '预约时间', value: 2 },
            ],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '订单号', value: 0 },
              { label: '套餐名', value: 1 },
              { label: '体检人', value: 2 },
              { label: '就诊卡号', value: 3 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '数量',
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
                { label: '微信', value: 'WX' },
                { label: '支付宝', value: 'ALI_LITE' },
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
        regDate: {
          minWidth: 120,
        },
        packageName: {
          minWidth: 160,
        },
        opt: {
          hidden: true,
        },
        index: {
          hidden: true,
        },
        fixed: {
          minWidth: 80,
        },
        payFee: {
          formatter(row) {
            return `￥${row.payFee}`
          },
          minWidth: 100,
        },

        itemNum: { minWidth: 100 },
        cardNo: { minWidth: 100 },
        payWay: { minWidth: 100 },
        state: { minWidth: 100 },
      }
    },
  },
  methods: {
    goto(row) {
      this.$router.push(
        `/payment/appointment/detail?orderId=${row.orderId}&cardNo=${row.cardNo}&state=${row.state}`,
      )
    },
  },
}
</script>
