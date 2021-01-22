<template>
  <el-dialog title="处方提交记录" :visible.sync="dialogVisible" width="60%">
    <List v-model="query" :columns="columns" :tableData="tableData"> </List>
  </el-dialog>
</template>

<script>
import { List, mixin } from '@/components'
import { seeSubRecord } from '@/api/prescription'

export default {
  name: 'TableList',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: seeSubRecord })],
  data() {
    return {
      dialogVisible: false,
      query: {
        currentNum: 10,
        pageSize: 1,
        orderId: '',
      },
    }
  },
  computed: {
    columns() {
      return {
        createTime: {
          minWidth: 160,
        },
        index: {
          hidden: true,
        },
      }
    },
  },
  methods: {
    open(id) {
      this.query.orderId = id
      this.dialogVisible = true
      this.$_fetchTableData(seeSubRecord)
    },
  },
}
</script>
