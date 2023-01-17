<template>
  <el-dialog
    title="单条详情"
    @closed="dialogClose"
    :visible.sync="dialogTableVisible"
    width="80%"
  >
    <div>
      <div style="border: 1px solid #dfe6ec">
        <el-table
          style="width: 100%"
          :data="tableData"
          :border="false"
          row-key="rowKey"
          size="mini"
          ref="refTable"
        >
          >
          <el-table-column
            label="第三方交易平台流水"
            align="center"
            class-name="border-right"
            key="2"
          >
            <el-table-column
              prop="bankTrxNo"
              label="交易流水号"
              min-width="200"
              show-overflow-tooltip
              key="2-1"
            >
            </el-table-column>
            <el-table-column
              prop="bankTradeTime"
              label="交易时间"
              min-width="150"
              sortable="custom"
              show-overflow-tooltip
              key="2-2"
            >
            </el-table-column>
            <el-table-column
              prop="bankAmount"
              label="出入账金额"
              min-width="90"
              show-overflow-tooltip
              key="2-3"
            >
              <template slot-scope="{ row }">
                {{ row.bankAmount ? `¥${row.bankAmount}` : '' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="bankType"
              label="来源"
              min-width="80"
              show-overflow-tooltip
              key="2-4"
            >
            </el-table-column>
            <el-table-column
              prop="bankTradeTypeText"
              label="账单类型"
              min-width="80"
              show-overflow-tooltip
              class-name="border-right"
              key="2-5"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="平台流水"
            align="center"
            class-name="border-right"
            key="3"
          >
            <el-table-column
              prop="platformOrderNo"
              label="单据号"
              min-width="200"
              show-overflow-tooltip
              key="3-1"
            >
            </el-table-column>
            <el-table-column
              prop="patientName"
              label="患者姓名"
              width="100"
              show-overflow-tooltip
              key="3-2"
            >
            </el-table-column>
            <el-table-column
              prop="visitNo"
              label="就诊号"
              min-width="120"
              show-overflow-tooltip
              key="3-3"
            >
            </el-table-column>
            <el-table-column
              prop="platformAmount"
              label="交易金额"
              min-width="100"
              key="3-4"
              show-overflow-tooltip
            >
              <template slot-scope="{ row }">
                {{ row.platformAmount ? `¥${row.platformAmount}` : '' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="platformTradeTypeText"
              label="单据类型"
              min-width="80"
              key="3-5"
              show-overflow-tooltip
              class-name="border-right"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="HIS流水"
            align="center"
            class-name="border-right"
            key="4"
          >
            <el-table-column
              prop="hisOrderNo"
              label="票据号"
              min-width="120"
              show-overflow-tooltip
              key="4-1"
            >
            </el-table-column>
            <el-table-column
              prop="hisAmount"
              label="交易金额"
              min-width="100"
              show-overflow-tooltip
              key="4-2"
            >
              <template slot-scope="{ row }">
                {{ row.hisAmount ? `¥${row.hisAmount}` : '' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="hisBizType"
              label="业务类型"
              min-width="80"
              show-overflow-tooltip
              class-name="border-right"
              key="4-3"
            >
            </el-table-column>
            <el-table-column
              prop="hisTradeTypeText"
              label="单据类型"
              min-width="80"
              show-overflow-tooltip
              class-name="border-right"
              key="4-4"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="statusText"
            label="状态"
            width="80"
            fixed="right"
            key="5"
          >
            <template slot-scope="scope">
              <span
                :style="{
                  color: scope.row.statusText === '正常' ? '#333' : 'red',
                }"
                >{{ scope.row.statusText }}</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <BlockTitle style="margin-top">明细</BlockTitle>
      <div style="border: 1px solid #dfe6ec; margin-top: 20px">
        <el-table
          style="width: 100%"
          :data="tableInfoData"
          :border="false"
          size="mini"
          ref="refInfoTable"
        >
          >
          <el-table-column
            type="index"
            label="序号"
            width="65"
            class-name="border-right"
            key="1"
          >
          </el-table-column>
          <el-table-column
            label="平台流水"
            align="center"
            class-name="border-right"
            key="3"
          >
            <el-table-column
              prop="platformOrderNo"
              label="单据号"
              min-width="200"
              show-overflow-tooltip
              key="3-1"
            >
            </el-table-column>
            <el-table-column
              prop="patientName"
              label="患者姓名"
              width="100"
              show-overflow-tooltip
              key="3-2"
            >
            </el-table-column>
            <el-table-column
              prop="visitNo"
              label="就诊号"
              min-width="120"
              show-overflow-tooltip
              key="3-3"
            >
            </el-table-column>
            <el-table-column
              prop="platformAmount"
              label="交易金额"
              min-width="100"
              key="3-4"
              show-overflow-tooltip
            >
              <template slot-scope="{ row }">
                {{ row.platformAmount ? `¥${row.platformAmount}` : '' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="platformTradeTypeText"
              label="单据类型"
              min-width="80"
              key="3-5"
              show-overflow-tooltip
              class-name="border-right"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="HIS流水"
            align="center"
            class-name="border-right"
            key="4"
          >
            <el-table-column
              prop="hisOrderNo"
              label="票据号"
              min-width="120"
              show-overflow-tooltip
              key="4-1"
            >
            </el-table-column>
            <el-table-column
              prop="hisAmount"
              label="交易金额"
              min-width="100"
              show-overflow-tooltip
              key="4-2"
            >
              <template slot-scope="{ row }">
                {{ row.hisAmount ? `¥${row.hisAmount}` : '' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="hisBizType"
              label="业务类型"
              min-width="80"
              show-overflow-tooltip
              class-name="border-right"
              key="4-3"
            >
            </el-table-column>
            <el-table-column
              prop="hisTradeTypeText"
              label="单据类型"
              min-width="80"
              show-overflow-tooltip
              class-name="border-right"
              key="4-4"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="statusText"
            label="平台/HIS状态"
            width="120"
            fixed="right"
            key="5"
          >
            <template slot-scope="scope">
              <span
                :style="{
                  color: scope.row.statusText === '正常' ? '#333' : 'red',
                }"
                >{{ scope.row.statusText }}</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <BlockTitle style="margin-top">平账的对冲单据</BlockTitle>
      <div style="border: 1px solid #dfe6ec; margin-top: 20px">
        <el-table
          style="width: 100%"
          :data="balanceData"
          :border="false"
          row-key="rowKey"
          :row-class-name="tableRowClassName"
          size="mini"
        >
          >
          <el-table-column
            label="第三方交易平台流水"
            align="center"
            class-name="border-right"
            key="2"
          >
            <el-table-column
              prop="bankTrxNo"
              label="交易流水号"
              min-width="200"
              show-overflow-tooltip
              key="2-1"
            >
            </el-table-column>
            <el-table-column
              prop="bankTradeTime"
              label="交易时间"
              min-width="150"
              sortable="custom"
              show-overflow-tooltip
              key="2-2"
            >
            </el-table-column>
            <el-table-column
              prop="bankAmount"
              label="出入账金额"
              min-width="140"
              show-overflow-tooltip
              key="2-3"
            >
              <template slot-scope="{ row }">
                {{ row.bankAmount ? `¥${row.bankAmount}` : '' }}
                <span
                  :class="
                    getPrice(row.bankAmount, row.platformAmount) >= 0
                      ? 'addColor'
                      : 'subColor'
                  "
                  v-if="row.bankAmount != row.platformAmount"
                >
                  ({{
                    getPrice(row.bankAmount, row.platformAmount) >= 0
                      ? '+'
                      : ''
                  }}{{ getPrice(row.bankAmount, row.platformAmount) }})
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="bankType"
              label="来源"
              min-width="80"
              show-overflow-tooltip
              key="2-4"
            >
            </el-table-column>
            <el-table-column
              prop="bankTradeTypeText"
              label="账单类型"
              min-width="80"
              show-overflow-tooltip
              class-name="border-right"
              key="2-5"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="平台流水"
            align="center"
            class-name="border-right"
            key="3"
          >
            <el-table-column
              prop="platformOrderNo"
              label="单据号"
              min-width="200"
              show-overflow-tooltip
              key="3-1"
            >
            </el-table-column>
            <el-table-column
              prop="patientName"
              label="患者姓名"
              width="100"
              show-overflow-tooltip
              key="3-2"
            >
            </el-table-column>
            <el-table-column
              prop="visitNo"
              label="就诊号"
              min-width="120"
              show-overflow-tooltip
              key="3-3"
            >
            </el-table-column>
            <el-table-column
              prop="platformAmount"
              label="交易金额"
              min-width="100"
              key="3-4"
              show-overflow-tooltip
            >
              <template slot-scope="{ row }">
                <span
                  v-if="
                    row.platformAmount &&
                    (row.bankAmount != row.platformAmount ||
                      row.hisAmount != row.platformAmount)
                  "
                  class="payColor priceTip"
                ></span>
                {{ row.platformAmount ? `¥${row.platformAmount}` : '' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="platformTradeTypeText"
              label="单据类型"
              min-width="80"
              key="3-5"
              show-overflow-tooltip
              class-name="border-right"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="HIS流水"
            align="center"
            class-name="border-right"
            key="4"
          >
            <el-table-column
              prop="hisOrderNo"
              label="票据号"
              min-width="120"
              show-overflow-tooltip
              key="4-1"
            >
            </el-table-column>
            <el-table-column
              prop="hisAmount"
              label="交易金额"
              min-width="140"
              show-overflow-tooltip
              key="4-2"
            >
              <template slot-scope="{ row }">
                {{ row.hisAmount ? `¥${row.hisAmount}` : '' }}
                <span
                  :class="
                    getPrice(row.hisAmount, row.platformAmount) >= 0
                      ? 'addColor'
                      : 'subColor'
                  "
                  v-if="row.hisAmount != row.platformAmount"
                >
                  ({{
                    getPrice(row.hisAmount, row.platformAmount) >= 0 ? '+' : ''
                  }}{{ getPrice(row.hisAmount, row.platformAmount) }})
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="hisBizType"
              label="业务类型"
              min-width="80"
              show-overflow-tooltip
              class-name="border-right"
              key="4-3"
            >
            </el-table-column>
            <el-table-column
              prop="hisTradeTypeText"
              label="单据类型"
              min-width="80"
              show-overflow-tooltip
              class-name="border-right"
              key="4-4"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="statusText"
            label="状态"
            width="80"
            fixed="right"
            key="5"
          >
            <template slot-scope="scope">
              <span
                :style="{
                  color: scope.row.statusText === '正常' ? '#333' : 'red',
                }"
                >{{ scope.row.statusText }}</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { BlockTitle } from '@/components/Base'
import { reconciliation3Detail, writeoffTrade } from '@/api/zyapi/statistics'
export default {
  components: { BlockTitle },
  props: {
    content: {
      type: Object,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogTableVisible: false,
      tableData: [],
      tableInfoData: [],
      balanceData: [],
    }
  },
  watch: {
    show() {
      this.dialogTableVisible = this.show
      if (this.show) {
        this.tableData = [this.content]
        this.getreconciliation3Detail()
        this.getwriteoffTrade()
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit('close')
    },
    getPrice(value1, value2) {
      return (Number(value1 || 0) - Number(value2 || 0)).toFixed(2)
    },
    //高亮显示
    tableRowClassName({ row }) {
      if (row.status) {
        if (row.status === 'UNNORMAL') {
          return 'warning-row'
        } else {
          return ''
        }
      } else {
        if (
          row.bankAmount != row.platformAmount ||
          row.hisAmount != row.platformAmount
        ) {
          return 'warning-row'
        } else {
          return ''
        }
      }
    },
    async getreconciliation3Detail() {
      let res = await reconciliation3Detail({
        tradeType: this.content.tradeType,
        bankTrxNo: this.content.bankTrxNo,
        tradeOrderNo: this.content.tradeOrderNo,
      })
      this.tableInfoData = res
    },
    async getwriteoffTrade() {
      let res = await writeoffTrade({
        id: this.content.id,
        tradeType: this.content.tradeType,
      })
      this.balanceData = res
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../style.scss';
</style>
