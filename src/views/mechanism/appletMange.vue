<template>
  <div class="applet">
    <el-tabs v-model="activeName">
      <el-tab-pane label="版本操作" name="handle"></el-tab-pane>
      <el-tab-pane label="版本详情" name="detail"></el-tab-pane>
    </el-tabs>
    <VersionHandle v-if="activeName == 'handle'" />
    <VersionDetail v-else />
  </div>
</template>

<script>
import VersionHandle from './components/AlipayVersion/Handle'
import VersionDetail from './components/AlipayVersion/Detail'
export default {
  components: { VersionHandle, VersionDetail },
  data() {
    return {
      activeName: 'handle',
    }
  },
}
</script>

<style lang="scss" scoped>
.applet {
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 10px 20px 20px;
}
</style>
