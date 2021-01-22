<template>
  <div class="accountWrap">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <!-- 业务配置 -->
      <el-tab-pane
        label="互联网业务"
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
              <!-- input 下拉框的判断渲染-->
              <div
                v-if="
                  row.bizSelect == 'OVERDUE_TIME' ||
                  row.bizSelect == 'CLINIC_CLOSE' ||
                  row.bizSelect == 'AUTO_CLOSE_ORDER' ||
                  row.bizSelect == 'AUTO_TOTREAT' ||
                  row.bizSelect == 'AUTO_COMMENT' ||
                  row.bizSelect == 'SMS_CHECK_TIME'
                "
              >
                <el-input
                  placeholder="请输入内容"
                  v-model="row.selectConfig"
                  class="input-with-select"
                  size="mini"
                  style="max-width: 200px;"
                  @change="handleChange(row)"
                >
                  <el-select
                    v-model="row.unit"
                    slot="append"
                    placeholder="请选择"
                    @change="handleChange(row)"
                  >
                    <el-option
                      v-for="(item, index) in timeList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-input>
              </div>
              <!-- 邮寄运费的判断渲染 -->
              <div v-if="row.bizSelect == 'POST_FEE'">
                <el-input
                  placeholder="请输入内容"
                  v-model="row.selectConfig"
                  size="mini"
                  @change="handleChange(row)"
                  style="max-width: 200px;"
                >
                  <template slot="prepend">￥</template>
                </el-input>
              </div>
              <!-- 库存占用判断渲染 -->
              <div v-if="row.bizSelect == 'RESP_TAKE'">
                <el-select
                  v-model="row.selectConfig"
                  style="max-width: 200px;"
                  slot="append"
                  size="mini"
                  placeholder="请选择"
                  @change="handleChange(row)"
                >
                  <el-option
                    v-for="(item, index) in stockList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <!-- 医生排班判断渲染 -->
              <div v-if="row.bizSelect == 'DOC_SCHEDULE'">
                <el-select
                  v-model="row.selectConfig"
                  slot="append"
                  placeholder="请选择"
                  style="max-width: 200px;"
                  @change="handleChange(row)"
                >
                  <el-option
                    v-for="(item, index) in docSchList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <!-- 可预约未来判断 -->
              <div v-if="row.bizSelect == 'CAN_ORDERFU'">
                <el-input
                  v-model="row.selectConfig"
                  size="mini"
                  disabled
                  style="max-width: 200px;"
                ></el-input>
              </div>
            </template>
          </List>
        </div>
      </el-tab-pane>
      <el-tab-pane label="掌医业务" name="zyBusiness" lazy>
        <zyBusiness></zyBusiness>
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
import zyBusiness from './zybusiness'
import { List, mixin } from '@/components'
import { getBusSetList, modifyBus, editBusSet } from '@/api/setup'
export default {
  name: 'Bus',
  components: {
    List,
    zyBusiness,
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
      log: {
        query: {
          pageSize: 10,
          currentNum: 1,
          businessRel: this.$store.state.user.orgId + 'JG',
        },
        columns: {
          index: {
            hidden: true,
          },
        },
      },
      setting: {
        query: {
          pageSize: 10,
          currentNum: 1,
          moduleType: 2,
          id: this.$store.state.user.orgId,
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
          bizType: {
            width: 120,
          },
          descList: {
            prop: 'slot_descList',
          },
          bizSelect: {
            prop: 'slot_bizSelect',
            width: 120,
          },
          selectConfig: {
            prop: 'slot_selectConfig',
            width: 240,
          },
        },
      },

      // 时分日单位枚举列表
      timeList: [
        {
          value: 'H',
          label: '时',
        },
        {
          value: 'M',
          label: '分',
        },
        {
          value: 'D',
          label: '日',
        },
      ],
      // 库存占用枚举列表
      stockList: [
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
        {
          value: 'CUSTOM',
          label: '自定义',
        },
      ],
      // 医生排班枚举列表
      docSchList: [
        {
          value: 'NOT_CLOSE',
          label: '不可关闭',
        },
        {
          value: 'CLOSE_REFUND',
          label: '关闭退款',
        },
        {
          value: 'CLOSE_NOT_REFUND',
          label: '关闭不退款',
        },
      ],
    }
  },
  methods: {
    handleClick({ name }) {
      // 切换刷新日志页面数据
      if (name == 'log') {
        this.$_fetchTableData(editBusSet)
      }
    },
    // 列表修改业务事件
    async handleChange(row) {
      if (
        row.bizSelect == 'OVERDUE_TIME' ||
        row.bizSelect == 'CLINIC_CLOSE' ||
        row.bizSelect == 'AUTO_CLOSE_ORDER' ||
        row.bizSelect == 'AUTO_TOTREAT' ||
        row.bizSelect == 'AUTO_COMMENT' ||
        row.bizSelect == 'SMS_CHECK_TIME'
      ) {
        // console.log(row.selectConfig + ',' + row.unit)

        await modifyBus(
          {
            moduleType: 2,
            id: this.$store.state.user.orgId,
          },
          [
            {
              configId: row.configId,
              bizSelect: row.bizSelect,
              selectConfig: row.selectConfig + ',' + row.unit,
            },
          ],
        )
        this.$_fetchTableData(getBusSetList)
        this.$message.success('修改成功！')
      } else {
        await modifyBus(
          {
            moduleType: 2,
            id: this.$store.state.user.dept.id,
          },
          [
            {
              configId: row.configId,
              bizSelect: row.bizSelect,
              selectConfig: row.selectConfig,
            },
          ],
        )
        this.$_fetchTableData(getBusSetList)

        this.$message.success('修改成功！')
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
