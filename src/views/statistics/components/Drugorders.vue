<template>
  <!-- 药房端药品统计 -->
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
        <el-button type="primary">导出数据</el-button>
        <el-button type="info" @click="Refresh">刷新</el-button>
      </el-col>
    </el-row>

    <el-row class="view__content">
      <el-col :span="4" style="margin: 0 30px 0 700px;" class="mycol">
        <span>业务类型：</span>
        <el-select placeholder="全部" v-model="arrayS" @change="mideLis">
          <el-option label="全部" value=""></el-option>
          <el-option label="在线咨询" value="CONSULT"></el-option>
          <el-option label="在线复诊" value="REPEAT_CLINIC"></el-option>
          <el-option label="慢病续方" value="CARRYON_PRESC"></el-option>
        </el-select>
      </el-col>

      <el-col :span="4" class="mycol">
        <span>排名方式：</span>
        <el-select v-model="depchLisb" @change="hadleChange">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in roomBsub"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-col>
      <el-col>
        <div class="sortF">
          <el-radio-group v-model="saleSbaov" @change="hadleySca">
            <el-radio-button
              v-for="(_, index) in ['药品销量', '药品销售额']"
              :key="_"
              :label="index"
              >{{ _ }}</el-radio-button
            >
          </el-radio-group>
        </div>
        <div class="chart" ref="chart" style="margin-left: 50px;"></div>
      </el-col>

      <el-col>
        <span>全部排名</span>
        <el-radio-group v-model="type" @change="hadleySca">
          <el-radio-button
            v-for="(_, index) in ['药品销量', '药品销售额']"
            :key="_"
            :label="index"
            >{{ _ }}</el-radio-button
          >
        </el-radio-group>
      </el-col>

      <el-col>
        <el-table
          :data="tableData"
          border
          style="width: 100%;"
          :header-cell-style="{ textAlign: 'center' }"
        >
          <el-table-column
            label="名次"
            prop="index"
            width="500"
          ></el-table-column>
          <el-table-column>
            <template slot="header" slot-scope="{}">
              <el-select size="mini" v-model="btnWcno" @change="hadleChange">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in roomBsub"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <TableFooterTool
      v-model="comment.query"
      :total="total"
      @change="handleCommentChange"
    />
  </section>
</template>

<script>
import { isEqual } from 'lodash'
import { mapState } from 'vuex'
import { TableFooterTool } from '@/components/TableFooterTool'
import { sale, panKins } from '@/api/statistics'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'

import { removeResizeListener } from 'element-ui/lib/utils/resize-event'
import { deptChooseList } from '@/api'
import { formatDate } from '@/utils'

export default {
  name: 'StatisticsComment',
  components: {
    TableFooterTool,
  },
  data() {
    this.pickerOptions = {
      shortcuts: [
        {
          text: '最近7天',
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
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 87)
            picker.$emit('pick', [start, end])
          },
        },
      ],
    }

    return {
      total: 0, //页数总数
      comment: {
        query: {
          pageSize: 10,
          currentNum: 1,
        },
      },
      active: 7,
      arrayS: '', //业务类型
      department: '', //科室
      date: [
        formatDate(
          new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 6),
          'yyyyMMdd',
        ),
        formatDate(new Date(), 'yyyyMMdd'),
      ],
      saleSbaov: 0,
      type: 0,
      typeDate: 1,
      options: '', //科室
      tableData: [], //医药排名数据
      idiots: '', //医药排名
      leftBut: [], //柱状左侧
      buttonAut: [], //柱状下
      btnWcno: '',
      roomBsub: [], //科室
      depchLisb: '',
    }
  },
  created() {
    this.mideLis()
    this.hadleySca()
    this.roomListbtn() //科室
  },
  computed: {
    ...mapState('user', ['dept']),
  },
  beforeDestroy() {
    if (this.chart) {
      echarts.dispose(this.chart)
      removeResizeListener(this.$refs.chart, this.chart.resize)
    }
  },
  methods: {
    //分页总数
    handleCommentChange() {
      this.roomListbtn()
    },
    hadleChange() {
      this.roomListbtn() //科室
      this.mideLis()
    },
    //刷新
    Refresh() {
      ;(this.arrayS = ''), //业务类型
        (this.typeDate = 1)
      ;(this.date = [
        formatDate(
          new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
          'yyyyMMdd',
        ),
        formatDate(new Date(), 'yyyyMMdd'),
      ]),
        (this.active = 7)
      this.mideLis()
      this.hadleySca()
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
      this.mideLis()
      this.hadleySca()
    },
    //药房端药品统计 评论统计显示
    async mideLis() {
      let res = await sale({
        startTime: this.date[0],
        endTime: this.date[1],
        bizType: this.arrayS, //业务类型
        deptId: this.depchLisb, //科室ID
        pharmacyId: this.$store.state.user.store.id, //药房ID
      })
      this.buttonAut = res.xAxis //柱状下
      this.leftBut = res.datas.map(item => item.num) //柱状左
      this.find()
    },

    //药品排名
    async hadleySca() {
      let res = await panKins({
        startTime: this.date[0],
        endTime: this.date[1],
        pharmacyId: this.$store.state.user.store.id, //药房ID
        deptId: this.depchLisb, //科室ID
        rankType: this.type === 0 ? 'num' : 'amount', //排名类型
        currentNum: 1, //起始页
        pageSize: 10, //每页记录数
        orgId: this.$store.state.user.orgId, //机构id
      })

      this.tableData = res.list
      this.options = res.list
    },
    async roomListbtn() {
      //科室
      let res = await deptChooseList({
        tree: false,
      })
      this.roomBsub = res
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
      this.mideLis()
      this.hadleySca()
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
            data: this.buttonAut,
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
            name: '直接访问',
            type: 'bar',
            barWidth: '20px',
            data: this.leftBut,
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

.view__statistics-comment {
  .chart {
    height: 450px;
  }
}
// .sortF {
//   margin-left: 30px;
// }
// .pomede {
//   position: absolute;
//   top: 570px;
//   left: 1000px;
// }
// .talhad {
//   position: relative;
// }
.mycol {
  width: 300px;
}
</style>
