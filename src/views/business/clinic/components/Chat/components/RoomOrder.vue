<template>
  <div class="RoomOrder">
    <section>
      <div class="main">
        <div class="message_top flex-between">
          <div class="item">
            <span class="title">就诊人：</span>{{ bizInfo.memberName }}
          </div>
          <div class="item">
            <span class="title">就诊卡号：</span>{{ bizInfo.patientCard }}
          </div>
          <div class="item">
            <span class="title">就诊日期：</span>
            <span>{{ orderDate || '--' }}</span>
            <span v-if="orderDate">（{{ orderDate | weekDay }}）</span>
            <span v-if="dayNoon">{{ dayNoon }}</span>
          </div>
          <div class="item">
            <span class="title">诊疗费：</span>
            <span>￥{{ form.fee || '0.00' }}</span>
          </div>
          <div class="item">
            <span class="title">号源类型：</span>
            <el-select
              v-model="form.resourceNo"
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in sourceType"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="flex-between">
          <div class="left choose_doctor">
            <div class="flex">
              <!--  <div class="item">
                <el-select
                  v-model="form.orgId"
                  placeholder="请选择"
                  filterable
                  size="mini"
                >
                  <el-option
                    v-for="item in orgs"
                    :key="item.hospCode"
                    :value="item.hospCode"
                    :label="item.hospName"
                  >
                  </el-option>
                </el-select>
              </div> -->
              <!-- 科室 -->
              <div class="item">
                <el-select
                  v-model="form.deptId"
                  @change="selectDept"
                  placeholder="请选择"
                  size="mini"
                  filterable
                >
                  <template v-for="group in depts">
                    <template v-if="group.children && group.children.length">
                      <el-option-group :label="group.name" :key="group.id">
                        <el-option
                          v-for="item in group.children"
                          :label="item.name"
                          :value="item.id"
                          :key="item.id"
                        >
                        </el-option>
                      </el-option-group>
                    </template>
                    <template v-else>
                      <el-option
                        :label="group.name"
                        :value="group.id"
                        :key="group.id"
                      >
                      </el-option>
                    </template>
                  </template>
                </el-select>
              </div>
            </div>
            <!-- 医生 -->
            <div class="flex">
              <div class="item">
                <el-select
                  v-model="form.scheduleNo"
                  @change="selectDoctor"
                  placeholder="请选择"
                  size="mini"
                  filterable
                >
                  <el-option
                    v-for="(item, index) in doctors"
                    :key="'doctor-' + index"
                    :label="`${item.doctorName}(${item.sbsj})`"
                    :value="item.scheduleNo"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="item">
                {{ doctorTitle }}
              </div>
            </div>
          </div>

          <div class="right choose_date flex-between">
            <template v-if="dates.length">
              <img
                class="btn"
                src="@/assets/chat/prev.png"
                @click="selectDay(dateIndex - 1)"
              />
              <div class="date_list">
                <div class="list" ref="date" :style="dateStyle">
                  <div
                    v-for="(item, index) in dates"
                    :class="{ active: index === dateIndex }"
                    @click="selectDay(index)"
                    :key="'date-' + index"
                    class="item"
                  >
                    <p class="title">{{ item.weekDay }}</p>
                    <p>{{ item.showDate }}</p>
                  </div>
                </div>
              </div>
              <img
                class="btn"
                src="@/assets/chat/next.png"
                @click="selectDay(dateIndex + 1)"
              />
            </template>
          </div>
        </div>
        <div class="time_list flex" v-loading="isLoading">
          <template>
            <div
              v-for="(item, index) in schedue"
              @click="selectSchedue(index)"
              :key="'schedue-' + index"
              class="item"
              :class="{
                disabled: !item.beginTime,
                active: index === schedueIndex,
                passtime: compareTime(item.endTime, item.leaveNo),
              }"
            >
              <!-- <p v-if="!item.leaveNo" class="title">约满</p> -->
              <!-- <p v-else class="title">余 {{ item.leaveNo }}</p> -->
              <p>{{ item.beginTime }}-{{ item.endTime }}</p>
            </div>
            <div class="complement"></div>
            <div class="complement"></div>
            <div class="complement"></div>
            <div class="complement"></div>
            <div class="complement"></div>
            <div class="complement"></div>
            <div class="complement"></div>
            <div class="complement"></div>
            <div class="complement"></div>
          </template>
          <Empty v-if="!schedue.length" style="margin: 40px auto"></Empty>
        </div>
      </div>
      <footer class="is-right">
        <el-button size="mini" type="primary" @click="submit"> 提交 </el-button>
      </footer>
    </section>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapState } from 'vuex'
import { arr as array } from '@qietuzi/utils'
import { flat } from '@/utils'
import { Empty } from '@/components'
import { appointment } from '@/api/appointment'

const WeekDay = {
  day0: '周日',
  day1: '周一',
  day2: '周二',
  day3: '周三',
  day4: '周四',
  day5: '周五',
  day6: '周六',
}
const WeekDayCopy = {
  day0: '星期日',
  day1: '星期一',
  day2: '星期二',
  day3: '星期三',
  day4: '星期四',
  day5: '星期五',
  day6: '星期六',
}

export default {
  name: 'Appointment',
  components: {
    Empty,
  },
  props: {
    bizInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isLoading: false,
      form: {
        fee: '', // 诊疗费用
        orgId: '', // 机构id
        deptId: '', // 科室id
        endTime: '', // 预约结束日期
        periodNo: '', // 分时号
        startTime: '', // 预约开始日期
        shiftCode: '', // 班别
        visitDate: '', // 出诊日期
        scheduleNo: '', // 排班号（非必填）
        docInfo: {},
        numberCode: '', // 号别(同resourceNo)
        resourceNo: '普通', // 号源类型
        // bizInfo
        roomId: '', // 诊室id
        userId: '', // 用户id
        creator: '', // 创建人id
        memberId: '', // 成员id
        doctorId: '', // 医生id
        diagnoseNo: '', // 就诊号
        resource: 1, // 1-web 2-小程序
        origin: 1, // 来源 1-医生 2-患者
      },
      orgs: [], // 机构列表
      depts: [], // 科室列表
      dates: [], // 预约日期
      doctors: [], // 医师列表
      schedue: [], // 号源
      doctorTitle: '', // 医师职称

      dateIndex: 0, // 日期索引
      sourceType: [
        {
          label: '普通号（优惠0元）',
          value: '普通',
        },
        {
          label: '专家号（优惠0元）',
          value: '专家',
        },
      ], // 号源类型
      noType: '普通', // 医师当天号源类型
      schedueIndex: '', // 时段索引
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      platformCode: state => state.user.platformCode,
    }),
    dateStyle() {
      const posLeft = this.dateIndex * 80
      const dateWidth = this.$refs.date?.offsetWidth
      if (dateWidth < 550) {
        if (posLeft >= 0 && posLeft <= dateWidth - 80) {
          return {}
        } else {
          const disLeft = posLeft // left
          const disRight = dateWidth - 80 - posLeft // right
          const dis =
            Math.abs(disLeft) < Math.abs(disRight) ? disLeft : disRight
          return {
            transform: 'translateX(' + dis + 'px)',
          }
        }
      } else {
        return {}
      }
    },
    orderDate() {
      return this.dates[this.dateIndex]?.value
    },
    dayNoon() {
      const endTime = this.schedue[this.schedueIndex]?.endTime
      if (endTime) {
        const time = this.dates[this.dateIndex]?.value + '' + endTime
        const hour = dayjs(time).hour()
        return hour > 12 ? '下午' : '上午'
      } else {
        return ''
      }
    },
  },
  created() {
    this.init()
  },
  methods: {
    _findFirstChild(item) {
      if (item.children.length) {
        return this._findFirstChild(item.children[0])
      } else {
        return item.id
      }
    },
    //初始化
    async init() {
      this.form = {
        ...this.form,
        orgId: this.platformCode, // 取医院id
        deptId: /* this.user.dept.id */ '', // 取医院科室id
        roomId: this.bizInfo.roomId, // 诊室id
        userId: this.bizInfo.userId, // 用户id
        creator: this.bizInfo.doctorId, // 创建人id
        memberId: this.bizInfo.memberId, // 成员id
        doctorId: this.bizInfo.doctorId, // 医生id
        diagnoseNo: this.bizInfo.patientCard, // 就诊号
      }
      // console.log(this.user.dept.id,'院内id----')
      this.depts = []
      this.dates = []
      this.doctors = []
      this.schedue = []
      this.dateIndex = 0
      this.doctorTitle = ''
      await this.getOrgList()
      await this.getDeptList() //获取科室列表
      await this.getReverseDeptDate() //获取可选时段
      await this.getDoctorList() //获取医生列表
      await this.getSchedueList() //获取号源
    },
    // 获取机构列表
    async getOrgList() {
      this.orgs = await appointment.getHospInfo()
      console.log(this.orgs, '机构列表')
    },
    // 获取科室列表
    async getDeptList() {
      this.depts = await appointment.getDeptList(
        this.form.orgId,
        this.platformCode,
      )
      // 默认第一个科室
      const deptId = this._findFirstChild(this.depts[0])
      this.$set(this.form, 'deptId', deptId)
    },
    // 获取科室排班
    async getReverseDeptDate() {
      const res = await appointment.getReverseDeptDate({
        orgId: this.form.orgId,
        deptId: this.form.deptId,
      })
      let index
      const today = dayjs().format('YYYY-MM-DD')
      this.dates = res
        .map(item => item.reserveDate)
        .sort((a, b) => new Date(a) - new Date(b))
        .map((item, _index) => {
          let weekDay = WeekDay['day' + new Date(item).getDay()]
          if (today === item) {
            index = _index
            weekDay = '当天'
          }
          if (index + 1 === _index) weekDay = '明天'
          return {
            value: item,
            weekDay: weekDay,
            showDate: item.substring(5),
          }
        })
    },
    // 获取医师列表
    async getDoctorList() {
      this.doctors = await appointment.getDoctorList({
        orgId: this.form.orgId,
        deptId: this.form.deptId,
        endDate: this.dates[this.dateIndex].value, // 预约结束时间"
        beginDate: this.dates[this.dateIndex].value, // 预约开始时间"
      })
      console.log(this.doctors, '医生列表---')
      if (!this.doctors.length) {
        this.schedue = []
      }
      //默认选择第一个
      this.form.doctorId = this.doctors[0].doctorId
      this.form.scheduleNo = this.doctors[0].scheduleNo
      this.form.docInfo = this.doctors[0]
    },
    // 获取号源
    async getSchedueList() {
      if (!this.form.doctorId) {
        this.schedue = []
        this.doctorTitle = ''
        this.$set(this.form, 'fee', '')
        return
      }
      try {
        this.isLoading = true
        const res = await appointment.getDocFsInfo({
          orgId: this.form.orgId,
          deptId: this.form.deptId,
          doctorId: this.form.doctorId,
          scheduleNo: this.form.scheduleNo,
          visitDate: this.dates[this.dateIndex].value,
        })
        this.schedue = res
        console.log(this.schedue, '号源列表====')
        // this.$forceUpdate()
        this.isLoading = false
        if (res.length) {
          // const doctor = this.docInfo
          // const schecdule = doctor.scheduleLists[0]
          // this.noType = schecdule.noType == '1' ? '普通' : '专家'
          // // this.doctorTitle = doctor.docTitle || ''
          // // this.schedue = schecdule.fsInfo
          // //   ? schecdule.fsInfo.map(item => ({
          // //       ...item,
          // //       leaveNo: Number(item.leaveNo),
          // //       scheduleNo: schecdule.scheduleNo,
          // //     }))
          // //   : [] // 时段于号
          // // const firstIndex = this.schedue.findIndex(item => item.leaveNo)
          // // this.schedueIndex = firstIndex !== -1 ? firstIndex : ''
          // const regFee =
          //   schecdule.noType !== '专家' ? schecdule.regFee : schecdule.expertFee
          // this.$set(
          //   this.form,
          //   'resourceNo',
          //   schecdule.noType == '1' ? '普通' : '专家',
          // )
          // this.$set(this.form, 'fee', Number(regFee).toFixed(2)) // 诊疗费用
        } else {
          this.schedue = []
          this.doctorTitle = ''
          this.$set(this.form, 'fee', '')
        }
      } catch (e) {
        this.schedue = []
        this.doctorTitle = ''
        this.$set(this.form, 'fee', '')
      }
    },
    // 保存预约信息
    async submit() {
      // this.form.numberCode = this.form.resourceNo
      const depts = flat(this.depts, 'children')
      const dept = array.findItem(depts, 'id', this.form.deptId)
      const hospital = array.findItem(this.orgs, 'hospCode', this.form.orgId)
      const doctor = array.findItem(
        this.doctors,
        'doctorId',
        this.form.doctorId,
      )
      this.form.sbsj = this.form.docInfo.sbsj
      this.form.doctorTitle = this.form.docInfo.docTitle
      this.form.fee = this.form.docInfo.scheduleLists[0].regFee
      this.form.deptName = dept?.name
      this.form.orgName = hospital?.hospName
      this.form.doctorName = doctor?.doctorName
      this.form.patientName = this.bizInfo.memberName
      this.form.visitDate = this.dates[this.dateIndex].value
      this.form.startTime = this.schedue[this.schedueIndex].beginTime // 预约开始日期
      this.form.endTime = this.schedue[this.schedueIndex].endTime // 预约结束日期
      this.form.periodNo = this.schedue[this.schedueIndex].periodNo // 分时号
      this.form.shiftCode = this.schedue[this.schedueIndex].shiftCode // 班别
      this.form.numberCode = this.schedue[this.schedueIndex].scheduleNo
      this.form.scheduleNo = this.schedue[this.schedueIndex].scheduleNo

      const msg = this.validate()
      console.log(this.form, 'retrn--------')
      //当天且已过时
      if (
        dayjs().format('YYYY-MM-DD') === this.form.visitDate &&
        dayjs().isAfter(dayjs(`${this.form.visitDate} ${this.form.endTime}`))
      ) {
        return this.$message.error('当前时段已过期，请选择其他时段')
      }
      if (msg) return this.$message.error(msg)
      await appointment.save(this.form)
      this.$emit('toogleTab', 'message')
      this.$message.success('预约成功！')
      this.init()
    },
    validate() {
      if (!this.form.deptId) return '科室不能为空！'
      if (!this.form.doctorId) return '医师不能为空！'
      if (!this.form.periodNo) return '分时号不能为空！'
      return ''
    },
    // 选择科室=>更新可选日期=>更新医师列表=>更新号源列表
    selectDept() {
      Promise.all([this.getReverseDeptDate(), this.getDoctorList()]).then(() =>
        this.getSchedueList(),
      )
    },
    // 选择医生=>刷新号源
    selectDoctor(e) {
      //赋值医生id （因为加了上下午，需要根绝号源id筛选出医生id）
      this.doctors.forEach(i => {
        if (i.scheduleNo === e) {
          this.form.scheduleNo = i.scheduleNo
          this.form.doctorId = i.doctorId
          this.form.docInfo = i
        }
      })

      this.getSchedueList()
    },
    // 选择日期=>刷新医生=>刷新号源
    async selectDay(index) {
      if (index < 0 || index > 6) return
      this.dateIndex = index
      await this.getDoctorList()
      this.getSchedueList()
    },
    // 选择时段
    selectSchedue(index) {
      /* if (!this.schedue[index].leaveNo) {
        return this.$message.warning('当前时段没有余号了，请选择其他时段！')
      }
      if (
        this.compareTime(
          this.schedue[index].endTime,
          this.schedue[index].leaveNo,
        )
      ) {
        return this.$message.warning('请选择其他时间段')
      } */
      this.schedueIndex = index
    },
    compareTime(end, leaveNo) {
      //当前年月日
      const monthDay = new Date().toLocaleDateString().replaceAll('/', '-')
      //当前选中年月日
      const selectMonthDay =
        new Date().getFullYear() + '-' + this.dates[this.dateIndex].showDate

      //当前年月和选择时分的组合时间戳
      const oldTime = new Date(monthDay + ' ' + end + ':00').getTime()
      //当前时间时间戳
      const nowTime = new Date().getTime()

      //当前年月日时间戳
      const monthDayTime = new Date(monthDay + ' ' + '00:00:00').getTime()
      //选中年月日时间戳
      const selectMonthDayTime = new Date(
        selectMonthDay + ' ' + '00:00:00',
      ).getTime()

      return (
        (nowTime > oldTime && monthDayTime === selectMonthDayTime) || !leaveNo
      )
    },
  },
  filters: {
    weekDay(val) {
      return WeekDayCopy['day' + dayjs(val).day()]
    },
  },
  watch: {
    bizInfo: {
      handler(newVal, oldVal) {
        const newOrder = newVal?.orderId
        const oldOrder = oldVal?.orderId
        if (newOrder && newOrder !== oldOrder) {
          this.init()
        }
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';
.RoomOrder {
  height: 100%;
  section {
    height: 100%;
  }
  padding: 0 10px;
  .main {
    display: flex;
    flex-direction: column;
    height: calc(100% - 30px);
  }
  & ::v-deep {
    .el-input__inner {
      width: 160px;
      height: 30px;
      font-size: 14px;
      line-height: 28px;
    }
  }
}
.message_top {
  font-size: 14px;
  color: #333;
  padding-bottom: 12px;
  flex-wrap: wrap;
  .item {
    flex-shrink: 0;
    padding-top: 12px;
  }
  .title {
    color: #666;
  }
}
.choose_doctor {
  height: 70px;
  font-size: 14px;
  flex-shrink: 0;
  .item {
    margin-left: 10px;
    margin-bottom: 10px;
    line-height: 30px;
    &:first-child {
      margin-left: 0px;
    }
  }
}
.choose_date {
  width: 100%;
  overflow: hidden;
  height: 70px;
  padding-left: 20px;
  box-sizing: border-box;
  height: 70px;
  .btn {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    cursor: pointer;
  }
  .date_list {
    width: 100%;
    margin: 0 10px;
    overflow: hidden;
    height: 70px;
    position: relative;
    .list {
      width: 100%;
      display: flex;
      left: 0;
      position: absolute;
      transition: all 0.3s;
    }
    .item {
      flex: 1;
      height: 70px;
      min-width: 70px;
      margin-left: 10px;
      flex-shrink: 0;
      text-align: center;
      font-size: 14px;
      color: #333;
      background-color: #f2f2f2;
      border-radius: 4px;
      cursor: pointer;
      p {
        margin: 0;
      }
      .title {
        font-size: 16px;
        padding: 17px 0 10px 0;
      }
      &:first-child {
        margin-left: 0px;
      }
    }
    .active {
      background-color: $--color-primary;
      color: #fff;
    }
  }
}
.time_list {
  // width: 100%;
  margin-left: -10px;
  flex-wrap: wrap;
  padding-top: 20px;
  flex: 1;
  overflow-y: auto;
  justify-content: space-between;
  .item {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-content: center;
    width: 138px;
    height: 60px;
    // background-color: #f2f2f2;
    border: 1px solid #e0e0e0;
    margin-left: 10px;
    margin-bottom: 10px;
    text-align: center;
    border-radius: 4px;
    color: #333;
    font-size: 12px;
    cursor: pointer;
    p {
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .title {
      font-size: 16px;
      padding: 11px 0 10px 0;
    }
  }

  .complement {
    width: 138px;
    height: 0px;
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .active {
    border: 1px solid $--color-primary;
    background-color: rgba(10, 178, 193, 0.1);
    color: $--color-primary;
    background: #fff;
  }
  .passtime {
    background: #f2f2f2;
  }
}
</style>
