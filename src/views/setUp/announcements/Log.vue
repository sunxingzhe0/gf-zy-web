<template>
  <el-dialog
    title="操作日志"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="handleClose"
  >
    <List v-model="query" :tableData="tableData" :columns="columns"></List>
  </el-dialog>
</template>

<script>
import { List, mixin } from '@/components'
import { singleLog } from '@/api/setup'
export default {
  name: 'Log',
  components: { List },
  mixins: [mixin([{ fetchListFunction: singleLog }])],
  data() {
    return {
      query: {
        pageSize: 10,
        currentNum: 1,
        businessRel: '',
      },
      // 弹框
      dialogVisible: false,
      columns: {
        index: {
          hidden: true,
        },
      },
    }
  },
  methods: {
    open(id) {
      this.query.businessRel = id
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
  },
}
</script>
