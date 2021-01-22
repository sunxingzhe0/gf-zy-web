<template>
  <div
    :class="
      permissionNum([
        'ORG_WEB_SET_UP_LOG_MANAGEMENT',
        'DRUG_STORE_SET_UP_LOG_MANAGEMENT',
        'DOC_WEB_SET_UP_LOG_MANAGEMENT',
        'DRUG_DOC_SET_UP_LOG_SETTING',
      ]) < 2
        ? 'view__card'
        : ''
    "
  >
    <div
      v-if="
        permissionNum([
          'ORG_WEB_SET_UP_LOG_MANAGEMENT',
          'DRUG_STORE_SET_UP_LOG_MANAGEMENT',
          'DOC_WEB_SET_UP_LOG_MANAGEMENT',
          'DRUG_DOC_SET_UP_LOG_SETTING',
        ]) < 2
      "
    >
      <List
        :scope="
          clientType == 'ORG_WEB'
            ? 'JG'
            : clientType == 'DRUG_STORE'
            ? 'YF'
            : 'GR'
        "
      ></List>
    </div>
    <el-tabs type="border-card" v-else>
      <el-tab-pane
        label="机构"
        lazy
        v-if="checkPermission(['ORG_WEB_SET_UP_LOG_MANAGEMENT'])"
        ><List scope="JG"></List
      ></el-tab-pane>
      <el-tab-pane
        label="药房"
        lazy
        v-if="checkPermission(['DRUG_STORE_SET_UP_LOG_MANAGEMENT'])"
        ><List scope="YF"></List
      ></el-tab-pane>
      <el-tab-pane
        label="个人"
        lazy
        v-if="
          checkPermission([
            'DOC_WEB_SET_UP_LOG_MANAGEMENT',
            'DRUG_DOC_SET_UP_LOG_SETTING',
          ])
        "
        ><List scope="GR"></List
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import checkPermission from '@/utils/permission'
import permissionNum from '@/utils/permissionNum'
// import DocBus from './components/docbusiness'
// import PhaBus from './components/phabusiness'
import List from './list'

export default {
  components: {
    List,
  },

  data() {
    return {
      clientType: this.$store.state.user.platform,
    }
  },
  mounted() {},
  methods: {
    checkPermission,
    permissionNum,
  },
}
</script>
<style lang="scss" scoped>
// .view__card_only {
//   padding: 20px;
//   box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
//   border-radius: 2px;
//   background: #ffffff;
// }
</style>
