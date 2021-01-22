<template>
  <el-dialog
    title="常用药品"
    top="10vh"
    :visible.sync="show"
    class="common-drugs"
  >
    <el-table
      ref="table"
      :data="list"
      height="100%"
      highlight-current-row
      @selection-change="selectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="药品名称" prop="orgDrugName"></el-table-column>
      <el-table-column label="规格" prop="spec"></el-table-column>
      <el-table-column label="医保属性" prop="medicare">
        <template slot-scope="{ row }">
          {{ medicares[row.medicare] }}
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div class="is-center">
        <el-button size="small" @click="$emit('update:visible', false)">
          取消
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="importHandler"
          :disabled="!selected.length"
        >
          导入
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import { Medicares } from '../enums'
import { DrugItem } from '../constant'
import { oftenDrug } from '@/api/prescription'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: [],
      selected: [],
      medicares: Medicares,
    }
  },
  computed: {
    show: {
      get() {
        return this.visible
      },
      set() {
        this.$emit('update:visible', false)
      },
    },
  },
  methods: {
    // 加载药品
    async loadDrugs() {
      if (this.list.length) {
        this.$refs.table.clearSelection()
        return
      }
      this.list = await oftenDrug()
    },
    selectionChange(value) {
      this.selected = value
    },
    importHandler() {
      const selected = this.selected.map(item => {
        item.name = item.orgDrugName
        const drug = Object.assign({}, DrugItem, item)
        delete drug.orgDrugName
        return drug
      })
      this.$emit('confirmDrugs', selected)
    },
  },
  watch: {
    visible(val) {
      if (val) this.loadDrugs()
    },
  },
}
</script>
<style lang="scss" scoped>
.common-drugs ::v-deep {
  .el-dialog {
    height: 80vh;
    display: flex;
    overflow: hidden;
    flex-direction: column;
  }
  .el-dialog__body {
    flex: 1;
    overflow: hidden;
  }
}
</style>
