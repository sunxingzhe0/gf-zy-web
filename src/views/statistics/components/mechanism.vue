<template>
  <section class="view__card view__statistics-order">
    <el-row>
      <el-col :md="18">
        <el-date-picker
          style="margin-right: 10px;"
          type="daterange"
          :clearable="false"
          :picker-options="pickerOptions"
          value-format="yyyyMMdd"
          v-model="date"
          @change="handleDatePickerChange"
        ></el-date-picker>

        <el-button
          v-for="_ in [-1, 7, 30]"
          :key="_"
          :type="active === _ ? 'primary' : ''"
          @click="changeDate(_)"
        >
          {{ _ === -1 ? '昨天' : `最近${_}天` }}
        </el-button>
      </el-col>
      <el-col :md="6" class="is-right">
        <!-- <el-button type="primary" @click="dj">导出数据</el-button> -->
        <!-- <el-button type="primary" @click="getList">导出数据</el-button> -->
      </el-col>
    </el-row>

    <h3 class="view__title">订单金额数据</h3>
    <el-row class="view__content">
      <el-col :span="8" class="mycol" style="margin: 0 10 0 60;">
        <el-select v-model="depchLisb" @change="hadleChange">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in roomBsub"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <span>业务类型</span>
        <el-select placeholder="全部" v-model="lsitB" @change="getList">
          <el-option label="全部" value=""></el-option>
          <el-option label="在线咨询" value="CONSULT"></el-option>
          <el-option label="在线复诊" value="REPEAT_CLINIC"></el-option>
          <el-option label="慢病续方" value="CARRYON_PRESC"></el-option>
        </el-select>
      </el-col>

      <el-col>
        <el-row :gutter="20">
          <el-col :md="14">
            <div class="datas">
              <div
                v-for="{ title, type, value } in datas"
                :key="title"
                class="datas-box-wrap"
                :class="type"
              >
                <div>
                  <svg-icon :icon-class="`statistics-${type}`" />
                  <span class="info">{{ title }}</span>
                  <strong class="primary" v-if="type === 'amount'">
                    ¥{{ value || '0.00' }}
                  </strong>
                  <strong class="primary" v-else>
                    {{ value || 0 }}
                  </strong>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :md="8">
            <div class="totaClass">
              <div class="total">
                <div
                  class="trapezoid"
                  v-for="(item, index) in ['浏览', '下单', '付款']"
                  :key="item"
                >
                  <span v-if="index == 0">
                    <img src="@/assets/liulan.png" alt="" />
                  </span>
                  <span v-if="index == 1">
                    <img src="@/assets/xiadan.png" alt="" />
                  </span>
                  <span v-if="index == 2">
                    <img src="@/assets/fukuan.png" alt="" />
                  </span>
                  <span class="spans">{{ item }}</span>

                  <span v-if="index == 0" class="indClsx">
                    {{ listC.payRates }}%
                  </span>
                  <span v-if="index == 1" class="btnInde">
                    {{ listC.orderRates }}%
                  </span>
                  <span v-if="index == 2" class="payment">
                    {{ listC.finalRates }}%
                  </span>
                </div>

                <div class="cogi">
                  <img src="@/assets/cogi.png" alt="" />
                </div>
                <div class="mapng">
                  <img src="@/assets/mall.png" alt="" />
                </div>
                <div class="mall">
                  <img src="@/assets/mall.png" alt="" />
                </div>
              </div>
              <div class="cogiPng">
                <p class="mabos">下单转化率</p>
                <p class="clgbox">付款转化率</p>
                <p class="mabang">付款转化率</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>

      <el-col>
        <div class="chart" ref="chart"></div>
      </el-col>
    </el-row>

    <h3 class="view__title">订单与金额TOP5</h3>
    <el-row class="view__content">
      <el-col :md="12">
        <span>业务类型</span>
        <el-select v-model="arrayS" @change="Cheese">
          <el-option label="全部" value=""></el-option>
          <el-option label="在线咨询" value="CONSULT"></el-option>
          <el-option label="在线复诊" value="REPEAT_CLINIC"></el-option>
          <el-option label="慢病续方" value="CARRYON_PRESC"></el-option>
        </el-select>
      </el-col>

      <el-col :md="4" class="is-right">
        <el-radio-group v-model="type" @change="getListS">
          <el-radio-button
            v-for="(_, index) in ['订单数', '订单金额']"
            :key="_"
            :label="index"
            >{{ _ }}</el-radio-button
          >
        </el-radio-group>
      </el-col>

      <el-col>
        <el-table
          :data="tableData"
          @sort-change="hadnleSort"
          border
          style="width: 100%;"
          :header-cell-style="{ textAlign: 'center' }"
        >
          <el-table-column width="500" align="center">
            <template slot="header" slot-scope="{}">
              <el-select size="mini" v-model="department" @change="getListS">
                <el-option
                  v-for="item in branch"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </template>
            <template slot-scope="scope">
              {{ department == 0 ? scope.row.deptName : scope.row.doctorName }}
            </template>
          </el-table-column>
          <el-table-column label="高到低" sortable="custom" align="center">
            <template v-slot:default="{ row }">
              <el-row>
                <!-- <el-col :span="4">{{ row.orderNum }}</el-col> -->
                <el-col :span="4">
                  <template>
                    {{ department == 0 ? row.orderNum : row.orderAmount }}
                  </template>
                </el-col>
                <el-col :span="20">
                  <el-progress
                    :stroke-width="20"
                    :percentage="
                      department == 0
                        ? parseInt(row.orderNum)
                        : parseInt(row.orderAmount)
                    "
                    :show-text="false"
                  ></el-progress>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import moment from 'moment'
import { isEqual } from 'lodash'
import { mapState } from 'vuex'
import { getStatistics, getStatisticS, statChart } from '@/api/statistics'
import { deptChooseList } from '@/api'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'

import {
  addResizeListener,
  removeResizeListener,
} from 'element-ui/lib/utils/resize-event'

import { formatDate } from '@/utils'

// import variables from '@/styles/_variables.scss'
// import { number } from 'echarts/lib/export'

const T = [
  { title: '浏览人数', type: 'people', prop: 'viewNum' },
  { title: '下单人数', type: 'people', prop: 'ordersUserNum' },
  { title: '订单数', type: 'order', prop: 'orderNum' },
  { title: '有效订单数', type: 'order', prop: 'validNum' },
  { title: '下单金额', type: 'amount', prop: 'orderAmount' },
  { title: '退款金额', type: 'order', prop: 'refundAmount' },
  { title: '付款人数', type: 'people', prop: 'payUserNum' },
  { title: '付款订单数', type: 'order', prop: 'payOrderNum' },
  { title: '付款金额', type: 'amount', prop: 'payAmount' },
  // { title: '已付款客单价', type: 'amount', prop: 'orderRates' },
  { title: '已付款客单价', type: 'amount', prop: 'atvPrice' },
  { title: '下单转化率', type: 'amount', prop: 'orderRates' },
  { title: '成交转化率', type: 'amount', prop: 'finalRates' },
  { title: '付款转化率', type: 'amount', prop: 'payRates' },
]

export default {
  name: 'StatisticsOrder',
  data() {
    '',
      (this.pickerOptions = {
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              const today = moment()
              const yesterday = moment(today).add(-1, 'd')
              // const end = new Date()
              // const start = new Date()
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [
                moment(yesterday).format('YYYY-MM-DD 00:00:00'),
                moment(yesterday).format('YYYY-MM-DD 23:59:59'),
              ])
            },
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      })

    return {
      //科室
      abv: 0,
      depchLisb: '', //科室
      department: 0,
      roomBsub: [], //科室
      consulting: '',
      visit: '',
      prescription: '',
      active: -1,
      lsitB: '', //订单金额数据
      listC: {}, //浏览 下单 付款%
      arrayS: '', //订单金额TOP5
      orderS: 0, //订单金额 订单数
      flashback: '', //倒叙
      timeVbs: [], //时间
      comprehensive: [], //综合付款率
      branch: [
        //科室
        {
          name: '科室',
          id: 0,
        },
        {
          name: '医生',
          id: 1,
        },
      ],
      date: [
        formatDate(
          new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 1),
          'yyyyMMdd',
        ),
        // formatDate(new Date(), 'yyyyMMdd'),
        formatDate(
          new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 1),
          'yyyyMMdd',
        ),
      ],

      type: 0,

      datas: Array.from({ length: 10 }).map((_, index) => ({
        ...T[index],
        value: '', //这里是数据入口
      })),

      tableData: [],
    }
  },

  created() {
    // this.dj()
    this.getList(this.typ)
    this.Cheese()
    this.getListS()
    this.roomListbtn() //科室
  },
  // watch: {
  //   date() {
  //     this.dj()
  //     this.getList(this.typ)
  //   },
  // },
  beforeDestroy() {
    if (this.chart) {
      echarts.dispose(this.chart)
      removeResizeListener(this.$refs.chart, this.chart.resize)
    }
  },
  computed: {
    ...mapState('user', ['dept']),
  },
  methods: {
    hadleChange() {
      this.roomListbtn() //科室
      this.getList()
      this.Cheese()
    },
    hadnleSort({ order }) {
      //高低排序
      if (order === 'ascending') {
        this.flashback = 'ASC'
      } else if (order === 'descending') {
        this.flashback = 'DESC'
      } else {
        this.flashback = null
      }
      this.getListS()
    },
    //机构端订单金额数据
    async getList() {
      let res = await getStatistics({
        startTime: this.date[0],
        endTime: this.date[1],
        bizType: this.lsitB, //业务类型
        type: 0,
      })
      this.datas = this.datas.map(item =>
        Object.assign(item, {
          // 遍历 T 里面的数据
          value: res[item.prop],
        }),
      )
      this.listC = res
    },
    //科室
    async roomListbtn() {
      let res = await deptChooseList({
        tree: false,
      })
      this.roomBsub = res
    },
    //机构端 订单和金额TOP5
    async getListS() {
      let res = await getStatisticS({
        startTime: this.date[0], //开始时间
        endTime: this.date[1], //结束时间
        deptId: this.depchLisb, //科室ID
        bizType: this.arrayS, //业务类型
        orgId: this.$store.state.user.orgId, //机构id
        tagType: this.type, //订单金额 订单数
        sort: this.flashback, //倒叙 顺序
        selectType: this.department, //科室
        type: 0,
      })
      this.tableData = res
    },

    //统计图
    async Cheese() {
      let res = await statChart({
        orgId: this.$store.state.user.orgId, //机构id
        // deptId: this.dept.id, //科室ID
        bizType: this.arrayS, //业务类型
        startTime: this.date[0],
        endTime: this.date[1],
        type: 0, //订单
      })
      this.timeVbs = res.xAxis //时间
      this.comprehensive = res.datas
      this.$nextTick(() => {
        this.initCharts()
      })
    },
    // dj() {
    //   if (this.type === '全部') {
    //     return (this.typ = '')
    //   } else if (this.type === '在线咨询') {
    //     return (this.typ = 'CONSULT')
    //   } else if (this.type === '在线复诊') {
    //     return (this.typ = 'REPEAT_CLINIC')
    //   } else if (this.type === '慢病续方') {
    //     return (this.typ = 'CARRYON_PRESC')
    //   }
    // },
    handleDatePickerChange(val) {
      this.pickerOptions.shortcuts.some(({ text, onClick }) => {
        let dates = null
        onClick({
          $emit: (name, values) => {
            dates = values.map(_ => formatDate(_, 'yyyyMMdd'))
          },
        })

        if (isEqual(dates, val)) {
          this.active = { 昨天: -1, 最近一周: 7, 最近一个月: 30 }[text]
          return true
        }
        this.active = 0
        return false
      })
      this.Cheese()
      this.getListS()
      this.getList()
    },
    changeDate(days) {
      this.active = days
      switch (days) {
        case -1:
          this.pickerOptions.shortcuts[0].onClick({
            $emit: (name, values) =>
              (this.date = values.map(_ => formatDate(_, 'yyyyMMdd'))),
          })
          break
        case 7:
          this.pickerOptions.shortcuts[1].onClick({
            $emit: (name, values) =>
              (this.date = values.map(_ => formatDate(_, 'yyyyMMdd'))),
          })
          break
        case 30:
          this.pickerOptions.shortcuts[2].onClick({
            $emit: (name, values) =>
              (this.date = values.map(_ => formatDate(_, 'yyyyMMdd'))),
          })
          break
      }
      this.Cheese()
      this.getListS()
      this.getList()
    },

    initCharts() {
      // if (!this.chart) {
      this.chart = this.chart || echarts.init(this.$refs.chart)
      addResizeListener(this.$refs.chart, this.chart.resize)

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          y: 'bottom',
          bottom: 'buttom',
          itemGap: 80, //左右距离
          data: [
            '付款金额',
            '退款金额',
            '付款人数',
            '付款件数',
            '下单转化率(%)',
            '付款转换率(%)',
            '成交转化率(%)',
          ],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.timeVbs,
        },
        yAxis: [
          {
            type: 'value',
          },
          {
            name: '转化率%',
            nameLocation: 'start',
            type: 'value',
            inverse: true,
          },
        ],
        series: [
          {
            name: '付款金额',
            type: 'line',
            animation: false,
            lineStyle: {
              width: 2,
            },
            markArea: {
              silent: true,
            },
            data: this.comprehensive.map(item => item.payAmount), //付款金额
          },
          {
            name: '退款金额',
            type: 'line',
            animation: false,
            lineStyle: {
              width: 2,
            },
            markArea: {
              silent: true,
            },
            data: this.comprehensive.map(item => item.refundAmount), //退款金额
          },
          {
            name: '付款人数',
            type: 'line',
            animation: false,
            lineStyle: {
              width: 2,
            },
            markArea: {
              silent: true,
            },
            data: this.comprehensive.map(item => item.payUserNum), //付款人数
          },
          {
            name: '下单转化率(%)',
            type: 'line',
            animation: false,
            lineStyle: {
              width: 2,
            },
            markArea: {
              silent: true,
            },
            data: this.comprehensive.map(item => item.orderRates), //下单转化率
          },
          {
            name: '付款转换率(%)',
            type: 'line',
            animation: false,
            lineStyle: {
              width: 2,
            },
            markArea: {
              silent: true,
            },
            data: this.comprehensive.map(item => item.payRates),
          },
          {
            name: '成交转化率(%)',
            type: 'line',
            animation: false,
            lineStyle: {
              width: 2,
            },
            markArea: {
              silent: true,
            },
            data: this.comprehensive.map(item => item.finalRates),
          },
        ],
      })
    },
  },
  // },
}
</script>

<style lang="scss">
@import '@/styles/_modules-detail.scss';
@import '@/styles/statisticsA.scss';
.view__statistics-order {
  .chart {
    height: 450px;
  }

  .datas {
    display: grid;
    justify-content: space-between;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 20px;
  }

  .datas-box-wrap {
    position: relative;
    border: 1px solid #ccc;
    > div {
      // display: flex;
      // flex-direction: column;
      // justify-content: space-around;
      // position: absolute;
      position: relative;
      padding: 20px;
      width: 100%;
      height: 138px;
      word-break: break-word;
      overflow: hidden;

      > * {
        position: relative;
        z-index: 1;
      }

      strong {
        display: block;
        font-size: 17px;
      }

      .svg-icon {
        position: absolute;
        right: -10px;
        bottom: -10px;
        color: $--color-info-light;
        width: 50%;
        height: 70%;
      }
    }
  }

  .spans {
    margin: 0 65px;
  }
}
</style>
