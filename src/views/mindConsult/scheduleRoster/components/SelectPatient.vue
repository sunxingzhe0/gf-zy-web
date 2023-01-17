<template>
  <el-dialog
    title="添加预约患者"
    :visible.sync="innerVisible"
    :close-on-click-modal="false"
    width="600px"
    @close="close()"
  >
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="医生：">
        <span>{{ data ? data.userName || '-' : '-' }}</span>
      </el-form-item>
      <el-form-item label="班次：">
        <span>{{ setWorkSchedule(data) }}</span>
      </el-form-item>
      <el-form-item label="支付方式：" prop="payType">
        <el-radio-group v-model="form.payType">
          <el-radio label="ONLINE_PAY">在线支付</el-radio>
          <!-- <el-radio label="OFFLINE_PAY">线下支付</el-radio> -->
          <el-radio label="FREE_PAY">线下缴费</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="就诊人">
        <el-select
          v-model="form.patient"
          filterable
          clearable
          remote
          placeholder="输入关键字查找"
          style="width: 100%"
          :remote-method="getPatientList"
          @change="patientChange"
        >
          <el-option
            v-for="item in patientList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >{{ item.name }} {{ item.idCard }}</el-option
          >
        </el-select>
        <div class="patientInfo" v-if="patientInfo">
          <div>
            {{ patientInfo.name }}
            {{
              patientInfo.sex == 0 ? '女' : patientInfo.sex == 1 ? '男' : '-'
            }}
            {{ patientInfo.age }} {{ patientInfo.phone }}
          </div>
          <div>患者ID：{{ patientInfo.patientId || '' }}</div>
          <div>
            <div>就诊卡号：{{ patientInfo.cardNo }}</div>
            <!-- <div>就诊次数：{{ '-' }}</div> -->
          </div>

          <div>
            <div>出生日期：{{ patientInfo.birthday.split(' ')[0] }}</div>
            <div>身份证：{{ patientInfo.idCard }}</div>
          </div>
        </div>
      </el-form-item>
      <el-row v-if="!patientInfo">
        <el-col :span="12">
          <el-form-item label="患者姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-select
              v-model="form.sex"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone"
            ><el-input v-model="form.phone" placeholder="请输入"></el-input
          ></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age"
            ><el-input
              type="number"
              v-model="form.age"
              placeholder="请输入"
            ></el-input
          ></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idCard"
            ><el-input v-model="form.idCard" placeholder="请输入"></el-input
          ></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker
              v-model="form.birthday"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker
          ></el-form-item>
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
  data() {
    return {
      patientList: [],
      form: {
        patient: '',
        payType: 'ONLINE_PAY',
        //新就诊人数据
        name: '',
        sex: '',
        age: '',
        phone: '',
        idCard: '',
        birthday: '',
      },
      patientInfo: null,

      rules: {
        payType: [
          { required: true, message: '请选择支付方式', trigger: 'change' },
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sex: [{ required: false, message: '请选择性别', trigger: 'change' }],
        age: [{ required: false, message: '请输入年龄', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
        ],
        birthday: [
          { required: false, message: '请选择生日', trigger: 'change' },
        ],
      },
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
        this.patientInfo = null
        this.patientList = []
        this.form.patient = ''
        // this.getPatientList()
      }
    },
  },
  methods: {
    close(data) {
      this.form = {
        patient: '',
        payType: 'ONLINE_PAY',
        //新就诊人数据
        name: '',
        sex: '',
        age: '',
        phone: '',
        idCard: '',
        birthday: '',
      }
      this.$emit('onClose', data)
    },
    patientChange(e) {
      console.log(e)
      this.patientInfo = this.patientList.find(item => item.idCard === e)
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
    async getPatientList(keywords) {
      console.log(this.data)
      let res = await apiScheduleTemplate.getAdvanceAppointmentList({
        scheduleDate: this.data.scheduleDate,
        scheduleId: this.data.id,
        doctorId: this.data.userId,
        pageSize: 20, //查全部患者
        keywords,
      })
      this.patientList = res.list.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.idCard,
        }
      })
    },
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let patientItem = this.patientList.find(
            item => item.idCard === this.form.patient,
          )

          let params = {
            cost: this.data.price,
            deptName: this.data.deptName,
            doctor: this.data.userName,
            doctorId: this.data.userId,
            entryId: this.data.itemId,
            entryName: this.data.itemName,
            orgId: this.data.orgId,
            periodName: this.data.periodName,
            reservationDate: this.data.scheduleDate,
            reservationDtime: this.data.startTime + '-' + this.data.endTime,
            scheduleId: this.data.id,
            payType: this.form.payType, //支付方式
          }
          params = this.patientInfo
            ? {
                ...params,
                memberId: patientItem.memberId,
                patientId: patientItem.patientId,
              }
            : {
                ...params,
                ...this.form,
              }
          //logcanshu
          console.log('【调试】参数', params)
          await apiScheduleTemplate.addAdvanceAppointment(params)
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
<style lang="scss" scoped>
.patientInfo {
  margin-top: 10px;
  > div {
    display: flex;
    > div {
      width: 50%;
    }
  }
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 180px;
}
</style>
