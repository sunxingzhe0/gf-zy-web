<template>
  <div class="line-chart" ref="lineChart"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: {
    xLabel: {
      type: Array,
    },
    data: {
      type: Object,
    },
    type: {
      type: Number,
    },
  },
  data() {
    return {}
  },
  methods: {
    common() {
      let myChart = echarts.init(this.$refs.lineChart)
      let option = {
        legend: {
          data: [
            { name: `挂号${this.type == 1 ? '缴' : '退'}费` },
            { name: `门诊${this.type == 1 ? '缴' : '退'}费` },
            { name: `住院${this.type == 1 ? '缴' : '退'}费` },
          ],
          top: 'bottom',
        },
        grid: {
          left: '5%',
          top: '5%',
          right: '3%',
          bottom: this.xLabel.length > 24 ? '17%' : '13%',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} | {c}',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          textStyle: {
            color: '#ffffff',
          },
        },
        xAxis: {
          type: 'category',
          data: this.xLabel,
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: '#CCCCCC', //左边线的颜色
            },
          },
          axisLabel: {
            color: '#333', //坐标值得具体的颜色
            interval: this.xLabel.length > 24 ? 0 : '',
            rotate: this.xLabel.length > 24 ? 30 : '',
          },
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CCCCCC',
            },
          },
          axisLabel: {
            color: '#333',
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: `挂号${this.type == 1 ? '缴' : '退'}费`,
            data: this.data.GH,
            type: 'line',
            itemStyle: {
              color: '#e6a314',
            },
            areaStyle: {
              color: 'rgba(230,163,20,0.1)',
            },
          },
          {
            name: `门诊${this.type == 1 ? '缴' : '退'}费`,
            data: this.data.MZ,
            type: 'line',
            itemStyle: {
              color: '#0ab2c1',
            },
            areaStyle: {
              color: 'rgba(10,178,93,0.1)',
            },
          },
          {
            name: `住院${this.type == 1 ? '缴' : '退'}费`,
            data: this.data.ZY,
            type: 'line',
            itemStyle: {
              color: '#84d60f',
            },
            areaStyle: {
              color: 'rgba(132,214,15,0.1)',
            },
          },
        ],
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.common()
    })
  },
  watch: {
    option: {
      handler() {
        this.common()
      },
      deep: true,
    },
    data: {
      handler() {
        this.common()
      },
      deep: true,
    },
  },
}
</script>
<style lang="scss" scoped>
.line-chart {
  width: 100%;
  height: 100%;
}
</style>
