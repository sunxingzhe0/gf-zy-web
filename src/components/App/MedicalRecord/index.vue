<template>
  <div class="app-info">
    <BlockTitle>患者病历</BlockTitle>
    <div class="app-info-row">
      <div class="app-info-item">
        <div class="app-info-label">病历编号</div>
        <div class="app-info-value">
          {{ medicalRecord.diseId || '-' }}
        </div>
      </div>
      <div class="app-info-item">
        <div class="app-info-label">就诊时间</div>
        <div class="app-info-value">{{ medicalRecord.medicalDate || '-' }}</div>
      </div>
      <div class="app-info-item">
        <div class="app-info-label">诊疗类型</div>
        <div class="app-info-value">
          {{ medicalRecord.medicalType || '-' }}
        </div>
      </div>
    </div>
    <div class="app-info-row full">
      <div class="app-info-item">
        <div class="app-info-label">就诊人</div>
        <div class="app-info-value">
          {{ medicalRecord.medicalName || '-' }}
        </div>
      </div>
    </div>
    <div class="app-info-row full">
      <div class="app-info-item">
        <div class="app-info-label">主诉</div>
        <div class="app-info-value">
          {{ medicalRecord.mainSuit || '-' }}
        </div>
      </div>
    </div>
    <div class="app-info-row full">
      <div class="app-info-item">
        <div class="app-info-label">现病史</div>
        <div class="app-info-value">
          {{ medicalRecord.nowDisease || '-' }}
        </div>
      </div>
    </div>
    <div class="app-info-row full">
      <div class="app-info-item">
        <div class="app-info-label">既往史</div>
        <div class="app-info-value">
          {{ medicalRecord.hisDisease || '-' }}
        </div>
      </div>
    </div>
    <div class="app-info-row full">
      <div class="app-info-item">
        <div class="app-info-label">体格检查</div>
        <div class="app-info-value">
          {{ medicalRecord.phyCheck || '-' }}
        </div>
      </div>
    </div>
    <div class="app-info-row full">
      <div class="app-info-item">
        <div class="app-info-label">辅助检查</div>
        <div class="app-info-value">
          {{ medicalRecord.supCheck || '-' }}
        </div>
      </div>
    </div>
    <div class="app-info-row full">
      <div class="app-info-item">
        <div class="app-info-label">诊断</div>
        <div class="app-info-value">
          {{ medicalRecord.diagnosis || '-' }}
        </div>
      </div>
    </div>
    <div class="app-info-row full">
      <div class="app-info-item">
        <div class="app-info-label">处理意见</div>
        <div class="app-info-value">
          {{ medicalRecord.dealIdea || '-' }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/*
@author     qiang
@name       MedicalRecord
@desc       患者病历【详情】
@props      orderId             string  业务订单id
            propsMedicalRecord  object<{
                medicalNo       string
                visitTime       string
                medicalType     string
                medicalName     string
                chiefComplaint  string
                currentDisease  string
                checkupExam     string
                auxiliaryExam   string
                diagDesc        string
                advice          string

            }>  props病历信息
@emit       none
*/
import { curCase } from '@/api/prescription'
import { BlockTitle } from '@/components/Base'
export default {
  name: 'MedicalRecord',
  components: {
    BlockTitle,
  },
  props: {
    orderId: {
      type: String,
      default: '',
    },
    propsMedicalRecord: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      medicalRecord: {},
    }
  },
  methods: {
    async getMedicalRecord() {
      this.medicalRecord = (await curCase({ orderId: this.orderId })) || {}
    },
  },
  watch: {
    orderId: {
      handler(val) {
        if (val) this.getMedicalRecord()
      },
      immediate: true,
    },
    propsMedicalRecord: {
      handler(val) {
        let medicalRecord = {}
        if (this.orderId) return
        if (val) {
          medicalRecord = {
            dealIdea: val.advice,
            diseId: val.medicalNo,
            diagnosis: val.diagDesc,
            phyCheck: val.checkupExam,
            medicalDate: val.visitTime,
            supCheck: val.auxiliaryExam,
            medicalType: val.medicalType,
            medicalName: val.medicalName,
            mainSuit: val.chiefComplaint,
            nowDisease: val.currentDisease,
            hisDisease: val.historyDisease,
          }
        }
        this.medicalRecord = medicalRecord
      },
    },
  },
}
</script>
