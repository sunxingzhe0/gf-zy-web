<template>
  <section class="view__card view__detail">
    <header v-if="!isEdit">
      <h3 class="view__title">
        处方号：{{ id }}
        <el-tag style="margin-left: 30px;" type="info" size="mini">
          {{ statusMap[rpInfo.status] }}
        </el-tag>
      </h3>
      <el-steps :active="stepActive" align-center class="no-black">
        <el-step title="创建" :description="rpInfo.createTime"></el-step>
        <el-step title="提交" :description="rpInfo.submitTime"></el-step>
        <el-step title="审核" :description="rpInfo.auditTime"></el-step>
      </el-steps>
    </header>
    <el-tabs v-model="activeName">
      <el-tab-pane label="处方信息" name="info" lazy>
        <PatinetInfo :orderInfo="orderInfo"></PatinetInfo>
        <PrescriptionInfo
          :edit="isEdit"
          :orderInfo="orderInfo"
          :prescriptionInfo="rpInfo"
        ></PrescriptionInfo>
        <InvoiceInfo v-if="!isEdit" :prescriptionInfo="rpInfo"></InvoiceInfo>
      </el-tab-pane>
      <el-tab-pane
        v-if="orderInfo.bizType != 'CONSULT'"
        label="历史就诊记录"
        name="history"
        key="history"
        lazy
      >
        <TreatmentHistoryInfo
          :medicalId="orderInfo.historyMedicalId"
        ></TreatmentHistoryInfo>
      </el-tab-pane>
      <el-tab-pane
        v-if="orderInfo.sessionId"
        name="diagnosisRecord"
        key="diagnosisRecord"
        label="诊疗记录"
        lazy
      >
        <ChatRecord :orderInfo="orderInfo"></ChatRecord>
      </el-tab-pane>
      <el-tab-pane v-if="!isEdit" label="操作日志" name="log" lazy>
        <OperateLog :businessId="id"></OperateLog>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import * as prescription from '@/api/prescription'
import { orderDoctorWebDetail } from '@/api/business'
import {
  ChatRecord,
  OperateLog,
  InvoiceInfo,
  PatinetInfo,
  PrescriptionInfo,
  TreatmentHistoryInfo,
} from '@/components/App'

export default {
  name: 'Detail',
  props: {
    id: String,
    isEdit: Boolean,
  },
  components: {
    ChatRecord,
    OperateLog,
    InvoiceInfo,
    PatinetInfo,
    PrescriptionInfo,
    TreatmentHistoryInfo,
  },
  watch: {
    $route() {
      this.getData()
    },
  },
  data() {
    return {
      orderId: '', // 订单号
      orderInfo: {}, // 订单信息
      statusMap: {
        DRAFT: '草稿',
        PASSED: '已通过',
        REJECTED: '已驳回',
        PENDING_REVIEW: '待审核',
      }, // 处方状态
      activeName: 'info', // 基础信息
      rpInfo: { rpDrugList: [] }, // 单个处方药品列表
    }
  },
  computed: {
    stepActive() {
      const { submitTime, auditTime } = this.rpInfo
      if (auditTime) {
        return 3
      } else if (submitTime) {
        return 2
      } else {
        return 1
      }
    },
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.rpInfo = await prescription.preDetailInfo({ rpId: this.id })
      this.orderId = this.rpInfo.orderId
      this.getOrderInfo()
    },
    // 获取订单信息
    async getOrderInfo() {
      this.orderInfo = await orderDoctorWebDetail({
        orderId: this.orderId,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';
@import '@/styles/_modules-detail.scss';
.view__detail {
  height: calc(100vh - 52px);
  overflow: hidden;
  padding: 10px 0 10px 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  & ::v-deep {
    .el-tabs {
      flex: 1;
      display: flex;
      overflow: hidden;
      flex-direction: column;
    }
    .el-tabs__content {
      flex: 1;
      overflow: auto;
      padding-right: 10px;
    }
  }
}
</style>
