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
    this.medicalId = this.$route.query.medicalId
  },
  // beforeRouteLeave(to, from, next) {
  //   // 设置下一个路由的 meta
  //   to.meta.keepAlive = true // 详情 缓存，不刷新
  //   next()
  // },
}
</script>

<style lang="scss" scoped>
.info {
  padding: 20px;
  background: #fff;
}
</style>
