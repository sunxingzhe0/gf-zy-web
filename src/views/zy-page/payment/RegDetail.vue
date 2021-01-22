<template>
  <div class="view__card">
    <div class="orderTop">
      单据号：{{ infoData.billData }}
      <el-tag
        style="margin-left: 10px; font-weight: nomal;"
        size="mini"
        :type="infoData.state == '已付款' ? 'success' : ''"
        >{{ infoData.state }}</el-tag
      >
    </div>
    <div class="infoWrap">
      <!-- <div class="flex-start-center">
        <el-avatar style="margin-right: 15px;" :size="60" :src="FILE_URL(infoData.picId)"></el-avatar>
        <div class="info">
          <div>{{ infoData.doctorName }}</div>
          <div>{{ infoData.hospitalName }}</div>
        </div>
      </div> -->
      <div class="infoItem" v-if="infoData.deType == 'GH'">
        <div>
          <span>预约时段</span
          ><b style="font-weight: normal; color: red;">{{
            infoData.reserveTime
          }}</b>
        </div>
        <div><span>预约科室</span>{{ infoData.deptName }}</div>
      </div>
      <div class="infoItem" v-if="infoData.deType == 'GH'">
        <div><span>患者姓名</span>{{ infoData.patientName }}</div>
        <div><span>就诊卡号</span>{{ infoData.cardNo }}</div>
      </div>
      <div class="infoItem">
        <div><span>项目</span>{{ infoData.name }}</div>
        <div v-if="infoData.deType == 'GH'">
          <span>号源类型</span>{{ infoData.noTypeName }}
        </div>
        <div>
          <span>金额</span
          ><b style="font-weight: normal; color: red;"
            >￥{{ parseFloat(infoData.fee).toFixed(2) }}</b
          >
        </div>
        <div><span>创建时间</span>{{ infoData.createTime || '-' }}</div>
      </div>
      <div class="infoItem">
        <div v-if="infoData.refundFee">
          <span>支付金额</span
          ><b style="font-weight: normal; color: red;"
            >￥{{ parseFloat(infoData.payFee).toFixed(2) }}</b
          >
        </div>
        <div><span>支付号</span>{{ infoData.hisPayId || '-' }}</div>
        <div><span>支付方式</span>{{ infoData.payWayName || '-' }}</div>
        <div><span>支付时间</span>{{ infoData.payTime || '-' }}</div>
      </div>
      <div class="infoItem" v-if="infoData.deType == 'TJ'">
        <div><span>姓名</span>{{ infoData.patientName }}</div>
        <div><span>手机号</span>{{ infoData.phone }}</div>
        <div><span>体检时间</span>{{ infoData.reserveTime || '-' }}</div>
        <div><span>医院</span>{{ infoData.hospitalName || '-' }}</div>
        <div><span>体检套餐</span>{{ infoData.packageName }}</div>
      </div>
      <div class="infoItem">
        <div v-if="infoData.refundFee">
          <span>退费金额</span
          ><b style="font-weight: normal; color: red;"
            >￥{{ parseFloat(infoData.refundFee).toFixed(2) }}</b
          >
        </div>
        <div v-if="infoData.hisRefundId">
          <span>退费流水号</span>{{ infoData.hisRefundId || '-' }}
        </div>
        <div v-if="infoData.refundWayName">
          <span>退费方式</span>{{ infoData.refundWayName || '-' }}
        </div>
        <div v-if="infoData.refundTime">
          <span>退费时间</span>{{ infoData.refundTime || '-' }}
        </div>
      </div>
    </div>
    <div class="orderTop" v-if="infoData.deType == 'TJ'">体检项目</div>
    <div class="infoWrap" v-if="infoData.deType == 'TJ'">
      <div class="list" v-for="(item, index) in infoData.itemInfo" :key="index">
        <div class="objName">
          {{ item.combName
          }}<span v-if="item.remark">（{{ item.remark }}）</span>
        </div>
        <div class="objDetail">{{ item.combDetail }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { appointmentDetail } from '@/api/zyapi/payment'
export default {
  data() {
    return {
      infoData: {
        state: this.$route.query.state,
        cardNo: this.$route.query.cardNo,
      },
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      this.infoData = {
        ...(await appointmentDetail({ orderId: this.$route.query.orderId })),
        ...this.infoData,
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.orderTop {
  // height: 20px;
  // line-height: 20px;
  font-size: 16px;
  font-weight: bold;
  padding-left: 10px;
  position: relative;
  padding: 10px 30px;
  background: rgb(235, 235, 235);
  &::before {
    content: '';
    position: absolute;
    height: 18px;
    width: 3px;
    background: $--color-primary;
    top: 12px;
    left: 10px;
  }
}
.info {
  line-height: 30px;
}
.infoWrap {
  margin-top: 20px;
  font-size: 14px;
  padding-left: 30px;
}
.infoItem {
  margin-bottom: 10px;
  line-height: 28px;
  span {
    color: #888;
    display: inline-block;
    width: 100px;
  }
}
.list {
  margin-bottom: 15px;
  .objName {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    span {
      font-size: 12px;
      color: red;
    }
  }
  .objDetail {
    font-size: 13px;
    color: #666;
    margin-top: 6px;
  }
}
</style>
