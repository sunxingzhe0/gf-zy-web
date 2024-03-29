<template>
  <section class="view__card view__detail">
    <header>
      <h3 class="view__title">
        订单号：{{ id }}
        <el-tag style="margin-left: 30px" type="default" size="mini">
          {{ statusText[detailInfo.orderStatus] || '已关闭' }}
        </el-tag>
      </h3>
      <!-- 退款订单 -->
      <template v-if="detailInfo.refundFlag">
        <el-steps :active="3" align-center class="steps">
          <el-step
            title="提交订单"
            :description="detailInfo.createTime"
          ></el-step>
          <el-step title="付款" :description="detailInfo.paymentTime"></el-step>
          <el-step title="退款" :description="detailInfo.refundTime"></el-step>
        </el-steps>
      </template>
      <!-- 自提订单 -->
      <template v-else-if="detailInfo.expressMode === 0">
        <el-steps :active="activeStep" align-center class="steps">
          <el-step
            title="提交订单"
            :description="detailInfo.createTime"
          ></el-step>
          <el-step title="付款" :description="detailInfo.paymentTime"></el-step>
          <el-step
            title="自提"
            :description="
              detailInfo.takeInfo ? detailInfo.takeInfo[0].expenseTime : ''
            "
          ></el-step>
        </el-steps>
      </template>
      <!-- 邮寄订单 -->
      <template v-else>
        <el-steps :active="activeStep" align-center class="steps">
          <el-step
            title="提交订单"
            :description="detailInfo.createTime"
          ></el-step>
          <el-step title="付款" :description="detailInfo.paymentTime"></el-step>
          <el-step title="发货" :description="detailInfo.expressTime"></el-step>
          <el-step
            title="收货"
            :description="detailInfo.receiverTime"
          ></el-step>
        </el-steps>
      </template>
    </header>

    <el-tabs v-model="activeName">
      <el-tab-pane label="处方信息" name="info" lazy>
        <OrderInfo :orderInfo="detailInfo"></OrderInfo>
        <PatinetInfo :orderInfo="orderInfo"></PatinetInfo>
        <OrderPrescription :prescriptionInfo="detailInfo"></OrderPrescription>
      </el-tab-pane>

      <el-tab-pane label="配送信息" name="Distribution" lazy>
        <DeliveryInfo :orderInfo="detailInfo"></DeliveryInfo>
      </el-tab-pane>

      <el-tab-pane label="操作日志" name="log" lazy>
        <OperateLog :businessId="id"></OperateLog>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import {
  OrderInfo,
  OperateLog,
  PatinetInfo,
  DeliveryInfo,
  OrderPrescription,
} from '@/components/App'
import { mapState } from 'vuex'
import { orderDetail } from '@/api/order'

export default {
  name: 'Detail',
  components: {
    OrderInfo,
    OperateLog,
    PatinetInfo,
    DeliveryInfo,
    OrderPrescription,
  },
  data() {
    return {
      id: '',
      // 订单详情[患者信息]
      orderInfo: {},
      // 订单详情数据
      detailInfo: {},
      statusText: {
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
      },
      activeName: 'info',
    }
  },
  computed: {
    ...mapState({
      pharmacyId: state => state.user.store.id,
    }),
    activeStep() {
      if (this.detailInfo.takeTime) return 3
      if (this.detailInfo.paymentTime) return 2
      return 1
    },
  },
  created() {
    ;(this.id = this.$route.query.id), this.getDetail()
  },
  methods: {
    // 获取订单详情
    async getDetail() {
      const res = await orderDetail({
        orderId: this.id,
        pharmacyId: this.pharmacyId,
      })
      console.log(res, '00000')
      this.detailInfo = res
      // 患者信息拼装
      this.orderInfo = {
        ...res,
        patient: {
          age: res.memberAge,
          memberName: res.memberName,
          memberPhone: res.memberPhone,
          sex: res.memberSex === '男' ? 1 : 0,
        },
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_variables.scss';
@import '@/styles/_modules-detail.scss';
</style>
