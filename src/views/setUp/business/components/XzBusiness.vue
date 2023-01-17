<template>
  <div class="xzBusiness view__card">
    <List
      v-model="query"
      :columns="columns"
      :tableData="setTableData(tableData)"
      tableClass="table-height"
    >
      <!-- 可选设置 -->
      <template v-slot:slot_settings="{ row }">
        <!-- 排队功能 -->
        <div v-if="row.options === 'ENABLE_QUEUING'" class="edit-radio">
          <!-- 排队类型 -->
          <div class="top">
            <el-radio
              v-model="radioType"
              :label="true"
              @change="
                val => changeQueued(row, val, JSON.parse(row.settings).minute)
              "
            >
              顺序排队 </el-radio
            >，
            <span v-if="!radioType">{{ JSON.parse(row.settings).minute }}</span>
            <EditableText
              v-else
              maxLength="2"
              v-model="JSON.parse(row.settings).minute"
              @confirm="val => changeQueued(row, radioType, val)"
              icon="el-icon-edit"
            />
            <span class="mr-left-10">分钟</span>
          </div>
          <el-radio
            v-model="radioType"
            :label="false"
            @change="
              val => changeQueued(row, val, JSON.parse(row.settings).minute)
            "
            >不排队</el-radio
          >
        </div>
        <!-- 复购用户 -->
        <div v-else-if="row.options === 'REPURCHASE_USERS'">
          <span class="mr-right-10">待支付预约单关闭时为:</span>
          <EditableText
            maxLength="2"
            icon="el-icon-edit"
            v-model="JSON.parse(row.settings).minute"
            @confirm="val => changeTimes(row, val, 'minute')"
          ></EditableText>
          <span class="me-left-10">分钟</span>
        </div>
        <!-- (管理/医生)退款选项 -->
        <div
          v-else-if="row.options === 'MANAGER_REFUND_METHOD'"
          class="edit-row"
        >
          <el-checkbox-group
            v-model="checkMange"
            @change="val => changeCheck(row, val)"
          >
            <el-checkbox :label="1">不退款</el-checkbox>
            <el-checkbox :label="2">原来退回</el-checkbox>
            <el-checkbox :label="3">线下退款</el-checkbox>
          </el-checkbox-group>
        </div>
        <div
          v-else-if="row.options === 'DOCTOR_REFUND_METHOD'"
          class="edit-row"
        >
          <el-checkbox-group
            v-model="checkDoctor"
            @change="val => changeCheck(row, val)"
          >
            <el-checkbox :label="1">不退款</el-checkbox>
            <el-checkbox :label="2">原来退回</el-checkbox>
            <el-checkbox :label="3">线下退款</el-checkbox>
          </el-checkbox-group>
        </div>
        <!-- 排班间隔 -->
        <div v-else-if="row.options === 'SHIFT_INTERVAL'" class="edit-row">
          <EditableText
            maxLength="2"
            icon="el-icon-edit"
            v-model="JSON.parse(row.settings).interval"
            @confirm="val => changeTimes(row, val, 'interval')"
          ></EditableText>
          <span class="mr-left-10">分钟</span>
        </div>
        <!-- 患者 -->
        <div v-else-if="row.options === 'USERS'" class="edit-row">
          <span class="mr-right-10">可提前</span>
          <EditableText
            maxLength="2"
            icon="el-icon-edit"
            v-model="JSON.parse(row.settings).days"
            @confirm="val => changeTimes(row, val, 'days')"
          ></EditableText>
          <span class="mr-left-10">天</span>
        </div>
        <div v-else></div>
      </template>
      <!-- 业务选项说明 -->
      <template v-slot:slot_remark="{ row }">
        <div class="remark">{{ row.remark }}</div>
      </template>
    </List>
  </div>
</template>
<script>
import { List, mixin, EditableText } from '@/components'
import { getBasicConfList, editBasicConf } from '@/api/setup'

// 业务类型
const BizType = {
  COUNSELING_APPOINTMENT: '心咨预约',
  GROUP_THERAPY: '团体治疗',
}
// 业务选项
const BizOption = {
  USERS: '患者',
  REPURCHASE_USERS: '复购用户',
  ENABLE_QUEUING: '排队功能',
  GENERAL_USERS: '普通用户',
  MANAGER_REFUND_METHOD: '管理退款选项',
  DOCTOR_REFUND_METHOD: '医生退款选项',
  SHIFT_INTERVAL: '排班间隔',
}
// 排序
export const BizNum = {
  USERS: 1,
  REPURCHASE_USERS: 2,
  ENABLE_QUEUING: 3,
  GENERAL_USERS: 4,
  SHIFT_INTERVAL: 5,
  DOCTOR_REFUND_METHOD: 6,
  MANAGER_REFUND_METHOD: 7,
}
export default {
  components: { List, EditableText },
  mixins: [mixin({ fetchListFunction: getBasicConfList })],
  data() {
    return {
      query: {},
      radioType: null,
      checkMange: [],
      checkDoctor: [],
      columns: {
        index: {
          hidden: true,
        },
        type: {
          width: 100,
          formatter(row) {
            return BizType[row.type] || '-'
          },
        },
        options: {
          width: 120,
          formatter(row) {
            return BizOption[row.options] || '-'
          },
        },
        settings: {
          width: 320,
          prop: 'slot_settings',
        },
        remark: {
          prop: 'slot_remark',
        },
      },
    }
  },
  created() {
    this.setDefaultVal()
  },
  methods: {
    // 设置返回的默认值(排队类型｜退费选项)
    async setDefaultVal() {
      let res = await getBasicConfList()
      this.radioType = this.getValByOpt(res, 'ENABLE_QUEUING', 'enabled')
      this.checkMange = this.getValByOpt(res, 'MANAGER_REFUND_METHOD', 'method')
      this.checkDoctor = this.getValByOpt(res, 'DOCTOR_REFUND_METHOD', 'method')
    },
    // 修改排队功能
    async changeQueued(row, val, time) {
      let settings = JSON.stringify({ enabled: val, minute: time })
      await editBasicConf({
        id: row.id,
        type: row.type,
        options: row.options,
        settings: settings,
      })
      this.$_fetchTableData(getBasicConfList)
    },
    // 修改天数、时间间隔
    async changeTimes(row, val, name) {
      await editBasicConf({
        id: row.id,
        type: row.type,
        options: row.options,
        settings: JSON.stringify({ [name]: val }),
      })
      this.$_fetchTableData(getBasicConfList)
    },
    // 修改退费选项
    async changeCheck(row, val) {
      await editBasicConf({
        id: row.id,
        type: row.type,
        options: row.options,
        settings: JSON.stringify({ method: val }),
      })
      this.$_fetchTableData(getBasicConfList)
    },
    // 通过业务选项获取值
    getValByOpt(arr, opt, name) {
      if (!arr?.list || arr.list.length <= 0) return null
      let data = arr.list.find(v => v.options === opt)
      return JSON.parse(data.settings)[name] || null
    },
    // 修改排序
    setTableData(tableData) {
      if (tableData.list.length <= 0) return tableData
      let arr = tableData.list.map(v => ({ ...v, index: BizNum[v.options] }))
      let list = arr.sort((a, b) => a.index - b.index)
      return { ...tableData, list: list }
    },
  },
}
</script>
<style lang="scss" scoped>
.xzBusiness {
  padding: 0;
  .table-height {
    height: calc(100vh - 185px);
  }
}
.edit-row {
  display: flex;
  align-items: center;
  height: 100%;
  ::v-deep .el-checkbox {
    margin-right: 10px;
    line-height: 30px;
  }
}
.edit-radio {
  display: flex;
  flex-direction: column;
  .top {
    display: flex;
    align-items: center;
    height: 28px;
    ::v-deep .el-radio {
      line-height: 19px;
      margin-right: 5px;
    }
  }
}
.mr-right-10 {
  margin-right: 10px;
}
.mr-left-10 {
  margin-left: 10px;
}
.remark {
  white-space: normal !important;
  word-wrap: break-word;
  word-break: normal;
}
::v-deep .c__editable-text > span {
  line-height: 24px;
}
::v-deep .c__editable-text.is-edit .el-input .el-input__inner {
  width: 40px;
}
</style>
