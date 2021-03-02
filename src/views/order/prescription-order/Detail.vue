<template>
  <section class="view__card view__detail">
    <header>
      <h3 class="view__title">
        订单号：{{ id }}
        <el-tag style="margin-left: 30px" type="default" size="mini">
          {{ statusText[detailInfo.orderStatus] || '已关闭' }}
        </el-tag>
      </h3>
      <!-- 自提订单 -->
      <template v-if="detailInfo.expressMode === 0">
        <el-steps :active="activeStep" align-center class="steps">
          <el-step
            title="提交订单"
            :description="detailInfo.createTime"
          ></el-step>
          <el-step title="付款" :description="detailInfo.paymentTime"></el-step>
          <el-step
            title="自提"
            :description="
              detailInfo.takeInfo ? detailInfo.takeInfo[0].expenseTime : ''
            "
          ></el-step>
        </el-steps>
      </template>
      <!-- 邮寄订单 -->
      <template v-else>
        <el-steps :active="activeStep" align-center class="steps">
          <el-step
            title="提交订单"
            :description="detailInfo.createTime"
          ></el-step>
          <el-step title="付款" :description="detailInfo.paymentTime"></el-step>
          <el-step title="发货" :description="detailInfo.expressTime"></el-step>
          <el-step
            title="收货"
            :description="detailInfo.receiverTime"
          ></el-step>
        </el-steps>
      </template>
    </header>

    <el-tabs v-model="activeName">
      <el-tab-pane label="处方信息" name="info" lazy>
        <OrderInfo :orderInfo="detailInfo"></OrderInfo>
        <PatinetInfo :orderInfo="orderInfo"></PatinetInfo>
        <OrderPrescription :prescriptionInfo="detailInfo"></OrderPrescription>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="log" lazy>
        <OperateLog :businessId="id"></OperateLog>
      </el-tab-pane>
      <el-tab-pane label="配送信息" name="Distribution" lazy>
        <DeliveryInfo :orderInfo="detailInfo"></DeliveryInfo>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
/*
@author        qiang
@name          Detail(沿用历史组件名)
@desc          核销记录详情
@props         id   string    订单id
@emit
*/

import {
  OrderInfo,
  OperateLog,
  PatinetInfo,
  DeliveryInfo,
  OrderPrescription,
} from '@/components/App'
import { rpDetail } from '@/api/order'

export default {
  name: 'Detail',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  components: {
    OrderInfo,
    OperateLog,
    PatinetInfo,
    DeliveryInfo,
    OrderPrescription,
  },
  // rpDrugList
  data() {
    return {
      statusText: {
        UNPAID: '待付款',
        PAID: '已支付',
        WAIT_TREAT: '待接诊',
        IN_TREAT: '接诊中',
        WAIT_TAKE: '待自提',
        WAIT_SEND: '待发货',
        WAIT_RECEIVE: '待收货',
        TO_EVALUATE: '待评价',
        IN_AFTER_SALE: '售后中',
        FINISHED: '已完成',
      },
      infoList: {},
      activeName: 'info',
      // 订单详情
      orderInfo: {},
      // 处方详情数据
      detailInfo: {},
      // 处方列表
      prescriptionInfo: [],
    }
  },
  computed: {
    activeStep() {
      const detailInfo = this.detailInfo || {}
      if (detailInfo.expressMode === 0) {
        if (detailInfo.takeInfo) {
          if (detailInfo.takeInfo[0].expenseTime) return 3
        }
        if (detailInfo.paymentTime) return 2
        if (detailInfo.createTime) return 1
        return 0
      } else {
        if (detailInfo.receiverTime) return 4
        if (detailInfo.expressTime) return 3
        if (detailInfo.paymentTime) return 2
        if (detailInfo.createTime) return 1
        return 0
      }
    },
  },
  created() {
    this.getPrescriptionOrder()
  },
  methods: {
    // 获取订单详情
    async getPrescriptionOrder() {
      const res = await rpDetail({
        orderId: this.id,
      })
      this.infoList = res
      this.detailInfo = res
      this.prescriptionInfo = res.rpList.map(item => ({
        ...item,
        rpDrugList: item.contentList,
      }))
      // 患者信息拼装
      this.orderInfo = {
        ...res,
        patient: {
          age: res.memberAge,
          memberName: res.memberName,
          memberPhone: res.memberPhone,
          sex: res.memberSex === '男' ? 1 : 0,
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';
@import '@/styles/_modules-detail.scss';
</style>
