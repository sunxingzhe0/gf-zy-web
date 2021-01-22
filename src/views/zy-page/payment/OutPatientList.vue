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
import { orderItems, mzRecordData } from '@/api/zyapi/payment'
import { deptChooseList } from '@/api/index'
const pre = {
  dept: [],
  noType: [],
}
export default {
  name: 'TableList',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: mzRecordData })],
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
            ],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '单据号', value: 0 },
              { label: '患者姓名', value: 1 },
              { label: '就诊卡号', value: 2 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '项目',
              options: [
                { label: '不限', value: '' },
                ...pre.noType.map(_ => ({ label: _.name, value: _.id })),
              ],
            },
            keys: 'orderItem',
          },

          {
            props: {
              label: '科室',
              options: [
                { label: '不限', value: '' },
                ...pre.dept.map(_ => ({ label: _.name, value: _.syncCode })),
              ],
            },
            keys: 'deptId',
          },
          {
            props: {
              label: '缴纳金额',
              is: 'InputRange',
            },
            keys: ['startFee', 'endFee'],
          },
          {
            props: {
              label: '支付方式',
              options: [
                { label: '不限', value: '' },
                { label: '银联', value: 'UNION' },
                { label: '微信', value: 'WX' },
              ],
            },
            keys: 'payment',
          },
          {
            props: {
              label: '单据状态',
              options: [
                { label: '不限', value: 0 },
                { label: '已付款', value: 1 },
                { label: '已退费', value: 2 },
              ],
            },
            keys: 'billState',
          },
        ],
      }
    },
    columns() {
      return {
        createTime: {
          minWidth: 160,
        },
        opt: {
          hidden: true,
        },
        index: {
          hidden: true,
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
  beforeRouteLeave(to, from, next) {
    if (to.path == '/payment/out-patient/detail') {
      from.meta.keepAlive = true
    } else {
      from.meta.keepAlive = false
    }
    next()
  },
  async beforeRouteEnter(to, from, next) {
    ;[pre.dept, pre.noType] = await Promise.all([
      deptChooseList({ tree: false }),
      orderItems(),
    ])
    next()
  },
  methods: {
    goto(row) {
      this.$router.push(
        `/payment/out-patient/detail?billNo=${row.billNo}&patientId=${row.patientId}`,
      )
    },
  },
}
</script>
