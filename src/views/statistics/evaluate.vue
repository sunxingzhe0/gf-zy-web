<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane
      label="医生端"
      name="first"
      v-if="checkPermission(['DOC_WEB_STATISTICS_EVALUATION_STATISTICS'])"
    >
      <Comment class="orderBtns"></Comment>
    </el-tab-pane>
    <el-tab-pane
      label="机构端"
      name="second"
      v-if="checkPermission(['ORG_WEB_STATISTICS_EVALUATION_STATISTICS'])"
    >
      <institutional class="orderBtns"></institutional>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import checkPermission from '@/utils/permission'
import Comment from './components/Comment'
import institutional from './components/institutional'
export default {
  components: {
    Comment,
    institutional,
  },
  data() {
    return {
      activeName: 'first',
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    checkPermission,
  },
}
</script>
<style lang="scss" scoped>
.orderBtns {
  margin-left: 10px;
}
</style>
