<template>
  <div>
    <keep-alive :include="keepLiveList">
      <router-view :key="$route.fullpath"></router-view>
    </keep-alive>
  </div>
</template>
<script>
export default {
  computed: {
    keepLiveList() {
      return this.$store.state.user.keepLiveList
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.view__card {
  padding: $app-router-view-padding;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  background: $--color-white;
  overflow: auto;
  min-height: calc(100vh - 52px);
}
</style>
