<template>
  <div class="app-info">
    <BlockTitle>单据信息</BlockTitle>
    <div class="app-info-row" v-for="(_, index) in rows" :key="index">
      <div class="app-info-item">
        <div class="app-info-label">{{ index === 0 ? '关联处方' : '' }}</div>
        <div class="app-info-value">
          <template v-if="relRpIds[index]">
            <router-link
              :to="'/business/prescription/detail/' + relRpIds[index]"
            >
              <span>{{ relRpIds[index] }}</span>
              <el-button
                type="text"
                @click.stop.prevent=""
                v-clipboard:error="copyFailed"
                v-clipboard:success="copySuccess"
                v-clipboard:copy="relRpIds[index]"
              >
                复制
              </el-button>
            </router-link>
          </template>
        </div>
      </div>
      <div class="app-info-item">
        <template v-if="hasOrder">
          <div class="app-info-label no-width">
            {{ index === 0 ? '关联服务订单' : '' }}
          </div>
          <div class="app-info-value">
            <template v-if="index === 0">
              <router-link
                :to="'/business/order/detail/' + prescriptionInfo.orderId"
              >
                <span class="primary">{{ prescriptionInfo.orderId }}</span>
                <el-button
                  type="text"
                  @click.stop.prevent=""
                  v-clipboard:error="copyFailed"
                  v-clipboard:success="copySuccess"
                  v-clipboard:copy="prescriptionInfo.orderId"
                  >复制</el-button
                >
              </router-link>
            </template>
          </div>
        </template>
      </div>
      <div class="app-info-item"></div>
    </div>
  </div>
</template>
<script>
import { BlockTitle } from '@/components/Base'
export default {
  name: 'InvoiceInfo',
  components: {
    BlockTitle,
  },
  props: {
    hasOrder: {
      type: Boolean,
      default: true,
    },
    prescriptionInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    rows() {
      let count = 0
      const relRpIds = this.prescriptionInfo.relRpIds
      if (relRpIds && relRpIds.length) {
        count = relRpIds.length
      } else {
        count = 1
      }
      return new Array(count).fill(0)
    },
    relRpIds() {
      return this.prescriptionInfo.relRpIds || []
    },
  },
  methods: {
    copyFailed() {
      this.$message.error('复制失败！')
    },
    copySuccess() {
      this.$message.success('复制成功！')
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';
.no-width {
  width: auto;
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
</style>
