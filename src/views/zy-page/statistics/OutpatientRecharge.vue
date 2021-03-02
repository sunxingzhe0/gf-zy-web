<template>
  <section class="view__card view__statistics-comment">
    <el-row>
      <el-col :md="18">
        <el-date-picker
          style="margin-right: 10px"
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
          plain
          @click="changeDate(_)"
        >
          {{ _ === -1 ? '昨天' : `最近${_}天` }}
        </el-button>
      </el-col>
      <el-col :md="6" class="is-right">
        <el-button type="primary">导出数据</el-button>
        <el-button type="info">刷新</el-button>
      </el-col>
    </el-row>

    <h3 class="view__title">评价趋势图</h3>
    <el-row class="view__content">
      <el-col>
        <span>业务类型</span>
        <el-radio-group v-model="type">
          <el-radio-button
            v-for="_ in ['全部', '在线咨询', '在线复诊', '慢病续方']"
            :key="_"
            :label="_"
          ></el-radio-button>
        </el-radio-group>
      </el-col>

      <el-col></el-col>

      <el-col>
        <div class="chart" ref="chart"></div>
      </el-col>

      <el-col>
        <span>统计方式</span>
        <el-radio-group v-model="type">
          <el-radio-button
            v-for="_ in ['总分', '平均分']"
            :key="_"
            :label="_"
          ></el-radio-button>
        </el-radio-group>
      </el-col>

      <el-col>
        <el-table :data="tableData">
          <el-table-column
            label="患者姓名"
            prop="name"
            align="center"
          ></el-table-column>
          <el-table-column label="类型" prop="value" align="center">
          </el-table-column>
          <el-table-column label="分值" prop="value" align="center">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { isEqual } from 'lodash'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'

import {
  addResizeListener,
  removeResizeListener,
} from 'element-ui/lib/utils/resize-event'

import { formatDate } from '@/utils'

import variables from '@/styles/_variables.scss'

export default {
  name: 'StatisticsComment',
  data() {
    this.pickerOptions = {
      shortcuts: [
        {
          text: '昨天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            picker.$emit('pick', [start, end])
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
    }

    return {
      active: -1,
      date: [
        formatDate(
          new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 1),
          'yyyyMMdd',
        ),
        formatDate(new Date(), 'yyyyMMdd'),
      ],

      type: '全部',

      tableData: [
        {
          name: '刘小刚',
          value: 100,
        },
        {
          name: '找打住',
          value: 80,
        },
        {
          name: '李云',
          value: 60,
        },
        {
          name: '皱纹',
          value: 55,
        },
        {
          name: '百宝',
          value: 30,
        },
        {
          name: '李云龙',
          value: 25,
        },
      ],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts()
    })
  },
  beforeDestroy() {
    if (this.chart) {
      echarts.dispose(this.chart)
      removeResizeListener(this.$refs.chart, this.chart.resize)
    }
  },
  methods: {
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

        return false
      })
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
    },

    initCharts() {
      if (!this.chart) {
        this.chart = this.chart || echarts.init(this.$refs.chart)
        addResizeListener(this.$refs.chart, this.chart.resize)

        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              return params.map(({ data }) => data.join('：')).join('<br />')
            },
            axisPointer: {
              animation: false,
            },
          },
          xAxis: {
            type: 'time',
            axisLine: {
              lineStyle: {
                color: '#333',
                width: 1,
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#dadada',
              },
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#333',
                width: 1,
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#dadada',
              },
            },
            axisTick: {
              show: false,
            },
          },
          dataZoom: [
            {
              type: 'inside',
            },
          ],
          series: [],
          color: variables.blue,
          itemStyle: {
            borderColor: variables.blue,
            borderWidth: 2,
          },
        })
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_modules-detail.scss';

.view__statistics-comment {
  .chart {
    height: 450px;
  }
}
</style>
