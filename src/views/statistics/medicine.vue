<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane
      label="药房端"
      name="first"
      v-if="checkPermission(['DRUG_STORE_STATISTICS_DRUG_STATISTICS'])"
    >
      <Drugorders class="orderBtns"></Drugorders>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import checkPermission from '@/utils/permission'
import Drugorders from './components/Drugorders'
export default {
  components: {
    Drugorders,
  },
  data() {
    return {
      activeName: 'first',
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    checkPermission,
  },
}
</script>
<style lang="scss" scoped>
.orderBtns {
  margin-left: 10px;
}
</style>
