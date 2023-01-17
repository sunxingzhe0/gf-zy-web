<template>
  <section class="view__card salesList" v-loading="loading">
    <!-- top -->
    <div class="top">
      <div style="display: flex">
        <div class="list-item">
          <div class="lable">
            <span style="color: red">*</span> 选择对账日期：
          </div>
          <el-date-picker
            v-model="timeVal"
            class="filter-width"
            type="daterange"
            size="small"
            align="right"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeTime"
            value-format="yyyy-MM-dd"
          >
            >
          </el-date-picker>
        </div>
        <div class="list-item" style="margin-left: 30px">
          <div class="lable">
            <span style="color: red">*</span>选择三方对象：
          </div>
          <el-checkbox-group v-model="payWay" @change="changeFilter">
            <el-checkbox label="icbcPayPlugin">中国工商银行</el-checkbox>
            <el-checkbox label="aliPayPlugin">支付宝</el-checkbox>
            <!-- <el-checkbox label="offlinePayPlugin">线下支付</el-checkbox> -->
          </el-checkbox-group>
        </div>
      </div>
      <div class="sales-query">
        <div class="list-item">
          <span class="lable">对账维度：</span
          ><el-select
            class="filter-width"
            size="small"
            v-model="query.checkType"
            placeholder="请选择"
            @change="
              query.status = ''
              changeFilter()
            "
          >
            <el-option value="THIRD_CHECK" label="第三方/平台/HIS"></el-option>
            <el-option value="BANK_PLATFORM" label="第三方/平台"></el-option>
            <el-option value="PLATFORM_HIS" label="平台/HIS"></el-option>
          </el-select>
        </div>
        <div class="list-item" v-if="query.checkType != 'THIRD_CHECK'">
          <span class="lable">
            {{
              query.checkType === 'BANK_PLATFORM'
                ? '第三方/平台状态'
                : '平台/HIS状态'
            }}：</span
          >

          <el-select
            class="filter-width"
            size="small"
            v-model="query.status"
            placeholder="请选择"
            @change="changeFilter"
          >
            <el-option value="" label="不限"></el-option>
            <el-option value="NORMAL" label="正常"></el-option>
            <el-option value="PLATFORM_OVER_MISMATCH" label="长款"></el-option>
            <el-option value="PLATFORM_SHORT_MISMATCH" label="短款"></el-option>
          </el-select>
        </div>
        <div class="list-item" v-else>
          <span class="lable"> 第三方/平台/HIS状态：</span>

          <el-select
            class="filter-width"
            size="small"
            v-model="query.status"
            placeholder="请选择"
            @change="changeFilter"
          >
            <el-option value="" label="不限"></el-option>
            <el-option value="NORMAL" label="正常"></el-option>
            <el-option value="UNNORMAL" label="异常"></el-option>
            <el-option value="MANUAL_NORMAL" label="异常(已平账)"></el-option>
          </el-select>
        </div>
        <div class="list-item">
          <span class="lable">关键字：</span>
          <el-input
            size="small"
            class="filter-width"
            v-model="query.searchKeywords"
            style="width: 260px"
            clearable
            placeholder="交易流水号/就诊号/单据号/患者姓名"
            @change="changeFilter"
          ></el-input>
        </div>
        <div class="list-item">
          <span class="lable"> 类型：</span>

          <el-select
            class="filter-width"
            size="small"
            v-model="query.tradeType"
            placeholder="请选择"
            @change="changeFilter"
          >
            <el-option value="" label="不限"></el-option>
            <el-option value="out" label="出账"></el-option>
            <el-option value="in" label="入账"></el-option>
          </el-select>
        </div>
      </div>
      <BlockTitle style="margin-bottom: 10px">对账结果</BlockTitle>
      <div class="allNum">
        <template v-if="query.checkType != 'PLATFORM_HIS'"
          ><span
            >第三方交易平台流水
            {{ totalData.bakRefundCount + totalData.bankPayCount }} 笔，金额
            ￥{{
              parseFloat(
                Number(totalData.bankPayAmount) +
                  Number(totalData.bankRefundAmount),
              ).toFixed(2)
            }}</span
          >|</template
        >

        <span
          >平台流水
          {{ totalData.platformPayCount + totalData.platformRefundCount }}
          笔，金额 ￥{{
            parseFloat(
              Number(totalData.platformPayAmount) +
                Number(totalData.platformRefundAmount),
            ).toFixed(2)
          }}</span
        >|
        <template v-if="query.checkType != 'BANK_PLATFORM'">
          <span
            >HIS流水
            {{ totalData.hisPayCount + totalData.hisRefundCount }}
            笔，金额￥{{
              parseFloat(
                Number(totalData.hisRefundAmount) +
                  Number(totalData.hisPayAmount),
              ).toFixed(2)
            }}</span
          >|
        </template>
        <span
          >正常 {{ totalData.normal }} 笔<template
            v-if="query.checkType === 'THIRD_CHECK'"
            >，异常 <b>{{ totalData.unnormal }}</b> 笔，平账
            {{ totalData.manualNormal }} 笔</template
          ><template v-else
            >，长款 <b>{{ totalData.platformOver }}</b> 笔，短款
            <b>{{ totalData.platformShort }}</b> 笔</template
          >
        </span>
      </div>
      <BlockTitle style="margin-bottom: 10px; margin-top: 20px"
        >明细账单</BlockTitle
      >
    </div>
    <div
      style="
        height: calc(100vh - 400px);
        margin-top: 20px;
        border: 1px solid #dfe6ec;
      "
    >
      <el-table
        style="width: 100%"
        :data="tableData"
        @sort-change="sortChange"
        :border="false"
        row-key="rowKey"
        :max-height="tableHeight"
        size="mini"
        v-loading="loading"
        ref="refTable"
        show-summary
        :summary-method="getSummaries"
        :span-method="arraySpanMethod"
        :row-class-name="tableRowClassName"
      >
        >
        <el-table-column
          prop="index"
          label="序号"
          width="65"
          class-name="border-right"
          key="1"
        >
        </el-table-column>
        <el-table-column
          label="第三方交易平台流水"
          align="center"
          class-name="border-right"
          v-if="query.checkType != 'PLATFORM_HIS'"
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
                v-if="
                  row.bankAmount != row.platformAmount &&
                  row.statusText.indexOf('已平账') === -1
                "
              >
                ({{
                  getPrice(row.bankAmount, row.platformAmount) >= 0 ? '+' : ''
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
                  row.statusText.indexOf('已平账') === -1 &&
                  ((query.checkType === 'THIRD_CHECK' &&
                    (row.bankAmount != row.platformAmount ||
                      row.hisAmount != row.platformAmount)) ||
                    (query.checkType === 'BANK_PLATFORM' &&
                      row.bankAmount != row.platformAmount) ||
                    (query.checkType === 'PLATFORM_HIS' &&
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
          v-if="query.checkType != 'BANK_PLATFORM'"
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
                v-if="
                  row.hisAmount != row.platformAmount &&
                  row.statusText.indexOf('已平账') === -1
                "
              >
                ({{ getPrice(row.hisAmount, row.platformAmount) >= 0 ? '+' : ''
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
            query.checkType === 'THIRD_CHECK'
              ? '状态'
              : query.checkType === 'BANK_PLATFORM'
              ? '第三方/平台状态'
              : '平台/HIS状态'
          "
          :width="query.checkType === 'THIRD_CHECK' ? 100 : 128"
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
        <el-table-column key="6" label="操作" width="100" fixed="right">
          <template slot-scope="{ row }">
            <el-button
              v-if="row.hasMultiple && query.checkType === 'THIRD_CHECK'"
              type="text"
              @click="openDetail(row)"
              >明细</el-button
            >
            <el-button
              type="text"
              v-if="
                query.checkType === 'THIRD_CHECK' &&
                !(
                  row.statusText === '正常' ||
                  row.statusText.indexOf('已平账') > -1
                )
              "
              @click="openBalance(row)"
              >平账</el-button
            >
            <!-- <el-button
              type="text"
              v-if="
                getPrice(row.hisAmount, row.platformAmount) < 0 ||
                getPrice(row.hisAmount, row.bankAmount) < 0
              "
              >退款</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
    </div>

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
    <!--单条详情-->
    <SingleDetail
      :show="show"
      :content="rowData"
      @close="show = false"
    ></SingleDetail>
    <!--平账-->
    <BalanceBill
      :show="balanceShow"
      :content="rowData"
      :checkType="query.checkType"
      @close="balanceClose"
    ></BalanceBill>
  </section>
</template>

<script>
import { TableFooterTool } from '@/components'
import { BlockTitle } from '@/components/Base'
import dayjs from 'dayjs'
import {
  reconciliation3List,
  reconciliation3Total,
  reconciliation3ExportData,
} from '@/api/zyapi/statistics'
import SingleDetail from './components/SingleDetail'
import BalanceBill from './components/BalanceBill'
export default {
  components: {
    BlockTitle,
    SingleDetail,
    TableFooterTool,
    BalanceBill,
  },
  data() {
    this.filter = {
      isDisabledDate: true,
      status: '',
      billTypes: '',
      inline: [
        {
          props: {
            label: '状态',
            is: 'el-select',
            filterable: true,
            options: [
              { label: '正常', value: 'NORMAL' },
              { label: '异常', value: 'UNNORMAL' },
              // { label: '单据缺失', value: 'PLATFORM_MISS' },
              // { label: '流水缺失', value: 'BANK_MISS' },
            ],
            multiple: true,
          },
          keys: 'status',
          data: {
            on: {
              change: e => {
                console.log(e)

                // this.$set(this.query, 'status', e.join(','))
                this.query.status = e.join(',')
                this.query.currentNum = 1
                this.getreconciliationList()
              },
              'visible-change': () => {
                // !e && this.$set(this.query, 'status', this.status)
              },
            },
            style: 'margin-right:35px',
          },
        },
        {
          props: {
            label: '费用类型',
            is: 'el-select',
            options: [
              { label: '出账', value: 'out' },
              { label: '入账', value: 'in' },
            ],
            multiple: true,
          },
          keys: 'billTypes',
          data: {
            on: {
              change: e => {
                console.log(e)
                // this.$set(this.query, 'billTypes', e.join(','))
                this.query.billTypes = e.join(',')
                this.query.currentNum = 1
                this.getreconciliationList()
              },
              'visible-change': () => {
                // !e && this.$set(this.query, 'billTypes', this.billTypes)
              },
            },
            style: 'margin-right:35px',
          },
        },
      ],

      // date: {
      //   props: {
      //     options: [{ label: '支付时间', value: 0 }],
      //   },
      //   keys: ['timeType', 'startTime', 'endTime'],
      // },

      search: {
        props: {
          options: [
            { label: '支付流水号', value: 0 },
            { label: '单据号', value: 1 },
          ],
        },
        isOtherPage: true,
        keys: ['searchType', 'searchKeywords'],
      },
    }
    return {
      show: false,
      balanceShow: false,
      tableHeight: 0,
      rowData: {},
      payWay: ['icbcPayPlugin', 'aliPayPlugin' /* , 'offlinePayPlugin' */],
      rowKey: 1000000,
      totalData: {},
      tableData: [],
      radio: 1,
      loading: false,
      total: 0,
      timeVal: [
        this.$route.query.date ||
          dayjs(new Date() - 3600 * 1000 * 24 * 1).format('YYYY-MM-DD'),
        this.$route.query.date ||
          dayjs(new Date() - 3600 * 1000 * 24 * 1).format('YYYY-MM-DD'),
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      query: {
        timeType: 0,
        searchType: 99,
        pageSize: 10,
        currentNum: 1,
        bankType: '',
        checkType: 'THIRD_CHECK',
        status: this.$route.query.orderState == 1 ? '' : 'UNNORMAL',
        searchKeywords: '',
        tradeType: '',
        startBillDate:
          this.$route.query.date ||
          dayjs(new Date() - 3600 * 1000 * 24 * 1).format('YYYY-MM-DD'),
        endBillDate:
          this.$route.query.date ||
          dayjs(new Date() - 3600 * 1000 * 24 * 1).format('YYYY-MM-DD'),
      },
    }
  },
  created() {
    this.getreconciliationList()
    this.reconciliationTotal()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 400
    })
  },
  methods: {
    balanceClose(refresh) {
      if (refresh) {
        this.reconciliationTotal()
        this.getreconciliationList()
      }
      this.balanceShow = false
    },
    openBalance(row) {
      this.rowData = { ...row }
      this.balanceShow = true
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
          ((this.query.checkType === 'THIRD_CHECK' &&
            (row.bankAmount != row.platformAmount ||
              row.hisAmount != row.platformAmount)) ||
            (this.query.checkType === 'BANK_PLATFORM' &&
              row.bankAmount != row.platformAmount) ||
            (this.query.checkType === 'PLATFORM_HIS' &&
              row.hisAmount != row.platformAmount)) &&
          row.statusText.indexOf('已平账') === -1
        ) {
          return 'warning-row'
        } else {
          return ''
        }
      }
    },
    openDetail(row) {
      this.rowData = { ...row }
      this.show = true
    },
    getSummaries(param) {
      console.log(param)
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        sums[index] = ''
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 1) {
          sums[index] = `${
            this.query.checkType !== 'PLATFORM_HIS'
              ? this.getAllNum(this.tableData, 'bankTrxNo')
              : this.getAllNum(this.tableData, 'platformOrderNo')
          }笔，￥${
            this.query.checkType !== 'PLATFORM_HIS'
              ? this.getAllPrice(this.tableData, 'bankAmount')
              : this.getAllPrice(this.tableData, 'platformAmount')
          }`
        }
        if (index === 2) {
          sums[index] = `${
            this.query.checkType !== 'PLATFORM_HIS'
              ? this.getAllNum(this.tableData, 'platformOrderNo')
              : this.getAllNum(this.tableData, 'hisOrderNo')
          }笔，￥${
            this.query.checkType !== 'PLATFORM_HIS'
              ? this.getAllPrice(this.tableData, 'platformAmount')
              : this.getAllPrice(this.tableData, 'hisAmount')
          }`
        }
        if (index === 3) {
          sums[index] = `${this.getAllNum(
            this.tableData,
            'hisOrderNo',
          )}笔，￥${this.getAllPrice(this.tableData, 'hisAmount')}`
        }
      })

      return sums
    },
    arraySpanMethod() {
      //table合计行合并单元格
      if (this.$refs.refTable.$el) {
        let current = this.$refs.refTable.$el
          .querySelector('.el-table__footer-wrapper')
          .querySelector('.el-table__footer')
        let cell = current.rows[0].cells
        //cell[1].style.display = 'none'
        cell[1].colSpan = '5'
        cell[1].style.borderRight = '2px solid #dfe6ec'
        cell[1].style.textAlign = 'right'
        cell[2].colSpan = '5'
        cell[2].style.borderRight = '2px solid #dfe6ec'
        cell[2].style.textAlign = 'right'
        if (this.query.checkType === 'THIRD_CHECK') {
          cell[3].colSpan = '4'
          cell[3].style.borderRight = '2px solid #dfe6ec'
          cell[3].style.textAlign = 'right'
        } else if (this.query.checkType === 'PLATFORM_HIS') {
          cell[1].colSpan = '5'
          cell[1].style.borderRight = '2px solid #dfe6ec'
          cell[2].colSpan = '4'
          cell[2].style.borderRight = '2px solid #dfe6ec'
        }
      }
    },
    //排序
    sortChange(e) {
      console.log(e)
      this.$set(this.query, 'field', 'bank_trade_time')
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
    //计算价格
    getAllPrice(datalist, priceName) {
      let price = datalist.reduce(
        (sum, e) => sum + Number(e[priceName] || 0),
        0,
      )
      return parseFloat(price).toFixed(2)
    },
    //计算笔数
    flatten(arr) {
      return [].concat(
        ...arr.map(x => (Array.isArray(x) ? this.flatten(x) : x)),
      )
    },
    getAllNum(datalist, priceName) {
      let list = datalist
        .filter(item => item[priceName])
        .map(item => item[priceName])
      return list.length
    },
    pageChange({ currentNum, pageSize }) {
      this.query.currentNum = currentNum
      this.query.pageSize = pageSize
      this.getreconciliationList()
    },
    async getreconciliationList() {
      this.loading = true
      this.query.bankTypes = this.payWay.join(',')
      let res = await reconciliation3List(this.query).finally(() => {
        this.loading = false
      })
      this.tableData = res.list || []
      this.total = res.total
      this.$nextTick(() => {
        this.$refs.refTable?.doLayout()
      })
    },
    //daochu
    async exportData() {
      // console.log('导出')
      await reconciliation3ExportData(this.query)
    },
    //获取总数
    async reconciliationTotal() {
      this.query.bankTypes = this.payWay.join(',')
      this.totalData = await reconciliation3Total(this.query)
    },
    changeTime() {
      this.$set(
        this.query,
        'startBillDate',
        this.timeVal ? this.timeVal[0] : '',
      )
      this.$set(this.query, 'endBillDate', this.timeVal ? this.timeVal[1] : '')
      this.changeFilter()
    },
    changeFilter() {
      this.query.currentNum = 1
      this.reconciliationTotal()
      this.getreconciliationList()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
