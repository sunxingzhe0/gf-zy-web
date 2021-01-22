<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane
      label="医生"
      name="first"
      lazy
      v-if="checkPermission(['DOC_WEB_STATISTICS_ORDER_STATISTICS'])"
    >
      <OrderDoctor class="orderBtns"></OrderDoctor>
    </el-tab-pane>
    <el-tab-pane
      label="药房"
      name="second"
      lazy
      v-if="checkPermission(['DRUG_STORE_STATISTICS_ORDER_STATISTICS'])"
    >
      <Singleder class="orderBtns"></Singleder>
    </el-tab-pane>

    <el-tab-pane
      label="机构"
      name="third"
      lazy
      v-if="checkPermission(['ORG_WEB_STATISTICS_ORDER_STATISTICS'])"
    >
      <mechanism class="orderBtns"></mechanism>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import OrderDoctor from './components/OrderDoctor'
import Singleder from './components/Singleder'
import mechanism from './components/mechanism'
import checkPermission from '@/utils/permission'
export default {
  components: {
    OrderDoctor,
    Singleder,
    mechanism,
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
