<template>
  <el-dialog
    title="平账"
    @closed="dialogClose"
    :visible.sync="dialogTableVisible"
    :close-on-click-modal="false"
    width="80%"
  >
    <div>
      <div style="border: 1px solid #dfe6ec">
        <el-table
          style="width: 100%"
          :data="tableData"
          :border="false"
          row-key="rowKey"
          :row-class-name="tableRowClassName"
          size="mini"
          ref="refTable"
        >
          <el-table-column
            label="第三方交易平台流水"
            align="center"
            class-name="border-right"
            v-if="checkType != 'PLATFORM_HIS'"
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
              min-width="160"
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
              min-width="100"
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
              min-width="120"
              key="3-4"
              show-overflow-tooltip
            >
              <template slot-scope="{ row }">
                <span
                  v-if="
                    row.platformAmount &&
                    ((checkType === 'THIRD_CHECK' &&
                      (row.bankAmount != row.platformAmount ||
                        row.hisAmount != row.platformAmount)) ||
                      (checkType === 'BANK_PLATFORM' &&
                        row.bankAmount != row.platformAmount) ||
                      (checkType === 'PLATFORM_HIS' &&
                        row.hisAmount != row.platformAmount))
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
            v-if="checkType != 'BANK_PLATFORM'"
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
              min-width="160"
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
            :label="
              checkType === 'THIRD_CHECK'
                ? '状态'
                : checkType === 'BANK_PLATFORM'
                ? '第三方/平台状态'
                : '平台/HIS状态'
            "
            :width="checkType === 'THIRD_CHECK' ? 60 : 128"
            fixed="right"
            key="5"
          >
            <template slot-scope="scope">
              <span
                :style="{
                  color:
                    scope.row.statusText === '正常' ||
                    scope.row.statusText.indexOf('已平账') > -1
                      ? '#333'
                      : 'red',
                }"
                >{{ scope.row.statusText }}</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <BlockTitle
        style="
          display: flex;
          align-items: center;
          margin-top: 25px;
          height: auto;
        "
        >选择平账的对冲单据
        <el-autocomplete
          class="inline-input"
          v-model="keyWords"
          style="width: 340px; margin-left: 15px"
          :fetch-suggestions="querySearch"
          placeholder="关键字筛选"
          @select="handleSelect"
        >
          <el-select
            style="width: 90px"
            v-model="type"
            slot="prepend"
            placeholder="请选择"
            @change="
              e => {
                keyWords = ''
              }
            "
          >
            <el-option value="platform" label="平台"></el-option>
            <el-option value="his" label="HIS"></el-option>
            <el-option value="bank" label="第三方"></el-option>
          </el-select>
        </el-autocomplete>
      </BlockTitle>
      <div style="border: 1px solid #dfe6ec; margin-top: 20px">
        <el-table
          style="width: 100%"
          :data="tableInfoData"
          :border="false"
          row-key="id"
          :row-class-name="tableRowClassName"
          size="mini"
          @selection-change="handleSelectionChange"
        >
          >
          <el-table-column
            type="selection"
            width="55"
            class-name="border-right"
          >
          </el-table-column>
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogTableVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submit"
        >确 认</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { BlockTitle } from '@/components/Base'
import { writeoffTrade, executeWriteoffAccounts } from '@/api/zyapi/statistics'
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
    checkType: {
      type: String,
    },
  },
  data() {
    return {
      dialogTableVisible: false,
      tableData: [],
      tableInfoData: [],
      keyWords: '',
      multipleSelection: [],
      loading: false,
      isRefresh: false,
      type: 'platform',
    }
  },
  watch: {
    show() {
      this.dialogTableVisible = this.show
      if (this.show) {
        this.isRefresh = false
        this.tableData = [this.content]
        this.keyWords = ''
        this.type = 'platform'
        this.getreconciliation3Detail()
      }
    },
  },
  methods: {
    async querySearch(queryString, cb) {
      console.log(this.type)
      var data = {
        bankTrxNo: this.type === 'bank' ? queryString : null,
        platformOrderNo: this.type === 'platform' ? queryString : null,
        hisOrderNo: this.type === 'his' ? queryString : null,
        tradeType: this.content.tradeType,
        id: this.content.id,
      }
      let list = await writeoffTrade(data)
      let dataMap = list
        .filter(t =>
          this.type === 'bank'
            ? t.bankTrxNo
            : this.type === 'platform'
            ? t.platformOrderNo
            : this.type === 'his'
            ? t.hisOrderNo
            : false,
        )
        .map(item => {
          return {
            ...item,
            value:
              this.type === 'bank'
                ? item.bankTrxNo
                : this.type === 'platform'
                ? item.platformOrderNo
                : this.type === 'his'
                ? item.hisOrderNo
                : null,
          }
        })
      // 调用 callback 返回建议列表的数据
      cb(dataMap)
    },
    handleSelect(item) {
      console.log(item)
      let ids = this.tableInfoData.map(item => item.id)
      if (ids.indexOf(item.id) === -1) {
        this.tableInfoData.push(item)
      } else {
        this.$message({
          message: '该数据已存在',
          type: 'warning',
          onClose: true,
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    dialogClose() {
      this.$emit('close', this.isRefresh)
    },
    submit() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择要对冲的数据',
          type: 'warning',
          onClose: true,
        })
        return false
      }
      this.$confirm('确定要对该数据进行平账?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await executeWriteoffAccounts({
            id: this.content.id,
            writeoffIds: this.multipleSelection.map(item => item.id),
          })
          this.isRefresh = true
          this.dialogTableVisible = false
        })
        .catch(() => {})
    },

    async getreconciliation3Detail() {
      let res = await writeoffTrade({
        id: this.content.id,
        tradeType: this.content.tradeType,
      })
      this.tableInfoData = res
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../style.scss';
</style>
