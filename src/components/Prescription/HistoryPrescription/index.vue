<template>
  <el-dialog
    title="历史处方"
    top="5vh"
    width="80%"
    class="history-prescription"
    :visible.sync="show"
  >
    <div class="prescriptions-wrapper">
      <div>
        <span style="margin-right: 15px;">时间段</span>
        <el-date-picker
          type="daterange"
          v-model="queryDate"
          range-separator="至"
          @change="getHistory"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyyMMddHHmmss"
        >
        </el-date-picker>
        <el-button
          plain
          type="primary"
          style="margin-left: 10px;"
          @click="historicalFilterDateChange(1)"
        >
          今日
        </el-button>
        <el-button type="primary" plain @click="historicalFilterDateChange(3)">
          近3日
        </el-button>
        <el-button type="primary" plain @click="historicalFilterDateChange(7)">
          近7日
        </el-button>
      </div>
      <el-collapse v-model="activeCollapse" class="tables-wrapper">
        <div
          v-for="item in rpList"
          :key="item.id"
          style="padding-bottom: 5px; border-bottom: 1px dashed #e6e6e6;"
        >
          <el-collapse-item
            class="historical_collapse_item"
            :title="
              '诊断时间：' + item.diagnosisTime + ' 科室：' + item.deptName
            "
            :name="item.id"
          >
            <el-table
              ref="tabel-item"
              :data="item.rpDrugList"
              class="historical_tabel"
              @selection-change="
                selectionChange(arguments, item.id, item.rpDrugList.length)
              "
            >
              <el-table-column type="selection" width="50"> </el-table-column>
              <el-table-column
                key="seq"
                prop="seq"
                label="序号"
                width="50"
                :formatter="({ seq }) => seq"
              >
              </el-table-column>
              <el-table-column
                v-for="{ prop, label, width, formatter } in tableHeader"
                :key="prop"
                :prop="prop"
                :label="label"
                :width="width"
                :formatter="formatter"
              >
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </div>
      </el-collapse>
    </div>
    <template #footer>
      <div class="is-center">
        <el-checkbox
          class="select-all"
          v-model="Allchecked"
          @change="toogleSelectAll()"
          >全选</el-checkbox
        >
        <el-button size="small" @click="$emit('update:visible', false)">
          取消
        </el-button>
        <el-button size="small" type="primary" @click="importHandler">
          导入
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import { formatDate } from '@/utils'
import { historyRp } from '@/api/prescription'
import { Medicares } from '../enums'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rpList: [], // 处方列表
      queryDate: [], // 查询时间
      Allchecked: false,
      activeCollapse: [],
      multipleSelection: {},
      tableHeader: [
        {
          prop: 'type',
          label: '类型',
          formatter: ({ type }) => {
            const item = this.drugTypes.find(item => item.value === type)
            return item.label
          },
        },
        {
          prop: 'name',
          label: '药品名称',
        },
        {
          prop: 'spec',
          label: '规格',
        },
        {
          prop: 'useWays',
          label: '用药途径',
          formatter: ({ useWays }) => {
            const item = this.drugWays.find(item => item.value === useWays)
            return item.label
          },
        },
        {
          prop: 'singleDose',
          label: '单次剂量',
          formatter: ({ singleDose, singleDoseUnitText }) =>
            `${singleDose}${singleDoseUnitText}`,
        },
        {
          prop: 'useFrequency',
          label: '用药频次',
          formatter: ({ useFrequency }) => {
            const item = this.drugFrequencys.find(
              item => item.value === useFrequency,
            )
            return item.label
          },
        },
        // treatment
        {
          prop: 'treatment',
          label: '疗程',
          formatter: ({ treatment, treatmentUnit }) => {
            const item = this.treatmentUnits.find(
              item => item.value === treatmentUnit,
            )
            return String(treatment) + item.label
          },
        },
        {
          prop: 'total',
          label: '总量',
          formatter: row => {
            const totalUnits = {
              [row.basicUnit]: row.basicUnitText,
              [row.regularUnit]: row.regularUnitText,
              [row.singleDoseUnit]: row.singleDoseUnitText,
            }
            return `${row.total}${totalUnits[row.totalUnit]}`
          },
        },
        {
          prop: 'medicare',
          label: '医保',
          formatter: ({ medicare }) => Medicares[medicare],
        },
        {
          prop: 'price',
          label: '单价',
          formatter: ({ price }) => `￥${price}`,
        },
        {
          prop: 'totalPrice',
          label: '总价',
          formatter: ({ totalPrice }) => `￥${totalPrice}`,
        },
        {
          prop: 'receivePharmacy',
          label: '接收方',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      drugWays: state => state.drug.drugWays,
      drugTypes: state => state.drug.drugTypes,
      orgDrugUnits: state => state.drug.orgDrugUnits,
      treatmentUnits: state => state.drug.drugTreatments,
      drugFrequencys: state => state.drug.drugFrequencys,
    }),
    show: {
      get() {
        return this.visible
      },
      set() {
        this.$emit('update:visible', false)
      },
    },
  },
  methods: {
    async getHistory() {
      this.Allchecked = false
      this.queryDate = this.queryDate || []
      const [startTime, endTime] = this.queryDate
      const res = await historyRp({ startTime, endTime })
      this.rpList = res || []

      this.activeCollapse = this.rpList.map(item => item.id)
    },
    toogleSelectAll(val) {
      this.selectAll = !this.selectAll
      if (val !== undefined) {
        //取消时
        this.$refs['tabel-item']?.forEach(item => item.clearSelection())
      } else {
        //点击全选时
        if (!this.selectAll) {
          //先清空
          this.$refs['tabel-item']?.forEach(item => {
            item.clearSelection()
          })
          this.$refs['tabel-item']?.forEach(item => {
            item.toggleAllSelection()
          })
        } else {
          this.$refs['tabel-item']?.forEach(item => {
            item.toggleAllSelection()
          })
        }
      }
    },
    // 历史处方日期筛选
    historicalFilterDateChange(day) {
      this.queryDate = [
        formatDate(+new Date() - 86400000 * (day - 1), 'yyyyMMdd') + '000000',
        formatDate(+new Date() + 86400000, 'yyyyMMdd') + '000000',
      ]
      this.getHistory()
    },
    // 历史处方表格选择框
    selectionChange(args, prescriptionNo, len) {
      console.log(args, prescriptionNo)
      this.$set(this.multipleSelection, [prescriptionNo], args[0])
      if (args[0].length !== len) {
        this.Allchecked = false
      }
    },
    importHandler() {
      let drugs = []
      for (let p in this.multipleSelection) {
        drugs = drugs.concat(this.multipleSelection[p])
      }
      if (!drugs.length) return this.$message.warning('请先选择药品！')
      this.$emit('confirmDrugs', drugs)
    },
  },
  mounted() {},
  watch: {
    visible(val) {
      if (val) {
        // 清空所有的勾选
        this.toogleSelectAll(false)
        this.Allchecked = false
        if (!this.rpList.length) {
          this.getHistory()
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.history-prescription {
  & ::v-deep {
    .el-dialog {
      height: 90vh;
      display: flex;
      overflow: hidden;
      flex-direction: column;
    }
    .el-dialog__body {
      flex: 1;
      padding: 10px;
      overflow: hidden;
    }
  }
  .prescriptions-wrapper {
    height: 100%;
    display: flex;
    overflow: hidden;
    flex-direction: column;
  }
  .tables-wrapper {
    flex: 1;
    border: none;
    overflow: auto;
  }
  .select-all {
    position: absolute;
    left: 20px;
  }
}
</style>
