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
  props: {
    getId: {
      type: String,
    },
  },
  data() {
    return {
      dialogVisible: false,
      query: {
        pageSize: 10,
        dateType: 0,
        searchType: 0,
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
    open() {
      this.query.orderId = this.getId
      this.dialogVisible = true
      this.$_fetchTableData(seeSubRecord)
    },
  },
}
</script>
