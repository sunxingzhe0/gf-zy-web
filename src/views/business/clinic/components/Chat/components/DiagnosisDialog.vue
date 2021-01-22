<template>
  <el-dialog
    :visible.sync="visible"
    append-to-body
    title="选择诊断模板"
    top="20px"
    width="1100px"
    @open="fetchDiagList"
  >
    <div class="container">
      <h3>历史诊断</h3>
      <div>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyyMMddHHmmss"
          @change="selectDateRange"
        >
        </el-date-picker>
      </div>
      <div class="flex-between">
        <el-checkbox
          v-model="checked"
          :indeterminate="isIndeterminate"
          @change="toggleSelectAllTable"
        >
          全选
        </el-checkbox>
        <div style="margin: 20px 0;">
          <span
            v-for="(item, index) in [0, 3, 7]"
            :key="item"
            class="date-tag"
            :class="{ active: queryType === index }"
            @click="selectDate(index)"
          >
            {{ item ? `近${item}天` : '今天' }}
          </span>
        </div>
      </div>
      <el-scrollbar>
        <div
          v-for="{
            diagnosisId,
            diagTime,
            deptName,
            dtoList,
          } in diagData.historyTemp"
          :key="diagnosisId"
        >
          <div class="flex-between mt40">
            <div>诊断时间：{{ diagTime }}</div>
            <div>科室：{{ deptName }}</div>
          </div>
          <el-table
            :ref="`table_${diagnosisId}`"
            :data="dtoList"
            style="width: 100%;"
            @selection-change="
              selectionChange(arguments, ['historyTemp', diagnosisId])
            "
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="diagnosisType" label="类别" width="100">
              <template slot-scope="{ row }">
                {{
                  row.diagnosisType == 'WEST_MEDICINE'
                    ? '西医'
                    : row.diagnosisType == 'CH_MEDICINE_CARD'
                    ? '中医证型'
                    : row.diagnosisType == 'CH_MEDICINE_NAME'
                    ? '中医病名'
                    : ''
                }}
              </template>
            </el-table-column>
            <el-table-column prop="diagnosisName" label="诊断/病名">
              <template slot-scope="{ row }">
                {{ row.prefixName ? `(${row.prefixName})` : '' }}
                {{ row.diagnosisName }}
                {{ row.suffixName ? `(${row.suffixName})` : '' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-scrollbar>
    </div>

    <div
      class="container"
      style="border-left: 1px solid #eee; padding-left: 30px;"
    >
      <h3>常用诊断</h3>
      <el-scrollbar class="defScroll">
        <el-table
          ref="commonTable"
          :data="diagData.commonTemp"
          style="width: 100%;"
          @selection-change="selectionChange(arguments, ['commonTemp'])"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="diagnosisType" label="类别" width="100">
            <template slot-scope="{ row }">
              {{
                row.diagnosisType == 'WEST_MEDICINE'
                  ? '西医'
                  : row.diagnosisType == 'CH_MEDICINE_CARD'
                  ? '中医证型'
                  : row.diagnosisType == 'CH_MEDICINE_NAME'
                  ? '中医病名'
                  : ''
              }}
            </template>
          </el-table-column>
          <el-table-column prop="diagName" label="诊断/病名">
            <template slot-scope="{ row }">
              {{ row.prefixName ? `(${row.prefixName})` : '' }}
              {{ row.diagnosisName }}
              {{ row.suffixName ? `(${row.suffixName})` : '' }}
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>

    <template slot="footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { importDiagTemp } from '@/api/business'
export default {
  name: 'DiagnosisDialog',
  props: {
    memberId: String,
    selectedData: Array,
  },
  data() {
    return {
      visible: false,
      checked: false,
      queryType: null,
      date: [],
      isIndeterminate: false,
      diagData: {
        historyTemp: [],
        commonTemp: [],
      },
      selectionTables: {
        historyTemp: {},
        commonTemp: [],
      },
    }
  },
  methods: {
    visibleToggle() {
      this.visible = !this.visible
    },
    async fetchDiagList(param = {}) {
      const params = {
        ...param,
        memberId: this.memberId,
        currentNum: 1,
        pageSize: 999,
      }

      const { historyTemp, commonTemp } = await importDiagTemp(params)

      this.diagData = {
        historyTemp: historyTemp.map(({ dtoList, ...temp }) => ({
          ...temp,
          dtoList: dtoList
            .map((item, indexCode) => [
              { ...item, indexCode },
              ...item.childDtos.map(child => ({ ...child, parent: indexCode })),
            ])
            .flat(),
        })),
        commonTemp,
      }

      const selectedIds = this.selectedData.map(({ id }) => id)
      this.$nextTick(() => {
        this.diagData.historyTemp.forEach(({ diagnosisId, dtoList }) => {
          dtoList.forEach(
            dto =>
              selectedIds.includes(dto.id) &&
              this.$refs[`table_${diagnosisId}`][0].toggleRowSelection(
                dto,
                true,
              ),
          )
        })

        this.diagData.commonTemp.forEach(
          row =>
            selectedIds.includes(row.id) &&
            this.$refs.commonTable.toggleRowSelection(row, true),
        )
      })
    },
    selectDateRange(options) {
      const [startTime, endTime] = options || ['', '']

      const params = {
        startTime,
        endTime,
      }
      this.fetchDiagList(params)
    },
    selectDate(index) {
      const type = this.queryType === index ? null : index
      this.queryType = type
      this.fetchDiagList({ type })
    },
    toggleSelectAllTable() {
      this.isIndeterminate
        ? this.diagData.historyTemp.forEach(({ diagnosisId, dtoList }) => {
            dtoList.forEach(dto =>
              this.$refs[`table_${diagnosisId}`][0].toggleRowSelection(
                dto,
                true,
              ),
            )
          })
        : this.diagData.historyTemp.forEach(({ diagnosisId }) => {
            this.$refs[`table_${diagnosisId}`][0].toggleAllSelection()
          })
    },
    selectionChange(args, [temp, diagnosisId]) {
      const [selection] = args
      diagnosisId
        ? Object.assign(this.selectionTables[temp], {
            [diagnosisId]: selection,
          })
        : (this.selectionTables[temp] = selection)

      const selectionLength = Object.values(
        this.selectionTables.historyTemp,
      ).flat().length
      const tableLength = this.diagData.historyTemp
        .map(({ dtoList }) => dtoList)
        .flat().length

      this.checked = selectionLength === tableLength
      this.isIndeterminate =
        selectionLength > 0 && selectionLength < tableLength
    },
    submit() {
      const selection = [
        ...Object.values(this.selectionTables.historyTemp).flat(),
        ...this.selectionTables.commonTemp,
      ].map(item => ({ ...item, mainDiagnosis: 0 }))
      this.visibleToggle()

      this.$emit('submit', selection)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.mt40 {
  margin-top: 40px;
}
::v-deep .el-scrollbar {
  height: 400px;
}
::v-deep .defScroll {
  height: 492px;
}
.container {
  display: inline-block;
  vertical-align: top;
  width: 48%;

  + .container {
    margin-left: 30px;
  }
}
.date-tag {
  margin-right: 10px;
  padding: 4px 10px;
  border: 1px solid #cbcbcb;
  color: #cbcbcb;
  cursor: pointer;

  &.active {
    border-color: $--color-primary;
    color: $--color-primary;
  }
}
</style>
