<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:fixed="{ row }">
        <div class="operation">
          <router-link :to="`/order/allorder/orderdetail?id=${row.orderId}`"
            ><div class="watch">查看</div></router-link
          >
          <div
            v-if="row.orderStatus == 'WAIT_TAKE'"
            class="writeOff"
            @click="handleSave(row.orderId)"
          >
            核销
          </div>
          <div
            v-if="row.orderStatus == 'WAIT_RECEIVE'"
            class="writeOff"
            @click="sendGoods(row.orderId, '1')"
          >
            更新物流
          </div>
          <div
            v-if="row.orderStatus == 'WAIT_SEND'"
            class="writeOff"
            @click="sendGoods(row.orderId, '2')"
          >
            发货
          </div>
        </div>
      </template>
    </List>
    <!-- 弹框 -->
    <Tosend ref="tosend" @getOrderList="getList"></Tosend>
    <WriteOff ref="writeOff" @hxOrderSuccess="getList"></WriteOff>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import Tosend from './components/Tosend'
import WriteOff from './components/WriteOff'
import { getOrderList } from '@/api/order'
import {
  roleChooseList,
  deptChooseList,
  drugStoreChooseList,
  titleChooseList,
} from '@/api'
const serviceExpressMode = {
  0: '自提',
  1: '邮寄',
  // 配送方式：0自提；1邮寄
}
const serviceModeMap = {
  GRAPHIC: '图文',
  VIDEO: '视频',
  PHONE: '电话',
}
const serviceTypeMap = {
  CONSULT: '在线资讯',
  REPEAT_CLINIC: '在线复诊',
  CARRYON_PRESC: '慢病续方',
}
const statusMap = {
  UNPAID: '待付款',
  PAID: '已支付',
  WAIT_TREAT: '待接诊',
  IN_TREAT: '接诊中',
  WAIT_TAKE: '待自提',
  WAIT_SEND: '待发货',
  WAIT_RECEIVE: '待收货',
  TO_EVALUATE: '待评价',
  IN_AFTER_SALE: '售后中',
  FINISHED: '已完成',
  CLOSED: '已关闭',
}
const pre = {
  role: [],
  dept: [],
  store: [],
  title: [],
}

export default {
  name: 'AllOrder',
  components: {
    List,
    Tosend,
    WriteOff,
  },
  mixins: [mixin({ fetchListFunction: getOrderList })],
  data() {
    return {
      query: {
        pageSize: 10,
        dateType: 0,
        searchType: 0,
        timeType: 0,
        pharmacyId: this.$store.state.user.store.id,
      },
      ruleForm: { logisticsInfo: '', wayNum: '' },
      // 规则
      rules: {
        logisticsInfo: [
          { required: true, message: '请选择物流公司', trigger: 'change' },
        ],
        wayNum: [
          { required: true, message: '请填写运单号', trigger: 'triger' },
        ],
      },
      toWaitOff: {},
      // 待核销药品清单
      // 查看弹框是否显示
      dialogVisible: false,
      orderTableData: [],
      contentList: [],
    }
  },

  async beforeRouteEnter(to, from, next) {
    ;[pre.role, pre.dept, pre.store, pre.title] = await Promise.all([
      roleChooseList({ showUser: true }),
      deptChooseList({ tree: false }),
      drugStoreChooseList(),
      titleChooseList(),
    ])
    next()
  },
  created() {
    console.log(this.$store.state.user.store.list, '个人信息')
  },
  methods: {
    // 弹框子组件刷新列表方法
    getList() {
      this.$_fetchTableData(getOrderList)
    },
    // 更新物流
    // undateEx(id) {
    //   this.$refs.tosend.getToSendDrugs(id)
    // },
    // 核销
    async handleSave(id) {
      this.$refs.writeOff.showMore(id)
    },
    // 点击发货
    sendGoods(id, type) {
      this.$refs.tosend.getToSendDrugs(id, type)
    },
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [
              { label: '创建时间', value: 0 },
              { label: '发货时间', value: 1 },
              { label: '自提时间', value: 2 },
            ],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '订单号', value: 0 },
              { label: '患者姓名', value: 1 },
              { label: '开立医师', value: 2 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '业务类型',
              options: [
                { label: '不限', value: '' },
                // { label: '在线咨询', value: 'CONSULT' },
                { label: '在线复诊', value: 'REPEAT_CLINIC' },
                { label: '慢病续方', value: 'CARRYON_PRESC' },
              ],
            },
            keys: 'bizType',
          },
          {
            props: {
              label: '业务形式',
              options: [
                { label: '不限', value: '' },
                { label: '图文', value: 'GRAPHIC' },
                { label: '视频', value: 'VIDEO' },
                // { label: '电话', value: 'PHONE' },
              ],
            },
            keys: 'wayType',
          },
          {
            props: {
              label: '患者性别',
              options: [
                { label: '不限', value: '' },
                { label: '男', value: 1 },
                { label: '女', value: 0 },
              ],
            },
            keys: 'sex',
          },
          {
            props: {
              label: '患者年龄',
              is: 'InputRange',
            },
            keys: ['startAge', 'endAge'],
          },
          {
            props: {
              label: '职称',
              options: [
                { label: '不限', value: '' },
                ...pre.title.map(_ => ({ label: _.name, value: _.id })),
              ],
            },
            keys: 'titleId',
          },
          {
            props: {
              label: '科室',
              options: [
                { label: '不限', value: '' },
                ...pre.dept.map(_ => ({ label: _.name, value: _.id })),
              ],
            },
            keys: 'deptId',
          },
          {
            props: {
              label: '关联处方',
              is: 'InputRange',
            },
            keys: ['startRpNumber', 'endRpNumber'],
          },
          {
            props: {
              label: '药品数量',
              is: 'InputRange',
            },
            keys: ['startDrugNumber', 'endDrugNumber'],
          },
          {
            props: {
              label: '订单金额',
              is: 'InputRange',
            },
            keys: ['startPayFee', 'endPayFee'],
          },
          {
            props: {
              label: '物流类型',
              options: [
                { label: '不限', value: '' },
                { label: '自提', value: 0 },
                { label: '邮寄', value: 1 },
              ],
            },
            keys: 'expressMode',
          },
          {
            props: {
              label: '接收方',
              options: [
                { label: '不限', value: '' },
                ...this.$store.state.user.store.list.map(_ => ({
                  label: _.name,
                  value: _.id,
                })),
              ],
            },
            keys: 'pharmacyId',
            // canNotClear: true, //该选项无法被清空
          },
          {
            props: {
              label: '订单状态',
              options: [
                { label: '不限', value: '' },
                { label: '待自提', value: 'WAIT_TAKE' },
                { label: '待发货', value: 'WAIT_SEND' },
                { label: '待收货', value: 'WAIT_RECEIVE' },
                { label: '已完成', value: 'FINISHED' },
              ],
            },
            keys: 'orderStatus',
          },
        ],
      }
    },
    columns() {
      return {
        index: {
          hidden: true,
        },
        appointmentTime: {
          minWidth: 160,
        },
        createTime: {
          minWidth: 160,
        },
        fixed: {
          minWidth: 140,
        },
        payFee: {
          formatter: (row, col, cell) => {
            return '￥' + cell
          },
          minWidth: 120,
        },
        expressMode: {
          formatter: (row, col, cell) => {
            return serviceExpressMode[cell]
          },
          minWidth: 120,
        },
        wayType: {
          formatter: (row, col, cell) => {
            return serviceModeMap[cell]
          },
          minWidth: 120,
        },
        memberName: {
          minWidth: 120,
        },
        doctorName: {
          minWidth: 120,
        },
        rpNumber: { minWidth: 120 },

        drugNumber: { minWidth: 120 },
        bizType: {
          formatter: (row, col, cell) => {
            return serviceTypeMap[cell]
          },
          minWidth: 120,
        },
        orderStatus: {
          formatter: (row, col, cell) => {
            return statusMap[cell]
          },
          minWidth: 120,
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.operation {
  color: $--color-primary;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  white-space: nowrap;
  .watch {
    display: inline-block;
    line-height: 15px;
    margin-right: 15px;
  }
  .watch,
  .writeOff {
    display: inline-block;
    cursor: pointer;
    line-height: 15px;
    margin-right: 15px;
  }
}
::v-deep .el-dialog__title {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(26, 26, 26, 1);
}

::v-deep .el-dialog__footer {
  display: flex;
  justify-content: space-around;
  .el-button {
    width: 80px;
    line-height: 28px;
    padding: 0;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    text-align: center;
    border-radius: 2px;
  }
}

::v-deep .el-dialog {
  .el-dialog__body {
    padding: 15px 20px;
  }
  .writeOffContent {
    .el-row {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .el-col {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 30px;
        .itemTitle {
          width: 70px;
          display: flex;
          justify-content: flex-end;
          margin-right: 15px;
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #666666;
        }
        .itemContent {
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(26, 26, 26, 1);
        }
        img {
          margin-right: 15px;
        }
      }
    }
  }
}

::v-deep .el-table--border th {
  border-right: none;
}

::v-deep .el-table--border td {
  border-right: none;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}

.tableList {
  width: 90% !important;
  margin: 0 auto;
  margin-bottom: 20px;
}

::v-deep .el-form-item {
  border: 1px solid #cccccc;
  border-radius: 5px;
}
::v-deep .el-table .sort-caret {
  left: 22px;
}
</style>
