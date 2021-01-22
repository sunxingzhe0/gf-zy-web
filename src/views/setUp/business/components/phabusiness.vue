<template>
  <div class="accountWrap">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <!-- 业务配置 -->
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
            <template v-slot:slot_descList="{ row }">
              <p v-for="(item, index) in row.descList" :key="index">
                {{ item }}
              </p>
            </template>
            <template v-slot:slot_bizSelect="{ row }">
              {{ row.bizSelectDesc }}
            </template>
            <!-- 可选设置 -->
            <template v-slot:slot_selectConfig="{ row }">
              <!-- 占用库存判断渲染 -->
              <div v-if="row.bizSelect == 'RESP_TAKE'">
                <el-select
                  v-model="row.selectConfig"
                  placeholder="请选择"
                  @change="handleChange(row)"
                >
                  <el-option
                    v-for="(item, index) in stocksList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <!-- 低库存预警判断渲染 -->
              <div v-if="row.bizSelect == 'LOW_WARN'">
                <el-select
                  v-model="row.selectConfig"
                  placeholder="请选择"
                  @change="handleChange(row)"
                >
                  <el-option
                    v-for="(item, index) in lowList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <!-- 低库存设置渲染判断 -->
              <div v-if="row.bizSelect == 'LOW_SET'">
                <el-input
                  v-model="row.selectConfig"
                  size="mini"
                  style="width: 205px;"
                  @change="handleChange(row)"
                ></el-input>
              </div>
              <!-- 超库存预警判断渲染 -->
              <div v-if="row.bizSelect == 'MORE_RESP'">
                <el-select
                  v-model="row.selectConfig"
                  placeholder="请选择"
                  @change="handleChange(row)"
                  disabled
                >
                  <el-option
                    v-for="(item, index) in overStorks"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <!-- 审方渲染判断 -->
              <div v-if="row.bizSelect == 'CHECK_PER'">
                <el-select
                  v-model="row.selectConfig"
                  placeholder="请选择"
                  @change="handleChange(row)"
                >
                  <el-option
                    v-for="(item, index) in examineList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <!-- 默认处理方式渲染判断 -->
              <div v-if="row.bizSelect == 'DEFAULT_DEAL'">
                <el-select
                  v-model="row.selectConfig"
                  placeholder="请选择"
                  @change="handleChange(row)"
                >
                  <el-option
                    v-for="(item, index) in defaultList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>

              <!-- 预约时段渲染判断 -->
              <div v-if="row.bizSelect == 'ORDER_TIME_RANGE'">
                <el-input
                  style="width: 205px;"
                  v-model="row.selectConfig"
                  size="mini"
                  @change="handleChange(row)"
                ></el-input>
              </div>

              <!-- 自提开始时间范围判断 -->
              <div v-if="row.bizSelect == 'SINCE_LIFT_TIME_RANGE'">
                <el-time-picker
                  is-range
                  v-model="row.selectConfig"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  value-format="HH:mm"
                  format="HH:mm"
                  @change="handleChange(row)"
                >
                </el-time-picker>
              </div>
            </template>
          </List>
        </div>
      </el-tab-pane>
      <!-- 操作日志 -->
      <el-tab-pane
        label="操作日志"
        name="log"
        lazy
        v-loading.lock="log.loading"
      >
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
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import { getBusSetList, modifyBus, editBusSet } from '@/api/setup'
// import { isArray } from '@/utils'

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
          id: this.$store.state.user.store.id,
        },
        columns: {
          index: {
            hidden: true,
          },

          fixed: {
            minWidth: 90,
          },
          // bizSelect: {
          //   prop: 'slot_bizSelect',
          // },
          descList: {
            prop: 'slot_descList',
            minWidth: 180,
          },
          bizSelect: {
            prop: 'slot_bizSelect',
            width: 120,
          },
          selectConfig: {
            prop: 'slot_selectConfig',
            width: 370,
          },
          bizType: {
            width: 100,
          },
        },
      },
      log: {
        query: {
          pageSize: 10,
          currentNum: 1,
          businessRel: this.$store.state.user.store.id + 'YF',
        },
        columns: {
          index: {
            hidden: true,
          },
        },
      },
      // 时间选择
      value1: [new Date(), new Date()],
      //
      // 占用库存枚举列表
      stocksList: [
        {
          value: 'SUBMIT_PER',
          label: '提交处方',
        },
        {
          value: 'REVIEW_PER',
          label: '审核处方',
        },
        {
          value: 'PAY_TAKE',
          label: '支付占用',
        },
      ],
      // 低库存预警枚举列表
      lowList: [
        {
          value: 'OPEN',
          label: '开启',
        },
        {
          value: 'CLOSE',
          label: '关闭',
        },
      ],
      // 超库存枚举列表
      overStorks: [
        {
          value: 'OPEN',
          label: '开启',
        },
        {
          value: 'CLOSE',
          label: '关闭',
        },
        {
          value: 'FORCED_OPEN',
          label: '强制开启',
        },
        {
          value: 'FORCED_CLOSE',
          label: '强制关闭',
        },
      ],
      // 审方枚举列表
      examineList: [
        {
          value: 'AUTO_REVIEW',
          label: '自动审方',
        },
        {
          value: 'HAND_REVIEW',
          label: '手动审方',
        },
      ],
      // 默认处理方式枚举列表
      defaultList: [
        {
          value: 'PASS',
          label: '通过',
        },
        {
          value: 'REJECT',
          label: '驳回',
        },
      ],
    }
  },
  methods: {
    fetchTableDataHook() {
      this.table.tableData.list = this.table.tableData.list.map(item => {
        if (item.bizSelect === 'SINCE_LIFT_TIME_RANGE')
          item.selectConfig = item.selectConfig
            .split(',')
            .map(_ => (_.padStart(5, 0) + ':').padEnd(8, 0))
        return item
      })
    },
    handleClick({ name }) {
      // if (this[name]?.tableData.list.length > 0) {
      //   this.$nextTick(() => {
      //     $slots.default?.[0].componentInstance?.doLayout?.()
      //   })
      //   return
      // }

      // this.table.tableData.list.length || this.$_fetchTableData(name)
      if (name == 'log') {
        this.$_fetchTableData(editBusSet)
      }
    },
    // 列表修改业务事件
    async handleChange(row) {
      // return
      await modifyBus(
        {
          moduleType: 1,
          id: this.$store.state.user.store.id,
        },
        [
          {
            configId: row.configId,
            bizSelect: row.bizSelect,
            selectConfig: row.selectConfig.join
              ? row.selectConfig.join()
              : row.selectConfig,
          },
        ],
      ).finally(async () => {
        await this.$_fetchTableData(getBusSetList)
        this.fetchTableDataHook()
      })
      this.$message.success('修改成功！')
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
::v-deep .el-input-group__append {
  background: #fff;

  .el-select .el-input {
    width: 80px;
  }
}
</style>
