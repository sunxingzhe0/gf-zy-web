<template>
  <section class="page-card">
    <!-- top -->
    <div class="top-num">
      <div class="num" v-for="(item, icon) in topNumList" :key="icon">
        <div class="icon">
          <img :src="item.img" :alt="item.title" />
        </div>
        <div class="right">
          <div class="title">{{ item.title }}</div>
          <div class="number">
            <el-tooltip
              effect="dark"
              :content="item.number + '人'"
              placement="top"
            >
              <label>{{ changeNum(item.number) }}</label>
            </el-tooltip>
            <span class="num-unit">{{ changeNumUnit(item.number) }}</span>
            <span>人</span>
          </div>
        </div>
      </div>
    </div>
    <!-- conten -->
    <div class="content">
      <!-- 按日、月、年筛选 -->
      <div class="search-date">
        <el-select v-model="searchType" class="select" @change="changeDataType">
          <el-option label="按日" :value="1"></el-option>
          <el-option label="按月" :value="2"></el-option>
          <el-option label="按年" :value="3"></el-option>
        </el-select>
        <template v-if="searchType == 1">
          <el-date-picker
            v-model="searchDay"
            type="date"
            placeholder="选择日期"
            style="margin-right: 20px"
            @change="changeDate"
          >
          </el-date-picker>
          <el-button @click="getDateList(searchType, 1)">今日</el-button>
          <el-button @click="getDateList(searchType, 2)">昨日</el-button>
        </template>
        <template v-if="searchType == 2">
          <el-date-picker
            v-model="searchMonth"
            type="month"
            placeholder="选择月份"
            @change="changeDate"
            style="margin-right: 20px"
          >
          </el-date-picker>
          <el-button @click="getDateList(searchType, 1)">本月</el-button>
          <el-button @click="getDateList(searchType, 2)">上月</el-button>
        </template>
        <template v-if="searchType == 3">
          <el-date-picker
            v-model="searchYear"
            type="year"
            placeholder="选择年份"
            @change="changeDate"
            style="margin-right: 20px"
          >
          </el-date-picker>
          <el-button @click="getDateList(searchType, 1)">今年</el-button>
          <el-button @click="getDateList(searchType, 2)">去年</el-button>
        </template>
      </div>
      <!-- 数量显示 -->
      <div class="number-box">
        <el-row :gutter="20" style="margin-bottom: 20px">
          <!-- 流调表 -->
          <el-col :span="12">
            <div class="flow-table">
              <div class="content-title">流调表</div>
              <el-row :gutter="20">
                <el-col
                  :span="12"
                  v-for="(item, flow) in flowTable"
                  :key="flow"
                >
                  <div
                    :class="`content-item ${
                      flowTable.length - 1 != flow ? 'border' : ''
                    }`"
                  >
                    <div class="nums">
                      <el-tooltip
                        effect="dark"
                        :content="item.number + item.unit"
                        placement="top"
                      >
                        <label> {{ changeNum(item.number) }}</label>
                      </el-tooltip>
                      <span class="num-unit">{{
                        changeNumUnit(item.number)
                      }}</span>
                      <span class="text">{{ item.unit }}</span>
                    </div>
                    <div class="text">{{ item.text }}</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <!-- 核算检查、意见反馈 -->
          <el-col :span="6" v-for="(item, idea) in checkIdeaList" :key="idea">
            <div class="check-idea">
              <div class="content-title">{{ item.title }}</div>
              <div class="content-item">
                <div class="nums">
                  <el-tooltip
                    effect="dark"
                    :content="item.number + item.unit"
                    placement="top"
                  >
                    <label>{{ changeNum(item.number) }}</label>
                  </el-tooltip>
                  <span class="num-unit">{{ changeNumUnit(item.number) }}</span>
                  <span class="text">{{ item.unit }}</span>
                </div>
                <div class="text">{{ item.text }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <!-- 费用分析 -->
        <div class="fee">
          <div class="content-title">费用分析</div>
          <div class="fee-box">
            <div class="fee-item" v-for="(item, fee) in feeNumList" :key="fee">
              <div class="content-item">
                <div class="nums">
                  <el-tooltip
                    effect="dark"
                    :content="
                      (fee > 2
                        ? changeNum(item.number)
                        : defMoney(item.number)) + item.unit
                    "
                    placement="top"
                  >
                    <label>{{
                      fee > 2
                        ? changeNum(item.number)
                        : changeMoney(item.number)
                    }}</label>
                  </el-tooltip>
                  <span class="num-unit">{{
                    fee > 2
                      ? changeNumUnit(item.number)
                      : changeMoneyUnit(item.number)
                  }}</span>
                  <span class="text">{{ item.unit }}</span>
                </div>
                <div class="text">{{ item.text }}</div>
              </div>
              <div v-if="feeNumList.length - 1 != fee" class="fee-border"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 柱状图筛选条件 -->
      <div class="select-chart">
        <el-select
          v-model="selectFee"
          style="margin-right: 20px"
          @change="getViewPayData"
        >
          <el-option label="缴费情况" :value="1"></el-option>
          <el-option label="退费情况" :value="2"></el-option>
        </el-select>
        <el-select v-model="selectNum" @change="getViewPayData">
          <el-option label="按金额" :value="1"></el-option>
          <el-option label="按订单笔数" :value="2"></el-option>
        </el-select>
        <div class="right">
          <el-select v-model="selectChart">
            <el-option label="柱状图" value="bar"></el-option>
            <el-option label="折线图" value="line"></el-option>
          </el-select>
        </div>
      </div>
      <!-- 柱状图、折线图 -->
      <div class="chart-box">
        <OverviewBar
          v-if="selectChart == 'bar'"
          :xLabel="xLabel"
          :type="selectFee"
          :data="chartDate"
        ></OverviewBar>
        <OverviewLine
          v-if="selectChart == 'line'"
          :xLabel="xLabel"
          :type="selectFee"
          :data="chartDate"
        ></OverviewLine>
      </div>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import OverviewBar from './components/OverviewBar'
import OverviewLine from './components/OverviewLine'
import { viewTopData, viewDataCount, viewPayData } from '@/api/zyapi/overview'
import topIcon1 from '@/assets/overview-top1.png'
import topIcon2 from '@/assets/overview-top2.png'
import topIcon3 from '@/assets/overview-top3.png'

export default {
  components: { OverviewBar, OverviewLine },
  data() {
    return {
      searchDay: dayjs().format('YYYY-MM-DD'), // 日期
      searchMonth: dayjs().format('YYYY-MM'), // 月份
      searchYear: dayjs().format('YYYY'), // 年份
      searchType: 1, // 日期类型
      selectFee: 1, // 费用选择
      selectNum: 1, // 金额
      selectChart: 'bar', // 柱状图切换
      chartDate: { MZ: [], GH: [], ZY: [] }, //统计图y轴数据
      xLabel: [],
      topNumList: [
        { img: topIcon1, title: '公众号粉丝', number: '0' },
        { img: topIcon2, title: '建档数量', number: '0' },
        { img: topIcon3, title: '访问数', number: '0' },
      ],
      feeNumList: [
        { number: '0', unit: '元', text: '支付金额' },
        { number: '0', unit: '元', text: '退费金额' },
        { number: '0', unit: '元', text: '实收金额' },
        { number: '0', unit: '笔', text: '费用支付笔数' },
        { number: '0', unit: '笔', text: '退费笔数' },
      ],
      flowTable: [
        { number: '0', unit: '次', text: '登记数量' },
        { number: '0', unit: '次', text: '异常数量' },
      ],
      checkIdeaList: [
        { title: '核酸检测单检', number: '0', unit: '次', text: '支付人次' },
        { title: '意见反馈', number: '0', unit: '条', text: '数量' },
      ],
    }
  },
  methods: {
    //按日月年选择
    changeDate(val) {
      if (!val) return
      this.getViewDataCount()
      this.getViewPayData()
      this.getXLabel(this.searchMonth)
    },
    //获取今日、昨日、本月、上月、今年、去年
    getDateList(type, id) {
      let start = dayjs().format('YYYY-MM-DD')
      let end = dayjs()
        .subtract(1, type == 1 ? 'day' : type == 2 ? 'month' : 'year')
        .format('YYYY-MM-DD')
      switch (type) {
        case 1:
          this.searchDay = id == 1 ? start : end
          break
        case 2:
          this.searchMonth = id == 1 ? start : end
          break
        case 3:
          this.searchYear = id == 1 ? start : end
          break
      }
      this.getViewDataCount()
      this.getViewPayData()
    },
    //按日、月、年切换时查询默认时间
    changeDataType() {
      this.searchDay = dayjs().format('YYYY-MM-DD')
      this.searchMonth = dayjs().format('YYYY-MM')
      this.searchYear = dayjs().format('YYYY')
      this.getViewDataCount()
      this.getViewPayData()
      this.getXLabel(this.searchMonth)
    },
    //数值转化为以万为单位
    changeNum(nums) {
      nums = nums.toString()
      if (nums.length >= 7) {
        return parseInt(((nums / 10000) * 100) / 100)
      } else {
        return nums
      }
    },
    //改变单位
    changeNumUnit(nums) {
      nums = nums.toString()
      if (nums.length >= 7) {
        return ' 万'
      } else {
        return ' '
      }
    },
    //费用补0
    changeMoney(nums) {
      nums = nums.toString()
      if (nums.indexOf('.') != -1) {
        let list = nums.split('.')
        if (list[1].length == 2) {
          if (list[0].length >= 7) {
            return parseInt(((list[0] / 10000) * 100) / 100)
            // return (list[0] / 10000).toFixed(2)
          } else {
            return nums
          }
        } else {
          if (list[0].length >= 7) {
            // return (list[0] / 10000).toFixed(2)
            return parseInt(((nums / 10000) * 100) / 100)
          } else {
            return nums + '0'
          }
        }
      } else {
        if (nums.length >= 7) {
          // return (nums / 10000).toFixed(2)
          return parseInt(((nums / 10000) * 100) / 100)
        } else {
          return nums + '.00'
        }
      }
    },
    //默认费用补0
    defMoney(nums) {
      nums = nums.toString()
      if (nums.indexOf('.') != -1) {
        let list = nums.split('.')
        if (list[1].length == 2) {
          return nums
        } else {
          return nums + '0'
        }
      } else {
        return nums + '.00'
      }
    },
    //费用价格
    changeMoneyUnit(nums) {
      nums = nums.toString()
      if (nums.indexOf('.') != -1) {
        let list = nums.split('.')
        if (list[0].length >= 7) {
          return ' 万'
        } else {
          return ' '
        }
      } else {
        if (nums.length >= 7) {
          return ' 万'
        } else {
          return ' '
        }
      }
    },
    //获取顶部数据
    async getViewTopData() {
      let res = await viewTopData()
      this.topNumList[0].number = res.fansNum
      this.topNumList[1].number = res.cardNum
      this.topNumList[2].number = res.visitNum
    },
    // 获取中间数据
    async getViewDataCount() {
      let res = await viewDataCount({
        beginTime: this.getDateTypeList()[0],
        endTime: this.getDateTypeList()[1],
      })
      this.flowTable[0].number = res.registerNum
      this.flowTable[1].number = res.errorNum
      this.checkIdeaList[0].number = res.nucleateNum
      this.checkIdeaList[1].number = res.backNum
      this.feeNumList[0].number = res.payMoney
      this.feeNumList[1].number = res.refundMoney
      this.feeNumList[2].number = res.amount
      this.feeNumList[3].number = res.payNum
      this.feeNumList[4].number = res.refundNum
    },
    //获取统计图数据
    async getViewPayData() {
      let res = await viewPayData({
        beginTime: this.getDateTypeList()[0],
        endTime: this.getDateTypeList()[1],
        timeType: this.searchType - 1,
      })
      this.getXLabel(this.searchMonth)
      this.getChartDate(this.selectFee == 1 ? res.payList : res.refundList)
    },
    getChartDate(list) {
      let test = this.selectNum == 1 ? 'totalMoney' : 'totalNum'
      let data = { GH: [], MZ: [], ZY: [] }
      this.xLabel.forEach(item => {
        let num = { GH: 0, MZ: 0, ZY: 0 }
        list.forEach(v => {
          if (
            item == (this.searchType == 1 ? v.dateInfo + ':00' : v.dateInfo)
          ) {
            for (let i in num) {
              num[i] = v.payInfo.find(s => s.orderType == i)
                ? v.payInfo.find(s => s.orderType == i)[test]
                : 0
            }
          }
        })
        for (let i in data) {
          data[i].push(num[i])
        }
      })
      this.chartDate = data
    },
    //获取统计图x轴坐标
    getXLabel(searchMonth) {
      let hourList = []
      let dayList = []
      let monthList = []
      let year = dayjs(searchMonth).format('YYYY')
      let month = dayjs(searchMonth).format('MM')
      let day = ''
      switch (this.searchType) {
        case 1: //按日
          for (let i = 0; i < 25; i++) {
            hourList.push(
              i == 24 ? '23:59' : dayjs(`2021-10-10 ${i}:00`).format('HH:00'),
            )
          }
          this.xLabel = hourList
          break
        case 2: //按月
          day = new Date(year, month, 0)
          for (let i = 1; i <= day.getDate(); i++) {
            let str = year + '-' + month + '-' + i
            dayList.push(dayjs(str).format('YYYY-MM-DD'))
          }
          this.xLabel = dayList
          break
        case 3: //按年
          for (let i = 1; i < 13; i++) {
            let str = dayjs().format('YYYY') + '-' + i
            monthList.push(dayjs(str).format('YYYY-MM'))
          }
          this.xLabel = monthList
          break
      }
    },
    //获取开始时间-结束时间
    getDateTypeList() {
      let beginDay = dayjs(this.searchDay).format('YYYYMMDD000000')
      let endDay = dayjs(this.searchDay).format('YYYYMMDD235959')
      let beginMonth = dayjs(this.searchMonth).format('YYYYMM01000000')
      let endMonth = dayjs(this.searchMonth).format('YYYYMM31235959')
      let beginYear = dayjs(this.searchYear).format('YYYY0101000000')
      let endYear = dayjs(this.searchYear).format('YYYY1231235959')
      switch (this.searchType) {
        case 1:
          return [beginDay, endDay]
        case 2:
          return [beginMonth, endMonth]
        case 3:
          return [beginYear, endYear]
      }
    },
  },
  mounted() {
    this.getViewDataCount()
    this.getViewPayData()
  },
  created() {
    this.getViewTopData()
  },
}
</script>

<style lang="scss" scoped>
.page-card {
  .top-num {
    display: flex;
    justify-content: space-between;
    .num {
      display: flex;
      width: 33%;
      height: 104px;
      background: #fff;
      padding: 20px;
      box-sizing: border-box;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      align-items: center;
      .icon {
        width: 64px;
        height: 100%;
        margin-right: 20px;
        img {
          width: 64px;
          height: 64px;
        }
      }
      .right {
        flex: 1;
        height: 100%;
        overflow: hidden;
        .title {
          width: 100%;
          font-size: 14px;
          line-height: 14px;
          font-weight: bold;
          color: #333333;
          margin-bottom: 15px;
        }
        .number {
          width: 100%;
          font-size: 39px;
          line-height: 39px;
          font-weight: 500;
          color: #0ab2c1;
          overflow: hidden;
          span {
            font-size: 14px;
            color: #333;
          }
        }
      }
    }
  }
  .content {
    margin-top: 5px;
    min-height: 600px;
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    .search-date {
      width: 100%;
      margin-bottom: 20px;
      .select {
        width: 80px;
      }
    }
    .number-box {
      margin-bottom: 20px;
      .flow-table,
      .check-idea {
        width: 100%;
        padding: 20px;
        border: 1px solid #cccccc;
        border-radius: 2px;
        box-sizing: border-box;
      }
      .content-title {
        margin-bottom: 20px;
        font-size: 16px;
        font-weight: bold;
        color: #333333;
        line-height: 16px;
      }
      .content-item {
        width: 100%;
        .nums,
        text {
          width: 100%;
          font-size: 39px;
          font-weight: 500;
          color: #0ab2c1;
        }
        .nums {
          margin-bottom: 10px;
          line-height: 39px;
        }
        .text {
          font-size: 14px;
          line-height: 14px;
          color: #333333;
        }
      }
      .fee {
        width: 100%;
        padding: 20px;
        border: 1px solid #cccccc;
        border-radius: 2px;
        box-sizing: border-box;
        .fee-box {
          display: flex;
          .fee-item {
            display: flex;
            width: 20%;
            flex-shrink: 0;
            .fee-border {
              width: 1px;
              height: 100%;
              background: #ccc;
              margin: 0 20px;
            }
          }
        }
      }
    }
    .select-chart {
      display: flex;
      width: 100%;
      align-items: center;
      .right {
        flex: 1;
        text-align: right;
      }
    }
    .chart-box {
      width: 100%;
      height: 420px;
    }
    .border {
      border-right: 1px solid #ccc;
    }
    .fee-margin {
      margin-right: 20px;
      padding-right: 20px;
    }
  }
  .num-unit {
    color: #0ab2c1 !important;
    font-size: 14px !important;
  }
}
</style>
