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
          :to="`/order/tosendorder/orderdetail?id=${row.orderId}`"
          >查看</router-link
        >
        <div class="el-button el-button--text" @click="showMore(row.orderId)">
          发货
        </div>
      </template>
    </List>
    <!-- 弹框 -->
    <Tosend ref="tosend" @getOrderList="getList"></Tosend>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import Tosend from './components/Tosend'

import { getOrderList } from '@/api/order'
import {
  roleChooseList,
  deptOuterChooseList,
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
  name: 'order_tosendorder',
  components: {
    List,
    Tosend,
  },
  mixins: [mixin({ fetchListFunction: getOrderList })],
  data() {
    return {
      query: {
        pageSize: 10,
        dateType: 0,
        searchType: 0,
        timeType: 0,
        orderStatus: 'WAIT_SEND',
        pharmacyId: this.$store.state.user.store.id,
      },
      // 获取物流列表接口数据
      exListC: [],
      selEx: '',
      ruleForm: {
        exList1: [
          {
            corpId: '',
            expressNo: '',
            rpContentList: [],
            cropName: '',
          },
        ],
      },
      // 规则
      rules: {
        logisticsInfo: [
          { required: true, message: '请选择物流公司', trigger: 'change' },
        ],
        waybill: [
          { required: true, message: '请填写运单号', trigger: 'triger' },
        ],
      },
      // 查看弹框是否显示
      dialogVisible: false,
      // 待发货
      toSend: {},
      //  订单 id
      orderId: '',
    }
  },
  async beforeRouteEnter(to, from, next) {
    ;[pre.role, pre.dept, pre.store, pre.title] = await Promise.all([
      roleChooseList({ showUser: true }),
      deptOuterChooseList({ tree: false }),
      drugStoreChooseList(),
      titleChooseList(),
    ])
    next()
  },
  // created() {
  //   this.getExList()
  // },
  methods: {
    // 弹框子组件刷新列表方法
    getList() {
      this.$_fetchTableData(getOrderList)
    },
    // 点击查看更多
    showMore(id) {
      this.$refs.tosend.getToSendDrugs(id)

      // const res = await toSend({
      //   orderId: id,
      //   pharmacyId: this.$store.state.user.store.id,
      // })

      // this.orderId = res.orderId

      // this.ruleForm.exList1 = res.rpExpressList
      // if (this.ruleForm.exList1.length == 0) {
      //   this.handleAdd()
      // }

      // for (let i = 0; i < res.contentList.length; i++) {
      //   res.contentList[i].exType = 1
      //   for (let j = 0; j < this.ruleForm.exList1.length; j++) {
      //     if (res.contentList[i].exType == j + 1) {
      //       let arr = []
      //       arr.push(res.contentList[i].id)
      //       this.ruleForm.exList1[j].rpContentList = arr
      //     }
      //   }
      // }
      // this.toSend = res
    },
    // 点击新增物流包裹
    // handleAdd() {
    //   this.ruleForm.exList1.push({
    //     corpId: '',
    //     expressNo: '',
    //     corpName: '',
    //   })
    // },
    // 删除包裹
    // handleDelete(i) {
    //   this.$confirm('是否要删除该物流信息？', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   })
    //     .then(() => {
    //       this.ruleForm.exList1.splice(i, 1)
    //       this.$message({
    //         type: 'success',
    //         message: '删除成功!',
    //       })
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除',
    //       })
    //     })
    // },
    // 修改物流信息
    // handleSel(e, index) {
    //   for (let i = 0; i < this.exListC.length; i++) {
    //     if (this.exListC[i].code == e) {
    //       console.log(this.ruleForm.exList1[0])
    //       console.log(this.exListC[i].name)

    //       this.ruleForm.exList1[index].corpName = this.exListC[i].name
    //     }
    //   }
    //   console.log(this.ruleForm.exList1)
    // },
    // 提交新增包裹
    // async handleSubmit() {
    //   console.log(this.ruleForm.exList1)
    //   await submitEx({
    //     expressList: this.ruleForm.exList1,
    //     orderId: this.orderId,
    //     pharmacyId: this.$store.state.user.store.id,
    //   })
    //   this.dialogVisible = false
    //   this.$message.success('提交成功！')
    //   this.$_fetchTableData(getOrderList)
    // },
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [{ label: '创建时间', value: 0 }],
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
        ],
      }
    },
    columns() {
      return {
        index: {
          hidden: true,
        },
        appointmentTime: {
          minWidth: 150,
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
        memberName: {
          minWidth: 120,
        },
        doctorName: { minWidth: 120 },
        drugNumber: { minWidth: 120 },
        rpNumber: { minWidth: 120 },
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
  white-space: nowrap;
  font-size: 14px;
  .watch {
    margin-right: 5px;
  }
  .watch,
  .send {
    cursor: pointer;
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
  .sendContent {
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
::v-deep .el-table .sort-caret {
  left: 22px;
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

.wayInfo {
  ::v-deep .wayInfoTitle {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(102, 102, 102, 1);
    display: flex;
    justify-content: center !important;
  }
  .logisticsInfo {
    width: 100%;
    .el-form-item {
      margin-bottom: 0;
      width: 80%;
    }
    ::v-deep .el-select,
    .el-input {
      width: 100%;
    }
    ::v-deep .el-input__inner {
      border: 0 !important;
      width: 100%;
    }
    ::v-deep .el-form-item__label {
      border-right: 1px solid #cccccc;
      text-align: center;
      padding-right: 0;
    }
    .itemContent {
      margin-right: 15px;
    }
    .delate {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(247, 74, 74, 1);
      cursor: pointer;
      margin-left: 20px;
    }
  }
  ::v-deep .addNewWayInfo {
    color: $--color-primary;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 500;
    padding-left: 25px !important;
    cursor: pointer;
  }
}

.titleText {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
}

::v-deep .el-form-item {
  border: 1px solid #cccccc;
  border-radius: 5px;
}

.lableName {
  margin-right: 30px !important;
}

.mR {
  margin-left: 20px !important;
}
</style>
