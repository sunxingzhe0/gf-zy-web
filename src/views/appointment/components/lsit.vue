<template>
  <div class="view__card">
    <el-button-group class="state">
      <div
        v-for="{ label, value } in orderTypes"
        :key="value"
        class="item"
        :class="query.orderType == value ? 'select' : 'unselect'"
        @click="typeChange(value)"
      >
        {{ label }}
      </div>
    </el-button-group>
    <List
      :filter="filter"
      v-model="query"
      :columns="columns"
      :tableData="tableData"
      showSelection
    >
      <template v-slot:footertool>
        <!-- @click="addTask" -->
        <el-button type="primary" size="mini" @click="notice"
          >停诊通知</el-button
        >
      </template>

      <template
        v-slot:fixed="{ row }"
        v-if="query.orderType == 0 || query.orderType == 1"
      >
        <span class="btns" @click="appointmentO(row, true)">预约</span>
        <span class="btns" @click="appointmentO(row, false)">取消</span>
      </template>
    </List>
    <el-dialog
      width="640px"
      title="停诊通知"
      :visible.sync="dialogNoticVisible"
    >
      <el-form :model="noticeData" :rules="rules" ref="noticeData">
        <el-form-item label="通知对象" prop="target">
          <el-select
            style="width: 350px"
            v-model="noticeData.target"
            placeholder="请选择通知对象"
          >
            <el-option label="全部" value="all"></el-option>
            <el-option label="选中部分" value="select"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="停诊原因" prop="stopReason">
          <el-select
            style="width: 350px"
            v-model="noticeData.stopReason"
            placeholder="停诊原因"
          >
            <el-option label="设备故障" value="FAILURE"></el-option>
            <el-option label="班次调整" value="ADJUST"></el-option>
            <el-option label="其他" value="OTHER"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="causeother" style="width: 430px">
          <el-input
            v-model="noticeData.causeother"
            v-if="noticeData.stopReason === 'OTHER'"
            placeholder="请输入停诊原因"
          ></el-input>
        </el-form-item>
        <el-form-item label="通知方式" prop="noticeType">
          <el-checkbox-group v-model="noticeData.noticeType">
            <el-checkbox label="APP应用内推送"></el-checkbox>
            <el-checkbox label="微信推送"></el-checkbox>
            <el-checkbox label="短信推送"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="is-center">
          <el-button @click="dialogNoticVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="submit"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      width="640px"
      title="预约时间"
      :visible.sync="dialogAppointmentVisible"
    >
      <el-form :model="appointmentData">
        <el-form-item label="预约日期" prop="date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="appointmentData.date"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预约时间" prop="time">
          <el-select
            v-model="appointmentData.rangeTime"
            placeholder="请选择预约时间段"
          >
            <el-option
              :disabled="screen(time.endTime)"
              v-for="(time, index) in timeList"
              :key="index"
              :value="time.startTime + '-' + time.endTime"
            >
              {{ time.startTime + '-' + time.endTime }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="is-center">
          <el-button @click="dialogAppointmentVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="appointmentSubmit()">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
// import headers from './headers.json'
import { appointment } from '@/api/appointment'
import { Base64 } from 'js-base64'
export default {
  props: ['type'],
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: async function (params) {
          let host = location.host
          if (host.indexOf(':') != -1) {
            host = host.substring(0, host.indexOf(':'))
          }
          let time = new Date().getTime()

          let headers = {
            timestamp: time, //时间戳
            code: Base64.encode('11031' + time), //11031"拼接时间戳的base64加密串
            hlwYj: host,
            builtCode: params.builtCode,
            // builtCode: 'aaaaa', //角色标识
          }
          let res = []
          //根据类型获取数据
          if (params.type == 'LAB') {
            res = (await appointment.webJyList(params, headers)) || {}
          } else if (params.type == 'EXAMINE') {
            res = (await appointment.webJcList(params, headers)) || {}
          } else if (params.type == 'CURE') {
            res = (await appointment.webZlList(params, headers)) || {}
          }
          // res.headers = headers.headers
          return res
        },
      },
    ]),
  ],
  data() {
    return {
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() < new Date().getTime() - 86400000
        },
      },
      orderTypes: [
        { label: '未预约', value: 0 },
        { label: '已预约', value: 1 },
        { label: '全部', value: null },
      ],
      dialogNoticVisible: false,
      dialogAppointmentVisible: false,
      filter: {
        date: {
          props: {
            options: [{ label: '创建时间', value: 0 }],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '患者姓名', value: 0 },
              { label: '就诊卡号', value: 1 },
              { label: '检验项目', value: 2 },
              { label: '标本', value: 3 },
              // { label: '科室', value: 'inHospNo' },
            ],
            hideBtn: true,
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '是否自行预约',
              options: [
                { label: '不是', value: 0 },
                { label: '是', value: 1 },
              ],
            },
            keys: 'orderSelf',
          },
          // {
          //   props: {
          //     label: '单据状态',
          //     options: [{ label: '执行', value: 'workId' }],
          //   },
          //   keys: 'orderType',
          // },
        ],
      },
      query: {
        //根据类型获取
        orderType: 0,
        pageSize: 10,
        currentNum: 1,
        type: this.type,
        builtCode: '',
      },
      columns: {
        index: {
          hidden: true,
        },
        fixed: {
          minWidth: 100,
        },
        orderState: {
          formatter(row) {
            return row.orderState == 0
              ? '待缴费'
              : row.orderState == 1
              ? '待执行'
              : row.orderState == 2
              ? '已执行'
              : row.orderState == 3
              ? '已取消'
              : ''
          },
        },
      },
      noticeData: {
        cardNoList: [], //通知对象id
        target: 'all', //通知对象
        stopReason: 'FAILURE', //停诊原因
        causeother: '', //其他自填原因
        noticeType: [], //通知方式
        remindType: '', //通知方式拼接
        stopType: this.type,
      },
      //预约时间
      appointmentData: {
        id: '',
        date: '',
        rangeTime: '', //时间段
      },
      rules: {
        target: [
          { required: true, message: '请选择通知对象', trigger: 'change' },
        ],
        stopReason: [
          { required: true, message: '请选择停诊原因', trigger: 'change' },
        ],
        causeother: [
          { required: true, message: '请输入停诊原因', trigger: 'blur' },
        ],
        noticeType: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个通知方式',
            trigger: 'change',
          },
        ],
      },
      timeList: [], //预约时间段
    }
  },
  created() {
    if (this.$route.query.builtCode) {
      localStorage.setItem('builtCode', this.$route.query.builtCode)
    }
    this.query.builtCode = localStorage.getItem('builtCode')
    this.getTime()
  },
  methods: {
    typeChange(value) {
      this.$nextTick(() => {
        this.query.orderType = value
      })
    },
    notice() {
      this.dialogNoticVisible = true
    },
    appointmentO(item, isappointment) {
      if (isappointment) {
        this.appointmentData.id = item.id
        this.dialogAppointmentVisible = true
      } else {
        //弹出提示框取消
        this.$confirm('是否确认取消当前预约单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.cancelSingle(item)
        })
      }
    },
    cancelSingle(item) {
      appointment
        .cancelSingle(
          {
            id: item.id,
          },
          this.getHeaders(),
        )
        .then(() => {
          this.$message({
            type: 'success',
            message: '取消成功!',
          })
          this.$_fetchTableData()
        })
    },
    submit() {
      if (this.noticeData.target === 'all') {
        this.noticeData.cardNoList = []
      } else {
        let list = this.tableData.multipleSelection
        if (list.length == 0) {
          this.$message.warning('请选择需要停诊项！')
          return
        }
        this.noticeData.cardNoList = list.map(item => {
          return item.id
        })
      }

      //拼接通知方式

      this.noticeData.remindType += this.noticeData.noticeType
        .map(item => {
          let str = ''
          switch (item) {
            case 'APP应用内推送':
              str = 'APP'
              break
            case '微信推送':
              str = 'WX'
              break
            case '短信推送':
              str = 'SMS'
              break
          }
          return str
        })
        .join(',')

      appointment.cancelRemind(this.noticeData, this.getHeaders()).then(() => {
        this.$message.success('停诊成功！')
        this.dialogNoticVisible = false
      })
    },
    appointmentSubmit() {
      if (this.appointmentData.date === '') {
        this.$message({
          type: 'warning',
          message: '请选择日期',
        })
        return
      }
      if (this.appointmentData.rangeTime === '') {
        this.$message({
          type: 'warning',
          message: '请选择时间段',
        })
        return
      }

      appointment
        .changeOrderTimec(this.appointmentData, this.getHeaders())
        .then(() => {
          this.dialogAppointmentVisible = false
          this.$message({
            type: 'success',
            message: '预约成功!',
          })
          this.$_fetchTableData()
        })
    },
    getTime() {
      appointment.chooseDisTime(this.getHeaders()).then(data => {
        this.timeList = data
      })
    },
    getHeaders() {
      let host = location.host
      if (host.indexOf(':') != -1) {
        host = host.substring(0, host.indexOf(':'))
      }
      let time = new Date().getTime()
      let headers = {
        timestamp: time, //时间戳
        code: Base64.encode('11031' + time), //11031"拼接时间戳的base64加密串
        hlwYj: host,
        builtCode: 'aaaaa', //角色标识
      }
      return headers
    },
    screen(endTime) {
      if (new Date(this.appointmentData.date) - new Date() > 0) {
        return false
      }
      let date = this.appointmentData.date + ' ' + endTime
      if (new Date(date) - new Date() < 0) {
        return true
      }
    },
  },
}
</script>
<style lang="scss">
.view__card {
  padding: 0px !important;
  .el-dialog__body {
    padding: 30px 20px !important;
    .el-form {
      width: 100%;
    }
  }
  .state {
    display: flex;
    width: 100%;
    height: 60px;
    background: #f2f2f2;
    font-size: 16px;

    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 104px;
      height: 60px;
    }
    .select {
      background: #ffffff;
      color: #0ab2c1;
    }
    .unselect {
      background: #f2f2f2;
      color: #666666;
    }
  }
}
.c__list {
  padding: 20px !important;
}
.btns {
  color: #0ab2c1;
  font-size: 14px;
  cursor: pointer;
}
</style>
