<template>
  <el-dialog
    :title="`停诊${type ? '申请' : ''}`"
    :visible.sync="innerVisible"
    :close-on-click-modal="false"
    width="600px"
    @close="close()"
  >
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
      <template v-if="!type">
        <el-form-item label="医生：">
          <span>{{ data ? data.userName || '-' : '-' }}</span>
        </el-form-item>
        <el-form-item label="班次：">
          <span>{{ setWorkSchedule(data) }}</span>
        </el-form-item>
      </template>
      <el-form-item label="就诊人：">
        <span> {{ setPatientInfo(data) }} </span>
      </el-form-item>
      <el-form-item label="工作日程：" v-if="type">
        <span>{{ setWorkSchedule(data) }}</span>
      </el-form-item>
      <!-- 有预约患者才显示 -->
      <template v-if="hasReservedVO(data)">
        <el-form-item label="延时时间：" prop="newScheduleId">
          <!-- <el-select
            v-model="objItem"
            clearable
            placeholder="请选择项目"
            @change="itemChange"
            style="width: 33%"
          >
            <el-option
              v-for="item in itemList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
              >{{ item.name }}</el-option
            >
          </el-select> -->
          <div style="display: flex">
            <el-date-picker
              v-model="objDate"
              :picker-options="{
                disabledDate: time => dateDistable(time),
              }"
              @change="dateChange"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="flex: 1"
            >
            </el-date-picker>
            <el-select
              v-if="objDate"
              style="width: 140px"
              v-model="form.newScheduleId"
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
      </template>
      <el-form-item label="停诊原因：" prop="applyRemark">
        <el-input
          type="textarea"
          v-model="form.applyRemark"
          placeholder="请输入"
        />
      </el-form-item>
      <!-- <el-form-item
        label="退款方式"
        prop="stopRefundMethod"
        v-if="data && data.reservedVO && data.reservedVO.patientName"
      >
        <el-select v-model="form.stopRefundMethod" style="width: 100%">
          <el-option
            v-for="item in fundTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->
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
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
    },
    type: {
      type: String,
    },
    refundType: {
      type: String,
    },
  },
  watch: {
    async show() {
      if (this.show) {
        this.objDate = ''
        this.newSchedule = null
        this.objItem = this.data.itemId
        console.log(this.data)
        if (this.data.reservedVO) {
          this.form.memberId = this.data.reservedVO?.memberId || ''
          this.form.patientId = this.data.reservedVO?.patientId || ''
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
            this.form.newScheduleId = this.timeOption[0].value
            this.newSchedule = this.timeList.find(
              item => item.scheduleDate == defDate,
            )
          }
        }
      }
    },
  },
  created() {
    // this.getByOptions()
    // this.getItem()
  },
  data() {
    return {
      fundTypeList: [],
      form: {
        id: '',
        stopRefundMethod: 1,
        applyRemark: '',
        newScheduleId: '',
        patientId: '',
        memberId: '',
      },
      objDate: '',
      objItem: '',
      objTime: '',
      rules: {
        applyRemark: [
          { required: true, message: '请输入停诊原因', trigger: 'blur' },
        ],
        stopRefundMethod: [
          { required: true, message: '请选择退款方式', trigger: 'blur' },
        ],
      },
      itemList: [],
      timeList: [],
      newSchedule: null,
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
  methods: {
    close(data) {
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
      console.log(e)
      if (e) {
        let list = this.timeList.filter(v => v.scheduleDate === e)
        console.log(list)
        this.timeOption = list.map(v => ({
          label: `${v.startTime}-${v.endTime}`,
          value: v.id,
        }))
        this.form.newScheduleId = this.timeOption[0].value
        this.newSchedule = list[0] || null
      } else {
        this.newSchedule = null
        this.form.newScheduleId = '' //清空自动选择的延时排班id
      }
    },
    timeChange(e) {
      let data = this.timeList.find(v => v.id === e)
      this.newSchedule = data
    },
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          console.log(this.form)
          if (this.type) {
            await apiScheduleTemplate.stopApply({
              scheduleId: this.data.id,
              ...this.form,
              stopRefundMethod:
                this.data.reservedVO && !this.form.newScheduleId ? 2 : 1,
            })
          } else {
            await apiScheduleTemplate.stopInquiry({
              scheduleId: this.data.id,
              ...this.form,
              stopRefundMethod:
                this.data.reservedVO && !this.form.newScheduleId ? 2 : 1,
            })
          }

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
      this.objDate = ''
      this.objTime = ''
    },
    //设置 班次｜工作日程
    setWorkSchedule(data) {
      if (!data) return '-'
      let itemName = data.itemName || '-'
      let date = data.scheduleDate || '-'
      let time = data.startTime + '-' + data.endTime
      let price = `¥ ${data.price || 0}`
      return `${itemName} ｜ ${date} ${time} ｜ ${price}`
    },
    //设置 就诊人信息
    setPatientInfo(data) {
      if (!data) return '-'
      if (!data.reservedVO) return '-'
      let cardNo = data.reservedVO.cardNo || '-'
      let name = data.reservedVO.patientName || '-'
      let sex =
        data.reservedVO.sex === 1
          ? '男'
          : data.reservedVO.sex === 0
          ? '女'
          : '-'
      let phone = data.reservedVO.phone || '-'
      return `【${cardNo}】 ${name} ｜ ${sex} ｜ ${phone}`
    },
    //判断是否有预约患者
    hasReservedVO(data) {
      if (!data) return false
      if (!data.reservedVO) return false
      if (data.reservedVO.status === null) return false
      return true
    },
    async getScheduleListByDeptDoctorPeriod() {
      console.log(this.data)
      let res = await apiScheduleTemplate.getScheduleListByDeptDoctorPeriod({
        deptId: this.data.deptId,
        doctorId: this.data.userId,
        itemId: this.objItem,
        // startTime: this.data.startTime,
        // endTime: this.data.endTime,
      })
      this.timeList = res.filter(item =>
        dayjs(item.scheduleDate).isAfter(dayjs()),
      )
    },
    async getItem() {
      let res = await apiProjectSet.itemList({
        pageSize: 999999,
        currentNum: 1,
        enabled: true,
      })
      this.itemList = res.list
    },
    // async getByOptions() {
    //   let res = await apiScheduleTemplate.getByOptions(this.refundType)
    //   console.log(res)
    //   let option = JSON.parse(res.settings).method.sort((x, y) => x - y)
    //   let options = []
    //   option.forEach(item => {
    //     let opt = {
    //       label: '',
    //       value: item,
    //     }
    //     if (item == 1) {
    //       opt.label = '不退款'
    //     } else if (item == 2) {
    //       opt.label = '原路退回'
    //     } else if (item == 3) {
    //       opt.label = '线下退款'
    //     }
    //     options.push(opt)
    //   })
    //   this.fundTypeList = options
    // },
  },
}
</script>
