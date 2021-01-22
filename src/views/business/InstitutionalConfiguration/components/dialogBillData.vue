<template>
  <div>
    <el-dialog
      :title="'日志'"
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      width="80%"
    >
      <div class="list" v-if="isAdd">
        <List v-model="query" :columns="columns" :tableData="tableData"> </List>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import { loggerBillData } from '@/api/log'
export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: loggerBillData }])],
  data() {
    return {
      isAdd: false,
      query: {
        pageSize: 10,
        currentNum: 1,
        businessRel: '',
      },
      columns: {
        index: {
          hidden: true,
        },
        storeName: {
          hidden: true,
        },
      },
    }
  },

  methods: {
    open(row) {
      console.log(row)
      this.query.currentNum = 1
      this.query.businessRel = row.configId
      this.isAdd = true
      this.$_fetchTableData(loggerBillData)
    },
  },
}
</script>
<style lang="scss" scoped>
.list {
  ::v-deep.c__list .table-wrap {
    max-height: 58vh;
  }
}
</style>
