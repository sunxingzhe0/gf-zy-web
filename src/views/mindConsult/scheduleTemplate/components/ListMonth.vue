<template>
  <div class="list-month">
    <div class="all-num">
      <div>
        <el-date-picker
          v-model="currentMonth"
          type="month"
          style="margin-right: 10px; width: 120px"
          placeholder="选择月份"
          size="small"
        >
        </el-date-picker>
        <el-button size="small" @click="prevMonth">上一月</el-button>
        <el-button size="small" @click="nextMonth">下一月</el-button>
        <span>排班科室：{{ scheduNum.deptNum }} </span
        ><span>排班人数：{{ scheduNum.doctorNum }}人</span>
      </div>
      <el-button type="primary" @click="makeShift">生成排班</el-button>
    </div>
    <div class="list-month-wrap">
      <el-calendar v-model="currentMonth">
        <template slot="dateCell" slot-scope="{ date, data }">
          <div
            class="date-wrap"
            @click.stop="changeDate(date, isDuringDate(date))"
            :class="!isDuringDate(date) ? 'disabled' : ''"
          >
            <div class="show-date">
              {{
                data.type === 'current-month'
                  ? dayjs(date).format('DD')
                  : dayjs(date).format('MM/DD')
              }}
              {{
                datefu.solar2lunar(
                  data.day.split('-')[0],
                  data.day.split('-')[1],
                  data.day.split('-')[2],
                )
              }}
            </div>
            <div class="shift-num">
              <span v-if="isDuringDate(date)">已排：{{ getNum(date) }}</span>
            </div>
          </div>
        </template>
      </el-calendar>
      <div class="month-right">
        <div class="month-right-title">
          {{ dayjs(currentMonth).format('YYYY年 MM月 DD日')
          }}<span>{{ week[dayjs(currentMonth).day()] }}</span>
        </div>
        <div class="month-right-wrap" v-if="isShowTree">
          <el-tree
            :data="treeDate"
            icon-class="el-icon-arrow-right"
            :props="defaultProps"
            default-expand-all
            :render-content="renderContent"
          ></el-tree>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import datefu from '../../../scheduling/components/newDate'
export default {
  props: {
    isPreview: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
    },
    query: {
      type: Object,
    },
  },
  data() {
    return {
      datefu,
      isShowClose: false,
      isShowSubsitute: false,
      isShowSelectPatient: false,
      week: [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
      ],
      weekValue: [
        'SUNDAY',
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
      ],
      currentMonth: this.query.startDate,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      sourceData: this.data,
      delIds: [],
      treeDate: [],
      isShowTree: true,
    }
  },
  watch: {
    query() {
      this.gettreeDate()
    },
  },

  computed: {
    scheduNum() {
      let res = this.sourceData.find(
        item => item.weekDay === this.weekValue[dayjs(this.currentMonth).day()],
      )
      return {
        deptNum: res.deptNum,
        doctorNum: res.doctorNum,
        number: res.number,
      }
    },
  },
  mounted() {
    this.gettreeDate()
  },
  methods: {
    dayjs,
    gettreeDate() {
      this.isShowTree = false
      let data = this.sourceData.find(
        item => item.weekDay === this.weekValue[dayjs(this.currentMonth).day()],
      ).deptList
      data.forEach(item => {
        item.key = item.deptId
        item.label = item.deptName
        item.userList.forEach(u => {
          u.detailList = u.detailList.filter(
            t =>
              !this.delIds.find(
                v => t.id === v.id && this.currentMonth === v.date,
              ),
          )
          u.key = item.deptId + '_' + u.userId
          u.label = u.userName + ' | ' + u.titleName
          u.detailList.forEach(s => {
            s.key = s.id
            s.label =
              s.periodName +
              ' ' +
              s.startTime +
              '-' +
              s.endTime +
              ' ' +
              s.itemName +
              '  ￥' +
              s.price
          })

          u.children = u.detailList
        })
        item.children = item.userList
      })
      console.log(data)
      this.treeDate = data

      this.$nextTick(() => {
        this.isShowTree = true
      })
    },
    changeDate(date, type) {
      if (type) {
        this.currentMonth = date
        this.gettreeDate()
      }
    },
    getNum(date) {
      let res = this.sourceData.find(
        item => item.weekDay === this.weekValue[dayjs(date).day()],
      ).number
      return res
    },
    isDuringDate(date) {
      var curDate = new Date(date),
        beginDate = new Date(this.query.startDate),
        endDate = new Date(this.query.endDate)
      if (curDate >= beginDate && curDate <= endDate) {
        return true
      }
      return false
    },
    prevMonth() {
      let date = dayjs(this.currentMonth).subtract(1, 'month').format('YYYY-MM')
      if (this.isDuringDate(date + '-01')) {
        this.currentMonth = date
        this.gettreeDate()
      }
    },
    nextMonth() {
      let date = dayjs(this.currentMonth).add(1, 'month').format('YYYY-MM')
      if (this.isDuringDate(date + '-01')) {
        this.currentMonth = date
        this.gettreeDate()
      }
    },
    makeShift() {
      this.$emit('makeShift', this.delIds)
    },
    delSchedule(e) {
      this.delIds.push({
        id: e.id,
        date: this.currentMonth,
      })
      this.gettreeDate()
    },
    remove(node, data) {
      console.log(data)
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      this.delIds.push({
        id: data.id,
        date: this.currentMonth,
      })
    },
    renderContent(h, { node, data }) {
      return (
        <div class="tree-content-wrap">
          {data.children && data.children.length > 0 ? (
            <span>{node.label}</span>
          ) : (
            <span>
              {node.label}
              {
                //   {data.itemName && (
                //   <el-button
                //     type="text"
                //     on-click={() => this.delSchedule(data)}
                //     style="color: #f74a4a;margin-left:6px"
                //   >
                //     移除
                //   </el-button>
                // )}
              }
            </span>
          )}
        </div>
      )
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.list-month {
  flex: 1;
  display: flex;
  flex-direction: column;
  .all-num {
    font-size: 14px;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    span {
      margin-left: 30px;
    }
  }
  .list-month-wrap {
    flex: 1;
    display: flex;
    justify-content: space-between;
    .date-wrap {
      text-align: center;
      display: flex;
      flex-direction: column;
      height: 100%;
      font-size: 12px;
      .show-date {
        text-align: center;
      }
      .shift-num {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #f7f7f7;
        padding: 10px;
        margin-top: 10px;
        line-height: 22px;
      }
      &.disabled {
        color: #c0c4cc;
      }
    }
  }
  .month-right {
    width: 400px;
    margin-left: 20px;
    border: 1px solid #ccc;
    .month-right-title {
      height: 36px;
      padding: 0 16px;
      background: $--color-primary;
      color: #fff;
      line-height: 36px;
      span {
        margin-left: 10px;
      }
    }
    .month-right-wrap {
      margin-top: 10px;
    }
    ::v-deep .el-tree-node__content {
      height: auto;
      font-size: 14px;
      .tree-content {
        background: #f2f2f2;
        padding: 10px;
        font-size: 14px;
        color: #333;
        margin: 10px 0;
        line-height: 24px;
        .opt-btn {
          text-align: right;
          .el-button--text {
            padding: 0;
          }
        }
      }
    }
  }
  ::v-deep .el-calendar {
    flex: 1;
    .el-calendar__header {
      display: none;
    }
    .el-calendar__body {
      padding: 0;
      height: 100%;
      .el-calendar-table {
        height: 100%;
      }
      .el-calendar-table .el-calendar-day {
        height: 100%;
      }
      .el-calendar-table td.is-selected {
        background: rgba(10, 178, 193, 0.1);
        border: 1px solid #0ab2c1;
        .shift-num {
          background: #fff;
        }
      }
      .el-calendar-table th {
        border-top: 1px solid #dfe6ec;
        border-right: 1px solid #dfe6ec;
      }
      .el-calendar-table th:first-child {
        border-left: 1px solid #dfe6ec;
      }
    }
  }
}
</style>
