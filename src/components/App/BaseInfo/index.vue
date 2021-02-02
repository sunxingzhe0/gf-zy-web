<template>
  <div class="app-info">
    <BlockTitle>基本信息</BlockTitle>
    <div class="app-info-row">
      <div class="app-info-item">
        <div class="app-info-label">类型</div>
        <div class="app-info-value">
          {{ treatmentInfo.medicalType | medicalType }}
        </div>
      </div>
      <div class="app-info-item">
        <div class="app-info-label">唯一ID</div>
        <div class="app-info-value" style="overflow: hidden;">
          <el-tooltip
            effect="dark"
            placement="top"
            :content="treatmentInfo.patientId"
          >
            <span>
              {{ treatmentInfo.patientId }}
            </span>
          </el-tooltip>
        </div>
      </div>
      <div class="app-info-item">
        <div class="app-info-label">就诊渠道</div>
        <div class="app-info-value">
          {{ treatmentInfo.type == 'outer' ? '互联网' : '院内' }}
        </div>
      </div>
    </div>
    <div class="app-info-row">
      <div class="app-info-item">
        <div class="app-info-label">接诊医生</div>
        <div class="app-info-value">{{ treatmentInfo.deptName }}</div>
        <div class="app-info-value">{{ treatmentInfo.doctorName }}</div>
        <div class="app-info-value">{{ treatmentInfo.title }}</div>
      </div>
      <div class="app-info-item">
        <div class="app-info-label">接诊时间</div>
        <div class="app-info-value">
          {{ treatmentInfo.visitDate }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/*
@author     qiang
@name       BaseInfo
@desc       基本信息组件【详情】
@props      treatmentInfo   treatmentInfo
@emit       none
*/
import { BlockTitle } from '@/components/Base'
export default {
  name: 'BaseInfo',
  components: {
    BlockTitle,
  },
  props: {
    treatmentInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  filters: {
    medicalType(val) {
      switch (val) {
        case 'MZ':
          return '门诊'
        case 'ZY':
          return '住院'
        default:
          return '体检'
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.app-info-row {
  width: 100%;
  .app-info-item {
    width: 33.333%;

    .app-info-value {
      min-width: none;
      flex: 0;
    }
  }
}
</style>
