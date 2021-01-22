<template>
  <div class="view__card">
    <List></List>
    <!-- <el-tabs type="border-card">
      <el-tab-pane
        label="药房"
        lazy
        v-if="checkPermission(['DRUG_STORE_SET_UP_BUSINESS_SETTINGS'])"
        ><List scope="YF"></List
      ></el-tab-pane>
      <el-tab-pane label="个人" lazy><List scope="GR"></List></el-tab-pane>
    </el-tabs> -->
  </div>
</template>
<script>
import checkPermission from '@/utils/permission'
// import DocBus from './components/docbusiness'
// import PhaBus from './components/phabusiness'
import List from './List'

export default {
  components: {
    List,
  },

  data() {
    return {}
  },
  methods: {
    checkPermission,
  },
}
</script>
<style lang="scss" scoped></style>
