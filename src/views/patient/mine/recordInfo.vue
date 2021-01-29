<template>
  <div class="info">
    <TreatmentHistoryInfo :medicalId="medicalId"></TreatmentHistoryInfo>
  </div>
</template>

<script>
import { TreatmentHistoryInfo } from '@/components/App'
export default {
  components: {
    TreatmentHistoryInfo,
  },
  data() {
    return {
      medicalId: '',
    }
  },
  created() {
    console.log(this.$route.params, '路由参数')
    this.medicalId = this.$route.params.medicalId
  },
}
</script>

<style lang="scss" scoped>
.info {
  padding: 20px;
  background: #fff;
}
</style>
