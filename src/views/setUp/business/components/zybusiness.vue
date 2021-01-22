<template>
  <div class="accountWrap view__card">
    <List
      v-model="setting.query"
      :columns="setting.columns"
      :tableData="setting.tableData"
    >
      <template v-slot:slot_busSet="{ row }">
        <EditableText
          v-if="
            row.bizSelect == 'PRESTORE_REMINDER' ||
            row.bizSelect == 'OWE_REMINDER'
          "
          v-model="row.selectConfig"
          maxLength="100"
          icon="el-icon-edit"
          @confirm="val => serbus(row, val)"
        ></EditableText>
        <!-- <div
                v-else-if="
                  row.bizSelect == 'UN_BLACKLIST' ||
                  row.bizSelect == 'BLACKLIST_DEFAULTERS'
                "
              >
                <el-input
                  size="mini"
                  @change="serbus(row, row.bizSelect)"
                  v-model="row.selectConfig"
                  style="max-width: 90px; margin-right: 5px;"
                ></el-input
                >日<el-input
                  size="mini"
                  @change="serbus(row, row.bizSelect)"
                  v-model="row.checkSet"
                  style="max-width: 85px; margin-left: 5px; margin-right: 5px;"
                ></el-input
                >次
              </div> -->
        <div v-else>
          <el-input
            v-model="row.selectConfig"
            size="mini"
            style="width: 200px;"
            @change="serbus(row, row.bizSelect)"
          ></el-input>
          {{
            row.bizSelect == 'ADD_RESERVE' ||
            row.bizSelect == 'AUTO_DEL_BLACKLIST'
              ? '日'
              : row.bizSelect == 'OWE_REMIND' ||
                row.bizSelect == 'PRESTORE_REMIND'
              ? '%'
              : '次'
          }}
        </div>
      </template>
      <template v-slot:slot_busType="{ row }">{{ row.bizSelectDesc }}</template>
      <template v-slot:slot_busOption="{ row }"
        ><div>{{ row.descList[0] }}</div></template
      >
    </List>
  </div>
</template>
<script>
import { List, mixin, EditableText } from '@/components'
import { getBusSetList, modifyBus } from '@/api/setup'
export default {
  components: {
    List,
    EditableText,
  },
  mixins: [mixin([{ fetchListFunction: getBusSetList, prop: 'setting' }])],
  data() {
    return {
      activeName: 'setting',
      setting: {
        query: {
          pageSize: 10,
          currentNum: 1,
          moduleType: 3,
          id: this.$store.state.user.orgId,
        },
        columns: {
          index: {
            hidden: true,
          },
          selectConfig: {
            prop: 'slot_busSet',
            minWidth: 240,
          },
          bizSelect: {
            prop: 'slot_busType',
          },
          descList: {
            width: 300,
            prop: 'slot_busOption',
          },
        },
      },
    }
  },
  watch: {},
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
    //
    async serbus(row) {
      await modifyBus(
        {
          moduleType: 3,
          id: this.$store.state.user.orgId,
        },
        [
          {
            configId: row.configId,
            bizSelect: row.bizSelect,
            selectConfig: row.selectConfig,
          },
        ],
      ).finally(async () => {
        await this.$_fetchTableData(getBusSetList)
      })
      this.$message.success('修改成功！')
    },
    // 类型
    getType(type) {
      if (type == 'ADD_RESERVE') {
        return '预约挂号'
      } else if (
        type == 'PRESTORE_REMINDER' ||
        type == 'PRESTORE_REMIND' ||
        type == 'OWE_REMINDER' ||
        type == 'OWE_REMIND'
      ) {
        return '住院缴费'
      } else {
        return '黑名单'
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.accountWrap {
  padding: 0;
  .account_main {
    padding: 10px;
    ::v-deep.el-table .cell.el-tooltip {
      white-space: normal;
    }
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
