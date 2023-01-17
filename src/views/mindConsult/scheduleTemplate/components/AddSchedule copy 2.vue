<template>
  <el-dialog
    title="添加排班内容"
    :visible.sync="innerVisible"
    :close-on-click-modal="false"
    width="960px"
    @close="close()"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      label-position="left"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="医生">
            <el-input v-model="userName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="日期" prop="weekDay">
            <el-select
              v-model="form.weekDayList"
              @change="weekChange"
              multiple
              collapse-tags
              style="width: 100%"
            >
              <el-option
                v-for="item in week"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="午别" prop="periodId">
            <el-select
              v-model="form.periodId"
              @change="periodChange"
              style="width: 100%"
            >
              <el-option
                v-for="item in timeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目" prop="itemId">
            <el-select
              v-model="form.itemId"
              style="width: 100%"
              @change="itemChange"
            >
              <el-option
                v-for="item in itemList"
                :key="item.id"
                :disabled="item.disabled"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开始时间" prop="startTime">
            <el-time-picker
              style="width: 100%"
              format="HH:mm"
              value-format="HH:mm"
              v-model="form.startTime"
              :disabled="!form.periodId"
              :picker-options="{
                selectableRange: selectableRange,
              }"
              @change="startTimeChange"
              placeholder="请选择"
            >
            </el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结束时间" prop="endTime">
            <el-input
              v-model="form.endTime"
              format="HH:mm"
              value-format="HH:mm"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="咨询室" prop="roomId">
            <!-- <el-input v-model="form.clinicName" placeholder="请输入"></el-input> -->
            <el-select
              style="width: 100%"
              v-model="form.roomId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in roomList"
                :value="item.id"
                :label="item.name"
                :disabled="!item.status"
                :key="item.id"
                >{{ item.name }}</el-option
              >
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="号源类型" prop="ageGroup">
            <el-checkbox-group v-model="form.ageGroup">
              <el-checkbox label="1">儿童</el-checkbox>
              <el-checkbox label="2">青少年</el-checkbox>
              <el-checkbox label="3">成人</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="适用性别" prop="sex">
            <el-radio-group v-model="form.sex">
              <el-radio :label="9">通用</el-radio>
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否录像" prop="video">
            <el-radio-group v-model="form.video">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="价格/元">
            <el-input v-model="price" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="号源" prop="sourceNumber">
            <el-input v-model="form.sourceNumber" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer is-center">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import apiScheduleTemplate from '@/api/mindConsult/scheduleTemplate'
import apiProjectSet from '@/api/mindConsult/projectSet'
import dayjs from 'dayjs'
import schedulData from '../base'
import { consulRoomList } from '@/api/mindConsult/consultRoom'
import { range } from 'lodash'
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
    },
    list: {
      type: Array,
    },
  },
  data() {
    return {
      week: [
        { label: '周一', value: 'MONDAY' },
        { label: '周二', value: 'TUESDAY' },
        { label: '周三', value: 'WEDNESDAY' },
        { label: '周四', value: 'THURSDAY' },
        { label: '周五', value: 'FRIDAY' },
        { label: '周六', value: 'SATURDAY' },
        { label: '周日', value: 'SUNDAY' },
      ],
      timeList: [],
      itemList: [],
      roomList: [],
      userName: '',
      price: '',
      selectableRange: '',
      form: {
        deptId: '',
        // weekDay: '',
        weekDayList: [],
        periodId: '',
        startTime: '',
        endTime: '',
        itemId: '',
        clinicName: '',
        scheduleId: '',
        sourceNumber: 1,
        roomId: '',
        ageGroup: [],
        sex: 9,
        video: false,
      },
      rules: {
        itemId: [{ required: true, message: '请选择项目', trigger: 'blur' }],
        periodId: [{ required: true, message: '请选择午别', trigger: 'blur' }],
        roomId: [{ required: true, message: '请选择咨询室', trigger: 'blur' }],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' },
        ],
        weekDayList: [
          { required: true, message: '请选择日期', trigger: 'blur' },
        ],
        ageGroup: [
          { required: true, message: '请选择号源类型', trigger: 'change' },
        ],
        sex: [{ required: true, message: '请选择适用性别', trigger: 'blur' }],
        video: [{ required: true, message: '请选择是否录像', trigger: 'blur' }],
      },
      interval: 0,
      tableList: [],
    }
  },
  computed: {
    innerVisible: {
      get: function () {
        return this.show
      },
      set: function (val) {
        console.log(val)
        this.$emit('onClose')
      },
    },
  },
  watch: {
    show() {
      if (this.show) {
        this.tableList = this.list
        this.getTime()
        this.userName = this.data.userName
        this.form.deptId = this.data.deptId
        this.form.scheduleId = this.data.scheduleId
        this.form.userId = this.data.userId.split('_')[1]
        this.form.weekDayList = [this.data.weekDay]
      }
    },
  },
  async created() {
    await this.getByOptions()
    this.getconsulRoomList()
    this.getItem()
  },
  methods: {
    close(data) {
      this.price = ''
      this.$refs.ruleForm.resetFields()
      this.$emit('onClose', data)
    },
    weekChange(e) {
      console.log(e)
      if (e.length > 0) {
        this.doctorWeekDayScheduleList(e[0])
      }
    },
    itemChange(e) {
      console.log(e)
      let item = this.itemList.find(item => e === item.id)

      if (this.form.startTime) {
        let rangge = this.getRemainingTime()
        let itemEndtime = dayjs(`2020-01-01 ${this.form.startTime}:00`).add(
          item.duration,
          'minute',
        )
        //临时处理bug
        const status = rangge.data.some((v, i) => {
          return (
            itemEndtime.isBefore(dayjs(`2020-01-01${v.endTime}:00`)) ||
            itemEndtime.isSame(dayjs(`2020-01-01${v.endTime}:00`))
          )
        })
        if (
          /* itemEndtime.isBefore(
            dayjs(`2020-01-01${rangge.data[0].endTime}:00`),
          ) ||
          itemEndtime.isSame(dayjs(`2020-01-01${rangge.data[0].endTime}:00`)) */
          status
        ) {
          this.form.endTime = dayjs(`2020-01-01 ${this.form.startTime}:00`)
            .add(item.duration, 'minute')
            .format('HH:mm')
        } else {
          this.form.startTime = ''
          this.$message.warning('项目时长较长，所选时间不足，请重新选择')
        }
      }
      this.price = item.price
    },
    startTimeChange(e) {
      let rangge = this.getRemainingTime()
      console.log(rangge)
      let item = this.itemList.find(item => this.form.itemId === item.id)
      let itemEndtime = dayjs(`2020-01-01 ${this.form.startTime}:00`).add(
        item.duration,
        'minute',
      )
      //临时处理bug
      const status = rangge.data.some((v, i) => {
        return (
          itemEndtime.isBefore(dayjs(`2020-01-01${v.endTime}:00`)) ||
          itemEndtime.isSame(dayjs(`2020-01-01${v.endTime}:00`))
        )
      })
      if (
        /*  itemEndtime.isBefore(dayjs(`2020-01-01${rangge.data[0].endTime}:00`)) ||
        itemEndtime.isSame(dayjs(`2020-01-01${rangge.data[0].endTime}:00`)) */
        status
      ) {
        this.form.endTime = dayjs(`2020-01-01 ${e}:00`)
          .add(item.duration, 'minute')
          .format('HH:mm')
      } else {
        this.form.startTime = ''
        this.$message.warning('项目时长较长，所选时间不足，请重新选择')
      }
      console.log(rangge)
    },
    //切换午别
    periodChange() {
      // let timeItem = this.timeList.find(item => e === item.id)
      let remainingTime = this.getRemainingTime()
      console.log(remainingTime)
      //临时处理bug---START--
      // const start = dayjs(`2020-01-01 ${remainingTime.data[0].startTime}`)
      // const end = dayjs(`2020-01-01 ${remainingTime.data[0].endTime}`)
      // const subTime = end - start <= 40 * 60 * 1000
      // console.log('时间差', subTime)
      // this.form.startTime = subTime
      //   ? remainingTime.data[1].startTime
      //   : remainingTime.data[0].startTime
      /* END------- */
      this.form.startTime = remainingTime.data[0].startTime
      this.selectableRange = remainingTime.data.map(
        item => item.startTime + ':00' + '-' + item.endTime + ':00',
      )
      if (this.form.itemId) {
        let item = this.itemList.find(item => this.form.itemId === item.id)
        this.form.endTime = dayjs(`2020-01-01 ${this.form.startTime}:00`)
          .add(item.duration, 'minute')
          .format('HH:mm')
        this.price = item.price
      }
      this.setItemList()
    },
    getRemainingTime(periodItem) {
      let timeItem =
        periodItem || this.timeList.find(item => this.form.periodId === item.id)
      let timeData = {
        flag: false,
        data: [],
      }
      console.log(this.list)
      let list = this.tableList.filter(
        f =>
          (dayjs('2022-01-01 ' + f.startTime + ':00').isAfter(
            '2022-01-01 ' + timeItem.startTime + ':00',
          ) ||
            dayjs('2022-01-01 ' + f.startTime).isSame(
              '2022-01-01 ' + timeItem.startTime + ':00',
            )) &&
          (dayjs('2022-01-01 ' + f.endTime).isBefore(
            '2022-01-01 ' + timeItem.endTime + ':00',
          ) ||
            dayjs('2022-01-01 ' + f.endTime).isSame(
              '2022-01-01 ' + timeItem.endTime + ':00',
            )),
      )
      console.log(list)
      if (list.length > 0) {
        let timeList = schedulData.unselectTime(
          list.map(item => {
            return {
              startTime: item.startTime,
              endTime:
                item.endTime === timeItem.endTime
                  ? item.endTime
                  : dayjs('2022-01-01 ' + item.endTime + ':00')
                      .add(this.interval, 'minute')
                      .format('HH:mm'),
            }
          }),
          {
            startTime: timeItem.startTime,
            endTime: timeItem.endTime,
          },
        )
        timeData.data = timeList
        console.log(timeList)
        timeData.flag = true
      } else {
        timeData.flag = false
        timeData.data = [
          { startTime: timeItem.startTime, endTime: timeItem.endTime },
        ]
      }
      return timeData
    },
    //咨询室
    async getconsulRoomList() {
      let res = await consulRoomList({
        currentNum: 1,
        pageSize: 9999999,
        type: '预约',
      })
      this.roomList = res.list
    },
    //获取排班项目之间的间隔休息时间
    async getByOptions() {
      let res = await apiScheduleTemplate.getByOptions('SHIFT_INTERVAL')
      this.interval = JSON.parse(res.settings).interval
    },
    //获取午别
    async getTime() {
      let res = await apiScheduleTemplate.getTemplate(this.data.scheduleId)
      console.log(res)
      this.timeList = res.periodList.map(item => {
        return {
          ...item,
          disabled: this.getRemainingTime(item).data.length === 0,
        }
      })
      console.log(this.timeList)
    },
    //获取项目
    async getItem() {
      let res = await apiProjectSet.itemList({ pageSize: 99999, currentNum: 1 })
      this.itemList = res.list
    },
    async doctorWeekDayScheduleList(week) {
      let res = await apiScheduleTemplate.doctorWeekDayScheduleList({
        deptId: this.data.deptId,
        scheduleId: this.data.scheduleId,
        userId: this.data.userId,
        weekDay: week,
      })
      this.tableData = res
    },
    setItemList() {
      let timeItem = this.timeList.find(item => this.form.periodId === item.id)
      let rangeTimenum = this.selectableRange.map(item => {
        return {
          range: item,
          num: dayjs('2022-01-01 ' + item.split('-')[1] + ':00').diff(
            dayjs('2022-01-01 ' + item.split('-')[0] + ':00'),
            'minutes',
          ),
        }
      })
      console.log(rangeTimenum)
      this.itemList = this.itemList.map(item => {
        // let disabled = false
        let duration = this.list.filter(s => s.endTime === timeItem.startTime)
          .length
        let length = rangeTimenum.filter(s => {
          return (
            s.num >=
            (s.range.split('-')[1] === timeItem.endTime
              ? item.duration
              : duration > 0
              ? parseFloat(item.duration) + parseFloat(this.interval)
              : parseFloat(item.duration))
          )
        })
        console.log(length)
        if (length.length == 0) {
          item.disabled = true
        } else {
          item.disabled = false
        }
        return {
          ...item,
        }
      })
    },
    getTimeRepeat(dateAr) {
      for (let k in dateAr) {
        if (!this.isTimeRepeat(k, dateAr)) {
          return false
        }
      }
      return true
    },
    isTimeRepeat(idx, dateAr) {
      for (let k in dateAr) {
        if (idx !== k) {
          if (
            dateAr[k].startTime <= dateAr[idx].startTime &&
            dateAr[k].endTime > dateAr[idx].startTime
          ) {
            return false
          }
          if (
            dateAr[k].startTime < dateAr[idx].endTime &&
            dateAr[k].endTime >= dateAr[idx].endTime
          ) {
            return false
          }
        }
      }
      return true
    },
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let list = [
            ...this.tableList,
            { startTime: this.form.startTime, endTime: this.form.endTime },
          ]
          console.log(list)
          if (!this.getTimeRepeat(list)) {
            this.$message.error('午别时间有重叠，请重新调整')
            return false
          }
          //处理号源类型
          this.form.ageGroup = this.form.ageGroup.join(',')
          await apiScheduleTemplate.addDoctorSchedule(this.form)
          this.close(true)
          this.$message.success('操作成功!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>
