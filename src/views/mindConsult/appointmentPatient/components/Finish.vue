<template>
  <el-dialog
    title="结束"
    :visible.sync="innerVisible"
    :close-on-click-modal="false"
    width="600px"
    @close="close()"
  >
    <el-form :model="form" ref="ruleForm" label-width="120px">
      <el-form-item label="医生：">
        <span>{{ data ? data.docName || '-' : '-' }}</span>
      </el-form-item>
      <el-form-item label="咨询时段：">
        <span style="margin-right: 10px">{{ setWorkSchedule(data) }}</span>
        <el-tag type="danger" v-if="data">{{
          data.numberType === 'PERIODIC' ? '周期性预约单' : '一次性预约单'
        }}</el-tag>
      </el-form-item>
      <el-form-item label="就诊人：">
        <span> {{ setPatientInfo(data) }} </span>
      </el-form-item>
      <el-form-item label="就诊人类型：">
        <el-radio-group v-model="form.type" @change="typeChange">
          <el-radio :label="7">按周</el-radio>
          <el-radio :label="14">隔周</el-radio>
          <el-radio :label="30">按月</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="下次就诊时间：">
        <!-- <el-select
          v-model="objItem"
          clearable
          placeholder="请选择项目"
          @change="itemChange"
          style="width: 33%"
        >
          <el-option :value="1" label="项目一">项目一</el-option>
        </el-select> -->
        <div style="display: flex">
          <el-date-picker
            style="flex: 1"
            v-model="objDate"
            :picker-options="{
              disabledDate: time => dateDistable(time),
            }"
            @change="dateChange"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
          <el-select
            v-if="objDate"
            style="width: 140px"
            v-model="form.id"
            placeholder="请选择"
            @change="timeChange"
          >
            <el-option
              v-for="item in timeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div style="margin-top: 10px" v-if="newSchedule">
          {{ newSchedule.itemName }} | {{ newSchedule.scheduleDate }} |
          {{ newSchedule.startTime + '-' + newSchedule.endTime }} | ￥{{
            newSchedule.price
          }}
        </div>
        <!-- <el-select
          v-model="objTime"
          clearable
          placeholder="请选择时段"
          style="width: 33%"
        >
          <el-option :value="1" label="项目一">项目一</el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item
        label="支付方式"
        v-if="newSchedule"
        prop="payType"
        :rules="{
          required: true,
          message: '请选择支付方式',
          trigger: 'change',
        }"
      >
        <el-radio-group v-model="form.payType">
          <el-radio label="ONLINE_PAY">在线支付</el-radio>
          <!-- <el-radio label="OFFLINE_PAY">线下支付</el-radio> -->
          <el-radio label="FREE_PAY">线下缴费</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer is-center">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import apiScheduleTemplate from '@/api/mindConsult/scheduleTemplate'
import apiXzPatient from '@/api/mindConsult/appointmentPatient'
import dayjs from 'dayjs'
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
    },
  },
  mounted() {
    // this.getByOptions()
  },
  data() {
    return {
      fundTypeList: [],
      form: {
        id: '',
        type: 7,
        payType: 'ONLINE_PAY',
      },
      objDate: '',
      objItem: '',
      objTime: '',
      newSchedule: null,
      timeList: [],
      timeOption: [],
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
    async show() {
      if (this.show) {
        this.objItem = this.data.itemId
        console.log(this.data, '当前就诊信息')
        await this.getScheduleListByDeptDoctorPeriod()
        let defDate = dayjs(this.data.scheduleDate)
          .add(7, 'day')
          .format('YYYY-MM-DD')
        if (
          this.timeList.map(item => item.scheduleDate).indexOf(defDate) > -1
        ) {
          this.objDate = defDate
          let list = this.timeList.filter(v => v.scheduleDate === defDate)
          this.timeOption = list.map(v => ({
            label: `${v.startTime}-${v.endTime}`,
            value: v.id,
          }))
          //筛选出与当前就诊同时段的时段（reservedTime格式 "中午(10:10-11:10)"   label格式："09:00-10:00"）
          const identicalTime = this.timeOption.filter(
            v => this.data.reservedTime.indexOf(v.label) > -1,
          )
          this.form.id = identicalTime[0]?.value || this.timeOption[0].value //取同时段或可选第一个时段(this.form.id 所选排班id)
          console.log(this.timeOption, '可选时段信息')
          //选中项信息
          this.newSchedule = this.timeList.find(item => item.id == this.form.id)
        }
      }
    },
  },
  methods: {
    close(data) {
      this.objDate = '' //关闭弹窗时重置选项
      this.newSchedule = null //关闭弹窗时重置选项
      this.$refs.ruleForm.resetFields()
      this.$emit('onClose', data)
    },
    dateDistable(time) {
      let itemArr = this.timeList.map(item => item.scheduleDate)
      if (itemArr.indexOf(dayjs(time).format('YYYY-MM-DD')) > -1) {
        return false
      } else {
        return true
      }
    },
    dateChange(e) {
      if (!e) {
        console.log(e)
        this.newSchedule = null
        return false
      }
      console.log(e)
      let list = this.timeList.filter(v => v.scheduleDate === e)
      this.timeOption = list.map(v => ({
        label: `${v.startTime}-${v.endTime}`,
        value: v.id,
      }))
      this.form.id = this.timeOption[0].value
      this.newSchedule = list[0] || null
    },
    timeChange(e) {
      let data = this.timeList.find(v => v.id === e)
      this.newSchedule = data
    },
    //周期类型选择
    typeChange(e) {
      let defDate = dayjs(this.data.scheduleDate)
        .add(e, 'day')
        .format('YYYY-MM-DD')
      if (this.timeList.map(item => item.scheduleDate).indexOf(defDate) > -1) {
        this.objDate = defDate
        let list = this.timeList.filter(v => v.scheduleDate === defDate)
        this.timeOption = list.map(v => ({
          label: `${v.startTime}-${v.endTime}`,
          value: v.id,
        }))
        //筛选出与当前就诊同时段的时段（reservedTime格式 "中午(10:10-11:10)"   label格式："09:00-10:00"）
        const identicalTime = this.timeOption.filter(
          v => this.data.reservedTime.indexOf(v.label) > -1,
        )
        this.form.id = identicalTime[0]?.value || this.timeOption[0].value //取同时段或可选第一个时段(this.form.id 所选排班id)
        console.log(this.timeOption, '可选时段信息')
        //选中项信息
        this.newSchedule = this.timeList.find(item => item.id == this.form.id)
      } else {
        this.objDate = '' //重置选项
        this.newSchedule = null
      }
    },
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let formData = {
            deptName: this.data.deptName,
            doctor: this.data.docName,
            doctorId: this.data.doctorId,
            entryId: this.data.itemId,
            entryName: this.data.itemName,
            memberId: this.data.memberId,
            patientId: this.data.patientId,
            orgId: this.data.orgId,
            id: this.data.id,
            payType: this.form.payType,
          }
          if (this.newSchedule) {
            console.log(this.newSchedule)
            formData = {
              ...formData,
              cost: this.newSchedule.price,
              periodName: this.newSchedule.periodName,
              reservationDate: this.newSchedule.scheduleDate,
              reservationDtime:
                this.newSchedule.startTime + '-' + this.newSchedule.endTime,
              scheduleId: this.newSchedule.id,
            }
          }
          console.log(formData, 'formdata------')
          await apiXzPatient.endVisit(formData)
          this.close(true)
          this.$message.success('操作成功!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    itemChange(e) {
      console.log(e)
      this.date = ''
      this.objTime = ''
    },
    //设置 班次｜工作日程
    setWorkSchedule(data) {
      if (!data) return '-'
      let itemName = data.itemName || '-'
      let date = data.scheduleDate || '-'
      let time = data.periodName || '-'
      let price = `¥ ${data.price || 0}`
      return `${itemName} ｜ ${date} ${time} ｜ ${price}`
    },
    //设置 就诊人信息
    setPatientInfo(data) {
      if (!data) return '-'
      let cardNo = data?.cardNo || '-'
      let name = data?.name || '-'
      let sex = data?.sex === 0 ? '女' : data?.sex === 1 ? '男' : '未知'
      let phone = data?.phone || '-'
      return `【${cardNo}】 ${name} ｜ ${sex} ｜ ${phone}`
    },
    async getScheduleListByDeptDoctorPeriod() {
      console.log(this.data)
      let res = await apiScheduleTemplate.getScheduleListByDeptDoctorPeriod({
        deptId: this.data.deptId,
        doctorId: this.data.doctorId,
        itemId: this.data.itemId,
        // startTime: this.data.reservedTime
        //   ? this.data.reservedTime.split('-')[0]
        //   : '',
        // endTime: this.data.reservedTime
        //   ? this.data.reservedTime.split('-')[1]
        //   : '',
      })
      this.timeList = res.filter(item =>
        dayjs(item.scheduleDate).isAfter(dayjs()),
      )
    },
  },
}
</script>
