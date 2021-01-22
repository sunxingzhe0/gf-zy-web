<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_seq="{ row }">
        <EditableText
          icon="el-icon-edit"
          v-model="row.seq"
          @confirm="confirm($event, row.id)"
          @cancel="cancel"
        ></EditableText>
      </template>
      <template v-slot:slot_state="{ row }">
        <el-switch v-model="row.state" @change="stateChange($event, row.id)">
        </el-switch>
      </template>
      <template v-slot:slot_recommend="{ row }">
        <el-switch
          v-model="row.recommend"
          @change="recommendChange($event, row.id)"
        >
        </el-switch>
      </template>
      <!-- <template v-slot:footertool>
         <el-button size="mini" type="primary" @click="add('add')">
          新增员工
        </el-button>
        <el-button size="mini" plain type="primary" @click="batch">
          批量导入
        </el-button>
      </template> -->
      <template v-slot:fixed="{ row }">
        <el-button size="mini" type="text" @click="add('edit', row.id)">
          编辑
        </el-button>
        <el-button size="mini" type="text" @click="add('detail', row.id)">
          查看
        </el-button>
      </template>
    </List>
  </div>
</template>
<script>
import { List, mixin, EditableText } from '@/components'
import {
  employeeList,
  employeeChangeState,
  employeeCommend,
  employeeChangeOrder,
} from '@/api/zyapi/organization'
import { deptChooseList, titleChooseList } from '@/api/zyapi/index'

const pre = {
  dept: [],
  title: [],
}
export default {
  components: {
    List,
    EditableText,
  },
  mixins: [mixin([{ fetchListFunction: employeeList }])],
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
          options: [
            { label: '姓名', value: 0 },
            { label: '工号', value: 1 },
            { label: '员工账号', value: 2 },
          ],
        },
        keys: ['searchType', 'searchKeywords'],
      },
      // popover: [
      //   {
      //     props: {
      //       label: '账号类型',
      //       options: [
      //         { label: '不限', value: '' },
      //         { label: '医生', value: 'DOCTOR' },
      //         { label: '药师', value: 'DRUGER' },
      //         { label: '护士', value: 'NURSE' },
      //         { label: '其他', value: 'OTHER' },
      //       ],
      //     },
      //     keys: 'employeeType',
      //   },
      //   {
      //     props: {
      //       label: '性别',
      //       options: [
      //         { label: '不限', value: '' },
      //         { label: '女', value: 0 },
      //         { label: '男', value: 1 },
      //       ],
      //     },
      //     keys: 'sex',
      //   },
      //   {
      //     props: {
      //       label: '科室',
      //       options: [{ label: '不限', value: '' }, ...pre.dept.map(_ => ({ label: _.name, value: _.id }))],
      //     },
      //     keys: 'deptId',
      //   },
      //   {
      //     props: {
      //       label: '职称',
      //       options: [{ label: '不限', value: '' }, ...pre.title.map(_ => ({ label: _.name, value: _.id }))],
      //     },
      //     keys: 'titleId',
      //   },
      // ],
    }
    return {
      query: {
        timeType: 0,
        searchType: 0,
        deptId: this.$route.query.deptId,
        pageSize: 10,
        currentNum: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        createTime: {
          minWidth: 180,
        },
        fixed: {
          minWidth: 100,
        },
        recommend: {
          prop: 'slot_recommend',
          minWidth: 100,
        },
        seq: {
          label: '排序',
          prop: 'slot_seq',
          minWidth: 160,
        },
        state: {
          prop: 'slot_state',
          minWidth: 100,
        },
        employeeType: {
          formatter(row) {
            let name = ''
            switch (row.employeeType) {
              case 'DOCTOR':
                name = '医生'
                break
              case 'DRUGER':
                name = '药师'
                break
              case 'NURSE':
                name = '护士'
                break
              case 'OTHER':
                name = '其他'
                break
            }
            return name
          },
        },
      },
    }
  },
  async beforeRouteEnter(to, from, next) {
    ;[pre.dept, pre.title] = await Promise.all([
      deptChooseList({ tree: false }),
      titleChooseList(),
    ])
    next()
  },
  methods: {
    // 排序文本保存
    async confirm(e, id) {
      let seq = parseInt(e)
      await employeeChangeOrder({
        id: id,
        seq: seq,
      })
      this.$_fetchTableData(employeeList)
      this.$message.success('操作成功!')
    },
    cancel() {},
    // 新增职称
    add(type, id) {
      this.$router.push(`/organ/staff/${type}${id ? '?id=' + id : ''}`)
    },
    batch() {},
    // 修改状态
    async stateChange(e, id) {
      await employeeChangeState({
        id: id,
        state: e,
      })
      this.$_fetchTableData(employeeList)
      this.$message.success('操作成功!')
    },
    // 推荐
    async recommendChange(e, id) {
      await employeeCommend({
        id: id,
        recommend: e,
      })
      this.$_fetchTableData(employeeList)
      this.$message.success('操作成功!')
    },
  },
}
</script>
<style lang="scss" scoped>
.keshi {
  ::v-deep.c__editable-text {
    > span {
      display: none;
    }
  }
}
</style>
