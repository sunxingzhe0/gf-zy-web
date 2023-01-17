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
          :clearable="false"
          :picker-options="{
            disabledDate: disabledMonth,
          }"
          @change="changeMonth"
        >
        </el-date-picker>
        <el-button size="small" @click="prevMonth">上一月</el-button>
        <el-button size="small" @click="nextMonth">下一月</el-button>
        <span>排班科室：{{ treeDate.length }} </span
        ><span>排班人数：{{ docNum }}人</span>
      </div>
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
              <!-- {{
                datefu.solar2lunar(
                  data.day.split('-')[0],
                  data.day.split('-')[1],
                  data.day.split('-')[2],
                )
              }} -->
            </div>
            <div class="shift-num">
              <span v-if="isDuringDate(date)"
                >已排：{{ getNum(date).sourceNumber }}</span
              >
              <span v-if="isDuringDate(date)"
                >已预约：{{ getNum(date).usedSourceNumber }}</span
              >
              <span v-if="isDuringDate(date)"
                >可预约：{{ getNum(date).remainSourceNumber }}</span
              >
            </div>
          </div>
        </template>
      </el-calendar>
      <div class="month-right">
        <div class="month-right-title">
          {{ dayjs(currentMonth).format('YYYY年 MM月 DD日')
          }}<span>{{ week[dayjs(currentMonth).day()] }}</span>
        </div>
        <div class="month-right-wrap">
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
    <!--停诊-->
    <CloseDiagnosis
      :show="isShowClose"
      :data="rowData"
      refundType="MANAGER_REFUND_METHOD"
      @onClose="data => closeDiangnosis(data, 'isShowClose')"
    ></CloseDiagnosis>
    <!--替班-->
    <Subsitute
      :show="isShowSubsitute"
      :data="rowData"
      @onClose="data => closeDiangnosis(data, 'isShowSubsitute')"
    ></Subsitute>
    <!--添加可预约患者-->
    <SelectPatient
      :show="isShowSelectPatient"
      :data="rowData"
      @onClose="data => closeDiangnosis(data, 'isShowSelectPatient')"
    ></SelectPatient>
    <!--停诊替班记录-->
    <StopRecode
      :data="rowData"
      :type="recodeType"
      :show="showRecode"
      @onClose="data => closeDiangnosis(data, 'showRecode')"
    ></StopRecode>
    <!-- 改期 -->
    <ChangesChedule
      :show="isChangeChedule"
      :data="rowData"
      @onClose="data => closeDiangnosis(data, 'isChangeChedule')"
    />
  </div>
</template>
<script>
import dayjs from 'dayjs'
import ChangesChedule from '../../workSchedule/components/changesChedule.vue'
import datefu from '../../../scheduling/components/newDate'
import CloseDiagnosis from './CloseDiagnosis'
import Subsitute from './Substitute'
import SelectPatient from './SelectPatient'
import apiScheduleTemplate from '@/api/mindConsult/scheduleTemplate'
import StopRecode from './StopRecode.vue'
import paidImg from '@/assets/xz_paid.png'
import nopayImg from '@/assets/xz_nopay.png'
import askleaveImg from '@/assets/xz_askleave.png'

export default {
  components: {
    CloseDiagnosis,
    Subsitute,
    SelectPatient,
    StopRecode,
    ChangesChedule,
  },
  props: {
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
      isChangeChedule: false,
      showRecode: false,
      recodeType: 1,
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
      currentMonth: this.query?.startDate || dayjs().format('YYYY-MM-DD'),
      acctiveMonth: this.query?.startDate || dayjs().format('YYYY-MM-DD'),
      treeDate: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      statistics: [],
      rowData: null,
    }
  },
  computed: {
    docNum() {
      let res = []
      this.treeDate.forEach(e => {
        e.userList.forEach(s => {
          res.push(s.userId)
        })
      })
      console.log(res)
      let num = [...new Set(res)]
      return num.length
    },
  },
  watch: {
    query: {
      handler() {
        this.getStatistics()
        this.getList()
      },
      deep: true,
    },
  },
  mounted() {
    this.getStatistics()
    this.getList()
  },
  methods: {
    lockNo(row) {
      this.$confirm(`是否${row.locking ? '解锁' : '锁定'}该号源`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        row.locking
          ? await apiScheduleTemplate.removeLock(row.id)
          : await apiScheduleTemplate.scheduleLock(row.id)
        this.getList()
        this.$message({
          type: 'success',
          message: '操作成功!',
        })
      })
    },
    delPatient(id) {
      this.$confirm('确定要删除该患者?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await apiScheduleTemplate.delAdvanceAppointment(id)
        this.getList()
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
      })
    },
    dayjs,
    disabledMonth(e) {
      return (
        dayjs(e) < dayjs(this.query.startDate) ||
        dayjs(e) > dayjs(this.query.endDate)
      )
    },
    //过期的排班不能操作
    outTimeOpt(row) {
      if (
        dayjs().isAfter(dayjs(this.currentMonth + ' ' + row.endTime + ':00'))
      ) {
        return true
      } else {
        return false
      }
    },
    async changeMonth(e) {
      console.log(e)
      if (!e) {
        console.log(11111)
        this.currentMonth = dayjs().format('YYYY-MM-DD')
      }
      await this.getStatistics()
      this.getList()
    },
    changeDate(date, type) {
      console.log(type)
      if (type) {
        this.currentMonth = date
        this.getList()
      }
    },
    getNum(date) {
      let res = this.statistics.find(
        item =>
          item.scheduleDate.split(' ')[0] === dayjs(date).format('YYYY-MM-DD'),
      )
      return {
        usedSourceNumber: res?.usedSourceNumber || 0,
        sourceNumber: res?.sourceNumber || 0,
        remainSourceNumber: res?.remainSourceNumber || 0,
      }
    },
    isDuringDate(date) {
      var curDate = dayjs(dayjs(date).format('YYYY-MM-DD')).valueOf(),
        beginDate = this.query.startDate
          ? dayjs(this.query.startDate).valueOf()
          : dayjs(dayjs().format('YYYY-MM-DD')).valueOf(),
        endDate = this.query.endDate
          ? dayjs(this.query.endDate).valueOf()
          : dayjs().add(30, 'day').valueOf()
      if (this.query.startDate && this.query.endDate) {
        if (curDate >= beginDate && curDate <= endDate) {
          return true
        }
        return false
      } else {
        return true
      }
    },
    async prevMonth() {
      let date = dayjs(this.currentMonth).subtract(1, 'month').format('YYYY-MM')
      this.currentMonth = date + '-01'
      await this.getStatistics()
      this.getList()
      // if (this.isDuringDate(date + '-01')) {
      //   this.currentMonth = date
      // }
    },
    async nextMonth() {
      let date = dayjs(this.currentMonth).add(1, 'month').format('YYYY-MM')
      this.currentMonth = date + '-01'
      await this.getStatistics()
      this.getList()
      // if (this.isDuringDate(date + '-01')) {
      //   this.currentMonth = date
      // }
    },
    openCloseDiagnosis(data, type, opt) {
      if (
        type == 'isShowClose' &&
        data.reservedVO &&
        data.reservedVO.status == 3
      ) {
        this.$message.warning('请先处理请假审批，处理完再来申请停诊！')
        return false
      }
      if (type == 'showRecode') {
        this.recodeType = opt
      }
      this.rowData = data
      this[type] = true
    },
    closeDiangnosis(data, type) {
      if (data) {
        this.getStatistics()
        this.getList()
      }
      this.rowData = null
      this[type] = false
    },
    makeShift(row) {
      this.$confirm('确定要生成排班吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        console.log(row)
        this.$message({
          type: 'success',
          message: '生成成功!',
        })
      })
    },
    async getStatistics() {
      let res = await apiScheduleTemplate.statistics({
        ...this.query,
        startDate: this.query?.startDate
          ? this.query.startDate
          : dayjs(this.currentMonth).startOf('month').format('YYYY-MM-DD'),
        endDate: this.query?.endDate
          ? this.query.endDate
          : dayjs(this.currentMonth).endOf('month').format('YYYY-MM-DD'),
      })
      console.log(res)
      this.statistics = res
    },
    async getList() {
      let res = await apiScheduleTemplate.doctorScheduleTree({
        deptId: this.query.deptId,
        userId: this.query.userId,
        // keywords: this.query.keywords,
        scheduleDate: this.currentMonth,
      })
      res.forEach(item => {
        item.key = item.deptId
        item.label = item.deptName
        item.userList.forEach(u => {
          u.key = item.deptId + '_' + u.userId
          u.label = u.userName + ' | ' + u.titleName
          u.scheduleDetailList.forEach(s => {
            s.userName = u.userName
            s.key = s.id
            s.label =
              (s.periodName || '') +
              ' ' +
              s.startTime +
              '-' +
              s.endTime +
              ' ' +
              s.itemName +
              ' ￥' +
              s.price
          })
          var reg = new RegExp(this.query.keywords)
          u.children = u.scheduleDetailList.filter(t =>
            t.reservedVO
              ? reg.test(t.reservedVO.patientName) ||
                reg.test(t.reservedVO.phone) ||
                reg.test(t.reservedVO.cardNo) ||
                reg.test(t.itemName)
              : reg.test(t.itemName),
          )
        })
        item.children = item.userList.filter(v => v.children.length > 0)
      })
      this.treeDate = res.filter(c => c.children.length > 0)
    },

    // 设置状态图标
    setStateImg(data) {
      if (data.status === null) return nopayImg
      if (data.status == 3) return askleaveImg
      if (data.status == 1) return paidImg
    },
    renderContent(h, { node, data, store }) {
      console.log(node, data, store)
      return (
        <div class="tree-content-wrap">
          {data.children && data.children.length > 0 ? (
            <span>{node.label}</span>
          ) : (
            <div class="tree-content">
              <div>
                {node.data.aloneAdd && (
                  <img
                    style="margin-right:2px"
                    src={require('@/assets/addSchedule.png')}
                    class="state-img"
                  />
                )}
                {node.label}
              </div>
              <div class="paint-list">
                {node.data.reservedVO && (
                  <div>
                    <img
                      src={this.setStateImg(node.data.reservedVO)}
                      class="state-img"
                    />
                    {data.reservedVO.patientName} | {data.reservedVO.phone}
                    {node.data.adults && (
                      <el-tag size="mini" style="margin-left:5px">
                        成人
                      </el-tag>
                    )}
                    {data.reservedVO && data.reservedVO.status === null && (
                      <i
                        class="el-icon-circle-close"
                        on-click={() => this.delPatient(data.id)}
                      ></i>
                    )}
                  </div>
                )}
              </div>
              <div class="opt-btn">
                {node.data.video && (
                  <img class="recode" src={require('@/assets/video.png')} />
                )}
                {node.data.stopId && (
                  <img
                    class="recode"
                    on-click={() =>
                      this.openCloseDiagnosis(node.data, 'showRecode', 1)
                    }
                    src={require('@/assets/xz_record.png')}
                  />
                )}
                {node.data.substitute && (
                  <img
                    class="recode"
                    on-click={() =>
                      this.openCloseDiagnosis(node.data, 'showRecode', 2)
                    }
                    src={require('@/assets/xz_substituteRecord.png')}
                  />
                )}
                {node.data.locking && (
                  <el-tag type="warning" size="mini" style="margin-right: 5px">
                    锁号中
                  </el-tag>
                )}
                {!node.data.stop && !node.data.reservedVO && (
                  <el-button
                    type="text"
                    disabled={this.outTimeOpt(node.data)}
                    on-click={() => this.lockNo(data)}
                  >
                    {data.locking ? '解锁' : '锁号'}
                  </el-button>
                )}
                {!node.data.stop && node.data.reservedVO && (
                  <el-button
                    type="text"
                    disabled={
                      node.data.reservedVO.visitState != 1 ||
                      node.data.reservedVO.status != 1
                    }
                    on-click={() =>
                      this.openCloseDiagnosis(data, 'isChangeChedule')
                    }
                  >
                    改期
                  </el-button>
                )}
                {node.data.stopStatus == 1 && (
                  <el-button
                    type="text"
                    disabled={
                      this.outTimeOpt(node.data) ||
                      (node.data.reservedVO &&
                        node.data.reservedVO.visitState &&
                        node.data.reservedVO.visitState != 1)
                    }
                    on-click={() =>
                      this.openCloseDiagnosis(data, 'isShowClose')
                    }
                  >
                    停诊
                  </el-button>
                )}

                {!node.data.substitute && node.data.stopStatus != 3 && (
                  <el-button
                    type="text"
                    disabled={this.outTimeOpt(node.data)}
                    on-click={() =>
                      this.openCloseDiagnosis(data, 'isShowSubsitute')
                    }
                  >
                    替班
                  </el-button>
                )}

                {!node.data.stop && !node.data.reservedVO && (
                  <el-button
                    type="text"
                    disabled={this.outTimeOpt(node.data)}
                    on-click={() =>
                      this.openCloseDiagnosis(data, 'isShowSelectPatient')
                    }
                  >
                    添加预约患者
                  </el-button>
                )}

                {node.data.stopStatus != 1 && (
                  <el-tag
                    type={data.stopStatus == 3 ? 'danger' : 'warning'}
                    size="mini"
                    style="margin-right: 5px"
                  >
                    {node.data.stopStatus == 3 ? '已停诊' : '停诊申请中'}
                  </el-tag>
                )}
              </div>
            </div>
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
          display: flex;
          justify-content: flex-end;
          align-items: center;
          text-align: right;
          .recode {
            width: 16px;
            margin-right: 5px;
          }
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
::v-deep .tree-content-wrap {
  .state-img {
    width: 18px;
    height: 18px;
    vertical-align: text-top;
    margin-right: 6px;
  }
}
</style>
