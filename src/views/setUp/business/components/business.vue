<template>
  <el-tabs
    class="accountWrap"
    type="border-card"
    v-model="activeName"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="业务配置"
      name="setting"
      lazy
      v-loading.lock="setting.loading"
    >
      <div class="account_main">
        <List
          v-model="setting.query"
          :columns="setting.columns"
          :tableData="setting.tableData"
        >
        </List>
      </div>
    </el-tab-pane>
    <el-tab-pane label="操作日志" name="log" lazy v-loading.lock="log.loading">
      <div class="account_main">
        <List
          v-model="log.query"
          :columns="log.columns"
          :tableData="log.tableData"
        >
        </List>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { List, mixin } from '@/components'
import { getBusSetList, editBusSet } from '@/api/setup'
export default {
  name: 'Bus',
  components: {
    List,
  },
  mixins: [
    mixin([
      { fetchListFunction: getBusSetList, prop: 'setting' },
      { fetchListFunction: editBusSet, prop: 'log' },
    ]),
  ],
  data() {
    return {
      activeName: 'setting',
      setting: {
        query: {
          pageSize: 10,
          currentNum: 1,
          moduleType: 1,
          id: this.$store.state.user.orgId,
        },
        columns: {
          index: {
            hidden: true,
          },
          education: {
            hidden: true,
          },
          gender: {
            hidden: true,
          },
          zodiac: {
            hidden: true,
          },
          blood: {
            hidden: true,
          },
          constellation: {
            hidden: true,
          },
          name: {
            hidden: true,
          },
          age: {
            hidden: true,
          },
          maritalType: {
            hidden: true,
          },
          phone: {
            hidden: true,
          },
          userName: {
            hidden: true,
          },
          state: {
            hidden: true,
          },
          marital: {
            hidden: true,
          },
          createTime: {
            minWidth: 180,
          },
          // address: {
          //   label: '标题',
          //   prop: 'slot_title',
          //   minWidth: 300,
          // },
          // nurseId: {
          //   label: '状态',
          //   prop: 'slot_state',
          // },
          fixed: {
            minWidth: 90,
          },
        },
      },
      log: {
        query: {
          pageSize: 10,
          currentNum: 1,
        },
        columns: {
          index: {
            hidden: true,
          },
          education: {
            hidden: true,
          },
          gender: {
            hidden: true,
          },
          zodiac: {
            hidden: true,
          },
          blood: {
            hidden: true,
          },
          constellation: {
            hidden: true,
          },
          name: {
            hidden: true,
          },
          age: {
            hidden: true,
          },
          maritalType: {
            hidden: true,
          },
          phone: {
            hidden: true,
          },
          userName: {
            hidden: true,
          },
          state: {
            hidden: true,
          },
          marital: {
            hidden: true,
          },
          createTime: {
            minWidth: 180,
          },
          // address: {
          //   label: '标题',
          //   prop: 'slot_title',
          //   minWidth: 300,
          // },
          // nurseId: {
          //   label: '状态',
          //   prop: 'slot_state',
          // },
          fixed: {
            minWidth: 90,
          },
        },
      },
    }
  },
  methods: {
    handleClick({ name, $slots }) {
      if (this[name]?.tableData.list.length > 0) {
        this.$nextTick(() => {
          $slots.default?.[0].componentInstance?.doLayout?.()
        })
        return
      }
      this.table.tableData.list.length || this.$_fetchTableData(name)
    },
  },
}
</script>
<style lang="scss" scoped>
.accountWrap {
  padding: 0;
  .account_main {
    padding: 10px;
  }
  .el-tabs--border-card {
    border: 0;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }
  ::v-deep.el-tabs--border-card > .el-tabs__header {
    border: 0;
    background-color: #f2f2f2;
  }
  ::v-deep.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    border: 1px solid transparent;
  }
}
</style>
