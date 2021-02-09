<template>
  <div>
    <el-dialog
      :title="title + '启用药品'"
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      width="80%"
    >
      <div class="list">
        <List v-model="query" :columns="columns" :tableData="tableData">
          <template v-slot:slot_retailPrice="{ row }">
            ￥{{ row.retailPrice }}
          </template>
          <template v-slot:slot_status="{ row }">
            {{ row.status ? '禁用' : '启用' }}
          </template>
          <template v-slot:slot_attr="{ row }">
            {{ row.attr ? '特殊' : '普通' }}
          </template>
        </List>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import { getDrugsList } from '@/api/organization'
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
        mechanismId: '',
      },
      columns: {
        index: {
          hidden: true,
        },
        seq: {
          hidden: true,
        },
        status: {
          prop: 'slot_status',
        },
        attr: {
          prop: 'slot_attr',
        },
        basicUnit: {
          minWidth: 120,
        },
        regularUnit: {
          minWidth: 120,
        },
        commonName: {
          minWidth: 100,
        },
        basicUnitText: {
          minWidth: 120,
        },
        regularUnitText: {
          minWidth: 120,
        },
        //是否拆零
        split: {
          formatter(row) {
            return row.split ? '是' : '否'
          },
        },
        retailPrice: {
          prop: 'slot_retailPrice',
        },
      },
    }
  },

  methods: {
    open(row) {
      this.query.currentNum = 1
      console.log(row.id)
      this.title = row.name
      this.query.mechanismId = row.id
      this.query.status = false

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
