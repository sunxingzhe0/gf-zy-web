<template>
  <el-dialog
    title="申请记录"
    :visible.sync="innerVisible"
    :close-on-click-modal="false"
    width="600px"
    @close="close()"
  >
    <div class="block">
      <el-timeline>
        <el-timeline-item
          timestamp=""
          placement="top"
          v-for="item in list"
          :key="item.id"
        >
          <el-card>
            <div class="applyItem">
              <span>申请人：{{ item.applyName || '-' }}</span>
              <span>申请时间：{{ item.applyTime || '-' }}</span>
            </div>
            <div class="applyItem">
              <span>审核人：{{ item.auditName || '-' }}</span>
              <span>审核时间：{{ item.auditTime || '-' }}</span>
            </div>
            <div class="applyItem">
              <div class="openContent">
                <span>审核结果：</span>
                <div>
                  {{
                    item.auditResult == true
                      ? '同意'
                      : item.auditResult == false
                      ? '拒绝'
                      : ''
                  }}
                  {{ item.auditRemark ? `| ${item.auditRemark}` : '' }}
                </div>
              </div>

              <el-button type="text" @click="open(item)">{{
                item.isOpen ? '收起' : '展开'
              }}</el-button>
            </div>
            <div
              class="content-wrap"
              :style="item.isOpen ? 'height:auto' : 'height:0px'"
            >
              <div class="openContent">
                <span>就诊人：</span>
                <div>
                  {{
                    item.cardNo
                      ? `[${item.cardNo}]${item.patientName} | ${item.gender} | ${item.phones}`
                      : '-'
                  }}
                </div>
              </div>
              <div class="openContent">
                <span>工作日程：</span>
                <div>
                  {{ item.itemName }} | {{ item.scheduleDate }}
                  {{ item.scheduleTime }} | ￥{{ item.price }}
                </div>
              </div>
              <div class="openContent">
                <span>顺延时间：</span>
                <div>
                  {{
                    item.postponeScheduleDate
                      ? `${item.itemName} | ${item.postponeScheduleDate} ${item.postponeScheduleTime} | ${item.price}`
                      : '-'
                  }}
                </div>
              </div>
              <div class="openContent">
                <span>停诊原因：</span>
                <div>{{ item.applyRemark }}</div>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
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
      list: [],
    }
  },
  watch: {
    show() {
      if (this.show) {
        this.getStop()
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
    open(item) {
      this.$set(item, 'isOpen', !item.isOpen)
    },
    //获取停诊记录
    async getStop() {
      let res = await apiScheduleTemplate.stopPageList({
        pageSize: 9999999,
        currentNum: 1,
        scheduleId: this.data.id,
      })
      this.list = res.list
    },
    close(data) {
      this.$emit('onClose', data)
    },
  },
}
</script>
<style lang="scss" scoped>
.applyItem {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.content-wrap {
  height: 0px;
  overflow: hidden;
}
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
