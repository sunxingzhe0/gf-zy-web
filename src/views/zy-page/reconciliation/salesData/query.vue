<template>
  <section class="view__card salesList">
    <TableFilter
      v-model="query"
      :data="filter"
      @change="filterChange"
    ></TableFilter>
    <el-table
      style="width: 100%"
      :data="tableData"
      @sort-change="sortChange"
      height="calc(100vh - 52px - 126px)"
      :border="false"
      :tree-props="{
        children: 'subList',
      }"
      row-key="rowKey"
      size="mini"
      v-loading="loading"
      ref="refTable"
      :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClass"
    >
      >
      <el-table-column prop="index" label="序号" width="55">
        <template slot-scope="{ row }">
          {{ row.subList && row.subList.length > 0 ? row.index : '' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="billDate"
        label="对账日期"
        sortable="custom"
        min-width="100"
      >
      </el-table-column>
      <el-table-column
        prop="bankType"
        label="交易方式"
        width="110"
        class-name="border-right"
      >
      </el-table-column>
      <el-table-column
        label="平台流水"
        align="center"
        class-name="border-right"
      >
        <el-table-column
          prop="platformPayCount"
          label="收入笔数"
          min-width="80"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="platformRefundCount"
          label="退款笔数"
          width="80"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="platformPayAmount"
          label="收入金额"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span
              v-if="
                row.hisPayAmount != row.platformPayAmount ||
                row.platformPayAmount != row.bankPayAmount
              "
              class="payColor priceTip"
            ></span>
            {{ row.platformPayAmount ? `¥${row.platformPayAmount}` : '' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="platformRefundAmount"
          label="退款金额"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span
              v-if="
                row.hisRefundAmount != row.platformRefundAmount ||
                row.platformRefundAmount != row.bankRefundAmount
              "
              class="refundColor priceTip"
            ></span>
            {{ row.platformRefundAmount ? `¥${row.platformRefundAmount}` : '' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="platformActualAmount"
          label="实收金额"
          min-width="100"
          show-overflow-tooltip
          class-name="border-right"
        >
          <template slot-scope="{ row }">
            <span
              v-if="
                row.hisActualAmount != row.platformActualAmount ||
                row.platformActualAmount != row.bankActualAmount
              "
              class="actualColor priceTip"
            ></span>
            {{ row.platformActualAmount ? `¥${row.platformActualAmount}` : '' }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="HIS流水" align="center" class-name="border-right">
        <el-table-column
          prop="hisPayCount"
          label="收入笔数"
          min-width="80"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="hisRefundCount"
          label="退款笔数"
          min-width="80"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="hisPayAmount"
          label="收入金额"
          min-width="180"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span
              v-if="row.hisPayAmount != row.platformPayAmount"
              class="payColor priceTip"
            ></span>
            <span>{{ row.hisPayAmount ? `¥${row.hisPayAmount}` : '' }}</span>
            <span
              :class="
                getPrice(row.hisPayAmount, row.platformPayAmount) >= 0
                  ? 'addColor'
                  : 'subColor'
              "
              v-if="row.hisPayAmount != row.platformPayAmount"
            >
              ({{
                getPrice(row.hisPayAmount, row.platformPayAmount) >= 0
                  ? '+'
                  : ''
              }}{{ getPrice(row.hisPayAmount, row.platformPayAmount) }})
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="hisRefundAmount"
          label="退款金额"
          min-width="160"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span
              v-if="row.hisRefundAmount != row.platformRefundAmount"
              class="refundColor priceTip"
            ></span>
            <span>{{
              row.hisRefundAmount ? `¥${row.hisRefundAmount}` : ''
            }}</span>
            <span
              :class="
                getPrice(row.hisRefundAmount, row.platformRefundAmount) >= 0
                  ? 'addColor'
                  : 'subColor'
              "
              v-if="row.hisRefundAmount != row.platformRefundAmount"
            >
              ({{
                getPrice(row.hisRefundAmount, row.platformRefundAmount) >= 0
                  ? '+'
                  : ''
              }}{{ getPrice(row.hisRefundAmount, row.platformRefundAmount) }})
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="hisActualAmount"
          label="实收金额"
          min-width="180"
          show-overflow-tooltip
          class-name="border-right"
        >
          <template slot-scope="{ row }">
            <span
              v-if="row.hisActualAmount != row.platformActualAmount"
              class="actualColor priceTip"
            ></span>
            <span>{{
              row.hisActualAmount ? `¥${row.hisActualAmount}` : ''
            }}</span>
            <span
              :class="
                getPrice(row.hisActualAmount, row.platformActualAmount) >= 0
                  ? 'addColor'
                  : 'subColor'
              "
              v-if="row.hisActualAmount != row.platformActualAmount"
            >
              ({{
                getPrice(row.hisActualAmount, row.platformActualAmount) >= 0
                  ? '+'
                  : ''
              }}{{ getPrice(row.hisActualAmount, row.platformActualAmount) }})
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="第三方交易平台流水"
        align="center"
        class-name="border-right"
      >
        <el-table-column
          prop="bankPayCount"
          label="收入笔数"
          min-width="80"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="bankRefundCount"
          label="退款笔数"
          min-width="80"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="bankPayAmount"
          label="收入金额"
          min-width="180"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span
              v-if="row.bankPayAmount != row.platformPayAmount"
              class="payColor priceTip"
            ></span>
            <span>{{ row.bankPayAmount ? `¥${row.bankPayAmount}` : '' }}</span>
            <span
              :class="
                getPrice(row.bankPayAmount, row.platformPayAmount) >= 0
                  ? 'addColor'
                  : 'subColor'
              "
              v-if="row.bankPayAmount != row.platformPayAmount"
            >
              ({{
                getPrice(row.bankPayAmount, row.platformPayAmount) >= 0
                  ? '+'
                  : ''
              }}{{ getPrice(row.bankPayAmount, row.platformPayAmount) }})
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="bankRefundAmount"
          label="退款金额"
          min-width="160"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span
              v-if="row.bankRefundAmount != row.platformRefundAmount"
              class="refundColor priceTip"
            ></span>
            <span>{{
              row.bankRefundAmount ? `¥${row.bankRefundAmount}` : ''
            }}</span>
            <span
              :class="
                getPrice(row.bankRefundAmount, row.platformRefundAmount) >= 0
                  ? 'addColor'
                  : 'subColor'
              "
              v-if="row.bankRefundAmount != row.platformRefundAmount"
            >
              ({{
                getPrice(row.bankRefundAmount, row.platformRefundAmount) >= 0
                  ? '+'
                  : ''
              }}{{ getPrice(row.bankRefundAmount, row.platformRefundAmount) }})
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="bankActualAmount"
          label="实收金额"
          min-width="180"
          show-overflow-tooltip
          class-name="border-right"
        >
          <template slot-scope="{ row }">
            <span
              v-if="row.bankActualAmount != row.platformActualAmount"
              class="actualColor priceTip"
            ></span>
            <span>{{
              row.bankActualAmount ? `¥${row.bankActualAmount}` : ''
            }}</span>
            <span
              :class="
                getPrice(row.bankActualAmount, row.platformActualAmount) >= 0
                  ? 'addColor'
                  : 'subColor'
              "
              v-if="row.bankActualAmount != row.platformActualAmount"
            >
              ({{
                getPrice(row.bankActualAmount, row.platformActualAmount) >= 0
                  ? '+'
                  : ''
              }}{{ getPrice(row.bankActualAmount, row.platformActualAmount) }})
            </span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        prop="opt"
        label="操作"
        width="120"
        fixed="right"
        class-name="border-right-opt"
      >
        <template slot-scope="{ row }">
          <el-button
            type="text"
            v-if="row.subList && row.subList.length > 0"
            @click="toDetail(row)"
            >明细</el-button
          >
          <el-button
            type="text"
            v-if="row.subList && row.subList.length > 0"
            @click="toggleRow(row)"
            >{{ row.expend ? '收起' : '展开' }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <TableFooterTool
      :total="total"
      :value="{
        currentNum: query.currentNum,
        pageSize: query.pageSize,
      }"
      @change="pageChange"
    >
      <el-button @click="exportData"> 导出 </el-button>
    </TableFooterTool>
  </section>
</template>

<script>
import { TableFilter, TableFooterTool } from '@/components'
import dayjs from 'dayjs'
import {
  reconciliation3Statis,
  reconciliation3ExportSsData,
} from '@/api/zyapi/statistics'
export default {
  name: 'checkBill_query',
  components: {
    TableFilter,
    TableFooterTool,
  },
  data() {
    this.filter = {
      isDisabledDate: true,
      status: '',
      billTypes: '',
      date: {
        props: {
          options: [{ label: '对账日期', value: 0 }],
          format: 'yyyy-MM-dd',
          valueFormat: 'yyyy-MM-dd',
          type: 'daterange',
        },
        keys: ['timeType', 'startBillDate', 'endBillDate'],
      },
      popover: [
        {
          props: {
            label: '账单状态',
            options: [
              { label: '不限', value: '' },
              { label: '正常', value: 0 },
              { label: '异常', value: 1 },
            ],
          },
          keys: 'billStatus',
        },
      ],
    }
    return {
      rowKey: 1000000,
      tableData: [],
      radio: 1,
      loading: false,
      total: 0,
      query: {
        timeType: 0,
        pageSize: 10,
        currentNum: 1,
        orderState: 0,
        startBillDate: dayjs(new Date() - 3600 * 1000 * 24 * 30).format(
          'YYYY-MM-DD',
        ),
        endBillDate: dayjs(new Date() - 3600 * 1000 * 24 * 1).format(
          'YYYY-MM-DD',
        ),
      },
    }
  },
  created() {
    this.getreconciliationList()
  },

  methods: {
    getPrice(value1, value2) {
      return (Number(value1 || 0) - Number(value2 || 0)).toFixed(2)
    },
    tableCellClass({ row, column }) {
      if (
        (row[column.property] == null && column.property != 'opt') ||
        (column.property == 'opt' && row.subList == null) ||
        (row.index === 0 && column.property == 'index')
      ) {
        return 'cell-wite'
      } else {
        return ''
      }
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
          row.bankActualAmount != row.platformActualAmount ||
          row.bankActualAmount != row.hisActualAmount ||
          row.bankPayAmount != row.hisPayAmount ||
          row.bankPayAmount != row.platformPayAmount ||
          row.bankRefundAmount != row.hisRefundAmount ||
          row.bankRefundAmount != row.platformRefundAmount
        ) {
          return 'warning-row'
        } else {
          return ''
        }
      }
    },
    //排序
    sortChange(e) {
      console.log(e)
      this.$set(this.query, 'field', 'bill_date')
      this.$set(
        this.query,
        'sorted',
        e.order == 'ascending'
          ? 'ASC'
          : e.order == 'descending'
          ? 'DESC'
          : null,
      )
      this.query.currentNum = 1
      this.getreconciliationList()
    },
    toggleRow(row) {
      this.$set(row, 'expend', !row.expend)
      this.$refs.refTable.toggleRowExpansion(row)
    },
    //筛选
    filterChange(e) {
      console.log(e)
      this.query.endBillDate = e.endBillDate
      this.query.startBillDate = e.startBillDate
      this.query.currentNum = 1
      this.getreconciliationList()
    },
    pageChange({ currentNum, pageSize }) {
      this.query.currentNum = currentNum
      this.query.pageSize = pageSize
      this.getreconciliationList()
    },
    async getreconciliationList() {
      this.loading = true
      let res = await reconciliation3Statis(this.query).finally(() => {
        this.loading = false
      })
      const list = res.list.map(item => {
        item.subList.forEach(_item => {
          this.rowKey++
          _item.rowKey = 'rowKey-' + this.rowKey
        })
        this.rowKey++
        item.rowKey = 'rowKey-' + this.rowKey
        return item
      })
      this.tableData = list
      this.total = res.total
    },
    //daochu
    async exportData() {
      // console.log('导出')
      await reconciliation3ExportSsData(this.query)
    },
    toDetail(row) {
      let orderState = 1
      if (
        row.bankActualAmount != row.platformActualAmount ||
        row.bankActualAmount != row.hisActualAmount ||
        row.bankPayAmount != row.hisPayAmount ||
        row.bankPayAmount != row.platformPayAmount ||
        row.bankRefundAmount != row.hisRefundAmount ||
        row.bankRefundAmount != row.platformRefundAmount
      ) {
        orderState = 0
      }
      this.$router.push(
        `/checkBill/query/detail?date=${row.billDate}&orderState=${orderState}`,
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.salesList {
  padding-bottom: 0 !important;
  ::v-deep .el-table .cell:empty::before {
    content: '';
  }
  ::v-deep .el-table__expand-icon {
    display: none;
  }
  ::v-deep .el-table--border th,
  ::v-deep .el-table--border td {
    font-size: 14px;
    border-right: 0 !important;
  }
  ::v-deep .el-table--border .border-right {
    border-right: 2px solid #dfe6ec !important;
  }
  ::v-deep .el-table--border .border-right-opt {
    border-right: 1px solid #dfe6ec !important;
  }
  ::v-deep .el-table--border .border-left {
    border-left: 2px solid #dfe6ec !important;
  }
  ::v-deep .el-table thead.is-group th {
    /* background: #fff; */
  }
  ::v-deep .warning-row {
    background: #fef0f0;
    &.hover-row > td {
      background: #fef0f0;
    }
    .cell-wite {
      background: #fff !important;
    }
  }
}
.list-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #666;
  .lable {
    min-width: 120px;
    color: #666;
  }
}
::v-deep .el-row {
  display: flex;
}
::v-deep .el-col-lg-offset-2 {
  margin-left: 0;
}
.priceTip {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
  position: relative;
  top: -2px;
  &.payColor {
    background: #f74a4a;
  }
  &.refundColor {
    background: #f2a41c;
  }
  &.actualColor {
    background: #bf48f1;
  }
}
.addColor {
  color: #f74a4a;
}
.subColor {
  color: #21d20f;
}
</style>
