<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      :bats="[]"
    >
      <template v-slot:slot_status="{ row }">
        <el-switch
          v-model="row.status"
          @change="changeState(row.status, row.id)"
          class="textSwitch"
          active-text="启用"
          inactive-text="禁用"
          :width="50"
        ></el-switch>
      </template>
      <template v-slot:slot_sortNum="{ row }">
        <EditableText
          icon="el-icon-edit"
          v-model="row.sortNum"
          @confirm="changeSort($event, row.id)"
        ></EditableText>
      </template>
      <template v-slot:footertool>
        <el-button type="primary" @click="openEdit(null)">新增</el-button>
        <!-- <el-button type="primary" plain>导入</el-button> -->
        <!-- <el-button @click="exportList" :loading="exportLoad">导出</el-button> -->
        <el-button type="danger" plain @click="delRow()">批量删除</el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="openEdit(row)">编辑</el-button>
        <el-button type="text" style="color: red" @click="delRow(row.id)"
          >删除</el-button
        >
      </template>
    </List>
    <EditDialog
      :show="showEdit"
      :data="formData"
      @cancel="showEdit = false"
      @submit="submitForm()"
      @close="showEdit = false"
    />
  </div>
</template>
<script>
import { List, mixin, EditableText } from '@/components'
import {
  consulRoomList,
  exportRoom,
  editSort,
  editState,
  delRoom,
} from '../../../api/mindConsult/consultRoom'
import EditDialog from './components/EditDialog'
export default {
  components: {
    List,
    EditableText,
    EditDialog,
  },
  mixins: [mixin([{ fetchListFunction: consulRoomList }])],
  data() {
    this.filter = {
      inline: [
        {
          props: {
            label: '关键字',
            is: 'el-input',
          },
          data: {
            attrs: {
              placeholder: '名称/编码',
            },
          },
          keys: 'keywords',
        },
        {
          props: {
            label: '类型',
            is: 'el-select',
            options: [
              { label: '不限', value: null },
              { label: '预约', value: '预约' },
              { label: '团体', value: '团体' },
            ],
          },
          keys: 'type',
        },
        {
          props: {
            label: '状态',
            is: 'el-select',
            options: [
              { label: '不限', value: null },
              { label: '启用', value: true },
              { label: '禁用', value: false },
            ],
          },
          keys: 'status',
        },
      ],
    }
    return {
      loading: false,
      showEdit: false,
      formData: null,
      exportLoad: false,
      query: {
        pageSize: 10,
        currentNum: 1,
        type: null,
        status: null,
      },
      columns: {
        index: {
          hidden: true,
        },
        name: {
          minWidth: 160,
        },
        serialNum: {
          hidden: true,
        },
        status: {
          label: '状态',
          prop: 'slot_status',
          minWidth: 100,
        },
        sortNum: {
          label: '排序',
          prop: 'slot_sortNum',
          minWidth: 160,
        },
        fixed: {
          minWidth: 90,
        },
      },
    }
  },
  methods: {
    //修改排序
    async changeSort(e, id) {
      await editSort({ id: id, sortNum: e })
      this.$_fetchTableData()
      this.$message.success('操作成功!')
    },
    //修改状态
    async changeState(e, id) {
      await editState({ id: id, status: e })
      this.$_fetchTableData()
      this.$message.success('操作成功!')
    },
    //导出
    async exportList() {
      this.exportLoad = true
      await exportRoom(this.query)
      this.exportLoad = false
    },
    //删除
    delRow(id) {
      let delIds = []
      if (!id) {
        //批量删除
        let list = this.tableData.multipleSelection
        if (list.length <= 0)
          return this.$message.warning('请选择要删除的咨询室')
        delIds = list.map(v => v.id)
      } else {
        //单个删除
        delIds = [id]
      }
      this.$confirm('请确认是否删除？', '提示', {
        type: 'warning',
      }).then(async () => {
        await delRoom({ ids: delIds })
        this.$_fetchTableData()
      })
    },
    //打开编辑/新增
    openEdit(item) {
      this.showEdit = true
      this.formData = { ...item }
    },
    //表单提交
    submitForm() {
      this.showEdit = false
      this.$_fetchTableData()
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .table-wrap .cell {
  font-size: 16px;
}
::v-deep .el-table .cell.el-tooltip {
  font-size: 14px;
  padding-left: 6px;
}
</style>
