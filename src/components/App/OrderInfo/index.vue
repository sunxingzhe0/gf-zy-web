<template>
  <div class="app-info">
    <BlockTitle>基本信息</BlockTitle>
    <div class="app-info-row">
      <div class="app-info-item">
        <div class="app-info-label">购买人</div>
        <div class="app-info-value align-center">
          <el-image class="avatar_round" :src="FILE_URL(orderInfo.userAvatar)">
            <img slot="error" class="image-slot" src="@/assets/headerImg.png" />
          </el-image>

          <span>{{ orderInfo.userName }}</span>
          <span>{{ orderInfo.userPhone }}</span>
        </div>
      </div>
      <div class="app-info-item">
        <div class="app-info-label">下单时间</div>
        <div class="app-info-value">{{ orderInfo.createTime }}</div>
      </div>
      <div class="app-info-item">
        <div class="app-info-label">支付方式</div>
        <div class="app-info-value">
          {{ payType[orderInfo.payType] || '银行卡' }}
        </div>
      </div>
    </div>
    <div class="app-info-row">
      <div class="app-info-item">
        <div class="app-info-label">订单金额</div>
        <div class="app-info-value">￥{{ orderInfo.payFee }}</div>
      </div>
      <div class="app-info-item">
        <div class="app-info-label">支付时间</div>
        <div class="app-info-value">
          {{ orderInfo.paymentTime || '-' }}
        </div>
      </div>
      <div class="app-info-item">
        <div class="app-info-label">订单类型</div>
        <div class="app-info-value">
          <span>{{ orderType[orderInfo.orderType] }}</span>
          [<span>{{ wayType[orderInfo.wayType] }}</span
          >]
        </div>
      </div>
    </div>
    <template v-if="orderInfo.evaluate && orderInfo.evaluate.rating">
      <div class="app-info-row">
        <div class="app-info-item">
          <div class="app-info-label">评价</div>
          <div class="app-info-value">
            <el-rate
              disabled
              show-text
              style="display: inline-block;"
              :value="orderInfo.evaluate.rating"
              :texts="['不满意', '一般', '满意', '较满意', '非常满意']"
            ></el-rate>
          </div>
        </div>
        <div class="app-info-item">
          <div class="app-info-label">评价时间</div>
          <div class="app-info-value">
            {{ orderInfo.commentTime || '-' }}
          </div>
        </div>
        <div class="app-info-item"></div>
      </div>
      <div class="app-info-row">
        <div class="app-info-item">
          <div class="app-info-label"></div>
          <div class="app-info-value">
            {{ orderInfo.evaluate.content || '-' }}
          </div>
        </div>
        <div class="app-info-item"></div>
        <div class="app-info-item"></div>
      </div>
    </template>
  </div>
</template>
<script>
/*
@author     qiang
@name       OrderInfo
@desc       订单信息组件【核销记录详情=>基本信息】
@props      orderInfo   OrderInfo<>
@emit       none
@api        https://gitee.com/gftech_team/dashboard/programs/102514/docs/gftech_team%2Fhlwyy?doc_id=750580&sort_id=2415595
*/
import { BlockTitle } from '@/components/Base'
export default {
  name: 'OrderInfo',
  components: {
    BlockTitle,
  },
  props: {
    orderInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      payType: {
        OFFLINE_PAY: '线下支付',
        WECHAT_PAY: '微信支付',
        ALI_PAY: '支付宝',
      },
      orderType: {
        CONSULT: '在线咨询',
        REPEAT_CLINIC: '在线复诊',
        CARRYON_PRESC: '慢病续方',
      },
      wayType: {
        GRAPHIC: '图文',
        VIDEO: '视频',
        PHONE: '电话',
      },
    }
  },
}
</script>
<style lang="scss" scoped>
.align-center {
  display: flex;
  align-items: center;
}
.avatar_round {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
</style>
