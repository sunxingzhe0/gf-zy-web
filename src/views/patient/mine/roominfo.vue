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
    this.hisInfo = {
      sessionId: this.$route.params.sessionId,
      userId: this.$route.params.userId,
    }
    console.log(this.$route.params.sessionId, '-----------')
  },
  methods: {
    async getclinicRoomInfo() {
      console.log(this.$route.params)
      let res = await clinicRoomInfo({ clinicId: this.$route.params.clinicId })
      res.patient = {
        memberName: res.name,
        sex: res.sex,
        age: res.age,
        memberPhone: res.phone,
      }
      res.bizType = res.orderType
      this.info = res
    },
  },
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
