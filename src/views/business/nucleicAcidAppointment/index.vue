<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:fixed="{ row }">
        <router-link
          class="el-button el-button--text"
          :to="{
            path: '/reconciliation/nucleicacid_appointment/detail',
            query: { userId: row.id },
          }"
        >
          流调表
        </router-link>
      </template>
    </List>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { getWebRegList } from '@/api/business'

const getPayWay = {
  ICBC_PAY: '微信支付',
  ALI_PAY: '支付宝支付',
}
export default {
  name: 'reconciliation_nucleicacidAppointment',
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: getWebRegList }])],
  data() {
    this.filter = {
      date: {
        props: {
          options: [
            { label: '支付时间', value: 0 },
            { label: '预约时间', value: 1 },
          ],
        },
        keys: ['timeType', 'startTime', 'endTime'],
      },
      search: {
        props: {
          options: [
            { label: '预约人姓名', value: 0 },
            { label: '电话', value: 1 },
            { label: '身份证号', value: 2 },
            { label: '支付人', value: 3 },
          ],
        },
        keys: ['searchType', 'searchKeywords'],
      },
      popover: [
        {
          props: {
            label: '支付方式',
            options: [
              { label: '不限', value: '' },
              { label: '微信支付', value: 'ICBC_PAY' },
              { label: '支付宝支付', value: 'ALI_PAY' },
            ],
          },
          keys: 'payWay',
        },
      ],
    }
    return {
      query: {
        timeType: 0,
        searchType: 0,
        currentNum: 1,
        pageSize: 10,
        field: 'payTime',
      },
      columns: {
        index: {
          hidden: true,
        },
        name: {
          minWidth: 90,
        },
        phone: {
          minWidth: 120,
        },
        idCard: {
          minWidth: 180,
        },
        orderItem: {
          minWidth: 200,
        },
        rangeTime: {
          minWidth: 220,
        },
        price: {
          minWidth: 60,
          formatter(row) {
            return '¥' + row.price
          },
        },
        payWay: {
          formatter: (row, col, cell) => {
            return getPayWay[cell]
          },
          minWidth: 80,
        },
        payTime: {
          minWidth: 180,
        },
        fixed: {
          minWidth: 70,
        },
      },
    }
  },
}
</script>

<style lang="scss" scoped></style>
