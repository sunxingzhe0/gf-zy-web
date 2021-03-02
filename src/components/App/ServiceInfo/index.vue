<template>
  <div class="app-info">
    <BlockTitle>服务信息</BlockTitle>
    <div class="app-info-row" v-for="(item, index) in rows" :key="index">
      <div class="app-info-item">
        <div class="app-info-label"></div>
        <div class="app-info-value">
          <template v-if="index === 0">
            <span>{{ business.doctorName }}</span>
            <span> {{ business.memberSex === 0 ? '女' : '男' }}</span>
          </template>
          <template v-if="index === 1">
            <span style="margin-right: 10px">{{ business.deptName }}</span>
            <span style="margin-right: 10px">{{ business.titleName }}</span>
            <span style="margin-right: 10px">{{ business.orgName }}</span>
          </template>
          <template v-if="index === 2">
            <span>擅长：{{ business.skilled }}</span>
          </template>
        </div>
      </div>

      <div class="app-info-item"></div>
    </div>
    <div class="app-info-row" v-for="(item, index) in rows" :key="index">
      <div class="app-info-item">
        <div class="app-info-label">
          {{ index === 0 ? '关联处方' : '' }}
        </div>
        <div class="app-info-value">
          <router-link
            v-if="rpList[index] && rpList[index].id"
            :to="'/business/prescription/detail/' + rpList[index].id"
          >
            <span>{{ rpList[index].id }}</span>
            <el-button
              type="text"
              @click.stop.prevent=""
              v-clipboard:error="copyFailed"
              v-clipboard:success="copySuccess"
              v-clipboard:copy="rpList[index].id"
            >
              复制
            </el-button>
          </router-link>
        </div>
      </div>
    </div>
    <el-image :src="FILE_URL(business.avatar)">
      <img slot="error" class="image-slot" src="@/assets/headerImg.png" />
    </el-image>
  </div>
</template>
<script>
/*
@author     qiang
@name       ServiceInfo
@desc       订单信息组件【服务信息】
@props      orderId     string      业务订单id
            business    object      业务参数
@emit       none
@api        https://gitee.com/gftech_team/dashboard/programs/102514/docs/gftech_team%2Fhlwyy?doc_id=750580&sort_id=2415595
*/
import { curPre } from '@/api/prescription'
import { BlockTitle } from '@/components/Base'
export default {
  name: 'ServiceInfo',
  components: {
    BlockTitle,
  },
  props: {
    orderId: {
      type: String,
      default: '',
    },
    business: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    rows() {
      let count = this.rpList.length > 3 ? this.rpList.length : 3
      return new Array(count).fill(0)
    },
  },
  data() {
    return {
      rpList: [],
    }
  },
  methods: {
    // 获取本次处方
    async getCurrentRpInfo() {
      if (!this.orderId) return
      const res = await curPre({ orderId: this.orderId })
      this.rpList = res || []
    },
    copyFailed() {
      this.$message.error('复制失败！')
    },
    copySuccess() {
      this.$message.success('复制成功！')
    },
  },
  watch: {
    orderId: {
      handler(val) {
        if (val) this.getCurrentRpInfo()
      },
      immediate: true,
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';
.app-info {
  position: relative;
}
.app-info-value {
  a {
    height: 16px;
    display: flex;
    line-height: 16px;
    align-items: center;
    color: $--color-primary;
  }
  &::v-deep {
    .el-button {
      padding: 0;
      height: 16px;
      margin-left: 30px;
      line-height: 16px;
    }
  }
}
.el-image {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  position: absolute;
  top: 53px;
}
</style>
