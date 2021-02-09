<template>
  <div class="accountWrap view__card">
    <el-tabs type="border-card" @tab-click="handleClick" v-model="name">
      <el-tab-pane label="基本信息" name="0">
        <div class="account_main">
          <base-info></base-info>
        </div>
      </el-tab-pane>
      <el-tab-pane label="诊疗范围" name="PRACTICE_AREA">
        <div class="account_main">
          <diagnosis-range
            text="诊疗范围"
            type="PRACTICE_AREA"
            ref="PRACTICE_AREA"
          ></diagnosis-range>
        </div>
      </el-tab-pane>
      <el-tab-pane label="奖惩办法公示" name="REWARD_METHOD">
        <div class="account_main">
          <diagnosis-range
            text="奖惩办法公示"
            type="REWARD_METHOD"
            ref="REWARD_METHOD"
          ></diagnosis-range>
        </div>
      </el-tab-pane>
      <el-tab-pane label="奖惩信息公示" name="REWARD_INFOMATION">
        <div class="account_main">
          <diagnosis-range
            text="奖惩信息公示"
            type="REWARD_INFOMATION"
            ref="REWARD_INFOMATION"
          ></diagnosis-range>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import BaseInfo from './components/BaseInfo'
import DiagnosisRange from './components/DiagnosisRange'
export default {
  components: { BaseInfo, DiagnosisRange },
  data() {
    return {
      name: '0',
    }
  },
  methods: {
    handleClick(e) {
      if (e.name != '0') {
        this.$refs[e.name].getInfo()
      }
      console.log(e)
    },
  },
}
</script>
<style lang="scss" scoped>
.accountWrap {
  padding: 0 !important;
  .account_main {
    padding: 30px 20px;
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
</style>
