<template>
  <el-dialog
    :title="`排班模板-${data.scheduleName}`"
    :visible.sync="innerVisible"
    :close-on-click-modal="false"
    width="900px"
  >
    <div class="info">
      <div>
        {{ data.userName }} | {{ data.titleName }} | {{ data.deptName }}
      </div>
      <div>{{ weekDayName }}{{ data.periodName }}</div>
    </div>
    <el-table :data="tableData" border style="height: 50vh; width: 100%">
      <el-table-column prop="startTime" label="开始时间" width="180">
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间"> </el-table-column>
      <el-table-column prop="itemName" label="项目名称"> </el-table-column>
      <el-table-column prop="price" label="价格/元"> </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import apiScheduleTemplate from '@/api/mindConsult/scheduleTemplate'
import schedulData from '../base'
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
      tableData: [],
    }
  },
  watch: {
    show() {
      if (this.show) {
        console.log(this.data)
        this.doctorWeekDayScheduleList()
      }
    },
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
    weekDayName() {
      return schedulData.weekData.find(item => item.value === this.data.weekDay)
        ?.label
    },
  },
  methods: {
    close() {
      console.log(1111)
      this.$emit('onClose')
    },
    async doctorWeekDayScheduleList() {
      let res = await apiScheduleTemplate.doctorWeekDayScheduleList({
        deptId: this.data.deptId,
        scheduleId: this.data.scheduleId,
        userId: this.data.userId,
        weekDay: this.data.weekDay,
      })
      this.tableData = res
    },
  },
}
</script>
<style lang="scss" scoped>
.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -10px;
  margin-bottom: 20px;
}
</style>
