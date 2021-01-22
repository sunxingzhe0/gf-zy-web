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
          <router-link :to="`/order/tocarryorder/orderdetail?id=${row.orderId}`"
            ><div class="watch">查看</div></router-link
          >
          <div class="writeOff" @click="showMore(row.orderId)">核销</div>
        </div>
      </template>
    </List>
    <!-- 弹框 -->
    <el-dialog title="核销" :visible.sync="dialogVisible" width="80%">
      <div class="writeOffContent">
        <!-- 基本信息 -->
        <el-row>
          <el-col :span="8">
            <div class="itemTitle">订单号</div>
            <div class="itemContent">{{ toWaitOff.orderId }}</div>
          </el-col>
          <el-col :span="8">
            <div class="itemTitle">下单人</div>

            <el-image
              :src="FILE_URL(toWaitOff.userAvatar)"
              class="avatar_round"
              style="width: 40px; height: 40px; margin-right: 15px;"
            >
              <img
                slot="error"
                class="image-slot"
                src="@/assets/headerImg.png"
              />
            </el-image>
            <!-- <el-avatar
              style="vertical-align: middle; margin-right: 15px;"
              :src="FILE_URL(toWaitOff.userAvatar)"
            ></el-avatar> -->
            <div class="itemContent">
              {{ toWaitOff.userName }} {{ toWaitOff.userPhone }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="itemTitle">下单时间</div>
            <div class="itemContent">{{ toWaitOff.createTime }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="itemTitle">就诊人</div>
            <div class="itemContent">{{ toWaitOff.memberName }}</div>
          </el-col>
          <el-col :span="8">
            <div class="itemTitle">预留手机</div>
            <div class="itemContent">{{ toWaitOff.memberPhone }}</div>
          </el-col>
          <el-col :span="8">
            <div class="itemTitle">预约时间</div>
            <div class="itemContent">{{ toWaitOff.date }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="itemTitle">药品数量</div>
            <div class="itemContent">11</div>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table
          :data="contentList"
          border
          style="width: 100%;"
          class="tableList"
          v-if="contentList"
        >
          <el-table-column prop="index" label="序号" width="70" type="index">
          </el-table-column>
          <el-table-column label="类型" width="80">
            <template slot-scope="scoped"
              >{{ scoped.row.type == 'WESTERN_MEDICINE' ? '西药' : '中成药' }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="药品名称"> </el-table-column>
          <el-table-column prop="spec" label="规格"> </el-table-column>
          <el-table-column prop="useWays" label="用药途径"> </el-table-column>
          <el-table-column prop="singleDose" label="单次剂量">
          </el-table-column>
          <el-table-column prop="useFrequency" label="用药频次">
          </el-table-column>
          <el-table-column prop="total" label="总量"> </el-table-column>
          <el-table-column label="医保">
            <template slot-scope="scoped"
              >{{
                scoped.row.medicare == 'A'
                  ? '甲'
                  : scoped.row.medicare == 'B'
                  ? '乙'
                  : scoped.row.medicare == 'C'
                  ? '丙'
                  : '自费'
              }}
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价">
            <template slot-scope="scoped">￥{{ scoped.row.price }} </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="总价">
            <template slot-scope="scoped"
              >￥{{ scoped.row.totalPrice }}
            </template></el-table-column
          >
          <el-table-column prop="pharmacyName" label="接收方">
          </el-table-column>
          <el-table-column prop="remark" label="备注"> </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { getOrderList, toWaitOff, hxOrder } from '@/api/order'
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
  name: 'ToSendOrder',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: getOrderList })],
  watch: {
    $route() {
      if (this.$route.query?.start_time && this.$route.query?.end_time) {
        this.getNewList()
      }
    },
  },
  created() {
    if (this.$route.query?.start_time && this.$route.query?.end_time) {
      this.getNewList()
    }
  },
  data() {
    return {
      timeType: 0,
      query: {
        pageSize: 10,
        dateType: 0,
        searchType: 0,
        timeType: 0,
        orderStatus: 'WAIT_TAKE',
        pharmacyId: this.$store.state.user.store.id,
        // startTime: '20200909000000',
        // endTime: '20200917000000',
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
      // 订单id
      orderId: '',
      // 查看弹框是否显示
      dialogVisible: false,
      contentList: [
        {
          id: '',
          prescriptionId: '',
          type: '',
          name: '',
          spec: '',
          useWays: '',
          singleDose: '',
          useFrequency: '',
          total: '',
          medicare: '',
          price: '',
          totalPrice: '',
          pharmacyId: '',
          remark: '',
          orgId: null,
          seq: 0,
          groupId: '',
          pharmacyName: '',
        },
      ],
      toWaitOff: {},
      // 待核销药品清单
    }
  },

  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [
              { label: '创建时间', value: 0 },
              { label: '预约自提时间', value: 3 },
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
          minWidth: 140,
        },
        createTime: {
          minWidth: 160,
        },
        payFee: {
          formatter: (row, col, cell) => {
            return '￥' + cell
          },
        },
        expressMode: {
          formatter: (row, col, cell) => {
            return serviceExpressMode[cell]
          },
        },
        wayType: {
          formatter: (row, col, cell) => {
            return serviceModeMap[cell]
          },
        },
        bizType: {
          formatter: (row, col, cell) => {
            return serviceTypeMap[cell]
          },
        },
        orderStatus: {
          formatter: (row, col, cell) => {
            return statusMap[cell]
          },
        },
      }
    },
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
  methods: {
    getNewList() {
      this.query = {
        ...this.query,
        startTime: this.$route.query.start_time,
        endTime: this.$route.query.end_time,
        timeType: parseInt(this.$route.query.timeType),
      }
      this.$_fetchTableData()
    },
    // 点击查看更多
    async showMore(id) {
      this.orderId = id
      this.dialogVisible = true
      const res = await toWaitOff({
        orderId: id,
        pharmacyId: this.$store.state.user.store.id,
      })
      this.contentList = res.contentList
      this.toWaitOff = res
    },
    // 核销
    async handleSave() {
      await hxOrder({
        orderId: this.orderId,
        pharmacyId: this.$store.state.user.store.id,
      })
      this.$message.success('核销成功！')
      this.orderId = ''
      this.dialogVisible = false
      this.$_fetchTableData(getOrderList)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.operation {
  div {
    white-space: nowrap;
  }
  color: $--color-primary;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  white-space: nowrap;
  .watch {
    margin-right: 5px;
  }
  .watch,
  .writeOff {
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
          width: 65px;
          display: flex;
          justify-content: flex-start;
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
</style>
