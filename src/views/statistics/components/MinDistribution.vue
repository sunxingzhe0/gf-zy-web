<template>
  <section class="view__card mind-patient">
    <div class="date-filter">
      <!-- <el-button>导出数据</el-button> -->
      <el-button
        v-for="_ in [-1, 7, 30]"
        :key="_"
        :type="active === _ ? 'primary' : ''"
        @click="changeDate(_)"
      >
        {{ _ === -1 ? '昨天' : `最近${_}天` }}
      </el-button>
      <el-date-picker
        v-model="dateVal"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        value-format="yyyyMMddHHmmss"
        @change="changeDatePiker"
      >
      </el-date-picker>
    </div>
    <el-row style="margin-top: 20px">
      <el-col :span="8">
        购买次数：
        <el-radio-group v-model="radioVal" @change="changeRadio">
          <el-radio :label="0">平均值</el-radio>
          <el-radio :label="1">总数</el-radio>
        </el-radio-group>
      </el-col>
      <!-- <el-col :span="16" style="display: flex">
        业务类型：
        <el-checkbox-group v-model="checkList" @change="changeCheck">
          <el-checkbox :label="0">在线咨询（图文）</el-checkbox>
          <el-checkbox :label="1">在线咨询（视频）</el-checkbox>
        </el-checkbox-group>
      </el-col> -->
    </el-row>
    <div class="chart-box" ref="chart"></div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { formatDate } from '@/utils'
import { bizClinicCount } from '@/api/statistics'
const xData = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
]
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              const today = dayjs()
              const yesterday = dayjs(today).add(-1, 'd')
              picker.$emit('pick', [
                dayjs(yesterday).format('YYYY-MM-DD 00:00:00'),
                dayjs(yesterday).format('YYYY-MM-DD 23:59:59'),
              ])
            },
          },
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
        ],
      },
      dateVal: '',
      active: -1,
      radioVal: 0,
      checkList: [0, 1],

      option: {
        color: ['#0AB2C1', '#FF6666'],
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            const lsitText = params
              .map(v => {
                return `<br /> ${v.marker} ${v.seriesName}：${v.value}`
              })
              .join(' ')
            return `${params[0].name}:00:00-${params[0].name}:59:59 ${lsitText}`
          },
        },
        legend: {
          data: ['在线咨询（图文）', '在线咨询（视频）'],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
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
          data: xData,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '在线咨询（图文）',
            type: 'line',
            stack: 'Total',
            data: [
              120,
              132,
              101,
              134,
              90,
              230,
              210,
              120,
              132,
              101,
              134,
              90,
              230,
              210,
              120,
              132,
              101,
              134,
              90,
              230,
              210,
            ],
          },
          {
            name: '在线咨询（视频）',
            type: 'line',
            stack: 'Total',
            data: [
              120,
              132,
              101,
              134,
              90,
              230,
              210,
              120,
              132,
              101,
              134,
              90,
              230,
              210,
              120,
              132,
              101,
              134,
              90,
              230,
              210,
            ],
          },
        ],
      },
    }
  },
  created() {
    this.changeDate(-1)
  },
  mounted() {
    this.initEcharts()
  },
  methods: {
    //获取数据
    async getBizClinicCount() {
      const params = this.dateVal.length
        ? { beginTime: this.dateVal[0], endTime: this.dateVal[1] }
        : {}
      const res = await bizClinicCount(params)
      //要显示的类型
      const types = [
        { bizType: 'CONSULT', bizWay: 'GRAPHIC' },
        { bizType: 'CONSULT', bizWay: 'VIDEO' },
        // { bizType: 'REPEAT_CLINIC', bizWay: 'GRAPHIC' },
        // { bizType: 'REPEAT_CLINIC', bizWay: 'VIDEO' },
      ]
      //处理y轴数据
      this.option.series = types.map(v => {
        const itemVal = res.find(
          it => it.bizType === v.bizType && it.bizWay === v.bizWay,
        )
        return {
          name: `在线${v.bizType === 'CONSULT' ? '咨询' : '复诊'}（${
            v.bizWay === 'GRAPHIC' ? '图文' : '视频'
          }）`,
          type: 'line',
          stack: v.bizWay === 'GRAPHIC' ? 'Total' : 'Total2',
          data: xData.map(childV => {
            const filterVal = itemVal
              ? itemVal.timeCountList.find(
                  childIt => childIt.timeInfo === childV,
                )
              : ''
            if (filterVal) {
              return this.radioVal ? filterVal.totalNum : filterVal.averageNum
            } else {
              return 0
            }
          }),
        }
      })
      this.initEcharts()
    },
    changeDate(days) {
      this.active = days
      switch (days) {
        case -1:
          this.pickerOptions.shortcuts[0].onClick({
            $emit: (name, values) => {
              this.dateVal = values.map(_ => formatDate(_, 'yyyyMMddhhmmss'))
            },
          })
          break
        case 7:
          this.pickerOptions.shortcuts[1].onClick({
            $emit: (name, values) =>
              (this.dateVal = values.map(_ => formatDate(_, 'yyyyMMddhhmmss'))),
          })
          break
        case 30:
          this.pickerOptions.shortcuts[2].onClick({
            $emit: (name, values) =>
              (this.dateVal = values.map(_ => formatDate(_, 'yyyyMMddhhmmss'))),
          })
          break
      }
      this.getBizClinicCount()
    },
    changeDatePiker(e) {
      console.log(e)
      this.active = ''
      this.getBizClinicCount()
    },
    changeRadio(e) {
      this.getBizClinicCount()
    },
    changeCheck(e) {
      console.log(e)
    },
    //初始化图表
    initEcharts() {
      let myChart = echarts.init(this.$refs.chart)
      myChart.setOption(this.option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-date-editor {
  margin-left: 10px;
}
.chart-box {
  width: 100%;
  height: 600px;
  margin-top: 50px;
}
</style>
