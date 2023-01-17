<template>
  <div class="view__card work-schedule">
    <TableFilter :data="filter" v-model="query" @change="search"></TableFilter>
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      :row-class-name="tableRowClassName"
      border
      ref="table"
      class="table-wrap"
      height="100%"
    >
      <el-table-column prop="scheduleDate" label="日期" width="130">
        <template slot-scope="{ row }">
          {{ row.scheduleDate }}
          <div>{{ week[dayjs(row.scheduleDate).day()] }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="amount1" label="预约患者" width="210">
        <template slot-scope="{ row }">
          <!-- V1.1 预约患者新样式 -->
          <span v-if="row.reservedVO" size="mini">
            <img :src="setStateImg(row.reservedVO)" class="state-img" />
            {{ row.reservedVO.patientName }} |
            {{ row.reservedVO.phone }}
          </span>
          <span
            v-if="!row.stop && !row.reservedVO && !outTimeOpt(row)"
            @click="openDialog(row, 'isShowSelectPatient')"
            title="添加可预约患者"
            class="add-btn"
          >
            <i class="el-icon-circle-plus-outline" />
          </span>
          <i
            @click="delPatient(row.id)"
            v-if="row.reservedVO && row.reservedVO.status === null"
            class="el-icon-circle-close"
          ></i>
        </template>
      </el-table-column>
      <!-- V1.1 状态 -->
      <el-table-column prop="state" label="状态" width="100">
        <template slot-scope="{ row }">
          <div class="state_wrap">
            <img
              v-if="row.stopId"
              @click="openDialog(row, 'showRecode')"
              src="@/assets/xz_record.png"
            />
            <el-tag
              :type="
                row.locking
                  ? 'warning'
                  : row.stopStatus == 3
                  ? 'danger'
                  : row.stopStatus == 1
                  ? 'success'
                  : 'warning'
              "
              size="mini"
              style="argin-right: 5px"
              >{{
                row.locking ? '锁号中' : stopStatus[row.stopStatus - 1]
              }}</el-tag
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="periodName" label="午别" width="90">
        <template slot-scope="{ row }">
          {{ row.periodName }}
          <img
            class="aloneAdd"
            v-if="row.aloneAdd"
            src="@/assets/addSchedule.png"
          />
          <!-- <div>{{ row.startTime + '~' + row.endTime }}</div> -->
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="90">
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="90">
      </el-table-column>
      <el-table-column prop="roomName" label="咨询室" width="90">
      </el-table-column>

      <el-table-column prop="price" label="价格/元"> </el-table-column>
      <el-table-column prop="adults" label="号源类型" width="150">
        <template slot-scope="{ row }">
          <div class="flex-center">
            <img
              class="aloneAdd"
              style="margin-right: 2px; width: 18px"
              v-if="row.video"
              src="@/assets/video.png"
            />
            <span v-if="row.ageGroup"> {{ ageGroupText(row.ageGroup) }}</span>
            <i
              v-if="!row.stop && !row.reservedVO && !outTimeOpt(row)"
              @click="openAgeGroup(row)"
              class="el-icon-edit"
            ></i></div
        ></template>
      </el-table-column>
      <el-table-column prop="sex" label="适用性别" width="90">
        <template slot-scope="{ row }">
          <span>{{
            row.sex == 9
              ? '通用'
              : row.sex == 1
              ? '男'
              : row.sex == 2
              ? '女'
              : ''
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemName" label="项目名称" min-width="120">
      </el-table-column>
      <el-table-column prop="deptName" label="科室名称" width="90">
      </el-table-column>
      <el-table-column prop="amount1" label="操作" fixed="right" width="105">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.stopStatus == 1"
            type="text"
            :disabled="
              outTimeOpt(row) ||
              (row.reservedVO &&
                row.reservedVO.visitState &&
                row.reservedVO.visitState != 1)
            "
            @click="openDialog(row, 'isCloseApply')"
            >停诊</el-button
          >
          <el-button
            v-if="row.stopStatus == 2"
            type="text"
            :disabled="outTimeOpt(row)"
            @click="withdraw(row)"
            >撤回申请</el-button
          >
          <el-button
            v-if="!row.stop && !row.reservedVO && !outTimeOpt(row)"
            type="text"
            @click="lockNo(row)"
            >{{ row.locking ? '解锁' : '锁号' }}</el-button
          >
          <!-- visitState就诊状态(1.待就诊 2.就诊中 3.已结束,4.已爽约)   status预约单状态（null.待支付 1.已预约 2.已请假 3.请假中 4.已关闭）-->
          <el-button
            v-if="!row.stop && row.reservedVO"
            type="text"
            :disabled="
              row.reservedVO.visitState != 1 || row.reservedVO.status != 1
            "
            @click="openDialog(row, 'isChangeChedule')"
            >{{ '改期' }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px">
      <el-button type="primary" @click="goto">加号</el-button>
    </div>
    <!--添加可预约患者-->
    <SelectPatient
      :show="isShowSelectPatient"
      :data="rowData"
      @onClose="data => closeDialog(data, 'isShowSelectPatient')"
    ></SelectPatient>
    <!-- 停诊申请 -->
    <CloseDiagnosis
      :show="isCloseApply"
      :data="rowData"
      type="apply"
      @onClose="data => closeDialog(data, 'isCloseApply')"
    >
    </CloseDiagnosis>
    <!--停诊替诊记录-->
    <applyRecode
      :show="showRecode"
      :data="rowData"
      @onClose="data => closeDialog(data, 'showRecode')"
    >
    </applyRecode>
    <!-- 更改号源类型 -->
    <EditAgeGroup
      :show="isOpenEditAgeGroup"
      :data="rowData"
      @onClose="data => closeDialog(data, 'isOpenEditAgeGroup')"
    />
    <!-- 改期 -->
    <ChangesChedule
      :show="isChangeChedule"
      :data="rowData"
      @onClose="data => closeDialog(data, 'isChangeChedule')"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import ChangesChedule from './components/changesChedule.vue'
import TableFilter from '@/components/TableFilter'
import EditAgeGroup from './components/editAgeGroup.vue'
import SelectPatient from '../scheduleRoster/components/SelectPatient'
import CloseDiagnosis from '../scheduleRoster/components/CloseDiagnosis'
import apiScheduleTemplate from '@/api/mindConsult/scheduleTemplate'
import apiProjectSet from '@/api/mindConsult/projectSet'
import paidImg from '@/assets/xz_paid.png'
import nopayImg from '@/assets/xz_nopay.png'
import askleaveImg from '@/assets/xz_askleave.png'
import applyRecode from './components/applyRecode.vue'
import { deptXzChooseList } from '@/api/index'

const pre = {
  itemList: [],
  deptList: [],
}
let pickerOptions = {
  shortcuts: [
    {
      text: '今日',
      onClick(picker) {
        const end = new Date()
        end.setTime(end.getTime() - 1000)
        const start = new Date()
        start.setTime(start.getTime() - 1000)
        picker.$emit('pick', [start, end])
      },
    },
    {
      text: '明日',
      onClick(picker) {
        const end = new Date()
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
        const start = new Date()
        start.setTime(start.getTime() + 3600 * 1000 * 24 * 1)
        picker.$emit('pick', [start, end])
      },
    },
  ],
}
export default {
  components: {
    TableFilter,
    SelectPatient,
    CloseDiagnosis,
    applyRecode,
    EditAgeGroup,
    ChangesChedule,
  },
  data() {
    return {
      isOpenEditAgeGroup: false, //编辑号源类型弹窗控制属性
      // V1.1
      paidImg, //已付款图标
      nopayImg, //代付款图标
      askleaveImg, //请假图标
      filter: {
        date: {
          props: {
            options: [{ label: '日期', value: 0 }],
            type: 'daterange',
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            pickerOptions: pickerOptions,
          },
          keys: ['timeType', 'startDate', 'endDate'],
        },
        popover: [
          {
            props: {
              label: '项目',
              options: pre.itemList.map(_ => {
                return {
                  label: _.name,
                  value: _.id,
                }
              }),
            },
            data: {
              attrs: {
                clearable: true,
                filterable: true,
              },
            },
            keys: 'itemId',
          },
          {
            props: {
              label: '关键字',
              is: 'el-input',
            },
            data: {
              attrs: {
                placeholder: '患者姓名/就诊卡号/手机号/项目名称',
              },
            },
            keys: 'keywords',
          },
          {
            props: {
              label: '是否预约',
              options: [
                { label: '全部', value: '' },
                { label: '已预约', value: true },
                { label: '未预约', value: false },
              ],
            },
            keys: 'reserved',
          },
          {
            props: {
              label: '科室',
              options: pre.deptList.map(_ => {
                return {
                  label: _.showName,
                  value: _.id,
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
        ],
      },
      isShowSelectPatient: false,
      isCloseApply: false,
      isChangeChedule: false,
      query: {
        timeType: 0,
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
      },
      tableData: [],
      rowData: null,
      week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      showRecode: false,
      recodeType: 1,
      stopStatus: ['正常', '停诊申请中', '已停诊'],
    }
  },
  async beforeRouteEnter(to, from, next) {
    let res = await apiProjectSet.itemList({
      currentNum: 1,
      pageSize: 9999999,
    })
    pre.itemList = res.list
    pre.deptList = await deptXzChooseList()
    next(vm => {
      console.log(vm.$store.state.user)
    })
  },
  mounted() {
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
    openAgeGroup(row) {
      this.isOpenEditAgeGroup = true
      this.rowData = row
    },
    ageGroupText(ageGroup) {
      if (ageGroup.split(',').length === 3) return '通用'
      const types = {
        1: '儿童',
        2: '青少年',
        3: '成人',
      }
      return ageGroup
        .split(',')
        .map(v => types[v])
        .join('、')
    },
    dayjs,
    //过期的排班不能操作
    outTimeOpt(row) {
      if (
        dayjs().isAfter(dayjs(row.scheduleDate + ' ' + row.endTime + ':00'))
      ) {
        return true
      } else {
        return false
      }
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
    withdraw(row) {
      console.log(row)
      this.$confirm('确定要撤回申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await apiScheduleTemplate.stopWithdraw({ stopId: row.stopId })
        this.getList()
        this.$message({
          type: 'success',
          message: '操作成功!',
        })
      })
    },
    //打开弹窗
    openDialog(data, type) {
      console.log('applyItem:', data)
      if (
        type == 'isCloseApply' &&
        data.reservedVO &&
        data.reservedVO.status == 3
      ) {
        this.$message.warning('请先处理请假审批，处理完再来申请停诊！')
        return false
      }
      this.rowData = data
      this[type] = true
    },
    //关闭弹窗
    closeDialog(data, type) {
      this[type] = false
      if (data) {
        this.getList()
      }
      this.rowData = null
    },
    search() {
      this.getList()
    },
    flitterData(arr) {
      let spanOneArr = []
      let spanTwoArr = []
      let concatOne = 0
      let concatTwo = 0
      arr.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1)
          spanTwoArr.push(1)
        } else {
          if (item.scheduleDate === arr[index - 1].scheduleDate) {
            //第一列需合并相同内容的判断条件
            spanOneArr[concatOne] += 1
            spanOneArr.push(0)
          } else {
            spanOneArr.push(1)
            concatOne = index
          }
          if (item.scheduleDate === arr[index - 1].scheduleDate) {
            //第二列需合并相同内容的判断条件
            spanTwoArr[concatTwo] += 1
            spanTwoArr.push(0)
          } else {
            spanTwoArr.push(1)
            concatTwo = index
          }
        }
      })
      return {
        one: spanOneArr,
        two: spanTwoArr,
      }
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.flitterData(this.tableData).one[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col,
        }
      }
    },
    async getList() {
      let res = await apiScheduleTemplate.myWorkSchedule({
        ...this.query,
        keywords: null,
        // startDate: this.query.startDate || dayjs().format('YYYY-MM-DD'),
      })
      let list = []
      res.forEach(item => {
        item.scheduleDetailList.forEach(s => {
          list.push({
            ...s,
          })
        })
      })
      var reg = new RegExp(this.query.keywords)
      this.tableData = list.filter(item =>
        item.reservedVO
          ? reg.test(item.reservedVO.patientName) ||
            reg.test(item.reservedVO.phone) ||
            reg.test(item.reservedVO.cardNo) ||
            reg.test(item.itemName)
          : reg.test(item.itemName),
      )
      this.$nextTick(() => {
        this.$refs.table.doLayout()
      })
    },
    // 已停诊置灰色
    tableRowClassName({ row }) {
      if (row.stop) return 'row-stop'
      return ''
    },
    // V1.1
    // 设置状态图标
    setStateImg(data) {
      if (data.status === null) return nopayImg
      if (data.status == 3) return askleaveImg
      if (data.status == 1) return paidImg
    },
    goto() {
      this.$router.push('/mindConsult/workSchedule/supplement?type=2')
    },
  },
}
</script>

<style lang="scss" scoped>
.work-schedule {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 85px);
  .table-wrap {
    flex: 1;
    width: 100%;
    will-change: height;
    .aloneAdd {
      width: 18px;
    }
    .cell .el-tag {
      margin-left: 0;
      margin-top: 5px;
      word-break: break-all;
      margin-left: 0;
      margin-top: 5px;
      white-space: normal;
      height: auto;
    }
    .cell .el-tag:nth-child(1) {
      margin-top: 0px;
    }
    .state_wrap {
      display: flex;
      align-items: center;
      img {
        width: 18px;
        margin-right: 5px;
        cursor: pointer;
      }
    }
  }
  .add-btn {
    font-size: 20px;
    color: #0ab2c1;
    cursor: pointer;
  }
  .state-img {
    width: 18px;
    height: 18px;
    vertical-align: text-top;
  }
  ::v-deep .el-table .row-stop {
    color: #c2c2c2;
  }
}
.flex-center {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.el-icon-circle-close {
  cursor: pointer;
}
.el-icon-edit {
  color: #0ab2c1;
  margin-left: 3px;
  cursor: pointer;
}
</style>
