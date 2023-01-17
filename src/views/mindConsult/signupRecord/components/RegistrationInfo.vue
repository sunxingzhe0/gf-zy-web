<template>
  <el-dialog
    title="报名详情"
    :visible.sync="innerVisible"
    :close-on-click-modal="false"
    width="700px"
    @close="close()"
  >
    <div class="openContent">
      <div class="info-title">
        <div class="name">{{ info.activityName }}</div>
        <div>
          <el-tag
            size="mini"
            :type="
              info.activityStatus == 2 || info.activityStatus == 3 ? 'info' : ''
            "
            >{{ activityStatus[info.activityStatus - 1] }}</el-tag
          ><el-tag style="margin-left: 5px" size="mini">{{
            info.activityType
          }}</el-tag>
        </div>
      </div>
      <el-row>
        <el-col :span="24">活动id：{{ info.activityId }}</el-col>
        <el-col :span="8">状态：{{ status[info.status - 1] }}</el-col>
        <el-col :span="8"
          >是否退款：{{ refundRel[info.refundRel - 1] || '-' }}</el-col
        >
        <el-col :span="8">退款金额：{{ info.refundeFee || '-' }}</el-col>
        <template v-for="(item, index) in info.relList">
          <el-col :span="8" :key="index"
            >{{ item.fieldName }}：{{ item.fieldValue || '-' }}</el-col
          >
        </template>
        <template v-if="info.itemFeeList">
          <el-col :span="8"
            >{{ info.itemFeeList.length > 1 ? '咨询费' : '报名费' }}：{{
              (
                parseFloat(info.itemFeeList[0].price) * info.itemFeeList[0].nums
              ).toFixed(2)
            }}
            元</el-col
          >
          <el-col v-if="info.itemFeeList.length > 1" :span="8"
            >报名费：{{
              (
                parseFloat(info.itemFeeList[1].price) * info.itemFeeList[1].nums
              ).toFixed(2)
            }}
            元</el-col
          >
        </template>
      </el-row>
      <el-row>
        <el-col :span="8">支付金额：{{ info.payCost }}</el-col>
        <el-col :span="8"
          >支付方式：{{ info.payWay == 'WX_JSAPI' ? '微信支付' : '' }}</el-col
        >
        <el-col :span="8">支付时间：{{ info.payTime || '-' }}</el-col>
        <el-col :span="8">审核人：{{ info.approver || '-' }}</el-col>
        <el-col :span="8"
          >审核结果：{{
            approvalResult[info.approvalResult - 1] || '-'
          }}</el-col
        >
        <el-col :span="8">审核时间：{{ info.approvalTime || '-' }}</el-col>
        <el-col :span="24">备注：{{ info.remark || '-' }}</el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import { getRecordById } from '@/api/mindConsult/myActivity'
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
    },
  },
  data() {
    return {
      info: {},
      status: ['报名成功', '报名审核', '报名失败'],
      refundRel: ['是', '否'],
      approvalResult: ['同意', '拒绝'],
      activityStatus: ['进行中', '已结束', '暂停', '未开始'],
    }
  },
  watch: {
    show() {
      if (this.show) {
        this.getRecordById()
      }
    },
  },
  computed: {
    innerVisible: {
      get: function () {
        return this.show
      },
      set: function (val) {
        console.log(val)
        this.$emit('onClose')
      },
    },
  },
  methods: {
    close(data) {
      this.$emit('onClose', data)
    },
    //获取报名详情
    async getRecordById() {
      let res = await getRecordById({ signId: this.id })
      this.info = res
    },
  },
}
</script>
<style lang="scss" scoped>
.openContent {
  line-height: 30px;
  .info-title {
    display: flex;
    justify-content: space-between;
    .name {
      font-size: 16px;
    }
  }
}
</style>
