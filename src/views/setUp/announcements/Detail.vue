<template>
  <div class="view__card">
    <el-row>
      <el-col :span="22"
        ><div class="title">{{ title }}</div></el-col
      >
      <el-col :span="2" class="flex"
        ><el-switch v-model="see" @change="isShow"></el-switch
      ></el-col>
    </el-row>
    <div class="date">
      <div>发布日期：{{ releaseTime }}</div>
      <div>
        发布对象：
        <span v-for="(item, index) in role" :key="index">{{ item.name }}</span>
      </div>
      <div>
        发布科室：
        <span v-for="(item, index) in dept" :key="index">{{ item.name }}</span>
      </div>
    </div>
    <div class="content" v-html="content"></div>
    <el-button @click="pageBack">返回</el-button>
    <button>
      <el-button type="default" size="small" class="log" @click="handleClick()"
        >查看日志</el-button
      >
    </button>
    <Log ref="log"></Log>
  </div>
</template>
<script>
// import EditFooter from '@/components/EditFooter'
import { detailAnn, showAnn } from '@/api/setup'
import Log from './Log'
export default {
  components: {
    // EditFooter,
    Log,
  },

  data() {
    return {
      // 主键id
      id: '',
      // 文章标题
      title: '',
      // 正文内容
      content: '',
      // 发布时间或预约发布时间
      releaseTime: '',
      // 显示状态
      see: '',
      // 科室
      dept: [],
      // 发布对象
      role: [],
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getDetail()
  },
  methods: {
    //返回上一页
    pageBack() {
      this.$router.back(-1)
    },
    // 获取详情
    async getDetail() {
      let res = await detailAnn({
        announceId: this.id,
      })
      this.content = res.content
      this.releaseState = res.releaseState
      this.releaseTime = res.releaseTime
      this.dept = res.dept
      this.role = res.role
      this.title = res.title
      this.see = res.see
    },
    // 变更显示与隐藏
    async isShow() {
      let res = await showAnn({
        announceId: this.id,
      })
      console.log(res)
      this.$message.success(this.see ? '公告已显示!' : '公告已隐藏')
      this.getDetail()
    },
    // 点击打开弹窗
    handleClick() {
      this.$refs.log.open(this.id)
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
  display: flex;
  align-items: center;
  div {
    margin-right: 40px;
    span {
      margin-right: 10px;
    }
  }
}
.content {
  font-size: 16px;
  color: #333;
  line-height: 36px;
  margin-bottom: 30px;
}
.flex {
  display: flex;
  justify-content: flex-end;
}

.view__card {
  .logBox {
    display: flex;
    justify-content: align-items;
    margin-top: 100px;
    .log {
      margin-right: 30px;
    }
  }
}
</style>
