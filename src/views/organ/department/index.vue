<template>
  <div class="accountWrap view__card">
    <el-tabs type="border-card" v-model="active">
      <el-tab-pane label="互联网科室" name="0" lazy>
        <HList :dept="dept" @deptChange="deptChange"></HList>
      </el-tab-pane>
      <el-tab-pane label="预约挂号科室" name="1" lazy>
        <GList></GList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import HList from './HList'
import GList from './GList'
import { deptOuterPdeptList } from '@/api/organization'
const pre = {
  dept: [],
}
export default {
  components: {
    GList,
    HList,
  },
  data() {
    return {
      active: '0',
      dept: pre.dept,
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
  padding: 0;
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
</style>
