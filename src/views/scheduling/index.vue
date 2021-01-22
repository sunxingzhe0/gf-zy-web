<template>
  <div class="view__card schedule-wrapper">
    <shift></shift>
  </div>
</template>
<script>
import shift from './components/shift'
export default {
  components: { shift },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
}
</script>
<style lang="scss" scoped>
.schedule-wrapper {
  height: calc(100vh - 52px);
  overflow: hidden;
}
</style>
