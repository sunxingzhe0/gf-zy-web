<template>
  <div class="view__card">
    <div class="orderTop">
      单据号：{{ infoData.billNo }}
      <el-tag
        style="margin-left: 10px; font-weight: nomal"
        size="mini"
        :type="infoData.pay ? 'success' : ''"
        >{{ infoData.pay ? '已支付' : '待支付' }}</el-tag
      >
    </div>
    <div class="infoWrap">
      <el-row>
        <el-col :span="8">
          <div class="infoItem">
            <div><span>单据号</span>{{ infoData.billNo }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="infoItem">
            <div><span>费别</span>{{ infoData.name }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="infoItem">
            <div><span>金额</span>￥{{ infoData.fee }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="infoItem">
            <div><span>就诊人</span>{{ infoData.patientName }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="infoItem">
            <div><span>医院</span>{{ infoData.hospitalName }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="infoItem">
            <div><span>科室</span>{{ infoData.deptName }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="infoItem">
            <div><span>医生</span>{{ infoData.doctorName }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="infoItem">
            <div><span>创建时间</span>{{ infoData.createTime }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="orderTop">支付信息</div>
    <div class="infoWrap">
      <el-row>
        <el-col :span="8">
          <div class="infoItem">
            <div><span>支付号</span>{{ infoData.payNo || '-' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="infoItem">
            <div><span>支付方式</span>{{ infoData.payWay || '-' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="infoItem">
            <div><span>支付金额</span>￥{{ infoData.payFee || '-' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="infoItem">
            <div><span>支付时间</span>{{ infoData.payTime || '-' }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="orderTop">处方明细</div>
    <div class="rpList">
      <ul>
        <li class="" v-for="(item, index) in infoData.items" :key="index">
          {{ item.body }}<span>￥{{ item.fee }} x{{ item.num }}</span
          ><span style="color: red"
            >￥{{
              (parseFloat(item.fee) * parseInt(item.num)).toFixed(2)
            }}</span
          >
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mzRpDetail } from '@/api/zyapi/payment'
export default {
  data() {
    return {
      infoData: {},
    }
  },
  created() {
    this.getmzRpDetail()
  },
  methods: {
    async getmzRpDetail() {
      this.infoData = await mzRpDetail({
        type: 1,
        billNo: this.$route.query.billNo,
        patientId: this.$route.query.patientId,
      })
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
  margin: 30px 0;
  font-size: 14px;
}
.infoItem {
  margin: 5px;
  line-height: 28px;
  span {
    color: #888;
    display: inline-block;
    width: 100px;
  }
}
.rpList {
  margin-top: 30px;
  padding-left: 10px;
  line-height: 30px;
  font-size: 14px;
  color: #888;
  span {
    margin-left: 30px;
  }
}
</style>
