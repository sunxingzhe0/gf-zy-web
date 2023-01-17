<template>
  <section class="page-card">
    <!-- top -->
    <div class="top">
      <div class="head">累计数据</div>
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
                :content="topDateCount[item.key] + (icon === 3 ? '条' : '人')"
                placement="top"
              >
                <label>{{ changeNum(topDateCount[item.key]) }}</label>
              </el-tooltip>
              <span class="num-unit">{{
                getNumUnit(topDateCount[item.key])
              }}</span>
              <span>{{ icon === 3 ? '条' : '人' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- conten -->
    <div class="content">
      <div class="head">新增数据</div>
      <!-- 按日、月、年筛选 -->
      <div class="search-date">
        <el-select v-model="searchType" class="select" @change="changeDataType">
          <el-option label="按日" :value="1"></el-option>
          <el-option label="按月" :value="2"></el-option>
          <el-option label="按年" :value="3"></el-option>
        </el-select>
        <el-date-picker
          v-model="searchDate"
          :type="searchType == 1 ? 'date' : searchType == 2 ? 'month' : 'year'"
          :placeholder="`选择${
            searchType == 1 ? '日' : searchType == 2 ? '月' : '年'
          }份`"
          @change="changeDate"
          class="date"
        >
        </el-date-picker>
        <el-button @click="getDateList(searchType, 1)">
          {{ searchType == 1 ? '今日' : searchType == 2 ? '本月' : '今年' }}
        </el-button>
        <el-button @click="getDateList(searchType, 2)">
          {{ searchType == 1 ? '昨日' : searchType == 2 ? '上月' : '去年' }}
        </el-button>
      </div>
      <!-- 数量显示 -->
      <div class="number-box">
        <div class="item-demo">
          <div class="demo" v-for="(item, demo) in centerNumList" :key="demo">
            <!-- :style="`${index != 4 ? 'margin-right:20px' : ''}`" -->
            <div class="content-title">{{ item.title }}</div>
            <div class="content-item">
              <div class="nums" style="margin-bottom: 0">
                <el-tooltip
                  effect="dark"
                  :content="
                    (item.unit == '元'
                      ? defMoney(viewDataCount[item.key])
                      : viewDataCount[item.key]) + item.unit
                  "
                  placement="top"
                >
                  <label>{{
                    item.unit == '元'
                      ? changeMoney(viewDataCount[item.key])
                      : changeNum(viewDataCount[item.key])
                  }}</label>
                </el-tooltip>
                <span class="num-unit">{{
                  getNumUnit(viewDataCount[item.key])
                }}</span>
                <span class="text">{{ item.unit }}</span>
              </div>
            </div>
          </div>
        </div>
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
                        ? changeNum(viewDataCount[item.key])
                        : defMoney(viewDataCount[item.key])) + item.unit
                    "
                    placement="top"
                  >
                    <label>{{
                      fee > 2
                        ? changeNum(viewDataCount[item.key])
                        : changeMoney(viewDataCount[item.key])
                    }}</label>
                  </el-tooltip>
                  <span class="num-unit">{{
                    getNumUnit(viewDataCount[item.key])
                  }}</span>
                  <span class="text">{{ item.unit }}</span>
                </div>
                <div class="text">{{ item.text }}</div>
              </div>
              <!-- <div v-if="feeNumList.length - 1 != fee" class="fee-border"></div> -->
            </div>
          </div>
        </div>
      </div>
      <!-- 柱状图筛选条件 -->
      <div class="select-chart">
        <el-select
          v-model="selectFee"
          style="width: 120px; margin-right: 15px"
          @change="getViewPayData"
        >
          <el-option label="缴费情况" :value="1"></el-option>
          <el-option label="退费情况" :value="2"></el-option>
        </el-select>
        <el-select
          style="width: 130px"
          v-model="selectNum"
          @change="getViewPayData"
        >
          <el-option label="按金额" :value="1"></el-option>
          <el-option label="按订单笔数" :value="2"></el-option>
        </el-select>
        <div class="center">
          <span v-for="(item, sum) in sumList" :key="sum">
            {{ item.title + '：' }}
            {{ `${sumDate[item.key]} ${selectNum == 1 ? '元' : '笔'}` }}
          </span>
        </div>
        <el-select style="width: 120px" v-model="selectChart">
          <el-option label="柱状图" value="bar"></el-option>
          <el-option label="折线图" value="line"></el-option>
        </el-select>
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
import topIcon4 from '@/assets/overview-top4.png'

export default {
  name: 'checkBill_overview',
  components: { OverviewBar, OverviewLine },
  data() {
    return {
      searchDate: dayjs().format('YYYY-MM-DD'),
      searchType: 1, // 日期类型
      selectFee: 1, // 费用选择
      selectNum: 1, // 金额
      selectChart: 'bar', // 柱状图切换
      chartDate: { MZ: [], GH: [], ZY: [] }, //统计图y轴数据
      sumDate: { MZ: 0, GH: 0, ZY: 0 }, //挂号住院门诊总费用情况
      xLabel: [],
      viewDataCount: {},
      topDateCount: {},
      topNumList: [
        { img: topIcon1, title: '公众号粉丝', key: 'fansNum' },
        { img: topIcon2, title: '建档数量', key: 'cardNum' },
        { img: topIcon3, title: '访问数', key: 'visitNum' },
        { img: topIcon4, title: '意见反馈', key: 'backNum' },
      ],
      feeNumList: [
        { unit: '元', text: '支付金额', key: 'payMoney' },
        { unit: '元', text: '退费金额', key: 'refundMoney' },
        { unit: '元', text: '实收金额', key: 'amount' },
        { unit: '笔', text: '费用支付笔数', key: 'payNum' },
        { unit: '笔', text: '退费笔数', key: 'refundNum' },
      ],
      centerNumList: [
        { title: '建档数量', unit: '人', key: 'cardNum' },
        { title: '预约挂号', unit: '次', key: 'regNum' },
        { title: '当日挂号', unit: '次', key: 'regTodayNum' },
        { title: '访问数', unit: '人', key: 'visitNum' },
        { title: '意见反馈', unit: '条', key: 'backNum' },
        { title: '报告查询', unit: '次', key: 'reportNum' },
        { title: '流调表异常', unit: '人', key: 'errorNum' },
        { title: '流调表登记', unit: '人', key: 'registerNum' },
        { title: '核酸检测单检预约', unit: '次', key: 'nucleateNum' },
        { title: '核酸检测单检支付', unit: '元', key: 'nucleatePay' },
      ],
      sumList: [
        { title: '挂号', key: 'GH' },
        { title: '门诊', key: 'MZ' },
        { title: '住院', key: 'ZY' },
      ],
    }
  },
  methods: {
    //按日月年选择
    changeDate(val) {
      if (!val) return
      this.getViewDataCount()
      this.getViewPayData()
      this.getXLabel(this.searchDate)
    },
    //获取今日、昨日、本月、上月、今年、去年
    getDateList(type, id) {
      let start = dayjs().format('YYYY-MM-DD')
      let end = dayjs()
        .subtract(1, type == 1 ? 'day' : type == 2 ? 'month' : 'year')
        .format('YYYY-MM-DD')
      this.searchDate = id == 1 ? start : end
      this.getViewDataCount()
      this.getViewPayData()
    },
    //按日、月、年切换时查询默认时间
    changeDataType(val) {
      this.searchDate =
        val == 1
          ? dayjs().format('YYYY-MM-DD')
          : val == 2
          ? dayjs().format('YYYY-MM')
          : dayjs().format('YYYY')
      this.getViewDataCount()
      this.getViewPayData()
      this.getXLabel(this.searchDate)
    },
    //数值转化为以万为单位
    changeNum(nums) {
      if (!nums) return '0'
      if (nums >= 1000000) {
        return parseInt(((nums / 10000) * 100) / 100)
      } else {
        return nums
      }
    },
    //费用补0
    changeMoney(nums) {
      if (!nums) return '0.00'
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
      if (!nums) return '0.00'
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
    //改变单位
    getNumUnit(nums) {
      if (!nums) return
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
      this.topDateCount = res
    },
    // 获取中间数据
    async getViewDataCount() {
      let res = await viewDataCount({
        beginTime: this.getDateTypeList()[0],
        endTime: this.getDateTypeList()[1],
      })
      this.viewDataCount = res
    },
    //获取统计图数据
    async getViewPayData() {
      let res = await viewPayData({
        beginTime: this.getDateTypeList()[0],
        endTime: this.getDateTypeList()[1],
        timeType: this.searchType - 1,
      })
      this.getXLabel(this.searchDate)
      this.sumDate.GH = 0
      this.sumDate.MZ = 0
      this.sumDate.ZY = 0
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
      this.sumDate.MZ = this.getNumSum(data.MZ)
      this.sumDate.GH = this.getNumSum(data.GH)
      this.sumDate.ZY = this.getNumSum(data.ZY)
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
            let str = year + '-' + i
            monthList.push(dayjs(str).format('YYYY-MM'))
          }
          this.xLabel = monthList
          break
      }
    },
    //获取开始时间-结束时间
    getDateTypeList() {
      let beginDay = dayjs(this.searchDate).format('YYYYMMDD000000')
      let endDay = dayjs(this.searchDate).format('YYYYMMDD235959')
      let beginMonth = dayjs(this.searchDate).format('YYYYMM01000000')
      let endMonth = dayjs(this.searchDate).format('YYYYMM31235959')
      let beginYear = dayjs(this.searchDate).format('YYYY0101000000')
      let endYear = dayjs(this.searchDate).format('YYYY1231235959')
      switch (this.searchType) {
        case 1:
          return [beginDay, endDay]
        case 2:
          return [beginMonth, endMonth]
        case 3:
          return [beginYear, endYear]
      }
    },
    getNumSum(list) {
      let nums = list.reduce((sum, e) => sum + Number(e || 0), 0)
      return nums.toFixed(2)
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
  .top {
    width: 100%;
    background: #fff;
    padding-top: 20px;
    .head {
      margin-left: 20px;
      font-size: 16px;
      font-weight: bold;
      color: #1a1a1a;
      line-height: 16px;
    }
    .top-num {
      display: flex;
      justify-content: space-between;
      .num {
        display: flex;
        width: 25%;
        height: 104px;
        background: #fff;
        padding: 20px;
        box-sizing: border-box;
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
  }
  .content {
    margin-top: 5px;
    min-height: 600px;
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    .head {
      font-size: 16px;
      font-weight: bold;
      color: #1a1a1a;
      line-height: 16px;
      margin-bottom: 20px;
    }
    .search-date {
      width: 100%;
      margin-bottom: 20px;
      .select {
        width: 80px;
        margin-right: -1px;
        ::v-deep .el-input--medium .el-input__inner {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }
      .date {
        width: 13.1%;
        margin-right: 15px;
        &::v-deep.el-input--medium .el-input__inner {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }
    .number-box {
      margin-bottom: 20px;
      .item-demo {
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .demo {
          width: 19%;
          padding: 20px;
          border: 1px solid #cccccc;
          border-radius: 2px;
          box-sizing: border-box;
          margin-bottom: 15px;
        }
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
      overflow: hidden;
      .center {
        flex: 1;
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        span {
          margin-left: 20px;
        }
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
