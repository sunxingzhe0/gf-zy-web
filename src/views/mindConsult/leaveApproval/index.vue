<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      tableClass="institutionalusers"
    >
      <template v-slot:slot_patientName="{ row }">
        <el-button type="text" @click="goto(row)">{{
          row.patientName
        }}</el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" v-if="row.status == 3" @click="add(row, true)">
          同意
        </el-button>
        <el-button type="text" v-if="row.status == 3" @click="add(row, false)">
          拒绝
        </el-button>
      </template>
      <template v-slot:footertool>
        <el-button @click="exportData">导出</el-button>
      </template>
    </List>
    <el-dialog
      :title="editRow.state ? '同意' : '拒绝'"
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="就诊人" style="margin-bottom: 0">
          {{
            `[${infoData.cardNo}]${infoData.patientName}｜${
              infoData.sex || '-'
            }｜${infoData.phone}`
          }}
        </el-form-item>
        <el-form-item label="预约信息">
          <template v-if="infoData && infoData.reservationDate">
            {{
              `${infoData.entryName}｜${
                infoData.reservationDate &&
                infoData.reservationDate.split(' ')[0] +
                  ` ` +
                  infoData.reservationDtime
              }｜ ¥${infoData.cost}`
            }}
          </template>
        </el-form-item>
        <el-form-item label="退款方式" prop="refundWay" v-if="editRow.state">
          <el-select
            v-model="form.refundWay"
            @change="refundChange"
            style="width: 100%"
          >
            <el-option
              v-for="item in fundTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="顺延时间"
          v-if="editRow.state && form.refundWay === 1"
          prop="scheduleDate"
        >
          <div style="display: flex">
            <el-date-picker
              style="flex: 1"
              v-model="form.scheduleDate"
              @change="dateChange"
              :picker-options="{
                disabledDate: time => dateDistable(time),
              }"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
            <el-select
              v-if="form.scheduleDate"
              style="width: 140px"
              v-model="form.scheduleId"
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
        </el-form-item>
        <el-form-item label="操作理由" prop="remark" v-if="isAdd">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入内容"
            v-model="form.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer is-center">
        <el-button @click="isAdd = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import apiLeaveApproval from '@/api/mindConsult/leaveApproval'
import apiScheduleTemplate from '@/api/mindConsult/scheduleTemplate'
import apiProjectSet from '@/api/mindConsult/projectSet'
import { deptXzChooseList } from '@/api/index'
import dayjs from 'dayjs'
let pre = {
  itemList: [],
  deptList: [],
}
export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: apiLeaveApproval.leaveList }])],
  data() {
    this.filter = {
      date: {
        props: {
          options: [{ label: '预约就诊日期', value: 0 }],
          format: 'yyyy-MM-dd',
          valueFormat: 'yyyy-MM-dd',
        },
        keys: ['timeType', 'reservationDateLow', 'reservationDateHigh'],
      },
      popover: [
        {
          props: {
            label: '关键字',
            is: 'el-input',
          },
          data: {
            attrs: {
              placeholder: '患者姓名/电话/就诊卡号/备注/预约单号',
            },
          },
          keys: 'keywords',
        },

        {
          props: {
            label: '项目',
            options: pre.itemList.map(_ => {
              return {
                label: _.name,
                value: _.id,
                index: _.name,
              }
            }),
          },
          keys: 'activityType',
        },
        {
          props: {
            label: '状态',
            options: [
              { label: '不限', value: '' },
              { label: '已预约', value: 1 },
              { label: '请假中', value: 3 },
              { label: '已请假', value: 2 },
              { label: '已关闭', value: 4 },
            ],
          },
          keys: 'status',
        },
        {
          props: {
            label: '审批结果',
            options: [
              { label: '不限', value: '' },
              { label: '已同意', value: 1 },
              { label: '已拒绝', value: 2 },
            ],
          },
          keys: 'approvalResult',
        },
        {
          props: {
            label: '是否退费',
            options: [
              { label: '不限', value: '' },
              { label: '是', value: 1 },
              { label: '否', value: 0 },
            ],
          },
          keys: 'type',
        },
        {
          props: {
            label: '审批人',
            is: 'el-input',
          },
          data: {
            attrs: {
              placeholder: '请输入',
            },
          },
          keys: 'approver',
        },
      ],
    }
    return {
      infoData: {},
      loading: false,
      isAdd: false,
      editRow: {},
      fundTypeList: [],
      query: {
        timeType: 0,
        pageSize: 10,
        currentNum: 1,
        doctor:
          this.$route.path === '/mindConsult/leaveApproval/list'
            ? this.$store.state.user.userId
            : null,
      },
      columns: {
        index: {
          hidden: true,
        },
        fixed: {
          minWidth: 100,
        },
        status: {
          formatter(row) {
            return row.status == 1
              ? '已预约'
              : row.status == 2
              ? '已请假'
              : row.status == 3
              ? '请假中'
              : '已关闭'
          },
        },
        approvalResult: {
          formatter(row) {
            return row.approvalResult == 1
              ? '同意'
              : row.approvalResult == 2
              ? '拒绝'
              : ''
          },
        },
        refundRel: {
          formatter(row) {
            return row.refundRel == 1 ? '是' : row.refundRel == 0 ? '否' : ''
          },
        },
        reservationDate: {
          minWidth: 120,
          formatter(row) {
            return row.reservationDate && row.reservationDate.split(' ')[0]
          },
        },
        entryName: {
          minWidth: 140,
        },
        phone: {
          minWidth: 120,
        },
        reservationDtime: {
          minWidth: 100,
        },
        patientName: {
          prop: 'slot_patientName',
        },
        leaveTime: {
          minWidth: 160,
        },
        id: {
          minWidth: 280,
        },
      },
      form: {
        approvalResult: '',
        id: '',
        refundRel: '',
        refundWay: '',
        remark: '',
        scheduleId: '',
        scheduleDate: '',
      },
      rules: {
        refundWay: [
          { required: true, message: '请选择退款方式', trigger: 'blur' },
        ],
        scheduleDate: [
          { required: true, message: '请选择顺延时间', trigger: 'blur' },
        ],
        remark: [
          { required: true, message: '请填写操作理由', trigger: 'blur' },
        ],
      },
      objItem: '',
      objDate: '',
      objTime: '',
      newSchedule: null,
      timeList: [],
      timeOption: [],
      //新增筛选条件
      newFilter: [
        {
          props: {
            label: '科室',
            options: pre.deptList.map(item => {
              return {
                label: item.showName,
                value: item.id,
              }
            }),
          },
          data: {
            attrs: {
              clearable: true,
              filterable: true,
            },
          },
          keys: 'deptId',
        },
        {
          props: {
            label: '医生',
            is: 'el-input',
          },
          data: {
            attrs: {
              placeholder: '请输入',
            },
          },
          keys: 'doctorName',
        },
      ],
      oldFilter: null,
    }
  },
  async beforeRouteEnter(to, from, next) {
    let res = await apiProjectSet.itemList({
      currentNum: 1,
      pageSize: 9999999,
    })
    pre.deptList = await deptXzChooseList()
    pre.itemList = res.list

    next()
  },
  watch: {
    $route(to, from) {
      const formPath = from.path
      if (formPath === '/mindConsult/leaveApproval/list') {
        this.init()
        this.addFilter()
      }
      if (formPath === '/mindConsult/allLeaveApproval/list') {
        this.init()
        this.filter.popover = this.oldFilter
      }
    },
  },
  created() {
    //保存初始筛选条件
    this.oldFilter = JSON.parse(JSON.stringify(this.filter.popover))
    this.addFilter()
  },
  mounted() {
    this.getByOptions()
  },
  methods: {
    //是否新增筛选条件
    addFilter() {
      if (this.$route.path !== '/mindConsult/leaveApproval/list') {
        this.filter.popover = [...this.filter.popover, ...this.newFilter]
      }
    },
    init() {
      this.query = {
        timeType: 0,
        pageSize: 10,
        currentNum: 1,
        doctor:
          this.$route.path === '/mindConsult/leaveApproval/list'
            ? this.$store.state.user.userId
            : null,
      }
    },
    dateDistable(time) {
      let itemArr = this.timeList
        .map(item => item.scheduleDate)
        .filter(t => dayjs(t).isAfter(this.infoData.reservationDate))
      if (itemArr.indexOf(dayjs(time).format('YYYY-MM-DD')) > -1) {
        return false
      } else {
        return true
      }
    },
    dateChange(e) {
      console.log(e)
      if (!e) {
        this.newSchedule = null
        return false
      }
      this.form.scheduleDate = e
      let list = this.timeList.filter(v => v.scheduleDate === e)
      this.timeOption = list.map(v => ({
        label: `${v.startTime}-${v.endTime}`,
        value: v.id,
      }))
      this.form.scheduleId = this.timeOption[0].value
      this.newSchedule = list[0] || null
    },
    timeChange(e) {
      let data = this.timeList.find(v => v.id === e)
      this.newSchedule = data
    },
    async refundChange(e) {
      console.log(e)
      if (e == 1) {
        await this.getScheduleListByDeptDoctorPeriod()
        let defDate = dayjs(this.editRow.reservationDate)
          .add(7, 'day')
          .format('YYYY-MM-DD')
        if (
          this.timeList.map(item => item.scheduleDate).indexOf(defDate) > -1
        ) {
          let list = this.timeList.filter(v => v.scheduleDate === defDate)
          this.timeOption = list.map(v => ({
            label: `${v.startTime}-${v.endTime}`,
            value: v.id,
          }))
          this.form.scheduleId = this.timeOption[0].value
          this.form.scheduleDate = defDate
          this.newSchedule = this.timeList.find(t => t.scheduleDate == defDate)
          console.log(this.form)
        }
      }
    },
    async getInfo(id) {
      this.infoData = await apiLeaveApproval.leaveById({ reservationId: id })
    },
    async getByOptions() {
      let res = await apiScheduleTemplate.getByOptions('MANAGER_REFUND_METHOD')
      console.log(res)
      let option = JSON.parse(res.settings).method.sort((x, y) => x - y)
      let options = []
      option.forEach(item => {
        let opt = {
          label: '',
          value: item,
        }
        if (item == 1) {
          opt.label = '不退款'
        } else if (item == 2) {
          opt.label = '原路退回'
        } else if (item == 3) {
          opt.label = '线下退款'
        }
        options.push(opt)
      })
      this.fundTypeList = options
    },
    async getScheduleListByDeptDoctorPeriod() {
      let res = await apiScheduleTemplate.getScheduleListByDeptDoctorPeriod({
        deptId: this.editRow.deptId,
        doctorId: this.editRow.docId,
        itemId: this.editRow.entryId,
        // startTime: this.editRow.reservationDtime.split('-')[0],
        // endTime: this.editRow.reservationDtime.split('-')[1],
      })
      this.timeList = res.filter(item =>
        dayjs(item.scheduleDate).isAfter(dayjs()),
      )
    },
    //同意/拒绝
    async add(row, state) {
      this.newSchedule = null
      this.objDate = null
      this.getInfo(row.id) //id查详情
      this.rules.remark[0] = { ...this.rules.remark[0], required: !state }
      this.editRow = { ...row, state }
      this.form = {
        approvalResult: state ? 1 : 2, //状态 1同意 2拒绝
        id: row.id,
        refundRel: '', //是否退款
        refundWay: '', //退款方式
        remark: '', //备注
        scheduleDate: '',
        scheduleId: '',
      }
      this.$nextTick(() => {
        this.isAdd = true
      })
    },
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          //参数处理
          if (this.form.approvalResult === 1) {
            this.form.refundRel = this.form.refundWay == 1 ? 2 : 1
          }
          await apiLeaveApproval.agreeOrRefuse(this.form)
          this.$_fetchTableData()
          this.isAdd = false
          this.$message.success('操作成功!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    goto(row) {
      let path = this.$route.path.split('/list')
      this.$router.push(`${path[0]}/patientDetail?patientId=${row.patientId}`)
    },
    handleClose(done) {
      done()
      this.importDialog.visible = false
    },
    async exportData() {
      await apiLeaveApproval.recordExport(this.query)
    },
  },
}
</script>
<style lang="scss" scoped>
.institutionalusers {
  ::v-deep .prepend-select-date {
    width: 140px;
  }
}
::v-deep .c__filter .prepend-select-date .el-input__inner {
  width: 100%;
}
</style>
