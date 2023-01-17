<template>
  <section
    :class="
      checkPermissionNum([
        'ORG_WEB_USER_MENU_USER_MANAGEMENT',
        'XZ_ORG_XZ_USER_XZ_PATIENT',
      ]) > 1 ||
      checkPermissionNum([
        'DOC_WEB_PATIENT_MY_PATIENTS',
        'XZ_ORG_XZ_USER_XZ_MY_PATIENT',
      ]) > 1
        ? 'view__statistics-mind'
        : 'view__card'
    "
  >
    <el-tabs
      type="border-card"
      v-model="activeName"
      v-if="
        checkPermissionNum([
          'ORG_WEB_USER_MENU_USER_MANAGEMENT',
          'XZ_ORG_XZ_USER_XZ_PATIENT',
        ]) > 1 ||
        checkPermissionNum([
          'DOC_WEB_PATIENT_MY_PATIENTS',
          'XZ_ORG_XZ_USER_XZ_MY_PATIENT',
        ]) > 1
      "
    >
      <el-tab-pane
        v-if="
          checkPermission([
            'DOC_WEB_PATIENT_MY_PATIENTS',
            'ORG_WEB_USER_MENU_USER_MANAGEMENT',
          ])
        "
        label="互联网患者"
        name="hl"
      >
      </el-tab-pane>
      <el-tab-pane
        v-if="
          checkPermission([
            'XZ_ORG_XZ_USER_XZ_MY_PATIENT',
            'XZ_ORG_XZ_USER_XZ_PATIENT',
          ])
        "
        label="心咨患者"
        name="xz"
      >
      </el-tab-pane>
    </el-tabs>
    <div class="mind-content" v-if="show">
      <List v-if="activeName === 'hl'" />
      <MindList v-if="activeName === 'xz'" />
    </div>
  </section>
</template>

<script>
import List from './List'
import MindList from './MindList'
import checkPermission from '@/utils/permission'
import checkPermissionNum from '@/utils/permissionNum'
export default {
  name: 'patient_mine',
  components: { List, MindList },
  data() {
    return {
      activeName: checkPermission([
        'DOC_WEB_PATIENT_MY_PATIENTS',
        'ORG_WEB_USER_MENU_USER_MANAGEMENT',
      ])
        ? 'hl'
        : 'xz',
      show: true,
    }
  },
  watch: {
    $route(to, from) {
      console.log(to, from)
      if (
        (from.path === '/patient/patientTube/list' &&
          to.path === '/patient/mine/list') ||
        (from.path === '/patient/mine/list' &&
          to.path === '/patient/patientTube/list')
      ) {
        this.resetData()
      }
    },
  },
  methods: {
    checkPermissionNum,
    checkPermission,
    resetData() {
      this.show = false
      this.activeName = checkPermission([
        'DOC_WEB_PATIENT_MY_PATIENTS',
        'ORG_WEB_USER_MENU_USER_MANAGEMENT',
      ])
        ? 'hl'
        : 'xz'
      setTimeout(() => {
        this.show = true
      }, 0)
    },
  },
}
</script>

<style lang="scss" scoped>
.view__statistics-mind {
  background-color: #ffffff;
  .mind-content {
    padding: 0 15px 15px;
  }
  &::v-deep {
    .c__list {
      height: calc(100vh - 120px);
    }
    .c__filter {
      background-color: #ffffff;
    }
    .el-tabs--border-card > .el-tabs__content {
      padding: 15px 0 0;
    }
    .el-tabs--border-card {
      border-width: 0;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0);
    }
    .el-tabs--border-card > .el-tabs__header {
      border: 0;
      background-color: #f2f2f2;
    }
    .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
      border: 1px solid transparent;
    }
  }
}
</style>
