<template>
  <div class="app-info">
    <BaseInfo :treatmentInfo="treatmentInfo"></BaseInfo>
    <PatinetInfo :orderInfo="orderInfo"></PatinetInfo>
    <div class="app-info">
      <BlockTitle>医嘱记录</BlockTitle>
      <template v-for="(item, index) in rpList">
        <PrescriptionItem
          :key="index"
          scene="detail"
          :prescription="item"
        ></PrescriptionItem>
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
