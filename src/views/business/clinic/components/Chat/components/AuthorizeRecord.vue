<template>
  <div class="message__wrap message__text">
    <div>
      <span>您正在向对方申请查看就诊记录</span>
      <span>
        {{
          body.status == 'NONE'
            ? '，等待中'
            : body.status == 'ANSWERED'
            ? '，' + body.optContent
            : ''
        }}
      </span>
    </div>
    <div>
      <span>
        {{
          medicalInfo.medicalType == 'MZ'
            ? '门诊记录'
            : medicalInfo.medicalType == 'ZY'
            ? '住院记录'
            : medicalInfo.medicalType == 'TJ'
            ? '体检报告'
            : ''
        }}
      </span>
      <span class="ml-20">{{ medicalInfo.visitDate }}</span>
    </div>
    <div>{{ medicalInfo.patientName }}</div>
    <div>
      <span>{{ medicalInfo.deptName }}</span>
      <span class="ml-20">{{ medicalInfo.doctorName }}</span>
      <span class="ml-20">{{ medicalInfo.title }}</span>
    </div>
  </div>
</template>
<script>
import { eventbus } from '@/utils'
import { getMedicalInfo } from '@/api/business'
export default {
  name: 'AuthorizeRecord',
  props: {
    body: Object,
  },
  data() {
    return {
      medicalInfo: {},
    }
  },
  created() {
    if (this.body.content) {
      this.getData()
    }
  },
  methods: {
    async getData() {
      this.medicalInfo = await getMedicalInfo({
        medicalId: this.body.content,
      })
    },
  },
  watch: {
    'body.optContent'(val) {
      console.log(val, '变化-----')
      if (val) {
        if (val === '已同意') {
          eventbus.$emit('UPDATE_MEDICAL_AUTH', this.body.content)
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.ml-20 {
  margin-left: 20px;
}
</style>
