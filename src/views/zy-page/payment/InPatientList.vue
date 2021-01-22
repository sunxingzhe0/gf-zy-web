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

      <!-- <template v-slot:fixed="{ row }">
        <el-button type="text" @click="goto(row)">查看</el-button>
      </template> -->
    </List>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { bihRecordData } from '@/api/zyapi/payment'
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
  mixins: [mixin({ fetchListFunction: bihRecordData })],
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
  async beforeRouteEnter(to, from, next) {
    ;[pre.dep] = await Promise.all([deptChooseList({ tree: false })])
    next()
  },
  methods: {
    goto(row) {
      this.$router.push(
        `/shift/doctor-rules/detail?patientId=${row.patientId}&billNo=${row.billNo}`,
      )
    },
  },
}
</script>
