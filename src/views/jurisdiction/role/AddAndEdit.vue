<template>
  <el-form
    class="view__card"
    ref="form"
    :model="model"
    :rules="rules"
    label-width="100px"
  >
    <el-form-item label="角色名称" prop="name">
      <el-input
        style="max-width: 400px"
        v-model="model.name"
        maxlength="20"
        show-word-limit
      ></el-input>
    </el-form-item>

    <el-form-item label="权限配置" prop="role">
      <el-tree
        :data="tree"
        show-checkbox
        node-key="id"
        ref="tree"
        highlight-current
        :props="{
          children: 'next',
          label: 'name',
        }"
      >
      </el-tree>
    </el-form-item>

    <el-form-item label="角色状态" prop="state">
      <el-radio v-model="model.state" :label="true">启用</el-radio>
      <el-radio v-model="model.state" :label="false">禁用</el-radio>
    </el-form-item>

    <EditFooter class="is-center">
      <el-button type="primary" size="small" @click="submit('form')">
        {{ id ? '保存' : '提交' }}
      </el-button>
    </EditFooter>
  </el-form>
</template>

<script>
import { EditFooter } from '@/components'
import { invalidFieldSetFocus } from '@/utils'
import {
  roleGet,
  roleInsert,
  roleEdit,
  rolePermissionList,
} from '@/api/authority'

const pre = {
  role: {},
}

export default {
  name: 'AddAndEdit',
  props: {
    id: String,
  },
  components: {
    EditFooter,
  },
  data() {
    this.rules = {
      name: [{ required: true, message: '请输入内容', trigger: 'blur' }],
    }
    this.tree = pre.tree

    return {
      loading: false,
      model: {
        id: this.id,
        name: pre.role.name ?? '',
        state: pre.role.state ?? true,
      },
    }
  },
  async beforeRouteEnter(to, from, next) {
    const { id } = to.params

    ;[pre.tree, pre.role] = await Promise.all([
      rolePermissionList(), // get tree
      id ? roleGet({ id }) : [], // get detail
    ])

    next()
  },
  mounted() {
    this.$nextTick(() => {
      this.id && this.$refs.tree.setCheckedKeys(pre.role.permissionList ?? [])
    })
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(async (valid, invalidFields) => {
        if (valid) {
          this.loading = true
          await (this.model.id ? roleEdit : roleInsert)({
            ...this.model,
            permissionList: this.$refs.tree.getCheckedKeys(true),
          }).finally(() => setTimeout(() => (this.loading = false), 200))

          this.$message({
            type: 'success',
            message: '完成',
            showClose: true,
          })

          this.$router.push({
            path: '/jurisdiction/role/list',
            query: { flag: 1 },
          })
        } else {
          invalidFieldSetFocus(this.$refs[formName], invalidFields)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-tree > .el-tree-node + .el-tree-node {
    margin-top: 30px;
  }

  .c__edit-footer {
    z-index: 1;
  }
}
</style>
