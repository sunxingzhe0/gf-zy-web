<template>
  <div class="accountWrap view__card">
    <el-tabs type="border-card" v-model="active">
      <el-tab-pane label="互联网科室" name="0">
        <HList :dept="dept" @deptChange="deptChange"></HList>
      </el-tab-pane>
      <el-tab-pane label="预约挂号科室" name="1">
        <GList></GList>
      </el-tab-pane>
      <el-tab-pane label="心咨科室" name="3">
        <XList />
      </el-tab-pane>
      <el-tab-pane label="科室简介" name="2">
        <DepetInfoList></DepetInfoList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import HList from './HList'
import GList from './GList'
import XList from './XList'
import DepetInfoList from './depetInfoList.vue'
import { deptOuterPdeptList } from '@/api/organization'
const pre = {
  dept: [],
}
export default {
  name: 'organ_department',
  components: {
    GList,
    HList,
    DepetInfoList,
    XList,
  },
  data() {
    return {
      active: '0',
      dept: pre.dept,
    }
  },
  created() {
    if (this.$route.query.active) {
      this.active = this.$route.query.active
    }
  },
  mounted() {},
  async beforeRouteEnter(to, from, next) {
    ;[pre.dept] = await Promise.all([
      pre.dept.length
        ? pre.dept
        : deptOuterPdeptList({ tree: false, type: 'WEB' }),
    ])

    next()
  },
  methods: {
    deptChange(list) {
      this.dept = list
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
