<template>
  <div class="app-info">
    <template v-if="orderInfo.expressMode">
      <BlockTitle>收货信息</BlockTitle>
      <div class="app-info-row">
        <div class="app-info-item">
          <div class="app-info-label">收货人</div>
          <div class="app-info-value">{{ orderInfo.receiverName || '-' }}</div>
        </div>
        <div class="app-info-item">
          <div class="app-info-label">收货电话</div>
          <div class="app-info-value">{{ orderInfo.receiverPhone || '-' }}</div>
        </div>
        <div class="app-info-item">
          <div class="app-info-label">收货地址</div>
          <div class="app-info-value">
            {{ orderInfo.fullAddress || '-' }}
            {{ orderInfo.receiverDetailAddress || '' }}
          </div>
        </div>
      </div>
      <BlockTitle>基本信息</BlockTitle>
      <div class="app-info-row">
        <div class="app-info-item">
          <div class="app-info-label">配送方式</div>
          <div class="app-info-value">邮寄</div>
        </div>
        <div class="app-info-item">
          <div class="app-info-label">发货方</div>
          <div class="app-info-value">
            {{
              orderInfo.expressInfoList[0]
                ? orderInfo.expressInfoList[0].pharmacyName
                : '-'
            }}
          </div>
        </div>
        <div class="app-info-item">
          <div class="app-info-label">发货方电话</div>
          <div class="app-info-value">
            {{
              orderInfo.expressInfoList[0]
                ? orderInfo.expressInfoList[0].pharmacyPhone
                : '-'
            }}
          </div>
        </div>
      </div>
      <div class="app-info-row">
        <div class="app-info-item">
          <div class="app-info-label">物流公司</div>
          <div class="app-info-value">
            {{
              orderInfo.expressInfoList[0]
                ? orderInfo.expressInfoList[0].corpName
                : '-'
            }}
          </div>
        </div>
        <div class="app-info-item">
          <div class="app-info-label">物流单号</div>
          <div class="app-info-value">
            {{
              orderInfo.expressInfoList[0]
                ? orderInfo.expressInfoList[0].expressNo
                : '-'
            }}
          </div>
        </div>
        <div class="app-info-item"></div>
      </div>
      <div class="app-info-row">
        <!-- <div class="app-info-label">物流详情</div> -->
        <div class="app-info-value">
          <!-- <el-button type="text" @click="parent.isOpen = !parent.isOpen">{{
            parent.isOpen ? '收起' : '展开'
          }}</el-button>
          <transition name="el-zoom-in-top">
            <div class="distribution" v-show="parent.isOpen">
              <div
                class="flex-start-start distributionList on"
                v-for="(item, index) in parent.expressInfoList"
                :key="index"
              >
                <div class="time">
                  <div>{{ item.updateTime }}</div>
                </div>
                <div
                  class="icon"
                  :style="{
                    background: parent.variables.primary,
                    borderColor: parent.variables.primary,
                  }"
                >
                  <svg-icon
                    :style="{ color: '#fff' }"
                    icon-class="sidebar-order"
                  />
                </div>
                <div class="info">
                  <div>{{ item.status }}</div>
                  <div>{{ item.content }}</div>
                </div>
              </div>
            </div>
          </transition> -->
        </div>
      </div>
    </template>
    <template v-else>
      <template v-for="(item, index) in orderInfo.takeInfo">
        <div :key="index">
          <div class="app-info-row">
            <div class="app-info-item">
              <div class="app-info-label">配送方式</div>
              <div class="app-info-value">自提</div>
            </div>
            <div class="app-info-item">
              <div class="app-info-label">自提点</div>
              <div class="app-info-value">{{ item.address || '-' }}</div>
            </div>
            <div class="app-info-item">
              <div class="app-info-label">自提点电话</div>
              <div class="app-info-value">
                {{ item.phone || '-' }}
              </div>
            </div>
          </div>
          <div class="app-info-row">
            <div class="app-info-item">
              <div class="app-info-label">预留手机</div>
              <div class="app-info-value">
                {{ item.memberPhone || orderInfo.memberPhone || '-' }}
              </div>
            </div>
            <div class="app-info-item">
              <div class="app-info-label">预约自提时间</div>
              <div class="app-info-value">{{ item.dateTime || '-' }}</div>
            </div>
            <div class="app-info-item">
              <div class="app-info-label">实际自提时间</div>
              <div class="app-info-value">
                {{ item.expenseTime || '-' }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
<script>
/*
@author        qiang
@name          DeliveryInfo
@desc          配送信息【订单详情】
@props         orderInfo    object      处方订单详情 
@emit
@api           https://gitee.com/gftech_team/dashboard/programs/102514/docs/gftech_team%2Fhlwyy?doc_id=750580&sort_id=2415595
*/
import { BlockTitle } from '@/components/Base'
export default {
  name: 'DeliveryInfo',
  components: {
    BlockTitle,
  },
  props: {
    orderInfo: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
<style lang="scss" scoped>
.app-info-label {
  width: 100px;
}
</style>
