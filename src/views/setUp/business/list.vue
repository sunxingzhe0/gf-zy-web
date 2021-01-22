<template>
  <div
    :class="
      permissionNum([
        'DOC_WEB_SET_UP_BUSINESS_SETTINGS',
        'DRUG_STORE_SET_UP_BUSINESS_SETTINGS',
        'ORG_WEB_SET_UP_BUSINESS_SETTINGS',
      ]) < 2
        ? 'view__card'
        : ''
    "
  >
    <div
      v-if="
        checkPermission(['ORG_WEB_SET_UP_BUSINESS_SETTINGS']) &&
        !checkPermission(['DOC_WEB_SET_UP_BUSINESS_SETTINGS']) &&
        !checkPermission(['DRUG_STORE_SET_UP_BUSINESS_SETTINGS'])
      "
    >
      <DeptBus></DeptBus>
    </div>

    <div
      v-if="
        checkPermission(['DOC_WEB_SET_UP_BUSINESS_SETTINGS']) &&
        !checkPermission(['ORG_WEB_SET_UP_BUSINESS_SETTINGS']) &&
        !checkPermission(['DRUG_STORE_SET_UP_BUSINESS_SETTINGS'])
      "
    >
      <DocBus></DocBus>
    </div>

    <div
      v-if="
        checkPermission(['DRUG_STORE_SET_UP_BUSINESS_SETTINGS']) &&
        !checkPermission(['DOC_WEB_SET_UP_BUSINESS_SETTINGS']) &&
        !checkPermission(['ORG_WEB_SET_UP_BUSINESS_SETTINGS'])
      "
    >
      <PhaBus></PhaBus>
    </div>

    <el-tabs
      v-if="
        permissionNum([
          'DOC_WEB_SET_UP_BUSINESS_SETTINGS',
          'DRUG_STORE_SET_UP_BUSINESS_SETTINGS',
          'ORG_WEB_SET_UP_BUSINESS_SETTINGS',
        ]) > 1
      "
      type="border-card"
    >
      <el-tab-pane
        label="医生"
        lazy
        v-if="checkPermission(['DOC_WEB_SET_UP_BUSINESS_SETTINGS'])"
        ><DocBus></DocBus
      ></el-tab-pane>
      <el-tab-pane
        label="药房"
        lazy
        v-if="checkPermission(['DRUG_STORE_SET_UP_BUSINESS_SETTINGS'])"
        ><PhaBus></PhaBus
      ></el-tab-pane>
      <el-tab-pane
        label="机构"
        lazy
        v-if="checkPermission(['ORG_WEB_SET_UP_BUSINESS_SETTINGS'])"
        ><DeptBus></DeptBus
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import checkPermission from '@/utils/permission'
import permissionNum from '@/utils/permissionNum'
import DocBus from './components/docbusiness'
import PhaBus from './components/phabusiness'
import DeptBus from './components/deptbusiness'
export default {
  components: {
    DocBus,
    PhaBus,
    DeptBus,
  },

  data() {
    return {}
  },
  methods: {
    checkPermission,
    permissionNum,
  },
}
</script>
<style lang="scss" scoped></style>
