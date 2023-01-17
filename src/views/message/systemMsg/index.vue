<template>
  <div
    :class="
      permissionNum([
        'ORG_WEB_SET_UP_SYSTEM_MESSAGE',
        'DRUG_STORE_SET_UP_SYSTEM_MESSAGE',
        'DOC_WEB_SET_UP_SYSTEM_MESSAGE',
        'DRUG_DOC_NEWS_SYSTEM_MESSAGE',
      ]) < 2
        ? 'view__card'
        : ''
    "
  >
    <div
      v-if="
        permissionNum([
          'ORG_WEB_SET_UP_SYSTEM_MESSAGE',
          'DRUG_STORE_SET_UP_SYSTEM_MESSAGE',
          'DOC_WEB_SET_UP_SYSTEM_MESSAGE',
          'DRUG_DOC_NEWS_SYSTEM_MESSAGE',
        ]) < 2
      "
    >
      <List
        :scope="
          platform == 'ORG_WEB' ? 'JG' : platform == 'DRUG_STORE' ? 'YF' : 'GR'
        "
      ></List>
    </div>

    <el-tabs type="border-card" v-else>
      <el-tab-pane
        label="机构"
        lazy
        v-if="checkPermission(['ORG_WEB_SET_UP_SYSTEM_MESSAGE'])"
        ><List scope="JG"></List
      ></el-tab-pane>
      <el-tab-pane
        label="药房"
        lazy
        v-if="checkPermission(['DRUG_STORE_SET_UP_SYSTEM_MESSAGE'])"
        ><List scope="YF"></List
      ></el-tab-pane>

      <el-tab-pane
        label="个人"
        lazy
        v-if="
          checkPermission([
            'DOC_WEB_SET_UP_SYSTEM_MESSAGE',
            'DRUG_DOC_NEWS_SYSTEM_MESSAGE',
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
import { mapState } from 'vuex'
export default {
  name: 'message_systemMsg',
  components: {
    List,
  },

  data() {
    return {}
  },
  computed: {
    ...mapState('user', ['platform']),
  },
  methods: {
    checkPermission,
    permissionNum,
  },
}
</script>
<style lang="scss" scoped></style>
