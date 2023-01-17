<template>
  <div class="view__card" v-loading.lock="xList.loading">
    <List
      v-model="xList.query"
      :filter="filter"
      :columns="xList.columns"
      :tableData="xList.tableData"
      tableClass="hl-table"
    >
      <template v-slot:slot_docNum="{ row }">
        <router-link
          v-if="row.docNum != 0"
          class="el-button el-button--text el-button--mini"
          :to="{
            path: '/jurisdiction/account/list',
            query: {
              deptId: row.id,
            },
          }"
        >
          {{ row.docNum }}
        </router-link>
        <span v-else>{{ row.docNum }}</span>
      </template>

      <template v-slot:slot_seq="{ row }">
        <EditableText
          icon="el-icon-edit"
          v-model="row.seq"
          @confirm="confirm($event, row.id)"
        ></EditableText>
      </template>

      <template v-slot:slot_state="{ row }">
        <el-switch
          v-model="row.state"
          @change="setEnable(row)"
          active-text="启用"
          inactive-text="禁用"
          :width="50"
          class="textSwitch"
        >
        </el-switch>
      </template>
      <template v-slot:footertool>
        <el-button plain type="primary" @click="openSync"> 同步 </el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="add(row)"> 编辑 </el-button>
        <el-popconfirm @confirm="delItem(row)" title="是否确认删除">
          <el-button type="text" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </List>
    <el-dialog
      :title="form.id ? '修改科室' : '新增科室'"
      :close-on-click-modal="false"
      :visible.sync="openEidt"
      :before-close="closeEdit"
      width="600px"
    >
      <el-form :model="form" ref="ruleForm" v-if="openEidt" label-width="80px">
        <el-form-item label="所属院区">
          <div>{{ row.addName || '-' }}</div>
        </el-form-item>
        <el-form-item label="科室名称">
          <div>{{ row.deptName || '-' }}</div>
        </el-form-item>
        <el-form-item label="科室编码">
          <div>{{ row.id || '-' }}</div>
        </el-form-item>
        <el-form-item label="显示名">
          <el-input
            type="text"
            placeholder="请输入"
            maxlength="20"
            show-word-limit
            v-model="form.showName"
          ></el-input>
        </el-form-item>
        <el-form-item label="科室简介">
          <el-input
            type="textarea"
            placeholder="请输入"
            v-model="form.intro"
            :autosize="{ minRows: 6, maxRows: 6 }"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input
            type="number"
            placeholder="请输入"
            v-model="form.seq"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer is-center">
        <el-button @click="closeEdit">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="submitLoading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 同步科室弹窗 -->
    <el-dialog
      append-to-body
      title="同步"
      :visible.sync="isOpenSync"
      width="40%"
      :before-close="handleClose"
    >
      <div class="dept-tree-body">
        <el-tree
          check-on-click-node
          :data="deptTree"
          :props="defaultProps"
          show-checkbox
          ref="tree"
          node-key="id"
          default-expand-all
          @node-click="handleNodeClick"
          highlight-current
          current-node-key="node"
          @check="handleChcek"
        >
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isOpenSync = false">取 消</el-button>
        <el-button type="primary" @click="submitSync">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { List, mixin, EditableText } from '@/components'
import {
  getDepData,
  deptXzList,
  deptXzChangeState,
  syncDept,
  deptXzEdit,
  deptXzSeq,
  deptXzDel,
} from '@/api/organization'
export default {
  components: {
    List,
    EditableText,
  },
  props: {
    dept: Array,
  },
  mixins: [mixin([{ fetchListFunction: deptXzList, prop: 'xList' }])],
  data() {
    return {
      row: {},
      //默认
      defaultProps: {
        children: 'next',
        label: 'name',
      },
      selectTreeDeptIds: [],
      isOpenSync: false,
      deptTree: null,
      filter: {
        inline: [
          {
            props: {
              label: '关键字',
              is: 'el-input',
            },
            data: {
              attrs: {
                placeholder: '显示名/科室名称/科室编码',
              },
            },
            keys: 'keywords',
          },

          {
            props: {
              label: '状态',
              is: 'el-select',
              options: [
                { label: '不限', value: '' },
                { label: '启用', value: true },
                { label: '禁用', value: false },
              ],
            },
            keys: 'state',
          },
        ],
      },
      fileData: '',
      xList: {
        query: {
          pageSize: 10,
          currentNum: 1,
        },
        columns: {
          index: {
            hidden: true,
          },
          fixed: {
            minWidth: 80,
          },
          docNum: {
            label: '科室医生',
            prop: 'slot_docNum',
            minWidth: 120,
          },
          seq: {
            label: '排序',
            prop: 'slot_seq',
            minWidth: 140,
          },
          state: {
            label: '状态',
            prop: 'slot_state',
            minWidth: 100,
          },

          id: {
            minWidth: 150,
          },

          intro: {
            minWidth: 90,
          },
        },
        loading: false,
      },

      importDialog: {
        visible: false,
        sonListS: [],
      },
      submitLoading: false, //创建按钮loading状态
      openEidt: false,
      form: {
        id: '',
        intro: '',
        seq: 0,
        showName: '',
      },
    }
  },
  methods: {
    async delItem(row) {
      console.log(row)
      await deptXzDel({ id: row.id })
      this.$message.success('操作成功！')
      this.$_fetchTableData(deptXzList)
    },
    closeEdit() {
      this.openEidt = false
      this.form = {
        id: '',
        intro: '',
        seq: 0,
        showName: '',
      }
    },
    //确认同步科室
    async submitSync() {
      if (this.selectTreeDeptIds.length === 0) {
        return this.$message.error('请选择需要同步的科室')
      }
      try {
        await syncDept({ deptIds: this.selectTreeDeptIds })
        this.$message.success('操作成功！')
        this.isOpenSync = false
        this.$_fetchTableData(deptXzList)
      } catch (error) {}
    },
    //树节点选中时
    handleChcek() {
      //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
      const res = this.$refs.tree.getCheckedNodes(true, true)
      this.selectTreeDeptIds = res.map(v => v.id)
    },
    //点击树节点
    handleNodeClick() {},
    openSync() {
      this.isOpenSync = true
      this.getDeptTreeData()
    },
    //获取院内科室树
    async getDeptTreeData() {
      try {
        this.deptTree = await getDepData({ tree: true })
      } catch (error) {}
    },
    // 排序 - 父科室
    async confirm(e, id) {
      await deptXzSeq({
        id: id,
        seq: parseInt(e),
      })
      this.$message.success('操作成功！')
      this.$_fetchTableData(deptXzList)
    },

    // 编辑 、 新增弹框
    async add(row) {
      this.submitLoading = false
      this.openEidt = true
      this.row = row
      this.form.id = row.id
    },
    // 编辑
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.submitLoading = true
          await deptXzEdit(this.form)
          this.$_fetchTableData(deptXzList)
          this.$message.success('操作成功!')
          this.submitLoading = false
          this.openEidt = false
          this.form = {
            id: '',
            intro: '',
            seq: 0,
            showName: '',
          }
        } else {
          return false
        }
      })
    },
    // 变更启用状态
    async setEnable(row) {
      await deptXzChangeState({
        id: row.id,
        state: row.state,
      })
      this.$_fetchTableData(deptXzList)
      this.$message.success(row.state ? '科室启用成功!' : '科室禁用成功')
    },
    handleClose(done) {
      done()
    },
  },
}
</script>

<style lang="scss" scoped>
.hl-table {
  height: calc(100vh - 120px);
}
.el-table {
  .el-button--text {
    padding: 0;
  }
}
.el-icon-top {
  margin-right: 10px;
  font-size: 20px;
  cursor: pointer;
}
.el-icon-bottom {
  font-size: 20px;
  cursor: pointer;
}
.el-table .cell {
  font-size: 14px;
}
// ::v-deep .table-wrap .cell{
//   font-size: 16px;
// }
// ::v-deep .el-table .cell.el-tooltip {
//   font-size: 14px;
//   padding-left: 6px;
// }
::v-deep .selctedIcon {
  &::after {
    display: none;
  }
}
.dept-tree-body {
  max-height: 400px;
  overflow-y: scroll;
}
</style>
