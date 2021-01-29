<template>
  <div class="app-info">
    <BaseInfo :treatmentInfo="treatmentInfo"></BaseInfo>
    <PatinetInfo :orderInfo="orderInfo"></PatinetInfo>
    <div class="app-info">
      <BlockTitle>医嘱记录</BlockTitle>
      <div class="rpTitle">处方单</div>
      <template v-for="(item, index) in rpList">
        <div :key="index" class="rpWrap">
          <div class="rpList">
            <div>处方号：{{ item.id }}</div>
            <div class="flex-between">
              <span>数量：{{ item.drugNumber }}</span>
              <span
                >医生：{{ item.auditName }} {{ item.auditTitle || '' }}</span
              >
              <span>审方时间：{{ item.auditTime }}</span>
              <span>西药：￥{{ item.westFee }}</span>
              <span>中成药：￥{{ item.chPatentFee }}</span>
              <span class="price">合计：￥{{ item.rpFee }}</span>
            </div>
          </div>
          <PrescriptionItem
            scene="detail"
            :prescription="item"
          ></PrescriptionItem>
        </div>
      </template>
    </div>
    <ExamReport :examInfoList="treatmentInfo.examInfoList"></ExamReport>
    <InspectReport :labInfoList="treatmentInfo.labInfoList"></InspectReport>
    <MedicalRecord
      :propsMedicalRecord="{
        ...treatmentInfo.medicalRecord,
        medicalName: treatmentInfo.patientName,
      }"
    ></MedicalRecord>
  </div>
</template>
<script>
/*
@author     qiang
@name       TreatmentHistoryInfo
@desc       历史就诊记录【详情】
@props      medicalId   string      就诊记录id
@emit       none
*/
import {
  BaseInfo,
  ExamReport,
  PatinetInfo,
  InspectReport,
  MedicalRecord,
} from '@/components/App'
import { hisRecord } from '@/api/prescription'
import { BlockTitle } from '@/components/Base'
import PrescriptionItem from '@/components/Prescription/PrescriptionItem'

export default {
  name: 'TreatmentHistoryInfo',
  components: {
    BaseInfo,
    BlockTitle,
    ExamReport,
    PatinetInfo,
    InspectReport,
    MedicalRecord,
    PrescriptionItem,
  },
  props: {
    medicalId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      orderInfo: {},
      treatmentInfo: {},
    }
  },
  computed: {
    rpList() {
      const rpList = this.treatmentInfo.rpList || []
      return rpList.map(item => ({
        ...item,
        rpDrugList: item.rpDrugList || item.contentList,
      }))
    },
  },

  methods: {
    async getTreatmentHistoryInfo() {
      if (!this.medicalId) return
      const res = await hisRecord({ medicalId: this.medicalId })
      this.treatmentInfo = res || {}
      console.log(this.treatmentInfo, '00000')
      this.orderInfo = {
        patient: {
          age: res.patientAge,
          sex: Number(res.sex),
          memberName: res.patientName,
          memberPhone: res.patientPhone,
        },
        picList: res.pic,
        bizType: res.bizType,
        wayType: res.wayType,
        diagnose: res.diagnose,
        illnessDesc: res.illnessDesc,
      }
    },
  },
  watch: {
    medicalId: {
      handler() {
        this.getTreatmentHistoryInfo()
      },
      immediate: true,
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';
.rpTitle {
  color: #666;
  margin: 20px 0;
}
.rpWrap {
  padding: 15px;
  border: 1px solid #e6e6e6;
  ::v-deep.prescription-item-footer {
    display: none;
  }
}
.rpList {
  font-size: 16px;
  color: #333;

  span {
    font-size: 14px;
    color: #666;
    margin-top: 10px;
    &.price {
      color: $--color-primary;
    }
  }
}
</style>
