<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_relId="{ row }">
        <el-button v-if="row.relId" @click="seeInfo(row)" type="text">{{
          row.relId
        }}</el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button v-if="row.status == 3" @click="closeRow(row)" type="text">
          关闭
        </el-button>
      </template>
      <!-- <template v-slot:footertool>
        <div class="footer-box">
          <el-button @click="exportData">导出</el-button>
        </div>
      </template> -->
    </List>
    <RegistrationInfo
      :show="dialogVisible"
      :id="rowId"
      @onClose="handleClose"
    />
  </div>
</template>

<script>
import { toPayList, recordExport, closePay } from '@/api/mindConsult/order'
import { List, mixin } from '@/components'
import apiProjectSet from '@/api/mindConsult/projectSet'
import RegistrationInfo from '../mindConsult/signupRecord/components/RegistrationInfo.vue'

let pre = {
  departments: [],
  itemList: [],
}
export default {
  components: {
    List,
    RegistrationInfo,
  },
  mixins: [mixin([{ fetchListFunction: toPayList }])],
  data() {
    this.filter = {
      date: {
        props: {
          options: [{ label: '创建时间', value: 1 }],
        },
        keys: ['timeType', 'startTime', 'endTime'],
      },
      inline: [
        {
          props: {
            label: '关键字',
            is: 'el-input',
          },
          data: {
            attrs: {
              placeholder: '患者姓名/电话/就诊卡号/单据号/关联业务单',
            },
          },
          keys: 'keywords',
        },
        {
          props: {
            label: '业务类型',
            is: 'el-select',
            options: [{ label: '全部', value: '' }].concat(
              pre.itemList.map(_ => {
                return {
                  label: _.name,
                  value: _.id,
                }
              }),
            ),
          },
          keys: 'busiType',
        },
        {
          props: {
            label: '状态',
            is: 'el-select',
            options: [
              { label: '全部', value: '' },
              { label: '已缴费', value: 1 },
              { label: '已退费', value: 2 },
              { label: '待缴费', value: 3 },
              { label: '已关闭', value: 4 },
            ],
          },
          keys: 'status',
        },
        {
          props: {
            label: '科室名称',
            is: 'el-select',
            options: [{ label: '全部', value: '' }].concat(
              [
                ...new Set(
                  pre.departments.map(v => {
                    return {
                      deptName: v.deptName,
                      deptId: v.deptId,
                    }
                  }),
                ),
              ].map(_ => {
                return {
                  label: _.deptName,
                  value: _.deptId,
                }
              }),
            ),
          },
          keys: 'dept',
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
        timeType: 1,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        payTime: {
          minWidth: 160,
        },
        createTime: {
          minWidth: 160,
        },
        tradeNo: {
          minWidth: 120,
        },
        busiType: {
          formatter(row) {
            return ['预约', '报名'][row.busiType - 1] || '-'
          },
        },
        orderType: {
          formatter(row) {
            return ['支付', '退费'][row.orderType] || '-'
          },
        },
        payType: {
          formatter(row) {
            const types = {
              ONLINE_PAY: '在线支付',
              OFFLINE_PAY: '线下支付',
              FREE_PAY: '线下缴费',
            }
            return row.payType ? types[row.payType] : row.payType
          },
        },
        cost: {
          formatter(row) {
            return row.cost ? row.cost + '元' : '-'
          },
        },
        status: {
          formatter(row) {
            if (!row.status) return '已关闭'
            const types = {
              1: '已缴费',
              2: '已退费',
              3: '待缴费',
            }
            return types[row.status]
          },
        },
        relId: {
          prop: 'slot_relId',
        },
      },
      dialogVisible: false,
      rowId: '',
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
  watch: {
    query: {
      handler() {
        console.log(this.query)

        if (this.query.startTime && this.query.endTime) {
          if (this.query.timeType == 0) {
            this.$set(this.query, 'reservationDateLow', this.query.startTime)
            this.$set(this.query, 'reservationDateLowHight', this.query.endTime)
            this.query.creatTimeLow = null
            this.query.creatTimeHigh = null
          } else {
            this.$set(this.query, 'creatTimeLow', this.query.startTime)
            this.$set(this.query, 'creatTimeHigh', this.query.endTime)
            this.query.reservationDateLow = null
            this.query.reservationDateLowHight = null
          }
        } else {
          this.query.reservationDateLow = null
          this.query.reservationDateLowHight = null
          this.query.creatTimeLow = null
          this.query.creatTimeHigh = null
        }
      },
      deep: true,
    },
  },

  methods: {
    seeInfo(row) {
      this.$router.push(
        '/order/hcReservations/hcReservationsDetail?id=' + row.relId,
      )
    },
    closeRow(row) {
      this.$confirm('确定要关闭该订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await closePay({ id: row.id })
        this.$_fetchTableData()
        this.$message({
          type: 'success',
          message: '操作成功!',
        })
      })
    },

    async exportData() {
      await recordExport(this.query)
    },
    handleClose() {
      this.dialogVisible = false
      this.rowId = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.footer-box {
  display: flex;
  align-items: center;
  .count-info {
    font-size: 14px;
    line-height: 20px;
    margin-left: 20px;
  }
}
</style>
