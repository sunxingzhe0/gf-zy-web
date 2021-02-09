<template>
  <div class="info">
    <PatinetInfo :orderInfo="info"></PatinetInfo>
    <div class="history">
      <div class="title">
        <BlockTitle>诊疗记录</BlockTitle>
      </div>
      <ChatRecord :orderInfo="hisInfo"></ChatRecord>
    </div>
  </div>
</template>

<script>
import { ChatRecord, PatinetInfo } from '@/components/App'
import { BlockTitle } from '@/components/Base'
import { clinicRoomInfo } from '@/api/list'
import { orderDoctorWebDetail } from '@/api/business'
export default {
  name: 'roominfo',
  components: {
    ChatRecord,
    PatinetInfo,
    BlockTitle,
  },
  data() {
    return {
      info: {},
      hisInfo: {},
    }
  },
  created() {
    this.getclinicRoomInfo()
    /*   this.hisInfo = {
      sessionId: this.$route.query.sessionId,
      userId: this.$route.query.userId,
    } */
    this.orderDoctorWebDetail()
    console.log(this.$route.query.sessionId, '-----------')
  },
  methods: {
    async getclinicRoomInfo() {
      console.log(this.$route.query)
      let res = await clinicRoomInfo({ clinicId: this.$route.query.clinicId })
      res.patient = {
        memberName: res.name,
        sex: res.sex,
        age: res.age,
        memberPhone: res.phone,
      }
      res.bizType = res.orderType
      this.info = res
    },
    //获取订单详情
    async orderDoctorWebDetail() {
      const res = await orderDoctorWebDetail({
        orderId: this.$route.query.orderId,
      })
      this.hisInfo = res
      console.log(res, '------------------')
    },
  },
  /*  beforeRouteLeave(to, from, next) {
    // 设置下一个路由的 meta
    to.meta.keepAlive = true // 详情 缓存，不刷新
    next()
  }, */
}
</script>

<style lang="scss" scoped>
.info {
  padding: 20px;
  background: #fff;
  .history {
    margin-top: 40px;
    .title {
      margin-bottom: 20px;
    }
  }
}
</style>
