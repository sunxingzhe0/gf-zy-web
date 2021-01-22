<template>
  <div class="accountWrap view__card">
    <el-tabs type="border-card">
      <el-tab-pane label="账号信息" lazy>
        <div class="account_main">
          <account-info></account-info>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="基本信息"
        lazy
        v-if="checkPermission(['DOC_WEB', 'DRUG_DOC', 'ORG_WEB'])"
      >
        <div class="account_main">
          <base-info></base-info>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="实名信息"
        lazy
        v-if="checkPermission(['DRUG_DOC', 'DOC_WEB'])"
      >
        <div class="account_main">
          <real-name></real-name>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="资格证书"
        lazy
        v-if="checkPermission(['DRUG_DOC', 'DOC_WEB'])"
      >
        <div class="account_main">
          <qualification-info></qualification-info>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="其他信息"
        lazy
        v-if="checkPermission(['DRUG_DOC', 'DOC_WEB'])"
      >
        <div class="account_main">
          <other-info></other-info>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import checkPermission from '@/utils/permission'
import accountInfo from './components/accountInfo'
import baseInfo from './components/baseInfo'
import realName from './components/realName'
import qualificationInfo from './components/qualificationInfo'
import otherInfo from './components/otherInfo'
export default {
  components: { accountInfo, baseInfo, realName, qualificationInfo, otherInfo },
  methods: {
    checkPermission,
  },
}
</script>
<style lang="scss" scoped>
.accountWrap {
  padding: 0;
  .account_main {
    padding: 50px;
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
