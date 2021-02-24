<template>
  <section class="view__card" v-loading="loading">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_accountNum="{ row }">
        <router-link
          class="el-button el-button--text"
          :to="{ path: '/jurisdiction/account/list', query: { id: row.id } }"
        >
          {{ row.accountNum }}
        </router-link>
      </template>

      <template v-slot:slot_state="{ row, $index }">
        <el-switch
          v-model="row.state"
          @change="handleChange($event, row, $index)"
          active-text="启用"
          inactive-text="禁用"
          :width="50"
          class="textSwitch"
        ></el-switch>
      </template>

      <template v-slot:fixed="{ row }">
        <router-link class="el-button el-button--text" :to="`edit/${row.id}`">
          修改
        </router-link>

        <!-- <el-popconfirm
          style="margin-left: 10px;"
          title="确定删除吗？"
        > -->
        <div
          @click="open(row)"
          v-if="row.accountNum == 0"
          class="danger el-button el-button--text"
          type="text"
        >
          删除
        </div>
        <!-- </el-popconfirm> -->
      </template>

      <template v-slot:footertool>
        <router-link class="el-button el-button--primary" to="add">
          新增角色
        </router-link>
      </template>
    </List>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { roleList, roleChangeState, roleDelete } from '@/api/authority'

export default {
  name: 'TableList',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: roleList })],
  watch: {
    $route: 'getPath',
  },
  data() {
    return {
      query: {
        pageSize: 10,
        dateType: 0,
        searchType: 0,
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
          keys: ['dateType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [{ label: '角色名称', value: 0 }],
          },
          keys: ['searchType', 'searchKeywords'],
        },
      }
    },
    columns() {
      return {
        index: {
          hidden: true,
        },
        accountNum: {
          prop: 'slot_accountNum',
        },
        state: {
          prop: 'slot_state',
        },
        createTime: {
          minWidth: 120,
        },
        fixed: {
          minWidth: 100,
        },
      }
    },
  },
  methods: {
    getPath() {
      if (this.$route.query?.flag == 1) {
        this.$_fetchTableData()
      }
    },
    async handleChange(state, { id }, index) {
      await roleChangeState({ id, state }).catch(err => {
        this.tableData.list[index].state = !state
        throw Error(err)
      })
      this.tableData.list[index].state = state

      this.$message({
        type: 'success',
        message: state ? '角色启用成功' : '角色禁用成功',
        showClose: true,
      })
    },
    open(row) {
      this.$confirm('是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.handleDel(row)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    async handleDel({ id }) {
      await roleDelete({ id })

      this.$_fetchTableData()

      this.$message({
        type: 'success',
        message: '已删除',
        showClose: true,
      })
    },
  },
}
</script>
