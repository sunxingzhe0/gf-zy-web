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
          :to="`/payment/out-patient/detail?billNo=${row.billNo}&patientId=${row.patientId}&billStateName=${row.billStateName}`"
        >
          查看
        </router-link>
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
  name: 'payment_outPatient',
  components: {
    List,
  },
  mixins: [
    mixin({
      fetchListFunction: async params => {
        const data = JSON.parse(JSON.stringify(params))
        data.startFee = data.startFee
          ? Number(data.startFee).toFixed(2) * 100
          : ''
        data.endFee = data.endFee ? Number(data.endFee).toFixed(2) * 100 : ''
        console.log(data, '参数====')
        const res = await mzRecordData(data)
        return res
      },
    }),
  ],
  data() {
    return {
      query: {
        pageSize: 10,
        timeType: 0,
        searchType: 1,
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
              label: '类别',
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
                { label: '不限', value: null },
                ...pre.dept.map(_ => ({ label: _.name, value: _.syncCode })),
              ],
            },
            data: {
              attrs: {
                filterable: true,
              },
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
          // {
          //   props: {
          //     label: '支付方式',
          //     options: [
          //       { label: '不限', value: '' },
          //       { label: '银联', value: 'UNION' },
          //       { label: '微信', value: 'WX' },
          //     ],
          //   },
          //   keys: 'payment',
          // },
          {
            props: {
              label: '单据状态',
              options: [
                { label: '不限', value: 0 },
                { label: '已支付', value: 1 },
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
          minWidth: 80,
        },
        billNo: {
          minWidth: 100,
        },
        totalFee: {
          formatter(row) {
            return `￥${parseFloat(row.totalFee).toFixed(2)}`
          },
          minWidth: 100,
        },
        num: {
          hidden: true,
        },
        billStateName: {
          minWidth: 100,
          formatter(row) {
            return row.billStateName === 'REFUNDED' ? '已退费' : '已支付'
          },
        },
        noTypeName: { minWidth: 100 },
        patientName: { minWidth: 100 },
        cardNo: { minWidth: 100 },
        paymentName: { minWidth: 100 },
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
  methods: {
    goto(row) {
      this.$router.push(
        `/payment/out-patient/detail?billNo=${row.billNo}&patientId=${row.patientId}`,
      )
    },
  },
}
</script>
