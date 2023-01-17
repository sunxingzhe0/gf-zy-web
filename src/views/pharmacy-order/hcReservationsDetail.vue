<template>
  <div class="view__card">
    <BlockTitle style="margin-bottom: 15px">基本信息</BlockTitle>
    <el-row>
      <el-col :span="8">预约项目：{{ infoData.entryName || '-' }}</el-col>
      <el-col :span="8"
        >预约日期：{{ infoData.reservationDate || '-' }}
      </el-col>
      <el-col :span="8"
        >预约时段：{{ infoData.reservationDtime || '-' }}
      </el-col>
      <el-col :span="8">医生：{{ infoData.doctor || '-' }}</el-col>
      <el-col :span="8">科室：{{ infoData.dept || '-' }}</el-col>
      <el-col :span="8">医院：{{ infoData.hospital || '-' }} </el-col>
      <el-col :span="8">创建时间：{{ infoData.creatTime || '-' }} </el-col>
      <el-col :span="8">单据号：{{ infoData.id || '-' }} </el-col>
      <el-col :span="8"
        >状态：{{ statusTypes[infoData.status - 1] || '-' }}</el-col
      >
    </el-row>
    <BlockTitle style="margin-bottom: 15px">患者信息 </BlockTitle>
    <el-row>
      <el-col :span="8">就诊号：{{ infoData.cardNo || '-' }} </el-col>
      <el-col :span="8">患者姓名：{{ infoData.patientName || '-' }} </el-col>
      <el-col :span="8">身份证号：{{ infoData.idCard || '-' }} </el-col>
    </el-row>
    <BlockTitle style="margin-bottom: 15px">交易信息 </BlockTitle>
    <el-row>
      <el-col :span="8">支付号：{{ infoData.payCode || '-' }} </el-col>
      <el-col :span="8"
        >支付方式：{{
          infoData.payWay === 'WX_JSAPI'
            ? '微信支付'
            : infoData.payWay === 'OFFLINE_PAY'
            ? '线下支付'
            : '-'
        }}
      </el-col>
      <el-col :span="8">支付时间：{{ infoData.payTime || '-' }} </el-col>
      <el-col :span="8"
        >支付金额：{{ infoData.cost ? infoData.cost + '元' : '-' }}
      </el-col>
    </el-row>
    <BlockTitle style="margin-bottom: 15px">请假信息 </BlockTitle>
    <el-row>
      <el-col :span="24">请假时间：{{ infoData.leaveTime || '-' }} </el-col>
      <el-col :span="24">请假理由：{{ infoData.leaveDesc || '-' }}</el-col>
      <el-col :span="8">审批人： {{ infoData.approver || '-' }}</el-col>
      <el-col :span="8"
        >审批结果：{{
          ['已同意', '已拒绝'][infoData.approvalResult - 1] || '-'
        }}</el-col
      >
      <el-col :span="8">审批时间：{{ infoData.approvalTime || '-' }} </el-col>
      <el-col :span="24">备注：{{ infoData.remark || '-' }}</el-col>
      <el-col :span="8">交易号：{{ infoData.tradeNo || '-' }} </el-col>
      <el-col :span="8"
        >退款方式：{{ refundWayTypes[infoData.refundWay] || '-' }}</el-col
      >
      <el-col :span="8">退款时间：{{ infoData.refundTime || '-' }}</el-col>
      <el-col :span="8">退款金额：{{ infoData.refundFee || '-' }}</el-col>
      <el-col :span="8"
        >是否退款：{{ infoData.refundRel == 1 ? '是' : '否' }}</el-col
      >
    </el-row>
    <BlockTitle style="margin-bottom: 15px">延诊记录 </BlockTitle>
    <el-table
      :data="infoData.delayList"
      style="width: 100%"
      header-row-class-name="header-row"
    >
      <el-table-column
        type="index"
        ref=""
        label="序号"
        width="50"
      ></el-table-column>
      <el-table-column
        prop="opTime"
        label="经办时间"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="opUser"
        label="经办人"
        width="80"
      ></el-table-column>
      <el-table-column
        :formatter="
          row => {
            return row.delay == 1 ? '请假' : '停诊'
          }
        "
        prop="delay"
        label="延诊原因"
        width="80"
      ></el-table-column>
      <el-table-column prop="remark" label="备注" width="80"></el-table-column>
      <el-table-column
        prop="reservationDate"
        label="预约日期"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="rangeTime"
        label="预约时段"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="delayDate"
        label="顺延日期"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="delayRangeTime"
        label="顺延时段"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="patientName"
        label="患者姓名"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="cardNo"
        label="就诊号"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="itemName"
        label="预约项目"
        width="120"
      ></el-table-column>
      <el-table-column prop="dept" label="科室" width="80"></el-table-column>
      <el-table-column prop="doctor" label="医生" width="80"></el-table-column>
      <el-table-column prop="cost" label="费用" width="80"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryReservationDetail } from '@/api/mindConsult/order'
import { BlockTitle } from '@/components/Base'
export default {
  components: {
    BlockTitle,
  },
  data() {
    return {
      refundWayTypes: {
        ORIGINAL: '原路退回',
        OFFLINE: '线下退款',
        ACCOUNT: '账户退款',
      },
      infoData: {},
      statusTypes: ['已预约', '已请假', '请假中', '已关闭'],
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      this.infoData = await queryReservationDetail({
        reservationId: this.$route.query.id,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.line {
  border-top: 1px solid #e6e6e6;
  margin-top: 8px;
}
::v-deep .el-col {
  margin: 8px 0;
  color: #4d4d4d;
}
.el-table /deep/ .el-table__body td .cell:empty::after,
.el-table /deep/ .el-table__body td .cell > span:empty::after,
.el-table /deep/ .el-table__body td .cell .approval:empty::after,
.el-table /deep/ .el-table__body td .cell div:empty::after,
.el-table /deep/ .el-table__body td .cell .line-limit-length:empty::after {
  content: '-';
}
.header-row {
  background-color: #f2f2f2;
}
</style>
