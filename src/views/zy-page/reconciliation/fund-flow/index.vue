<template>
  <div class="accountWrap view__card">
    <el-tabs type="border-card" v-model="active" @tab-click="changeTab">
      <el-tab-pane label="微信流水" name="0"> <BankList /> </el-tab-pane>
      <el-tab-pane label="支付宝流水" name="1"> <ZfbList /></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import BankList from './list.vue'
import ZfbList from './zfbData.vue'
export default {
  name: 'checkBill_fundFlow',
  components: { BankList, ZfbList },
  data() {
    return {
      active: '0',
    }
  },
  methods: {
    changeTab(e) {
      e.index == 1 && this.$EventBus.$emit('changeTab')
    },
  },
}
</script>
<style lang="scss" scoped>
.accountWrap {
  padding: 0 !important;
  .account_main {
    padding: 0 90px;
    ::v-deep.ck-content {
      min-height: 300px;
    }
  }
  .el-tabs--border-card {
    border: 0;
    box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
  }
  ::v-deep.el-tabs--border-card > .el-tabs__header {
    border: 0;
    background-color: #f2f2f2;
  }
  ::v-deep.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    border: 1px solid transparent;
  }
}
::v-deep .el-table .cell {
  line-height: 20px;
}
::v-deep .table-wrap .cell {
  font-size: 16px;
}
::v-deep .el-table .cell.el-tooltip {
  font-size: 14px;
  padding-left: 6px;
}
</style>
