<template>
  <div>
    <el-dialog
      title="使用药品"
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      width="80%"
    >
      <div class="list">
        <List
          v-model="query"
          :columns="columns"
          :tableData="tableData"
          :filter="filter"
        >
        </List>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import { getDrugsList } from '@/api/dictionary'
export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: getDrugsList }])],
  data() {
    return {
      title: '',
      isAdd: false,
      query: {
        pageSize: 10,
        currentNum: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        drugPharmacyList: {
          hidden: true,
        },
        price: {
          formatter(row) {
            return '￥' + row.price
          },
        },
        deptNames: {
          minWidth: 160,
        },
        pharmacyNames: {
          minWidth: 160,
        },
      },
      filter: {
        search: {
          // props: {},
          // keys: ['searchType', 'searchKeywords'],
        },
      },
    }
  },

  methods: {
    open(row) {
      this.query.mechanismId = this.$store.state.user.YF
      this.query.searchUnitId = row.orgUnitId
      this.isAdd = true
      this.$_fetchTableData(getDrugsList)
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
