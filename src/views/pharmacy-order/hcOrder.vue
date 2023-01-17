<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <!-- <template v-slot:fixed="{ row }"> -->
      <!-- <el-button @click="seeInfo(row)" type="text"> 详情 </el-button> -->
      <!-- <el-button
          @click="handelRefund(row)"
          v-if="row.status == 1 && row.busiType == 1"
          type="text"
        >
          退费
        </el-button> -->
      <!-- </template> -->
      <template v-slot:slot_relationOrder="{ row }">
        <el-button v-if="row.relationOrder" @click="seeInfo(row)" type="text">{{
          row.relationOrder
        }}</el-button>
      </template>
      <template v-slot:footertool>
        <div class="footer-box">
          <el-button @click="exportData">导出</el-button>
          <div class="count-info" v-if="countInfo && countInfo.length">
            <div>
              {{
                `合计流水${countInfo[0].count}笔，合计金额${countInfo[0].countAmount}元。其中支付${countInfo[0].payCount}笔，${countInfo[0].payAmount}元；退费${countInfo[0].refundCount}笔，${countInfo[0].refundAmount}元。`
              }}
            </div>
            <div>
              {{
                `预约流水${countInfo[1].count}笔，${countInfo[1].countAmount}元。其中支付${countInfo[1].payCount}笔，${countInfo[1].payAmount}元；退款${countInfo[1].refundCount}笔，${countInfo[1].refundAmount}元。`
              }}
            </div>
            <div>
              {{
                `团体流水${countInfo[2].count}笔，${countInfo[2].countAmount}元。其中支付${countInfo[2].payCount}笔，${countInfo[2].payAmount}元；退款${countInfo[2].refundCount}笔，${countInfo[2].refundAmount}元。`
              }}
            </div>
          </div>
        </div>
      </template>
    </List>
    <RegistrationInfo
      :show="dialogVisible"
      :id="rowId"
      @onClose="handleClose"
    />
    <el-dialog
      title="退费"
      :visible.sync="isOpenRefund"
      width="600px"
      :before-close="closeRefund"
    >
      <el-form
        :model="formData"
        ref="refundForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="患者：">{{
          `${orderInfo.patientName} | ${orderInfo.idCard}`
        }}</el-form-item>
        <el-form-item label="医生：">{{
          `${orderInfo.doctor} | ${orderInfo.dept || '-'}`
        }}</el-form-item>
        <el-form-item label="业务：">{{
          `预约 | ${orderInfo.entryName} | ￥${orderInfo.cost}`
        }}</el-form-item>
        <el-form-item label="">{{
          orderInfo.reservationDtime || ''
        }}</el-form-item>
        <el-form-item label="操作理由：" prop="remark">
          <el-input type="textarea" v-model="formData.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRefund">取 消</el-button>
        <el-button type="primary" @click="closeRefund">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  orderList,
  recordExport,
  orderCount,
  queryReservationDetail,
} from '@/api/mindConsult/order'
import { List, mixin } from '@/components'
import apiProjectSet from '@/api/mindConsult/projectSet'
import RegistrationInfo from '../mindConsult/signupRecord/components/RegistrationInfo.vue'

let pre = {
  departments: [],
}
export default {
  components: {
    List,
    RegistrationInfo,
  },
  mixins: [mixin([{ fetchListFunction: orderList }])],
  data() {
    this.filter = {
      date: {
        props: {
          options: [
            { label: '交易时间', value: 0 },
            { label: '创建时间', value: 1 },
          ],
          // format: 'yyyy-MM-dd',
          // valueFormat: 'yyyy-MM-dd',
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
              placeholder: '患者姓名/电话/就诊卡号/单据号/关联单据',
            },
          },
          keys: 'keywords',
        },
        {
          props: {
            label: '订单类型',
            is: 'el-select',
            options: [
              { label: '全部', value: '' },
              { label: '支付', value: 0 },
              { label: '退费', value: 1 },
            ],
          },
          keys: 'orderType',
        },
        {
          props: {
            label: '业务类型',
            is: 'el-select',
            options: [
              { label: '全部', value: '' },
              { label: '预约', value: 1 },
              { label: '报名', value: 2 },
            ],
          },
          keys: 'busiType',
        },
        {
          props: {
            label: '状态',
            is: 'el-select',
            options: [
              { label: '全部', value: '' },
              { label: '已关闭', value: 0 },
              { label: '已完成', value: 1 },
              { label: '已退费', value: 2 },
              { label: '待交易', value: 3 },
            ],
          },
          keys: 'status',
        },
        // {
        //   props: {
        //     label: '交易日期',
        //     is: 'el-date-picker',
        //   },
        //   data: {
        //     attrs: {
        //       type: 'datetimerange',
        //     },
        //   },
        //   keys: ['reservationDateLowHight', 'reservationDateLow'],
        // },
        // {
        //   props: {
        //     label: '创建日期',
        //     is: 'el-date-picker',
        //   },
        //   data: {
        //     attrs: {
        //       type: 'datetimerange',
        //     },
        //   },
        //   keys: ['creatTimeHigh', 'creatTimeLow'],
        // },
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
      rowData: {},
      orderInfo: {},
      formData: {
        remark: '',
      },
      isOpenRefund: false,
      countInfo: [], //订单统计数据
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
            //1：支付  2：退费  ''：已关闭  null：-
            if (row.orderType === '') return '已关闭'
            return ['支付', '退费'][row.orderType - 1] || '-'
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
        cost: {
          formatter(row) {
            return row.cost ? row.cost + '元' : '-'
          },
        },
        status: {
          formatter(row) {
            const statusTypes = ['已完成', '已退费', '待交易']
            return statusTypes[row.status - 1] || '已关闭'
          },
        },
        relationOrder: {
          prop: 'slot_relationOrder',
        },
      },
      dialogVisible: false,
      rowId: '',
      rules: {
        remark: [
          { required: true, message: '请输入操作理由', trigger: 'blur' },
        ],
      },
    }
  },
  async beforeRouteEnter(to, from, next) {
    pre.departments = await apiProjectSet.departments({})
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
        this.getCountDetail()
      },
      deep: true,
    },
  },
  created() {
    this.getCountDetail()
  },
  methods: {
    //获取预约详情
    async getInfo(id) {
      this.orderInfo = await queryReservationDetail({ reservationId: id })
    },
    //关闭退费
    closeRefund() {
      this.isOpenRefund = false
      this.$refs.refundForm.resetFields()
      this.orderInfo = {}
    },
    //退费弹窗
    handelRefund(row) {
      this.getInfo(row.reservationId)
      this.rowData = row
      this.isOpenRefund = true
    },
    //获取订单统计数据
    async getCountDetail() {
      this.countInfo = await orderCount(this.query)
    },
    seeInfo(row) {
      if (row.busiType == 1) {
        this.$router.push(
          '/order/hcReservations/hcReservationsDetail?id=' + row.reservationId,
        )
      } else {
        this.dialogVisible = true
        this.rowId = row.reservationId
      }
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
.el-form-item {
  margin-bottom: 0;
}
</style>
