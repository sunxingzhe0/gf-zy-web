<template>
  <section>
    <el-row class="view__content">
      <el-col :span="8">
        <span>病历编号</span>
        {{ info.diseId || '-' }}
      </el-col>

      <el-col :span="8">
        <span>就诊时间</span>
        {{ info.medicalDate || '-' }}
      </el-col>

      <el-col :span="8">
        <span>诊疗类型</span>
        {{ info.medicalType || '-' }}
      </el-col>

      <el-col>
        <span>就诊人</span>
        {{ info.medicalName || '-' }}
      </el-col>
      <!-- 病历调整前 -->
      <!-- <el-col>
        <span>主诉</span>
        {{ info.mainSuit || '-' }}
      </el-col>

      <el-col>
        <span>现病史</span>
        {{ info.nowDisease || '-' }}
      </el-col>

      <el-col>
        <span>体格检查</span>
        {{ info.phyCheck || '-' }}
      </el-col>

      <el-col>
        <span>辅助检查</span>
        {{ info.supCheck || '-' }}
      </el-col>

      <el-col>
        <span>诊断</span>
        {{ info.diagnosis || '-' }}
      </el-col>

      <el-col>
        <span>处理意见</span>
        {{ info.dealIdea || '-' }}
      </el-col> -->
      <!-- 病历调整后 -->
      <el-col>
        <span>就诊方式</span>
        {{ info.seeWay || '-' }}
      </el-col>
      <el-col>
        <span>病情</span>
        {{ info.illness || '-' }}
      </el-col>
      <el-col>
        <span>辅助检查</span>
        {{ info.supCheck || '-' }}
      </el-col>
      <el-col>
        <span>初次诊断</span>
        {{ info.diagnosis || '-' }}
      </el-col>
      <el-col>
        <span>处理意见</span>
        {{ info.dealIdea || '-' }}
      </el-col>
    </el-row>
  </section>
</template>
<script>
import { curCase } from '@/api/prescription'
export default {
  name: 'MedicalRecord',
  props: {
    orderId: String,
    isHistory: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      info: {},
    }
  },
  watch: {
    isHistory(newValue) {
      console.log(11111)
      if (newValue) {
        this.info = this.$attrs
      } else {
        this.getData()
      }
    },
  },
  mounted() {
    if (!this.isHistory) {
      this.getData()
    } else {
      this.info = {
        diseId: this.$attrs.medicalNo,
        medicalDate: this.$attrs.visitTime,
        medicalType: this.$attrs.medicalType,
        medicalName: this.$attrs.medicalName,
        mainSuit: this.$attrs.chiefComplaint,
        nowDisease: this.$attrs.currentDisease,
        phyCheck: this.$attrs.checkupExam,
        supCheck: this.$attrs.auxiliaryExam,
        diagnosis: this.$attrs.diagDesc,
        dealIdea: this.$attrs.advice,
      }
    }
  },
  methods: {
    async getData() {
      this.info = (await curCase({ orderId: this.orderId })) || {}
    },
  },
}
</script>
