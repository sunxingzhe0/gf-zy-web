<template>
  <section class="view__card view__detail">
    <header>
      <h3 class="view__title">
        订单号：{{ detailInfo.orderId }}
        <el-tag style="margin-left: 30px" type="default" size="mini">
          {{ statusText[detailInfo.orderStatus] || '已关闭' }}
        </el-tag>
      </h3>
      <el-steps :active="activeStep" align-center class="steps">
        <el-step
          title="提交订单"
          :description="detailInfo.createTime"
        ></el-step>
        <el-step title="付款" :description="detailInfo.paymentTime"></el-step>
        <el-step title="接诊" :description="detailInfo.acceptsTime"></el-step>
        <el-step title="评价" :description="detailInfo.commentTime"></el-step>
      </el-steps>
    </header>

    <el-tabs v-model="activeName">
      <el-tab-pane label="订单" name="order" lazy>
        <OrderInfo :orderInfo="orderInfo"></OrderInfo>
        <PatinetInfo :orderInfo="orderInfo"></PatinetInfo>
        <ServiceInfo
          :business="orderInfo.biz"
          :orderId="orderInfo.orderId"
        ></ServiceInfo>
      </el-tab-pane>
      <el-tab-pane
        v-if="detailInfo.orderType != 'CONSULT'"
        label="历史就诊记录"
        name="history"
        lazy
      >
        <TreatmentHistoryInfo
          :medicalId="orderInfo.historyMedicalId"
        ></TreatmentHistoryInfo>
      </el-tab-pane>
      <el-tab-pane label="诊疗记录" name="diagnosisRecord" lazy>
        <ChatRecord :orderInfo="orderInfo"></ChatRecord>
      </el-tab-pane>
      <el-tab-pane
        v-if="detailInfo.bizType != 'CONSULT'"
        label="本次诊断"
        name="diagnosis"
      >
        <p>诊断：{{ detailInfo.diagnose }}</p>
      </el-tab-pane>
      <el-tab-pane
        v-if="detailInfo.orderType != 'CONSULT'"
        name="medicalRecord"
        label="本次病历"
        lazy
      >
        <MedicalRecord :orderId="detailInfo.orderId"></MedicalRecord>
      </el-tab-pane>
      <el-tab-pane
        v-if="detailInfo.orderType != 'CONSULT'"
        name="prescription"
        label="本次处方"
        lazy
      >
        <OrderPrescription :orderId="detailInfo.orderId"></OrderPrescription>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="log" lazy>
        <OperateLog :businessId="detailInfo.orderId"></OperateLog>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import {
  OrderInfo,
  ChatRecord,
  OperateLog,
  PatinetInfo,
  ServiceInfo,
  MedicalRecord,
  OrderPrescription,
  TreatmentHistoryInfo,
} from '@/components/App'
import { getOrderDetail } from '@/api/order'

export default {
  name: 'Detail',
  props: {
    id: String,
  },
  components: {
    OrderInfo,
    OperateLog,
    ChatRecord,
    PatinetInfo,
    ServiceInfo,
    MedicalRecord,
    OrderPrescription,
    TreatmentHistoryInfo,
  },
  data() {
    return {
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
      activeName: 'order',
      // 订单详情
      detailInfo: {},
      // 订单心情【病人信息】
      orderInfo: {},
    }
  },
  created() {
    this.getOrderInfo()
  },
  computed: {
    activeStep() {
      if (this.detailInfo.commentTime) return 4
      if (this.detailInfo.acceptsTime) return 3
      if (this.detailInfo.paymentTime) return 2
      return 1
    },
  },
  methods: {
    // 获取订单详情信息
    async getOrderInfo() {
      const res = await getOrderDetail({
        orderId: this.id,
      })
      this.detailInfo = res
      // 患者信息拼装
      this.orderInfo = {
        ...res,
        patient: {
          age: res.patient.age,
          memberName: res.memberName,
          memberPhone: res.memberPhone,
          sex: res.memberSex === '男' ? 1 : 0,
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';
@import '@/styles/_modules-detail.scss';
</style>
