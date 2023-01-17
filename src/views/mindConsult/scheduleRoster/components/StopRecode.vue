<template>
  <el-dialog
    :title="type === 1 ? '停诊记录' : '替班记录'"
    :visible.sync="innerVisible"
    :close-on-click-modal="false"
    width="600px"
    @close="close()"
  >
    <div>
      <div class="openContent">
        <span>操作人：</span>
        <div>{{ info.createName || '-' }}</div>
      </div>
      <div class="openContent">
        <span>操作时间：</span>
        <div>{{ info.createTime || '-' }}</div>
      </div>
      <div class="openContent">
        <span>医生：</span>
        <div>{{ info.userName || '-' }} | {{ info.deptName || '-' }}</div>
      </div>
      <div class="openContent">
        <span>班次：</span>
        <div>{{ setWorkSchedule(data) }}</div>
      </div>
      <div class="openContent">
        <span>就诊人：</span>
        <div>{{ setPatientInfo(data) }}</div>
      </div>
      <template v-if="type != 1">
        <div class="openContent">
          <span>替班医生：</span>
          <div>
            {{ info.replaceUserName }} | {{ info.replaceDeptName || '-' }}
          </div>
        </div>
        <div class="openContent">
          <span>替班原因：</span>
          <div>{{ info.replaceRemark || '-' }}</div>
        </div>
      </template>
      <template v-else>
        <div class="openContent">
          <span>延诊时间：</span>
          <div>
            {{
              (info.postponeScheduleDate || '-') +
              ' ' +
              (info.postponeScheduleTime || '')
            }}
          </div>
        </div>
        <div class="openContent">
          <span>停诊原因：</span>
          <div>{{ info.applyRemark || '-' }}</div>
        </div>
      </template>
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
    type: {
      type: Number, //1.停诊记录，2.替班记录
      default: 1,
    },
    data: {
      type: Object,
    },
  },
  data() {
    return {
      info: {},
    }
  },
  watch: {
    show() {
      if (this.show) {
        if (this.type == 1) {
          this.getStop()
        } else {
          this.getReplace()
        }
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
  },
  methods: {
    close(data) {
      this.$emit('onClose', data)
    },
    //获取替班记录
    async getReplace() {
      let res = await apiScheduleTemplate.replaceInquiryList(this.data.id)
      this.info = res[0]
      console.log(this.info)
    },
    //获取停诊记录
    async getStop() {
      let res = await apiScheduleTemplate.stopPageList({
        pageSize: 9999999,
        currentNum: 1,
        scheduleId: this.data.id,
      })
      this.info = res.list[0]
      this.info.userName = this.info.doctor
      this.info.deptName = this.info.dept
      this.info.createName = this.info.applyName
      this.info.createTime = this.info.applyTime
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
  },
}
</script>
<style lang="scss" scoped>
.openContent {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 8px;
  span {
    width: 80px;
  }
  > div {
    flex: 1;
  }
}
</style>
