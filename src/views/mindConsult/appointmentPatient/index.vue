<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_name="{ row }">
        <span>{{ row.name }}</span>
        <span v-if="row.severePatient" class="color-red">{{ '重精' }}</span>
        <span v-if="row.riskReport" class="color-org">{{ '报告' }}</span>
      </template>
      <template v-slot:footertool>
        <el-button type="primary" @click="goto('supplement')"> 补录 </el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button
          v-if="row.visitState == 2"
          type="text"
          @click="cancelVisit(row)"
        >
          取消接诊
        </el-button>
        <el-button
          type="text"
          v-if="row.visitState == 2"
          @click="finishOpen(row, true)"
        >
          结束
        </el-button>
        <!-- 临时调整2022-10-19  接诊按钮权限  原：  v-if="row.visitState == 1 && !query.doctorId"-->
        <el-button type="text" v-if="row.visitState == 1" @click="treated(row)">
          接诊
        </el-button>
        <el-button
          type="text"
          v-if="row.visitState == 1"
          @click="openDialog(row)"
        >
          爽约
        </el-button>
        <template>
          <el-button
            type="text"
            v-if="row.visitState == 2 && query.doctorId"
            @click="goto('enterInfo', row)"
          >
            录入
          </el-button>
          <el-button
            type="text"
            v-if="row.visitState == 3"
            @click="goto('receptionRecord', row)"
          >
            接诊记录
          </el-button>
        </template>
      </template>
    </List>
    <Finish :data="rowData" :show="showFinish" @onClose="finishClose"></Finish>
    <el-dialog
      :modal-append-to-body="false"
      title="爽约"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div class="title-dialog">备注：</div>
      <el-input
        type="textarea"
        autosize
        :rows="2"
        placeholder="请输入内容"
        v-model="textarea"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click=";(dialogVisible = false), (textarea = '')"
          >取 消</el-button
        >
        <el-button type="primary" @click="confirmSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import apiXzPatient from '@/api/mindConsult/appointmentPatient'
import apiProjectSet from '@/api/mindConsult/projectSet'
import Finish from './components/Finish.vue'
import dayjs from 'dayjs'
import { deptXzChooseList } from '@/api/index'

let pre = {
  itemList: [],
  deptList: [],
}
export default {
  name: 'mindConsult_appointmentPatient',
  components: {
    List,
    Finish,
  },
  mixins: [mixin({ fetchListFunction: apiXzPatient.reservedList })],
  data() {
    this.filter = {
      date: {
        props: {
          options: [{ label: '预约日期', value: 0 }],
        },
        keys: ['timeType', 'reservedStartTime', 'reservedEndTime'],
      },
      inline: [
        {
          props: {
            label: '关键字',
            is: 'el-input',
          },
          data: {
            attrs: {
              placeholder: '患者ID/就诊卡号/名称/身份证号/联系电话/家庭地址',
            },
          },
          keys: 'keywords',
        },
        {
          props: {
            label: '项目',
            is: 'el-select',
            options: pre.itemList.map(_ => {
              return {
                label: _.name,
                value: _.id,
              }
            }),
          },
          keys: 'itemId',
        },
        {
          props: {
            label: '状态',
            is: 'el-select',
            options: [
              { label: '不限', value: '' },
              { label: '待就诊', value: 1 },
              { label: '就诊中', value: 2 },
              { label: '已结束', value: 3 },
              { label: '已爽约', value: 4 },
            ],
          },
          keys: 'status',
        },
        {
          props: {
            label: '',
            is: 'el-checkbox',
          },
          data: {
            attrs: {
              label: '仅看超时的',
            },
            on: {
              change: e => {
                this.query.endTimeout = e ? e : null
              },
            },
          },

          keys: 'endTimeout',
        },
        {
          props: {
            label: '',
            is: 'el-checkbox',
          },
          data: {
            attrs: {
              label: '仅看补录的',
            },
            on: {
              change: e => {
                this.query.inputState = e ? e : null
              },
            },
          },

          keys: 'inputState',
        },
        {
          props: {
            label: '',
            is: 'el-checkbox',
          },
          data: {
            attrs: {
              label: '仅看重精患者',
            },
            on: {
              change: e => {
                this.query.severePatient = e ? e : null
              },
            },
          },

          keys: 'severePatient',
        },
        {
          props: {
            label: '',
            is: 'el-checkbox',
          },
          data: {
            attrs: {
              label: '仅看有风险报告的',
            },
            on: {
              change: e => {
                this.query.riskReport = e ? e : null
              },
            },
          },

          keys: 'riskReport',
        },
      ],
    }
    return {
      query: {
        pageSize: 10,
        timeType: 0,
        endTimeout: null,
        inputState: null,
        severePatient: null, //仅重精患者
        riskReport: null, //仅看风险报告
        reservedStartTime: dayjs().format('YYYYMMDD') + '000000',
        reservedEndTime: dayjs().format('YYYYMMDD') + '235959',
        doctorId:
          this.$route.path === '/mindConsult/appointmentPatient/list'
            ? this.$store.state.user.userId
            : null,
      },
      rowData: null,
      showFinish: false,
      textarea: '',
      dialogVisible: false,
      //新增筛选条件
      newFilter: [
        {
          props: {
            label: '科室',
            is: 'el-select',
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
  computed: {
    columns() {
      return {
        patientId: {
          minWidth: 130,
        },
        index: {
          hidden: true,
        },
        name: {
          prop: 'slot_name',
          minWidth: 150,
        },

        visitState: {
          formatter(row) {
            return row.visitState == 1
              ? '待就诊'
              : row.visitState == 2
              ? '就诊中'
              : row.visitState == 3
              ? '已结束'
              : row.visitState == 4
              ? '已爽约'
              : '-'
          },
        },
        sex: {
          width: 50,
          formatter(row) {
            return row.sex ? '男' : '女'
          },
        },
        birthday: {
          minWidth: 90,
          formatter(row) {
            return row.birthday.split(' ')[0]
          },
        },
        idCard: {
          minWidth: 120,
        },
        phone: {
          minWidth: 120,
        },
        scheduleDate: {
          minWidth: 100,
        },
        itemName: {
          minWidth: 120,
        },
        reservedTime: {
          minWidth: 140,
        },
        periodName: {
          minWidth: 50,
        },
        fixed: {
          minWidth: 180,
        },
      }
    },
  },
  watch: {
    $route(to, from) {
      console.log(from)
      const formPath = from.path
      if (formPath === '/mindConsult/appointmentPatient/list') {
        this.init()
        this.addFilter()
      }
      if (formPath === '/mindConsult/allAppointmentPatient/list') {
        this.init()
        this.filter.inline = this.oldFilter
      }
    },
  },
  async beforeRouteEnter(to, from, next) {
    let res = await apiProjectSet.itemList({
      currentNum: 1,
      pageSize: 9999999,
    })
    pre.itemList = res.list
    pre.deptList = await deptXzChooseList()
    next()
  },
  created() {
    //保存初始筛选条件
    this.oldFilter = JSON.parse(JSON.stringify(this.filter.inline))
    this.addFilter()
  },
  methods: {
    //是否新增筛选条件
    addFilter() {
      if (this.$route.path !== '/mindConsult/appointmentPatient/list') {
        this.filter.inline = [...this.filter.inline, ...this.newFilter]
      }
    },
    //取消接诊
    cancelVisit(row) {
      console.log(row)
      this.$confirm('确认取消接诊该患者?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await apiXzPatient.cancelAccept(row.id)
        this.$_fetchTableData()
        this.$message.success('操作成功！')
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.textarea = ''
    },
    openDialog(row) {
      this.rowData = row
      this.dialogVisible = true
    },
    //爽约
    async confirmSubmit() {
      await apiXzPatient.brokePromise({ id: this.rowData.id })
      this.$message.success('操作成功')
      this.dialogVisible = false
      this.init()
    },
    init() {
      this.query = {
        pageSize: 10,
        timeType: 0,
        doctorId:
          this.$route.path === '/mindConsult/appointmentPatient/list'
            ? this.$store.state.user.userId
            : null,
        reservedStartTime: dayjs().format('YYYYMMDD') + '000000',
        reservedEndTime: dayjs().format('YYYYMMDD') + '235959',
      }
      console.log(this.query)
    },
    $_resolveRowClassName({ row }) {
      return row.endTimeout && (row.visitState == 2 || row.visitState == 1)
        ? 'overtime'
        : ''
    },

    goto(url, row) {
      this.$router.push(
        this.$route.path === '/mindConsult/appointmentPatient/list'
          ? `/mindConsult/appointmentPatient/${url}?id=${
              row ? row.id : ''
            }&type=1`
          : `/mindConsult/allAppointmentPatient/${url}?id=${
              row ? row.id : ''
            }&type=1&all=true`,
      )
    },
    //接诊
    treated(row) {
      // let time = dayjs().isBefore(
      //   dayjs(
      //     row.scheduleDate + ' ' + row.reservedTime.split('-')[0] + ':00',
      //   ).subtract(10, 'minute'),
      // )
      // if (time) {
      //   return this.$message.warning('还未到接诊时间，请稍后再试。')
      // }
      this.$confirm('确认接诊该患者?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await apiXzPatient.acceptVisit(row.id)
        this.$_fetchTableData()
        this.$message.success('操作成功！')
      })
    },
    finishOpen(row) {
      this.rowData = row
      this.showFinish = true
    },
    finishClose(refresh) {
      if (refresh) {
        this.$_fetchTableData()
      }
      this.showFinish = false
      this.rowData = null
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_modules-detail.scss';
::v-deep .el-table {
  .overtime {
    background: #fef0f0;
  }
  .red-color {
    .cell {
      color: red;
    }
  }
}
::v-deep .el-table {
  .red-row {
    background: #fef0f0;
  }
}
::v-deep .c_filter_left {
  .c__filter_item:nth-child(5),
  .c__filter_item:nth-child(6),
  .c__filter_item:nth-child(7),
  .c__filter_item:nth-child(8) {
    width: 150px;
    .item-label {
      width: 0;
      min-width: 0;
    }
  }
  /* .c__filter_item:nth-child(6) {
    position: absolute;
    top: 40px;
  } */
}
.color-red {
  color: #f74a4a;
  background: rgba(247, 74, 74, 0.15);
  font-size: 12px;
  padding: 2px 4px;
}
.color-org {
  color: #ff6600;
  background: rgba(247, 74, 74, 0.15);
  font-size: 12px;
  padding: 2px 4px;
}
.dialog-footer {
  margin-top: 10px;
}
.title-dialog {
  margin-bottom: 20px;
}
</style>
