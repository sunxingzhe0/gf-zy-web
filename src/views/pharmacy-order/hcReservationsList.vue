<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:fixed="{ row }">
        <el-button @click="seeInfo(row)" type="text"> 详情 </el-button>
      </template>
      <template v-slot:footertool>
        <el-button @click="exportData">导出</el-button>
      </template>
    </List>
  </div>
</template>

<script>
import { queryReservation, exportExcel } from '@/api/mindConsult/order'
import { List, mixin } from '@/components'
import apiProjectSet from '@/api/mindConsult/projectSet'

let pre = {
  itemList: [],
  departments: [],
}
export default {
  name: 'order_hcReservations_list',
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: queryReservation }])],
  data() {
    this.filter = {
      date: {
        props: {
          options: [{ label: '预约时间', value: 0 }],
          format: 'yyyy-MM-dd',
          valueFormat: 'yyyy-MM-dd',
        },
        keys: ['timeType', 'reservationDateLow', 'reservationDateHigh'],
      },
      inline: [
        {
          props: {
            label: '关键字',
            is: 'el-input',
          },
          data: {
            attrs: {
              placeholder: '患者姓名/电话/就诊卡号/备注/预约单号',
            },
          },
          keys: 'keywords',
        },
        {
          props: {
            label: '项目',
            is: 'el-select',
            options: [{ label: '全部', value: '' }].concat(
              pre.itemList.map(_ => {
                return {
                  label: _.name,
                  value: _.id,
                  index: _.name,
                }
              }),
            ),
          },
          keys: 'activityType',
        },
        {
          props: {
            label: '状态',
            is: 'el-select',
            options: [
              { label: '全部', value: '' },
              { label: '已预约', value: 1 },
              { label: '已请假', value: 2 },
              { label: '请假中', value: 3 },
              { label: '已关闭', value: 4 },
            ],
          },
          keys: 'status',
        },
        {
          props: {
            label: '审批结果',
            is: 'el-select',
            options: [
              { label: '全部', value: '' },
              { label: '已同意', value: 1 },
              { label: '已拒绝', value: 2 },
            ],
          },
          keys: 'approvalResult',
        },
        {
          props: {
            label: '是否退费',
            is: 'el-select',
            options: [
              { label: '是', value: 1 },
              { label: '否', value: '' },
            ],
          },
          keys: 'type',
        },
        {
          props: {
            label: '科室名称',
            is: 'el-select',
            options: [{ label: '全部', value: '' }].concat(
              [...new Set(pre.departments.map(v => v.deptName))].map(_ => {
                return {
                  label: _,
                  value: _,
                }
              }),
            ),
          },
          keys: 'deptName',
        },
        {
          props: {
            label: '医生',
            is: 'el-input',
          },
          data: {
            attrs: {
              placeholder: '请输入',
            },
          },
          keys: 'doctor',
        },
      ],
    }
    return {
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        reservationDate: {
          minWidth: 160,
        },
        reservationDtime: {
          minWidth: 120,
        },
        payTime: {
          minWidth: 160,
        },
        status: {
          formatter(row) {
            const types = ['已预约', '已请假', '请假中', '已关闭']
            return types[row.status - 1] || ''
          },
        },
        payWay: {
          formatter(row) {
            return row.payWay === 'WX_JSAPI'
              ? '微信支付'
              : row.payWay === 'OFFLINE_PAY'
              ? '线下支付'
              : row.payWay
          },
        },
      },
    }
  },
  async beforeRouteEnter(to, from, next) {
    let res = await apiProjectSet.itemList({
      currentNum: 1,
      pageSize: 9999999,
    })
    pre.departments = await apiProjectSet.departments({})
    pre.itemList = res.list
    next()
  },
  methods: {
    seeInfo({ id }) {
      this.$router.push('/order/hcReservations/hcReservationsDetail?id=' + id)
    },
    async exportData() {
      await exportExcel(this.query)
    },
  },
}
</script>

<style lang="scss" scoped></style>
