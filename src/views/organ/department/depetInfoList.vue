<template>
  <div class="view__card" v-loading="loading">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      alwaysShowBtn
      tableClass="dept-info-table"
    >
      <!-- 排序 -->
      <template v-slot:slot_seq="{ row }">
        <EditableText
          icon="el-icon-edit"
          v-model="row.seq"
          @confirm="confirm($event, row.id)"
          @cancel="cancel"
        ></EditableText>
      </template>
      <!-- 状态 -->
      <template v-slot:slot_status="{ row }">
        <el-switch
          v-model="row.status"
          @change="changeState(row)"
          active-text="显示"
          active-value="1"
          inactive-value="0"
          inactive-text="隐藏"
          :width="50"
          class="textSwitch"
        >
        </el-switch>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="editItem(row)">编辑</el-button>
        <el-popconfirm @confirm="delItem(row)" title="是否确认删除">
          <el-button type="text" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
      <template v-slot:footertool>
        <el-button type="primary" @click="editItem(1)"> 新增 </el-button>
      </template>
    </List>
  </div>
</template>

<script>
import {
  introList,
  introChangeState,
  introSeq,
  introDelete,
} from '@/api/organization'
import { List, mixin, EditableText } from '@/components'

export default {
  components: {
    List,
    EditableText,
  },
  mixins: [mixin([{ fetchListFunction: introList }])],
  data() {
    return {
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
        deptLevel: '',
      },
      columns: {
        index: {
          hidden: true,
        },
        status: {
          prop: 'slot_status',
        },
        seq: {
          prop: 'slot_seq',
        },
      },
      filter: {
        inline: [
          {
            props: {
              label: '状态',
              is: 'el-select',
              options: [
                { label: '全部', value: '' },
                { label: '显示', value: 1 },
                { label: '隐藏', value: 0 },
              ],
            },
            keys: 'status',
          },
          {
            props: {
              label: '标题',
              is: 'el-input',
            },
            data: {
              attrs: {
                placeholder: '关键字',
              },
            },
            keys: 'title',
          },
        ],
      },
    }
  },

  methods: {
    editItem(row) {
      console.log(row, '=123')
      this.$router.push({
        path:
          row !== 1
            ? '/organ/department/editDeptInfo'
            : '/organ/department/addDeptInfo',
        query: {
          id: row.id || '',
        },
      })
    },
    //变更状态
    async changeState(row) {
      console.log(row)
      await introChangeState(row.id)
      this.$message.success('操作成功！')
      this.$_fetchTableData()
    },
    async delItem(row) {
      await introDelete(row.id)
      this.$message.success('操作成功！')
      this.$_fetchTableData()
    },
    //变更状态
    async confirm(e, id) {
      await introSeq({ id, seq: e })
      this.$message.success('操作成功！')
      this.$_fetchTableData()
    },
    cancel() {},
  },
}
</script>

<style lang="scss" scoped>
.dept-info-table {
  height: calc(100vh - 120px);
}
</style>
