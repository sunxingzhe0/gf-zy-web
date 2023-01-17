<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      :bats="[]"
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
        <el-switch
          v-model="row.state"
          @change="stateChange([row.id], row.state)"
          active-text="显示"
          inactive-text="隐藏"
          :width="50"
          class="textSwitch"
        ></el-switch>
      </template>
      <template v-slot:footertool>
        <el-button type="primary" plain @click="del()"> 批量删除 </el-button>
        <el-button type="primary" plain @click="stateChange('', false)">
          批量隐藏
        </el-button>
        <el-button type="primary" plain @click="stateChange('', true)">
          批量显示
        </el-button>
        <el-button type="primary" @click="info('add')"> 新增资讯 </el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="info('detail', row.id)">
          查看
        </el-button>
        <el-button type="text" @click="info('edit', row.id)"> 修改 </el-button>
        <el-button type="text" style="color: #f74a4a" @click="del([row.id])">
          删除
        </el-button>
      </template>
    </List>
  </div>
</template>
<script>
import { List, mixin, EditableText } from '@/components'
import { getInfoList, delInfo, sortInfo, setInfoState } from '@/api/setup'
export default {
  name: 'setUp_information',
  components: {
    List,
    EditableText,
  },
  mixins: [mixin([{ fetchListFunction: getInfoList }])],
  watch: {
    updateListInformation() {
      this.$_fetchTableData()
    },
  },
  computed: {
    updateListInformation() {
      return this.$store.state.updateList.updateListInformation
    },
  },
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
            { label: '标题', value: 0 },
            { label: '创建人', value: 1 },
          ],
        },
        keys: ['searchType', 'searchKeyWords'],
      },
      popover: [
        {
          props: {
            label: '浏览',
            isInteger: true,
            is: 'InputRange',
          },
          keys: ['startBrowse', 'endBrowse'],
        },
        {
          props: {
            label: '状态',
            options: [
              { label: '不限', value: '' },
              { label: '显示', value: true },
              { label: '隐藏', value: false },
            ],
          },
          keys: 'state',
        },
      ],
    }
    return {
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
        createDate: {
          hidden: true,
        },

        fixed: {
          minWidth: 160,
        },
        age: {
          hidden: true,
        },
        nurseId: {
          hidden: true,
        },
        seq: {
          prop: 'slot_seq',
        },
        state: {
          prop: 'slot_state',
        },
        opt: {
          hidden: true,
        },
      },
    }
  },
  methods: {
    getPath() {
      if (this.$route.query?.flag == 1) {
        this.$_fetchTableData()
      }
    },
    // 文本标记确认
    async confirm(e, id) {
      await sortInfo({
        id: id,
        seq: e,
      })
      this.$_fetchTableData(getInfoList)
      this.$message.success('操作成功！')
    },
    // 文本编辑取消
    cancel() {},
    // 新增资讯
    info(name, id) {
      this.$router.push(`/set-up/information/${name}${id ? '?id=' + id : ''}`)
    },
    // 删除资讯
    del(id) {
      let ids = []
      let list = this.tableData.multipleSelection
      // 批量删除
      if (!id) {
        if (list.length == 0) {
          this.$message.warning('请先选择要删除的资讯')
          return false
        }
        for (let i in list) {
          ids.push(list[i].id)
        }
      } else {
        // 单个删除
        ids = id
      }
      this.$confirm('确定删除选中的资讯吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        // 删除接口
        await delInfo({
          ids: ids,
        })
        // 重新拉取数据
        this.$_fetchTableData(getInfoList)
        // console.log(id)
        this.$message.success('操作成功!')
      })
    },
    // 开关状态改变
    async stateChange(id, bool) {
      let ids = []
      let list = this.tableData.multipleSelection
      if (!id) {
        if (list.length == 0) {
          this.$message.warning('请选择要更改的数据')
          return false
        }
        for (let i in list) {
          ids.push(list[i].id)
        }
      } else {
        // 单个修改状态
        ids = id
      }
      await setInfoState({
        ids: ids,
        state: bool,
        // 重新拉取数据
      })
      this.$_fetchTableData(getInfoList)
      this.$message.success(bool ? '资讯已显示!' : '资讯已隐藏')
    },
  },
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
</style>
