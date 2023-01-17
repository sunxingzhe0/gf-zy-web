<template>
  <div class="app-info">
    <BlockTitle>{{ title }}</BlockTitle>
    <div class="app-info-row doctor">
      <div class="app-info-item">
        <div class="app-info-label">开方医生</div>
        <div class="app-info-value">
          {{ prescriptionInfo.doctorName }}
        </div>
        <div class="app-info-value">
          {{ prescriptionInfo.auditUserTitle }}
        </div>
        <!-- <div class="app-info-value">
          {{ prescriptionInfo.deptName }}
        </div> -->
      </div>
      <div class="app-info-item">
        <div class="app-info-label">药品数量</div>
        <div class="app-info-value">
          {{
            prescriptionInfo.rpDrugList && prescriptionInfo.rpDrugList.length
          }}
        </div>
      </div>
      <div class="app-info-item"></div>
    </div>
    <Prescription
      v-if="edit"
      :createParams="createParams"
      :orderId="orderInfo.orderId"
    ></Prescription>
    <PrescriptionItem
      v-else
      scene="detail"
      :prescription="prescriptionInfo"
    ></PrescriptionItem>
  </div>
</template>
<script>
import { BlockTitle } from '@/components/Base'
import Prescription from '@/components/Prescription'
import PrescriptionItem from '@/components/Prescription/PrescriptionItem'
export default {
  name: 'PrescriptionInfo',
  components: {
    BlockTitle,
    Prescription,
    PrescriptionItem,
  },
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '处方信息',
    },
    orderInfo: {
      type: Object,
      default: () => ({}),
    },
    prescriptionInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    createParams() {
      return {
        userId: this.prescriptionInfo.userId,
        titleId: this.prescriptionInfo.titleId,
        orderId: this.prescriptionInfo.orderId,
        memberId: this.prescriptionInfo.memberId,
        memberSex: this.prescriptionInfo.memberSex,
        memberName: this.prescriptionInfo.memberName,
        serviceType: this.prescriptionInfo.serviceType,
        serviceMode: this.prescriptionInfo.serviceMode,
        treatmentTime: this.prescriptionInfo.treatmentTime,
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.doctor {
  .app-info-value {
    flex: initial;
  }
}
</style>
