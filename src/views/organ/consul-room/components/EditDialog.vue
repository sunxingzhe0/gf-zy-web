<template>
  <el-dialog
    :title="`${code ? '修改' : '新增'}咨询室`"
    :visible.sync="show"
    :before-close="closeDialog"
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="编码:" v-if="code">
        <el-input v-model="code" disabled></el-input>
      </el-form-item>
      <el-form-item label="名称:" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序:" prop="sortNum">
        <el-input type="number" v-model="form.sortNum"></el-input>
      </el-form-item>
      <el-form-item label="类型:" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio label="预约"></el-radio>
          <el-radio label="团体"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="true">启用</el-radio>
          <el-radio :label="false">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="resetForm()">取 消</el-button>
      <el-button type="primary" @click="submitForm()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addRoom, editRoom } from '../../../../api/mindConsult/consultRoom'
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
    },
  },
  data() {
    return {
      editId: null,
      code: null,
      form: {
        name: null,
        sortNum: null,
        type: null,
        status: null,
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
      },
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        if (this.editId) {
          await editRoom({
            id: this.editId,
            ...this.form,
          })
        } else {
          await addRoom({ ...this.form })
        }
        this.$refs.form.resetFields()
        this.$emit('submit')
      })
    },
    resetForm() {
      this.$emit('cancel')
      this.$refs.form?.resetFields()
    },
    closeDialog() {
      this.$emit('close')
    },
  },
  watch: {
    data() {
      this.editId = this.data?.id || null
      this.code = this.data?.serialNum || null
      this.form = {
        name: this.data?.name || null,
        sortNum: this.data?.sortNum || null,
        type: this.data?.type || null,
        status: this.data?.status,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding-bottom: 0;
}
</style>
