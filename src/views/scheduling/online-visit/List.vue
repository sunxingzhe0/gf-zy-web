<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      :resetBtnText="'重置'"
      alwaysShowBtn
    >
      <template v-slot:slot_state="{ row }">
        <el-switch
          v-model="row.state"
          :active-value="1"
          :inactive-value="0"
          @change="setState(row.deptConfigId, row.state)"
          active-text="启用"
          inactive-text="禁用"
          :width="50"
          class="textSwitch"
        >
        </el-switch>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button
          type="text"
          @click="
            info(
              row.deptConfigId,
              row.deptId,
              row.state,
              row.deptName,
              row.hospName,
            )
          "
        >
          修改
        </el-button>
      </template>
    </List>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import { getSchedualList, setStateSchedual } from '@/api/scheduling'
export default {
  name: 'shift_onlineVisit',
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: getSchedualList }])],
  data() {
    this.filter = {
      inline: [
        {
          props: {
            label: '医院名称',
            is: 'el-input',
          },
          keys: 'hospitalName',
        },
        {
          props: {
            label: '科室名称',
            is: 'el-input',
          },
          keys: 'deptName',
        },
        {
          props: {
            label: '状态',
            is: 'el-select',
            options: [
              { label: '全部', value: '' },
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 },
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
          minWidth: 180,
        },
        state: {
          prop: 'slot_state',
        },
        fixed: {
          minWidth: 60,
        },
      },
    }
  },
  computed: {
    updateListFlagVisit() {
      return this.$store.state.updateList.updateListFlagVisit
    },
  },
  watch: {
    updateListFlagVisit() {
      this.$_fetchTableData(getSchedualList)
      // console.log(this.updateListFlagVisit)
    },
  },
  methods: {
    info(id, deptId, state, name, hospName) {
      this.$router.push(
        `/shift/online-visit/edit?id=${id}&deptId=${deptId}&state=${state}&name=${name}&hospName=${hospName}`,
      )
    },
    // 更改排班状态
    async setState(id, state) {
      await setStateSchedual({
        deptConfigId: id,
        state: state,
      })
      this.$_fetchTableData(getSchedualList)
      this.$message.success(state ? '排班启用成功!' : '排班禁用成功')
    },
  },
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
</style>
