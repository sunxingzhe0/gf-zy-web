<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:footertool>
        <el-button type="primary" @click="add()"> 新增模板 </el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="add(row)"> 修改 </el-button>
        <el-button class="danger" type="text" @click="del(row.id)">
          删除
        </el-button>
      </template>
    </List>
    <el-dialog
      :title="form.id ? '修改驳回原因' : '新增驳回原因'"
      :visible.sync="isreject"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item prop="content">
          <el-input
            type="textarea"
            placeholder="请输入"
            v-model="form.content"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 6, maxRows: 6 }"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isreject = false">取 消</el-button>
        <el-button type="primary" @click="rejectSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import { getRejectList, addReject, editReject, delReject } from '@/api/template'
export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: getRejectList }])],
  data() {
    this.filter = {
      date: {
        props: {
          options: [{ label: '创建时间', value: 0 }],
        },
        keys: ['timeType', 'startTime', 'endTime'],
      },
      search: {
        props: {
          options: [{ label: '内容', value: 0 }],
        },
        keys: ['searchType', 'searchKeywords'],
      },
      popover: [
        {
          props: {
            label: '使用次数',
            is: 'InputRange',
          },
          keys: ['numberMin', 'numberMax'],
        },
      ],
    }
    return {
      isreject: false,
      form: {
        content: '',
      },
      rules: {
        content: [{ required: true, message: '请输入驳回原因' }],
      },
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        fixed: {
          minWidth: 90,
        },
      },
    }
  },
  methods: {
    del(id) {
      this.$confirm('确定删除该模板吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await delReject({
          id: id,
        })
        this.$_fetchTableData(getRejectList)
        this.$message.success('操作成功!')
      })
    },
    add(row) {
      if (row) {
        this.form.id = row.id
        this.form.content = row.content
      } else {
        this.form.id = ''
        this.form.content = ''
      }
      this.isreject = true
    },
    rejectSubmit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          if (this.form.id) {
            // 编辑
            await editReject({
              ...this.form,
            })
            this.isreject = false
            this.$message.success('操作成功!')
            this.$_fetchTableData(getRejectList)
          } else {
            // 新增
            await addReject({
              ...this.form,
            })
            this.isreject = false
            this.$message.success('操作成功!')
            this.$_fetchTableData(getRejectList)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
// ::v-deep .table-wrap .cell{
//   font-size: 16px;
// }
// ::v-deep .el-table .cell.el-tooltip {
//   font-size: 14px;
//   // padding-left: 6px;
// }
</style>
