<template>
  <section class="view__card" v-loading="loading">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      showSelection
    >
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="hadnleEdit(row)">修改</el-button>

        <el-popconfirm
          style="margin-left: 10px;"
          title="确定删除吗？"
          @confirm="handleDel([row.id])"
        >
          <el-button slot="reference" type="text">删除</el-button>
        </el-popconfirm>
      </template>

      <template v-slot:footertool>
        <el-button type="primary" size="mini" @click="dialog.visible = true">
          新增常用语
        </el-button>

        <el-popconfirm
          style="margin-left: 10px;"
          title="确定删除吗？"
          @confirm="handleDel(tableData.multipleSelection.map(_ => _.id))"
        >
          <el-button
            slot="reference"
            size="mini"
            :disabled="!tableData.multipleSelection.length"
          >
            批量删除
          </el-button>
        </el-popconfirm>
      </template>
    </List>

    <el-dialog
      :title="dialog.model.id ? '修改常用语' : '新增常用语'"
      :visible.sync="dialog.visible"
      append-to-body
      custom-class="component__dialog"
      @closed="handleClosed"
      :close-on-click-modal="false"
    >
      <el-scrollbar>
        <el-form ref="form" :model="dialog.model" :rules="rules">
          <el-form-item prop="content">
            <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 10 }"
              placeholder="请输入内容"
              v-model="dialog.model.content"
              maxlength="100"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <template v-slot:footer>
        <div class="is-center">
          <el-button size="mini" @click="dialog.visible = false">
            取消
          </el-button>
          <el-button
            size="mini"
            type="primary"
            :loading="dialog.loading"
            @click="submit('form')"
          >
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import {
  findTemplateData,
  addTemplate,
  editTemplate,
  delTemplate,
} from '@/api/template'
import { invalidFieldSetFocus } from '@/utils'

export default {
  name: 'TableList',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: findTemplateData })],
  data() {
    return {
      query: {
        currentNum: 1,
        pageSize: 10,
        dateType: 0,
        searchType: 0,
      },

      dialog: {
        loading: false,
        visible: false,
        model: {
          content: '',
        },
      },
    }
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [{ label: '创建时间', value: 0 }],
          },
          keys: ['dateType'],
        },
        search: {
          props: {
            options: [{ label: '内容', value: 0 }],
          },
          keys: ['searchType', 'searchKeyWords'],
        },
        popover: [
          {
            props: {
              label: '使用次数',
              is: 'InputRange',
            },
            keys: ['startNum', 'endNum'],
          },
        ],
      }
    },
    columns() {
      return {
        index: {
          hidden: true,
        },
        content: {
          minWidth: 200,
        },
        createTime: {
          minWidth: 120,
        },
        opt: {
          hidden: true,
        },
        fixed: {
          minWidth: 100,
        },
      }
    },
    rules() {
      return {
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
      }
    },
  },
  methods: {
    async resolveSortChange() {
      this.$message({
        type: 'success',
        message: '完成',
        showClose: true,
      })

      this.$_fetchTableData()
    },

    hadnleEdit({ id, content }) {
      this.dialog.model = {
        id,
        content,
      }
      this.dialog.visible = true
    },

    async handleDel(ids) {
      await Promise.all(ids.map(id => delTemplate({ id })))

      this.tableData.list.length === 1 &&
        this.query.currentNum > 1 &&
        this.query.currentNum--

      this.$_fetchTableData()
      this.$message({
        type: 'success',
        message: '完成',
        showClose: true,
      })
    },

    submit(formName) {
      this.$refs[formName].validate(async (valid, invalidFields) => {
        if (valid) {
          this.dialog.loading = true
          await (this.dialog.model.id ? editTemplate : addTemplate)(
            this.dialog.model,
          ).finally(() => setTimeout(() => (this.dialog.loading = false), 200))

          this.$message({
            type: 'success',
            message: '完成',
            showClose: true,
          })

          this.dialog.visible = false

          this.$_fetchTableData()
        } else {
          invalidFieldSetFocus(this.$refs[formName], invalidFields)
        }
      })
    },

    handleClosed() {
      this.$refs.form.resetFields()
      this.dialog.model = { content: '' }
    },
  },
}
</script>
