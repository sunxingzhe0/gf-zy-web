<template>
  <div class="view__card">
    <div class="title">{{ title }}</div>
    <div class="date">发布日期：{{ releaseTime }}</div>
    <div class="content" v-html="content"></div>
    <EditFooter></EditFooter>
  </div>
</template>
<script>
import EditFooter from '@/components/EditFooter'
import { detailAnn, read } from '@/api/setup'
export default {
  components: { EditFooter },
  data() {
    return {
      content: '',
      createTime: '2020-07-14 14:38:21',
      releaseTime: '2020-07-25 00:00:00',
      title: '',
    }
  },
  created() {
    this.getDetailInfo()
  },
  methods: {
    // 获取详情
    async getDetailInfo() {
      const res = await detailAnn({
        announceId: this.$route.query.id,
      })
      await read({
        announceId: this.$route.query.id,
      })
      this.content = res.content
      this.title = res.title
      this.releaseTime = res.releaseTime
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
</style>
