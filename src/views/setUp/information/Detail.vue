<template>
  <div class="view__card">
    <div class="title">{{ title }}</div>
    <div class="date">
      <span>来源：{{ source }}</span
      ><span>创建人：{{ founder }}</span
      ><span><i class="el-icon-view"></i> {{ browse }}</span
      ><span>{{ createTime }}</span>
    </div>
    <div class="content" v-html="infoContent"></div>
    <EditFooter></EditFooter>
  </div>
</template>
<script>
import EditFooter from '@/components/EditFooter'
import { infoDetail } from '@/api/setup'
export default {
  components: { EditFooter },
  data() {
    return {
      // 正文
      infoContent: '',
      // 来源
      source: '',
      // 标题
      title: '',
      // 创建时间
      createTime: '',
      // 浏览量
      browse: '',
      // 创建人
      founder: '',
    }
  },
  created() {
    this.getInfoDetail()
  },
  mounted() {},

  methods: {
    async getInfoDetail() {
      let res = await infoDetail({
        id: this.$route.query.id,
      })
      this.infoContent = res.content
      this.source = res.source
      this.title = res.title
      this.createTime = res.createTime
      this.browse = res.browse
      this.founder = res.founder
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
  span {
    margin-right: 40px;
  }
}
.content {
  font-size: 16px;
  color: #333;
  line-height: 36px;
  margin-bottom: 30px;
}
</style>
