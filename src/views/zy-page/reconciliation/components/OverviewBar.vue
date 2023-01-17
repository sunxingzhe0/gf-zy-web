<template>
  <div class="bar-chart" ref="barChart"></div>
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
      let myChart = echarts.init(this.$refs.barChart)
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
          top: '7%',
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
            // interval: this.xLabel.length > 24 ? 0 : '',
            // rotate: this.xLabel.length > 24 ? 30 : '',
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
            textStyle: {
              color: '#333',
            },
          },
          axisTick: {
            show: false,
          },
        },
        dataZoom: [
          {
            show: this.xLabel.length > 24,
            type: 'slider',
            start: 0,
            end: this.sliderLength(this.xLabel.length),
            height: 12,
            bottom: this.xLabel.length > 24 ? '7%' : '',
            fillerColor: 'rgba(215,226,251,0.4)',
            selectedDataBackground: {
              dataBackground: {
                color: 'rgba(215,226,251,1)',
              },
            },
          },
        ],
        series: [
          {
            name: `挂号${this.type == 1 ? '缴' : '退'}费`,
            data: this.data.GH,
            type: 'bar',
            barGap: 0.05,
            barMaxWidth: 30,
            barMinWidth: 15,
            itemStyle: {
              color: '#0AB2C1',
            },
            label: {
              show: true,
              position: 'top',
              fontWeight: '500',
              lineHeight: 12,
              formatter: function (val) {
                return parseInt(val.data) > 0 ? val.data : ''
              },
            },
          },
          {
            name: `门诊${this.type == 1 ? '缴' : '退'}费`,
            data: this.data.MZ,
            type: 'bar',
            barMaxWidth: 30,
            barMinWidth: 15,
            itemStyle: {
              color: '#1598DB',
            },
            label: {
              show: true,
              position: 'top',
              fontWeight: '500',
              lineHeight: 12,
              formatter: function (val) {
                return parseInt(val.data) > 0 ? val.data : ''
              },
            },
          },
          {
            name: `住院${this.type == 1 ? '缴' : '退'}费`,
            data: this.data.ZY,
            type: 'bar',
            barMaxWidth: 30,
            barMinWidth: 15,
            itemStyle: {
              color: '#56C829',
            },
            label: {
              show: true,
              position: 'top',
              fontWeight: '500',
              lineHeight: 12,
              formatter: function (val) {
                return parseInt(val.data) > 0 ? val.data : ''
              },
            },
          },
        ],
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    sliderLength(xLength) {
      if (xLength > 23) {
        if (xLength < 27) {
          return 50
        } else {
          return 33
        }
      } else {
        return 100
      }
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
.bar-chart {
  width: 100%;
  height: 100%;
}
</style>
