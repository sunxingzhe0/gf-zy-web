<template>
  <div class="list-day">
    <DateLine
      :tiemDatas="tiemDatas"
      :active="currentDate"
      @onchange="changeDate"
    ></DateLine>
    <div class="all-num">
      <div>
        <span>排班科室：{{ scheduleNum.deptNum }} </span
        ><span>排班人数：{{ scheduleNum.doctorNum }}人</span>
      </div>
    </div>
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      :row-class-name="tableRowClassName"
      border
      class="table-wrap"
    >
      <el-table-column
        prop="deptName"
        label="科室"
        min-width="100"
      ></el-table-column>
      <el-table-column prop="userName" label="医生" min-width="100">
      </el-table-column>
      <el-table-column prop="amount1" label="预约患者" min-width="200">
        <template slot-scope="{ row }">
          <span v-if="row.reservedVO" size="mini">
            <img :src="setStateImg(row.reservedVO)" class="state-img" />
            {{ row.reservedVO.patientName }} |
            {{ row.reservedVO.phone }}
          </span>
          <span
            v-if="!row.stop && !row.reservedVO && !outTimeOpt(row)"
            @click="openCloseDiagnosis(row, 'isShowSelectPatient')"
            title="添加预约患者"
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
      <!-- V1.1 -->
      <el-table-column prop="state" label="状态" min-width="120">
        <template slot-scope="{ row }">
          <div class="state_wrap">
            <img
              v-if="row.stopId"
              @click="openCloseDiagnosis(row, 'showRecode', 1)"
              src="@/assets/xz_record.png"
            />
            <img
              v-if="row.substitute"
              @click="openCloseDiagnosis(row, 'showRecode', 2)"
              src="@/assets/xz_substituteRecord.png"
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
      <el-table-column prop="periodName" label="午别">
        <template slot-scope="{ row }">
          {{ row.periodName }}

          <img
            class="aloneAdd"
            v-if="row.aloneAdd"
            src="@/assets/addSchedule.png"
          />
          <div>{{ row.startTime + '~' + row.endTime }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" min-width="90">
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" min-width="90">
      </el-table-column>
      <el-table-column prop="roomName" label="咨询室" min-width="90">
      </el-table-column>
      <el-table-column prop="price" label="价格/元"> </el-table-column>
      <el-table-column prop="adults" label="号源类型" min-width="150">
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
      <el-table-column prop="amount1" width="150" fixed="right" label="操作">
        <template slot-scope="{ row }">
          <!-- stopStatus停诊状态 1:正常/2:停诊申请中/3:同意  -->
          <el-button
            v-if="row.stopStatus == 1"
            type="text"
            :disabled="
              outTimeOpt(row) ||
              (row.reservedVO &&
                row.reservedVO.visitState &&
                row.reservedVO.visitState != 1)
            "
            @click="openCloseDiagnosis(row, 'isShowClose')"
            >停诊</el-button
          >
          <el-button
            type="text"
            v-if="!row.substitute && row.stopStatus != 3"
            :disabled="
              outTimeOpt(row) ||
              (row.reservedVO &&
                row.reservedVO.visitState &&
                row.reservedVO.visitState != 1)
            "
            @click="openCloseDiagnosis(row, 'isShowSubsitute')"
            >替班</el-button
          >
          <el-button
            v-if="!row.stop && !row.reservedVO && !outTimeOpt(row)"
            type="text"
            @click="lockNo(row)"
            >{{ row.locking ? '解锁' : '锁号' }}</el-button
          >
          <el-button
            v-if="!row.stop && row.reservedVO"
            type="text"
            :disabled="
              row.reservedVO.visitState != 1 || row.reservedVO.status != 1
            "
            @click="openCloseDiagnosis(row, 'isChangeChedule')"
            >{{ '改期' }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
    <!-- 更改号源类型 -->
    <EditAgeGroup
      :show="isOpenEditAgeGroup"
      :data="rowData"
      @onClose="data => closeDiangnosis(data, 'isOpenEditAgeGroup')"
    />
    <!-- 改期 -->
    <ChangesChedule
      :show="isChangeChedule"
      :data="rowData"
      @onClose="data => closeDiangnosis(data, 'isChangeChedule')"
    />
  </div>
</template>
<script>
import ChangesChedule from '../../workSchedule/components/changesChedule.vue'
import EditAgeGroup from '../../workSchedule/components/editAgeGroup.vue'
import DateLine from './DateLine'
import CloseDiagnosis from './CloseDiagnosis'
import Subsitute from './Substitute'
import SelectPatient from './SelectPatient'
import dayjs from 'dayjs'
import schedulData from '../../scheduleTemplate/base'
import apiScheduleTemplate from '@/api/mindConsult/scheduleTemplate'
import StopRecode from './StopRecode.vue'
import paidImg from '@/assets/xz_paid.png'
import nopayImg from '@/assets/xz_nopay.png'
import askleaveImg from '@/assets/xz_askleave.png'

export default {
  components: {
    DateLine,
    CloseDiagnosis,
    Subsitute,
    SelectPatient,
    StopRecode,
    EditAgeGroup,
    ChangesChedule,
  },
  props: {
    query: {
      type: Object,
    },
  },
  data() {
    return {
      isChangeChedule: false,
      isOpenEditAgeGroup: false,
      tiemDatas: [],
      currentDate: '',
      tableData: [],
      isShowClose: false,
      isShowSubsitute: false,
      isShowSelectPatient: false,
      statistics: [],
      rowData: null,
      // V1.1
      paidImg, //已付款图标
      nopayImg, //代付款图标
      askleaveImg, //请假图标
      recodeType: 1,
      showRecode: false,
      stopStatus: ['正常', '停诊申请中', '已停诊'],
    }
  },
  computed: {
    scheduleNum() {
      let item = this.statistics.find(
        t => t.scheduleDate.split(' ')[0] === this.currentDate,
      )
      return {
        deptNum: item?.deptNum || 0,
        doctorNum: item?.doctorNum || 0,
      }
    },
  },
  async mounted() {
    if (!this.query.startDate && !this.query.endDate) {
      await this.getStatistics(
        dayjs().format('YYYY-MM-DD'),
        dayjs().add(30, 'day').format('YYYY-MM-DD'),
      )
    } else {
      await this.getStatistics()
    }
    await this.getList()
  },
  watch: {
    query: {
      async handler() {
        if (!this.query.startDate && !this.query.endDate) {
          await this.getStatistics(
            dayjs().format('YYYY-MM-DD'),
            dayjs().add(30, 'day').format('YYYY-MM-DD'),
          )
        } else {
          await this.getStatistics()
        }

        this.getList()
      },
      deep: true,
    },
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
    getalldays() {
      var arr = []
      var ab = (this.query?.startDate
        ? this.query.startDate
        : dayjs().format('YYYY-MM-DD')
      ).split('-')
      var ae = (this.query?.endDate
        ? this.query.endDate
        : dayjs().add(30, 'day').format('YYYY-MM-DD')
      ).split('-')
      var db = new Date()
      let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
      var de = new Date()
      de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
      var unixDb = db.getTime() - 24 * 60 * 60 * 1000
      var unixDe = de.getTime() - 24 * 60 * 60 * 1000
      for (var k = unixDb; k <= unixDe; ) {
        k = k + 24 * 60 * 60 * 1000
        let disable = this.statistics.filter(
          item =>
            item.scheduleDate.split(' ')[0] ===
            dayjs(new Date(parseInt(k))).format('YYYY-MM-DD'),
        )
        arr.push({
          title: dayjs(new Date(parseInt(k))).format('YYYY-MM-DD'),
          desc: week[dayjs(new Date(parseInt(k))).day()],
          disable: disable.length === 0 ? true : false,
          value: schedulData.weekData.find(
            item => item.label === week[dayjs(new Date(parseInt(k))).day()],
          ).value,
        })
      }
      this.tiemDatas = arr
      this.currentDate = arr[0].title
      console.log(this.tiemDatas)
    },
    //过期的排班不能操作
    outTimeOpt(row) {
      if (
        dayjs().isAfter(dayjs(this.currentDate + ' ' + row.endTime + ':00'))
      ) {
        return true
      } else {
        return false
      }
    },

    openCloseDiagnosis(data, type, opt) {
      console.log('data:', data)
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
        // this.getStatistics()
        this.getList()
      }
      this.rowData = null
      this[type] = false
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = schedulData.flitterData(this.tableData).one[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col,
        }
      }
      if (columnIndex === 1) {
        const _row = schedulData.flitterData(this.tableData).two[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col,
        }
      }
    },
    changeDate(e) {
      this.currentDate = e.title
      this.getList()
    },
    async getStatistics(startDate, endDate) {
      let res = await apiScheduleTemplate.statistics({
        ...this.query,
        startDate: startDate ? startDate : this.query?.startDate,
        endDate: endDate ? endDate : this.query?.endDate,
      })
      this.statistics = res
      this.getalldays()
    },
    async getList() {
      let res = await apiScheduleTemplate.doctorScheduleTree({
        deptId: this.query.deptId,
        userId: this.query.userId,
        // keywords: this.query.keywords,
        scheduleDate: this.currentDate,
      })
      let list = []
      res.forEach(item => {
        item.userList.forEach(t => {
          if (t.scheduleDetailList && t.scheduleDetailList.length > 0) {
            t.scheduleDetailList.forEach(s => {
              let obj = {
                ...item,
                ...t,
                ...s,
                deptName: item.deptName,
                userName: t.userName,
              }
              list.push(obj)
            })
          }
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
  },
}
</script>
<style lang="scss" scoped>
.list-day {
  display: flex;
  flex-direction: column;
  /* will-change: height; */
  height: 100%;
  .all-num {
    font-size: 14px;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
    span {
      margin-right: 30px;
    }
  }
  .table-wrap {
    flex: 1;
    width: 100%;
    will-change: height;
    height: 100%;
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
  .state-img {
    width: 18px;
    height: 18px;
    vertical-align: text-top;
  }
  .add-btn {
    font-size: 20px;
    color: #0ab2c1;
    cursor: pointer;
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
.el-icon-edit {
  color: #0ab2c1;
  margin-left: 3px;
  cursor: pointer;
}
</style>
