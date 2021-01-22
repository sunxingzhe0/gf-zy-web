<template>
  <div class="app-info">
    <BlockTitle>患者信息</BlockTitle>
    <div class="app-info-row">
      <div class="app-info-item">
        <div class="app-info-label">就诊人</div>
        <div class="app-info-value">{{ patient.memberName }}</div>
      </div>
      <div class="app-info-item">
        <div class="app-info-label">性别</div>
        <div class="app-info-value" v-if="patient.sex === 1">男</div>
        <div class="app-info-value" v-if="patient.sex === 0">女</div>
        <div class="app-info-value" v-if="patient.sex === null">
          未知
        </div>
      </div>
      <div class="app-info-item">
        <div class="app-info-label">年龄</div>
        <div class="app-info-value">{{ patient.age || 0 }}岁</div>
      </div>
    </div>
    <div class="app-info-row">
      <div class="app-info-item">
        <div class="app-info-label">联系电话</div>
        <div class="app-info-value">{{ patient.memberPhone || '--' }}</div>
      </div>
      <div class="app-info-item">
        <div class="app-info-label">业务类型</div>
        <div class="app-info-value">
          {{ orderInfo.bizType && serviceType[orderInfo.bizType] }}
        </div>
      </div>
      <div class="app-info-item">
        <div class="app-info-label">业务形式</div>
        <div class="app-info-value">
          {{ orderInfo.wayType && serviceMode[orderInfo.wayType] }}
        </div>
      </div>
    </div>
    <div class="app-info-row">
      <div class="app-info-item full">
        <div class="app-info-label">病情自诉</div>
        <div class="app-info-value">
          {{ orderInfo.illnessDesc || '无' }}
        </div>
      </div>
    </div>
    <div class="app-info-row" v-if="picList.length">
      <div class="app-info-item full with-img">
        <el-image
          v-for="item in picList"
          :preview-src-list="[]"
          :src="FILE_URL(item)"
          :key="item"
        ></el-image>
      </div>
    </div>
    <div class="app-info-row">
      <div class="app-info-item full">
        <div class="app-info-label">诊断</div>
        <div class="app-info-value">{{ orderInfo.diagnose || '无' }}</div>
      </div>
    </div>
  </div>
</template>
<script>
/*
@author     qiang
@name       PatinetInfo
@desc       病人信息组件【详情】
@props      orderInfo   object  业务订单详情
@emit       none
@api        https://gitee.com/gftech_team/dashboard/programs/102514/docs/gftech_team%2Fhlwyy?doc_id=750580&sort_id=2414061
*/
import { BlockTitle } from '@/components/Base'
export default {
  name: 'PatinetInfo',
  components: {
    BlockTitle,
  },
  props: {
    orderInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    patient() {
      console.log(this.orderInfo)
      return this.orderInfo.patient || {}
    },
    picList() {
      return this.orderInfo.picList || []
    },
  },
  data() {
    return {
      serviceType: {
        CONSULT: '在线咨询',
        REPEAT_CLINIC: '在线复诊',
        CARRYON_PRESC: '慢病续方',
      },
      serviceMode: {
        GRAPHIC: '图文',
        VIDEO: '视频',
        PHONE: '电话',
      },
    }
  },
}
</script>
<style lang="scss" scoped>
.with-img {
  height: auto;
  &::v-deep {
    .el-image {
      width: 120px;
      height: 120px;
      margin-right: 20px;
    }
  }
}
</style>
