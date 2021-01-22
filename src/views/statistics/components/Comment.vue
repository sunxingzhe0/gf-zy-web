<template>
  <!-- 医生端 评价统计 -->
  <section class="view__card view__statistics-comment">
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
          v-for="_ in [7, 30, 90]"
          :key="_"
          :type="active === _ ? 'primary' : ''"
          @click="changeDate(_)"
        >
          {{ _ === 7 ? '最近7天' : `最近${_}天` }}
        </el-button>
      </el-col>
      <el-col :md="4" class="is-right">
        <el-button type="primary" @click="fails">导出数据</el-button>
        <el-button type="info" @click="refResh">刷新</el-button>
      </el-col>
    </el-row>

    <el-row class="view__content">
      <el-col :push="16" class="checkBs">
        <span>业务类型：</span>
        <el-select placeholder="全部" v-model="arrayS" @change="meter">
          <el-option label="全部" value=""></el-option>
          <el-option label="在线咨询" value="CONSULT"></el-option>
          <el-option label="在线复诊" value="REPEAT_CLINIC"></el-option>
          <el-option label="慢病续方" value="CARRYON_PRESC"></el-option>
        </el-select>
      </el-col>
      <el-col>
        <div class="sortF">
          <p>评价均分</p>
          <el-radio-group v-model="typeDate" @change="meter">
            <el-radio-button
              v-for="(_, index) in ['按日', '按周', '按月']"
              :key="_"
              :label="index + 1"
              >{{ _ }}</el-radio-button
            >
          </el-radio-group>
        </div>
        <div class="chart" ref="chart" style="margin-left: 50px;"></div>
      </el-col>

      <el-col>
        <span>统计方式</span>
        <el-select placeholder="总分" v-model="vbrSan" @change="jend">
          <el-option
            v-for="item in branch"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-col>

      <el-col>
        <el-table :data="tableData" border>
          <el-table-column
            label="名次"
            prop="index"
            align="center"
          ></el-table-column>
          <el-table-column label="类型" prop="bizType" align="center">
            <template slot-scope="scope">
              {{
                scope.row.bizType == 'CONSULT'
                  ? '在线咨询'
                  : scope.row.bizType == 'REPEAT_CLINIC'
                  ? '在线复诊'
                  : scope.row.bizType == 'CARRYON_PRESC'
                  ? '慢病续方'
                  : ''
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="分值"
            prop="summ"
            align="center"
            v-if="vbrSan == 1"
          >
          </el-table-column>
          <el-table-column label="分值" prop="average" align="center" v-else>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { isEqual } from 'lodash'
import { edicalSystem, tongFang, exportDatabs } from '@/api/statistics'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'

import { removeResizeListener } from 'element-ui/lib/utils/resize-event'

import { formatDate } from '@/utils'

export default {
  name: 'StatisticsComment',
  data() {
    this.pickerOptions = {
      shortcuts: [
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
          text: '最近30天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
            picker.$emit('pick', [start, end])
          },
        },
        {
          text: '最近90天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          },
        },
      ],
    }

    return {
      active: 7,
      arrayS: '', //业务类型
      department: '', //科室
      actionsBlue: [], //柱状侧
      actBotton: [], //柱状下
      vbrSan: 1, //总分
      branch: [
        //统计方式
        {
          name: '总分',
          id: 1,
        },
        {
          name: '平均分',
          id: 2,
        },
      ],
      date: [
        formatDate(
          new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
          'yyyyMMdd',
        ),
        formatDate(new Date(), 'yyyyMMdd'),
      ],

      type: 0,
      typeDate: 1,

      tableData: [], //机构端排名
      taRIW: [], //业务类型
    }
  },
  created() {
    this.meter()
    this.jend()
    //  this.fails()
  },
  beforeDestroy() {
    if (this.chart) {
      echarts.dispose(this.chart)
      removeResizeListener(this.$refs.chart, this.chart.resize)
    }
  },
  methods: {
    //导出数据
    missIle() {},
    //刷新
    refResh() {
      this.arrayS = '' //业务类型
      ;(this.typeDate = 1), //日 周 月
        (this.vbrSan = ''), //总分
        (this.date = [
          formatDate(
            new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
            'yyyyMMdd',
          ),
          formatDate(new Date(), 'yyyyMMdd'),
        ]),
        (this.active = 7)
      this.meter()
      this.jend()
    },
    handleDatePickerChange(val) {
      this.pickerOptions.shortcuts.some(({ text, onClick }) => {
        let dates = null
        onClick({
          $emit: (name, values) => {
            dates = values.map(_ => formatDate(_, 'yyyyMMdd'))
          },
        })

        if (isEqual(dates, val)) {
          this.active = { 最近一周: 7, 最近30天: 30, 最近90天: 90 }[text]
          return true
        }
        this.active = 0 //时间选中 就把最近一天 一周 一个月 清除
        return false
      })
      this.meter()
      this.jend()
      // this.fails()
    },
    async meter() {
      //评价统计显示
      let res = await edicalSystem({
        startTime: this.date[0],
        endTime: this.date[1],
        bizType: this.arrayS, //业务类型
        type: this.typeDate, //日期显示
        // rankingTye: this.department, //排序方式
      })
      res.sort(function (a, b) {
        return b.createTime > a.createTime ? -1 : 1
      })
      this.actionsBlue = res.map(item => item.average)
      this.actBotton = res.map(item => item.createTime)
      this.find()
    },

    //医生端 评价统计显示
    async jend() {
      let res = await tongFang({
        startTime: this.date[0],
        endTime: this.date[1],
      })
      this.tableData = res.list
    },
    //导出数据
    async fails() {
      await exportDatabs({
        startTime: this.date[0], //开始时间
        endTime: this.date[1], //结束时间
      })
    },
    changeDate(days) {
      this.active = days
      switch (days) {
        case 7:
          this.pickerOptions.shortcuts[0].onClick({
            $emit: (name, values) =>
              (this.date = values.map(_ => formatDate(_, 'yyyyMMdd'))),
          })
          break
        case 30:
          this.pickerOptions.shortcuts[1].onClick({
            $emit: (name, values) =>
              (this.date = values.map(_ => formatDate(_, 'yyyyMMdd'))),
          })
          break
        case 90:
          this.pickerOptions.shortcuts[2].onClick({
            $emit: (name, values) =>
              (this.date = values.map(_ => formatDate(_, 'yyyyMMdd'))),
          })
          break
      }
      this.meter()
      this.jend()
    },

    find() {
      this.chart = echarts.init(this.$refs.chart)
      const option = {
        color: ['#0AB2C1'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: this.actBotton,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '评价均分',
            type: 'bar',
            barWidth: '20px',
            data: this.actionsBlue,
          },
        ],
      }
      this.chart.setOption(option)
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_modules-detail.scss';
// @import '@/styles/statistics.scss';
.view__statistics-comment {
  .chart {
    height: 450px;
  }
}
.sortF {
  margin-left: 30px;
}
.checkBs {
  width: 300px;
}
</style>
