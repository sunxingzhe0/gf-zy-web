<template>
  <div class="c__column-custom el-icon-more" @click.self="visible = true">
    <el-dialog
      :visible.sync="visible"
      title="自定义数据显示"
      custom-class="c__column-custom-dialog"
      append-to-body
      @open="handleOpen"
    >
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        >全选</el-checkbox
      >
      <el-checkbox-group
        v-model="checkedColumn"
        @change="handleCheckedColumnChange"
      >
        <el-checkbox
          v-for="{ prop, label, disabled } in columns"
          :label="prop"
          :key="prop"
          :disabled="disabled"
          >{{ label }}</el-checkbox
        >
      </el-checkbox-group>

      <template v-slot:footer>
        <el-button size="mini" @click="visible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="handleConfirmClick"
          >确认</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { union, difference } from 'lodash'

export default {
  name: 'CellCustom',
  model: {
    prop: 'columns',
    event: 'change',
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      checkAll: false,
      checkedColumn: [],
      isIndeterminate: false,
    }
  },
  computed: {
    col() {
      return this.columns.reduce(
        (_, { prop, disabled }) => {
          _[disabled ? 'disabled' : 'enable'].push(prop)
          return _
        },
        {
          enable: [],
          disabled: [],
        },
      )
    },
  },
  methods: {
    handleOpen() {
      const checkedColumn = this.columns.reduce(
        (_, { prop, checked }) => (checked && _.push(prop), _),
        [],
      )

      this.checkedColumn = checkedColumn
      this.checkAll = checkedColumn.length === this.columns.length
      this.isIndeterminate =
        !!checkedColumn.length && checkedColumn.length !== this.columns.length
    },
    handleCheckAllChange(val) {
      this.checkedColumn = val
        ? union(this.checkedColumn, this.col.enable)
        : difference(this.checkedColumn, this.col.enable)
      this.isIndeterminate =
        !!this.checkedColumn.length &&
        this.checkedColumn.length !== this.columns.length
    },
    handleCheckedColumnChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.columns.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.columns.length
    },
    handleConfirmClick() {
      this.$emit(
        'change',
        this.columns.map(
          item => (
            (item.checked = this.checkedColumn.includes(item.prop)), item
          ),
        ),
      )

      this.visible = false
    },
  },
}
</script>

<style lang="scss">
.c__column-custom {
  position: absolute;
  top: -5px;
  right: 0;
  margin-right: -10px;
  padding: 10px;
  cursor: pointer;
}

.c__column-custom-dialog {
  .el-checkbox-group {
    margin-top: 10px;
  }
}
</style>
