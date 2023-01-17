<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_payPrice="{ row }">
        <div><span>￥</span>{{ row.price }}</div>
      </template>
      <template v-slot:slot_orderId="{ row }">
        <el-button type="text" @click="toOrderInfo(row)">{{
          row.orderId
        }}</el-button>
      </template>
    </List>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { refundBizOrderList } from '@/api/zyapi/statistics'
import { deptOuterPdeptList } from '@/api/organization'
export default {
  name: 'checkBill_refund',
  components: {
    List,
  },
  mixins: [
    mixin({
      fetchListFunction: async params => {
        const res = await refundBizOrderList({
          ...params,
        })
        return res
      },
    }),
  ],
  data() {
    return {
      deptList: [],
      query: {
        pageSize: 10,
        currentNum: 1,
        status: 'TO_REFUND',
        // timeType: 0,
        // searchType: 0,
        // startTime: dayjs().subtract(2, 'day').format('YYYYMMDD') + '000000',
        // endTime: dayjs().format('YYYYMMDD') + '235959',
      },
      columns: {
        index: {
          hidden: true,
        },
        cardNo: { minWidth: 100 },
        applyTime: { minWidth: 150 },
        bizType: {
          formatter: row => {
            const types = {
              CONSULT: '在线咨询',
              REPEAT_CLINIC: '在线复诊',
              CARRYON_PRESC: '慢病续方',
              PRESCRIPTION: '处方',
            }
            return types[row.bizType] || '-'
          },
        },
        reason: {
          formatter: row => {
            const types = {
              HZZD: '患者主动',
              YSZD: '医生结束',
              OTHER: '其他',
            }
            return types[row.reason] || '-'
          },
        },
        feeType: {
          formatter: row => {
            const types = {
              GH: '挂号',
              MZ: '门诊缴费',
            }
            return types[row.feeType] || '-'
          },
        },
        orderId: { minWidth: 120, prop: 'slot_orderId' },
        deptName: { minWidth: 120 },
        status: {
          formatter: row => {
            const types = {
              TO_REFUND: '待退费',
              REFUNDED: '已退费',
            }
            return types[row.status] || '-'
          },
        },
      },
    }
  },
  computed: {
    filter() {
      return {
        // date: {
        //   props: {
        //     options: [{ label: '支付时间', value: 0 }],
        //   },
        //   keys: ['timeType', 'startTime', 'endTime'],
        // },
        // search: {
        //   props: {
        //     options: [
        //       { label: '患者姓名', value: 0 },
        //       { label: '支付流水号', value: 1 },
        //       { label: '就诊卡号', value: 2 },
        //     ],
        //   },
        //   keys: ['searchType', 'searchKeywords'],
        // },
        popover: [
          {
            props: {
              label: '关键字',
              is: 'el-input',
            },
            data: {
              attrs: {
                placeholder: '患者ID/姓名/门诊号/就诊医生/单据号/关联订单号',
              },
            },
            keys: 'searchKeywords',
          },
          {
            props: {
              label: '状态',
              options: [
                { label: '不限', value: '' },
                { label: '待退费', value: 'TO_REFUND' },
                { label: '已退费', value: 'REFUNDED' },
              ],
            },
            keys: 'status',
          },
          {
            props: {
              label: '业务类型',
              options: [
                { label: '不限', value: '' },
                { label: '在线咨询', value: 'CONSULT' },
                { label: '在线复诊', value: 'REPEAT_CLINIC' },
                { label: '慢病续方', value: 'CARRYON_PRESC' },
                { label: '处方', value: 'PRESCRIPTION' },
              ],
            },
            keys: 'bizType',
          },
          {
            props: {
              label: '类别',
              options: [
                { label: '不限', value: '' },
                { label: '挂号', value: 'GH' },
                { label: '门诊缴费', value: 'MZ' },
              ],
            },
            keys: 'feeType',
          },
          {
            props: {
              label: '退费原因',
              options: [
                { label: '不限', value: '' },
                { label: '医生结束', value: 'YSZD' },
                { label: '患者主动申请', value: 'HZZD' },
                { label: '其他', value: 'OTHER' },
              ],
            },
            keys: 'reason',
          },
          {
            props: {
              label: '挂号科室',
              options: [
                { label: '不限', value: '' },
                ...this.deptList.map(v => ({ label: v.name, value: v.id })),
              ],
            },
            keys: 'deptId',
          },
        ],
      }
    },
  },
  created() {
    this.getDeptList()
  },
  methods: {
    //获取互联网医院科室
    async getDeptList() {
      this.deptList = await deptOuterPdeptList({ tree: false, type: 'WEB' })
    },
    //订单详情
    toOrderInfo(row) {
      this.$router.push('/order/business/detail/' + row.orderId)
    },
  },
}
</script>
<style lang="scss" scoped></style>
