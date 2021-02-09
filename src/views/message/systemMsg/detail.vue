<template>
  <div class="view__card">
    <div class="title">{{ title }}</div>
    <div class="date">发布日期：{{ createTime }}</div>
    <div class="content">
      {{ content }}
    </div>
    <div class="buttonBox">
      <EditFooter></EditFooter>
      <el-button type="default" size="small" class="detail" @click="goTo"
        >查看详情</el-button
      >
    </div>
  </div>
</template>
<script>
import EditFooter from '@/components/EditFooter'
import { readNotice } from '@/api/index'
export default {
  components: { EditFooter },
  data() {
    return {
      arr: [],
      content: '',
      createTime: '',
      title: '',
      notice: '',
      bizId: this.$route.query.bizId,
    }
  },
  created() {
    console.log(this.$route.query)
    this.content = this.$route.query.content
    this.createTime = this.$route.query.time
    this.title = this.$route.query.title
    this.notice = this.$route.query.notice
    this.read_()
  },
  methods: {
    async read_() {
      this.arr = await readNotice({ noticeId: this.$route.query.id })
      this.$store.dispatch('updateList/changeFlag', 'updateListFlagNavNotice')
    },
    // 跳转
    goTo() {
      // console.log(this.notice.split('_'), '***/*')
      const [clientType, msgType] = this.notice.split('_')
      console.log(clientType, '****', msgType)
      if (clientType == 'DOCTOR') {
        if (msgType == 10) {
          this.$router.push('/business/clinic?active=REPEAT_CLINIC')
        } else {
          this.$router.push('/business/clinic')
        }
      } else if (
        clientType == 'YS' &&
        (msgType == '02' ||
          msgType == '01' ||
          msgType == '03' ||
          msgType == '04' ||
          msgType == '05')
      ) {
        this.$router.push(`/prescription/pending/detail?id=` + this.bizId)
      } else if (clientType == 'YF') {
        if (msgType == '01') {
          this.$router.push(`/order/allorder/orderdetail?id=` + this.bizId)
        } else if (msgType == '02' || msgType == '03') {
          // this.$router.push('/order/prescription-order/list')
        } else if (msgType == '05' || msgType == '04') {
          this.$router.push(`/order/tocarryorder/orderdetail?id=` + this.bizId)
        } else if (msgType == '06' || msgType == '07') {
          // this.$router.push('/order/prescription-order/list')
        }
      } else if (clientType == 'ORG') {
        if (msgType == '01' || msgType == '02') {
          this.$router.push('/jurisdiction/account/list')
        } else if (msgType == '03') {
          this.$router.push(`/set-up/announcements/detail?id=${this.bizId}`)
        }
      }
      if (clientType == 'ALL') {
        this.$router.push('/set-up/account')
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.title {
  font-size: 20px;
  font-weight: bold;
}
.date {
  font-size: 14px;
  color: #666;
  margin-top: 20px;
  margin-bottom: 40px;
}
.content {
  font-size: 16px;
  color: #333;
  line-height: 36px;
  margin-bottom: 30px;
}
.buttonBox {
  display: flex;
  align-items: center;
  .detail {
    margin-left: 20px;
  }
}
</style>
