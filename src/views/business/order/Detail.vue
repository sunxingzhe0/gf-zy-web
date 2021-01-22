<template>
  <section class="view__card view__detail">
    <header>
      <h3 class="view__title">
        订单号：{{ id }}
        <el-tag style="margin-left: 30px;" type="default" size="mini">
          {{ statusText[info.orderStatus] || '已关闭' }}
        </el-tag>
      </h3>
      <el-steps :active="stepActive" align-center class="no-black">
        <el-step title="提交订单" :description="info.createTime"></el-step>
        <el-step title="付款" :description="info.paymentTime"></el-step>
        <el-step title="接诊" :description="info.startTime"></el-step>
        <el-step title="评价" :description="info.commentTime"></el-step>
      </el-steps>
    </header>

    <el-tabs v-model="activeName">
      <el-tab-pane key="order" label="订单" name="order" lazy>
        <OrderInfo :orderInfo="info"></OrderInfo>
        <PatinetInfo :orderInfo="info"></PatinetInfo>
        <ServiceInfo :orderId="info.orderId" :business="info.biz"></ServiceInfo>
      </el-tab-pane>
      <el-tab-pane
        v-if="info.bizType != 'CONSULT'"
        label="历史就诊记录"
        name="history"
        key="history"
        lazy
      >
        <TreatmentHistoryInfo
          :medicalId="info.historyMedicalId"
        ></TreatmentHistoryInfo>
      </el-tab-pane>
      <el-tab-pane label="诊疗记录" name="diagnosisRecord" lazy>
        <ChatRecord v-if="info.sessionId" :orderInfo="info"></ChatRecord>
      </el-tab-pane>
      <el-tab-pane
        v-if="info.bizType != 'CONSULT'"
        label="本次诊断"
        name="diagnosis"
      >
        <p>诊断：{{ info.diagnose }}</p>
      </el-tab-pane>
      <el-tab-pane
        v-if="info.bizType != 'CONSULT'"
        name="medicalRecord"
        key="medicalRecord"
        label="本次病历"
        lazy
      >
        <MedicalRecord :orderId="info.orderId"></MedicalRecord>
      </el-tab-pane>
      <el-tab-pane
        v-if="info.bizType != 'CONSULT'"
        name="prescription"
        key="prescription"
        label="本次处方"
        lazy
      >
        <OrderPrescription :orderId="info.orderId"></OrderPrescription>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="log" key="log" lazy>
        <OperateLog :businessId="info.orderId"></OperateLog>
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
import { orderDoctorWebDetail } from '@/api/business'

export default {
  name: 'Detail',
  props: {
    id: String,
  },
  components: {
    OrderInfo,
    ChatRecord,
    OperateLog,
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
      info: {},
      prescriptions: [],
      activeName: 'order',
    }
  },
  computed: {
    stepActive() {
      if (this.info.commentTime) return 4
      if (this.info.orderStatus === 'TO_EVALUATE') return 3
      if (this.info.paymentTime) return 2
      if (this.info.createTime) return 1
      return 0
    },
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.info = await orderDoctorWebDetail({
        orderId: this.$route.params.id,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';
@import '@/styles/_modules-detail.scss';
</style>
