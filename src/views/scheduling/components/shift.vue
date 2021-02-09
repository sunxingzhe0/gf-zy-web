<template>
  <div class="shift-wrapper">
    <!-- <div class="flex-between">
      <div class="flex-start-center">
        <el-button-group size="small">
          <el-button
            size="small"
            icon="el-icon-arrow-left"
            @click="changeMonth('pre')"
          ></el-button>
          <el-button size="small" style="height: 32px;">{{
            moment(value).format('YYYY 年 MM 月')
          }}</el-button>
          <el-button size="small" @click="changeMonth('next')"
            ><i class="el-icon-arrow-right"></i
          ></el-button>
        </el-button-group>
        <el-button size="small" @click="today" style="margin-left: 10px;"
          >今日</el-button
        >
        <el-button size="small" @click="nextDay">次日</el-button>
        <el-button
          size="small"
          @click="changeOrderDay('pre')"
          :disabled="searchInfoListPre.length == 0"
          >上一个</el-button
        >
        <el-button
          size="small"
          @click="changeOrderDay('next')"
          :disabled="searchInfoListNext.length == 0"
          >下一个</el-button
        >
      </div>
      <el-input
        placeholder="请按患者姓名搜索"
        v-model="keywords"
        size="small"
        style="width: 280px;"
        class="input-with-select"
        @keyup.enter.native="search"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="search"
        ></el-button>
      </el-input>
    </div> -->
    <div class="tabs flex-start-start">
      <div class="tabItem">在线复诊</div>
      <!-- <div class="spaceBetween"> -->
      <div class="flex-between">
        <div class="flex-start-center">
          <el-button-group size="small">
            <el-button
              size="small"
              icon="el-icon-arrow-left"
              @click="changeMonth('pre')"
            ></el-button>
            <el-button size="small" style="height: 32px;">{{
              moment(value).format('YYYY 年 MM 月')
            }}</el-button>
            <el-button size="small" @click="changeMonth('next')"
              ><i class="el-icon-arrow-right"></i
            ></el-button>
          </el-button-group>
          <el-button size="small" @click="today" style="margin-left: 10px;"
            >今日</el-button
          >
          <el-button size="small" @click="nextDay">次日</el-button>
          <el-button
            size="small"
            @click="changeOrderDay('pre')"
            :disabled="searchInfoListPre.length == 0"
            >上一个</el-button
          >
          <el-button
            size="small"
            @click="changeOrderDay('next')"
            :disabled="searchInfoListNext.length == 0"
            >下一个</el-button
          >
        </div>
        <el-input
          placeholder="请按患者姓名搜索"
          v-model="keywords"
          size="small"
          style="width: 280px;"
          class="input-with-select"
          @keyup.enter.native="search"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="search"
          ></el-button>
        </el-input>
        <!-- </div> -->
      </div>
    </div>
    <div class="shift">
      <!-- <span>星期一</span>
      <span>星期二</span>
      <span>星期三</span>
      <span>星期四</span>
      <span>星期五</span>
      <span>星期六</span>
      <span>星期日</span> -->
      <el-row :gutter="10">
        <!-- 左侧排班信息 -->
        <el-col :span="16">
          <div class="shSpandara">
            <span>星期一</span>
            <span>星期二</span>
            <span>星期三</span>
            <span>星期四</span>
            <span>星期五</span>
            <span>星期六</span>
            <span>星期七</span>
          </div>
          <el-calendar ref="date" v-model="value">
            <template v-slot:dateCell="{ date, data }">
              <div style="display: none;">{{ date }}</div>
              <div
                :class="data.isSelected ? 'active dateWrap' : 'dateWrap'"
                @click="changeDay(data.day)"
              >
                <div class="date">
                  {{ data.day.split('-')[2] }}日<span>{{
                    datefu.GetLunarDay(
                      data.day.split('-')[0],
                      data.day.split('-')[1],
                      data.day.split('-')[2],
                    )
                  }}</span>
                  <span></span>
                </div>
                <template v-for="(item, index) in infoList">
                  <div
                    class="isday_"
                    :key="index + 'today'"
                    v-if="data.day == todayDate"
                  >
                    今
                  </div>
                  <div class="list" :key="index" v-if="item.date == data.day">
                    <div
                      class="Item text-overflow"
                      v-for="(i, index1) in item.leftInfo"
                      v-show="index1 < 4"
                      :key="index1"
                    >
                      {{ index1 != 3 ? i.beginRange : '...' }}
                    </div>
                  </div>
                  <!-- <div
                    class="more"
                    v-if="item.leftInfo.length > 3"
                    :key="index + '1'"
                  >
                    ···
                  </div> -->
                </template>
              </div>
            </template>
          </el-calendar>
        </el-col>
        <!-- 右侧当天排班信息 -->
        <el-col :span="8">
          <div class="header">
            <div class="today" v-html="rightDate"></div>
            <el-switch
              v-if="idType != '1' && isWorkDay"
              v-model="status"
              :active-value="1"
              :inactive-value="0"
              @change="
                handleChangeAll(
                  allConfId,
                  parseTime(value, '{y}-{m}-{d}'),
                  status,
                  allIds,
                )
              "
            ></el-switch>
          </div>

          <div class="planPeek">
            <div class="planList rest flex-between">
              <div class="range">
                {{ afterTime }}
              </div>

              <div class="num">休息</div>
            </div>

            <!-- <div
              class="planList flex-between"
              v-for="(item, index) in workTimeList"
              :key="index"
            >
              <div class="range">{{ item.timeRange }}</div>
              <div class="user flex-start-center">
                <span v-for="(_, index) in item.userName" :key="index">{{
                  _
                }}</span>
              </div>
              <span>1111</span>
              <div class="num">已满</div>
            </div> -->
            <el-row
              :class="
                item.restState == 1
                  ? 'planList flex-between reset'
                  : 'planList flex-between'
              "
              v-for="(item, index) in workTimeList"
              :key="index"
            >
              <el-col :span="7" class="range" v-if="item.restState == 1">{{
                item.timeRange
              }}</el-col>
              <el-col
                :span="6"
                class="user flex-start-center itemCenter"
                v-if="item.restState == 1"
                ><span v-for="(_, index) in item.userName" :key="index">{{
                  _
                }}</span></el-col
              >
              <el-col :span="4" v-if="item.restState == 1">{{
                item.grade
              }}</el-col>
              <el-col :span="4" v-if="item.restState == 1">
                <el-tag v-if="item.freeType == '空'" type="success">{{
                  item.freeType
                }}</el-tag>
                <el-tag v-if="item.freeType == '满'" type="danger">{{
                  item.freeType
                }}</el-tag>
              </el-col>
              <el-col :span="3"
                ><el-switch
                  v-if="idType != '1' && item.restState == 1"
                  v-model="item.configType"
                  :active-value="1"
                  :inactive-value="0"
                  @change="
                    handleChange(
                      item.userName,
                      item.timeConfId,
                      parseTime(value, '{y}-{m}-{d}'),
                      item.configType,
                      item.orderId,
                    )
                  "
                ></el-switch
              ></el-col>
            </el-row>
            <div class="planList rest flex-between">
              <div class="range">{{ beforeTime }}</div>
              <div class="num">休息</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import datefu from './date'
import { parseTime } from '@/utils'
import { getDocSchInfo, curDayDetail, setTime } from '@/api/scheduling'
import moment from 'moment'

export default {
  props: {
    docInfo: {
      type: Array,
    },
    idType: {
      type: String,
      default: '1',
    },
  },
  data() {
    return {
      datefu: datefu,
      value: new Date(),
      todayDate: moment().format('YYYY-MM-DD'),
      valueMonth: moment().format('YYYY-MM'),
      parseTime: parseTime,
      keywords: '',
      rightDate: parseTime(new Date(), '{y}年 {m}月 {d}日  &emsp; 星期{a}'),
      // 患者排班信息结合
      infoList: [],
      //有患者的集合
      searchInfoList: [{}],
      // 下班休息时间
      beforeTime: '',
      // 凌晨休息时间
      afterTime: '',
      // 当天排班详情
      workTimeList: [],
      // 当天的总状态
      status: '',
      //主配置 id
      allConfId: '',
      // 总订单 id 集合
      allIds: [],
      // 激活
      active: 0,

      // infoListPre: [],
      // infoListNext: [],
      searchInfoListPre: [],
      searchInfoListNext: [],
      isWorkDay: false, // 是否是工作日
    }
  },
  computed: {
    ...mapState('user', ['dept']),
  },
  // created() {
  //   if (this.docId == '') {
  //     this.docId = this.$store.state.user.uerId
  //   }
  // },
  mounted() {
    this.getDocInfo()
    this.getCurData()
  },
  watch: {
    value() {
      let month = moment(this.value).format('YYYY-MM')
      this.rightDate = parseTime(
        this.value,
        '{y}年 {m}月 {d}日  &emsp; 星期{a}',
      )

      if (month != this.valueMonth) {
        this.valueMonth = month
        this.getDocInfo()
      }
      this.setPreNextList()
      this.getCurData()
    },
    keywords() {
      if (this.keywords == '') {
        this.searchInfoListPre = []
        this.searchInfoListNext = []
        this.searchInfoList = []
      }
    },
  },
  created() {},
  methods: {
    moment,
    async searchDocInfo() {
      if (this.docInfo?.[1] || this.$store.state.user.dept.id) {
        let res = await getDocSchInfo({
          doctorId: this.docInfo?.[0] || this.$store.state.user.userId,
          deptId: this.docInfo?.[1] || this.$store.state.user.dept.id,
          // dayType: type,
          // datetime: this.valueMonth,
          searchKeyWords: this.keywords,
        })
        let arr = []
        for (let i = 0; i < res.length; i++) {
          const element = res[i]
          if (element.leftInfo && element.leftInfo.length > 0) {
            element.index = i
            // arr[i] = element
            arr.push(element)
          }
        }
        this.searchInfoList = arr
        this.setPreNextList('active')
      } else {
        this.$message.error('该医生没有科室！')
      }
    },
    // 获取排班信息
    async getDocInfo() {
      if (this.docInfo?.[1] || this.$store.state.user.dept.id) {
        let res = await getDocSchInfo({
          doctorId: this.docInfo?.[0] || this.$store.state.user.userId,
          deptId: this.docInfo?.[1] || this.$store.state.user.dept.id,
          // dayType: type,
          datetime: this.valueMonth,
          // searchKeyWords: this.keywords,
        })
        // this.infoList = res
        let arr = []
        for (let i = 0; i < res.length; i++) {
          const element = res[i]
          if (element.leftInfo && element.leftInfo.length > 0) {
            element.index = i
            // arr[i] = element
            arr.push(element)
          }
        }
        this.infoList = arr
        // this.setPreNextList()
      } else {
        this.$message.error('该医生没有科室！')
      }
    },
    // 获取当天排班详情
    async getCurData() {
      const res = await curDayDetail({
        doctorId: this.docInfo?.[0] || this.$store.state.user.userId,
        deptId: this.docInfo?.[1] || this.$store.state.user.dept.id,
        date: moment(this.value).format('YYYY-MM-DD'),
        // dayType: this.type,
      })
      // console.log(res.workTimeList)
      this.beforeTime = res.restTimeList && res.restTimeList[1]
      this.afterTime = res.restTimeList && res.restTimeList[0]
      this.workTimeList = res.workTimeList || []
      this.allConfId = res.allConfId
      this.allIds = res.allIds
      this.status = res.allState
      this.isWorkDay = res.workDay
    },
    // 关闭、开启某个时段(单个)
    async handleChange(userName, timeConfId, dateTime, state, orderList) {
      console.log(state)
      // if(userName.length>0){

      // }
      if (!orderList) {
        orderList = []
      }
      await setTime(
        {
          doctorId: this.docInfo?.[0] || this.$store.state.user.uerId,
          deptId: this.docInfo?.[1] || this.$store.state.dept.id,
          timeConfId: timeConfId,
          dateTime: dateTime,
          state: state,
        },
        orderList,
      )
        .then(() => {
          setTimeout(() => {
            this.$message.success('修改成功!')
          }, 100)
        })
        .catch(() => {
          // this.getCurData(parseTime(this.value, '{y}-{m}-{d}'))
        })

      this.getCurData(parseTime(this.value, '{y}-{m}-{d}'))
    },
    // 关闭、开启某个时段(总和)
    async handleChangeAll(id, dateTime, state, allIds) {
      const res = await setTime(
        {
          doctorId: this.docInfo?.[0] || this.$store.state.user.uerId,
          deptId: this.docInfo?.[1] || this.$store.state.dept.id,
          mainConfId: id,
          dateTime: dateTime,
          state: state,
        },
        allIds,
      )
        .then(res => {
          console.log(res)
          this.$message.success(state ? '开启时段成功!' : '关闭时段成功')
        })
        .catch(err => {
          this.status = !state
          console.log(err)
        })
      if (res) {
        console.log(res)
      }
      // if (res) {
      //   this.$message.success(state ? '开启时段成功!' : '关闭时段成功')
      // }
      this.getCurData()
    },
    //根据当天区分上一个列表和下一个列表
    setPreNextList(active) {
      let nowDay = moment(this.value).format('YYYY-MM-DD')
      // // this.value
      // let infoListPre = []
      // let infoListNext = []
      // this.infoList.forEach(element => {
      //   if (new Date(element.date).getTime() > new Date(nowDay).getTime()) {
      //     infoListNext.push(element)
      //   } else if (
      //     new Date(element.date).getTime() < new Date(nowDay).getTime()
      //   ) {
      //     infoListPre.push(element)
      //   }
      // })
      // this.infoListPre = infoListPre
      // this.infoListNext = infoListNext

      let searchInfoListPre = []
      let searchInfoListNext = []
      this.searchInfoList.forEach(element => {
        if (new Date(element.date).getTime() > new Date(nowDay).getTime()) {
          searchInfoListNext.push(element)
        } else if (
          new Date(element.date).getTime() < new Date(nowDay).getTime()
        ) {
          searchInfoListPre.push(element)
        }
      })
      this.searchInfoListPre = searchInfoListPre
      this.searchInfoListNext = searchInfoListNext

      if (active) {
        if (searchInfoListPre.length == 0 && searchInfoListNext.length == 0) {
          this.$message.info('无搜索结果!')
          return
        }
        !searchInfoListPre[searchInfoListPre.length - 1] ||
        !searchInfoListNext[0]
          ? (this.value = searchInfoListNext[0]
              ? searchInfoListNext[0].date
              : searchInfoListPre[searchInfoListPre.length - 1].date)
          : new Date(searchInfoListNext[0].date).getTime() -
              new Date(this.value).getTime() >
            new Date(this.value).getTime() -
              new Date(
                searchInfoListPre[searchInfoListPre.length - 1].date,
              ).getTime()
          ? (this.value = searchInfoListPre[searchInfoListPre.length - 1].date)
          : (this.value = searchInfoListNext[0].date)
      }
    },
    // 搜索
    search() {
      if (this.keywords && this.keywords != '') {
        this.searchDocInfo()
      } else {
        this.getDocInfo()
      }
    },
    // 改变日期，获取当天排班详情
    changeDay(day) {
      console.log(day)
      // this.getCurData()
    },
    // 今日
    today() {
      this.value = new Date()
    },
    // 次日
    nextDay() {
      this.value = moment().add(1, 'd').format('YYYY-MM-DD')
    },
    changeMonth(type) {
      if (type == 'pre') {
        this.value = this.$refs.date.prevMonthDatePrefix
      } else {
        this.value = this.$refs.date.nextMonthDatePrefix
      }
    },
    changeOrderDay(type) {
      let changeData = {}
      if (type == 'pre') {
        changeData = this.searchInfoListPre[this.searchInfoListPre.length - 1]
      } else {
        changeData = this.searchInfoListNext[0]
      }
      this.value = changeData.date
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.shift-wrapper {
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .shift {
    flex: 1;
    overflow: hidden;
    & > .el-row,
    .el-col-16 {
      height: 100%;
      .shSpandara {
        // margin-left: 48px;
        padding: 12px 30px 0 50px;
        span {
          display: inline-block;
          width: 14.2857%;
          padding: 0 4px 0 4px;
          text-align: center;
          font-family: PingFang SC;
          font-weight: bold;
          color: #333333;
          flex: 1;
        }
      }
    }
    & > .el-row.el-col-8 {
      height: 100%;
    }
    .el-col-8 {
      display: flex;
      flex-direction: column;
    }
    .plan {
      // flex: 1;
      overflow-y: scroll;
      height: calc(100% - 10px);
    }
    &::v-deep {
      .el-calendar {
        height: 100%;
      }
      .el-calendar__body {
        padding: 0px 0px 20px 35px;
        margin-top: 10px;
        overflow-y: auto;
        padding-bottom: 0;
        height: calc(100% - 10px);
      }
    }
  }
}
.tabs {
  height: 70px;
  background: #f2f2f2;
  padding: 10px;
  padding-bottom: 0;
  // margin-top: 30px;
  .tabItem {
    height: 60px;
    padding: 0 20px;
    background: #fff;
    color: $--color-primary;
    line-height: 60px;
    cursor: pointer;
  }
  .flex-between {
    display: flex;
    flex: 1;
    .flex-start-center {
      margin-left: 40px;
    }
  }
}
.shift {
  ::v-deep.el-calendar__header {
    display: none;
  }
  ::v-deep.el-calendar-table thead th {
    font-weight: bold;
    color: #333;
  }
  ::v-deep.el-calendar-table td {
    border: 0;
  }
  ::v-deep.el-calendar-table .el-calendar-day {
    padding: 4px;
    border: 0;
    height: 128px;
  }
}
.dateWrap {
  height: 100%;
  background: url('~@/assets/dateBg1.png') no-repeat center;
  background-size: 100% 100%;
  position: relative;
  color: #999;
  .date {
    text-align: center;
    // color: #999;

    font-size: 18px;
    font-weight: bold;
    line-height: 30px;
    padding-top: 4px;
    span {
      font-size: 12px;
      font-weight: normal;
      margin-left: 5px;
    }
  }
  .isday_ {
    position: absolute;
    right: -5px;
    top: -5px;
    width: 20px;
    height: 26px;
    font-size: 14px;
    font-weight: bold;
    line-height: 26px;
    text-align: center;
    color: #fff;
    background: #0ab2c1;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  .list {
    padding: 8px 5%;
    font-size: 12px;
    // color: #666;
    line-height: 16px;
    text-align: center;
  }
  .more {
    // color: #666;
    text-align: center;
  }
  &.active {
    background: url('~@/assets/dateBg.png') no-repeat center;
    background-size: 100% 100%;
    color: #fff !important;
    // .date,
    // .list,
  }
}
.today {
  line-height: 58px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  white-space: nowrap;
}
.planPeek {
  border: 1px solid #ccc;
  border-bottom: 0;
  height: 516px;
  overflow-y: scroll;
  border-bottom: 1px solid #ccc;
  .planList {
    // height: 60px;
    border-bottom: 1px solid #ccc;
    padding: 10px 10px;
    margin: 4px 0;
    .time {
      color: #333;
      text-align: center;
      .range {
        font-size: 12px;
        margin-top: 5px;
      }
    }
    .user {
      font-size: 14px;

      span {
        background: #f2f2f2;
        padding: 5px 14px;
        margin-right: 10px;
      }
    }
    &.rest {
      background: #f2f2f2;
      .time,
      .num {
        color: #999;
      }
    }
  }
}

.itemCenter {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.header {
  display: flex;
  justify-content: center;
  // padding: 8px 25px 8px 100px;
  align-items: center;
  margin: -10px 0 -3px 0;
}
::v-deep.el-switch {
  margin-left: 20px;
}
::v-deep .el-tag.el-tag--success {
  margin-left: 42px;
}
::v-deep thead {
  display: none;
}
</style>
