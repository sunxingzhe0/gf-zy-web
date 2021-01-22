<template>
  <div class="flex-start-center">
    <el-button
      plain
      icon="el-icon-arrow-left"
      size="mini"
      @click="back"
      circle
    ></el-button>
    <el-breadcrumb class="app-breadcrumb" separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
          <span
            v-if="
              item.redirect === 'noRedirect' || index == levelList.length - 1
            "
            class="no-redirect"
            >{{ item.meta.title }}</span
          >
          <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script>
// import { compile } from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null,
      nowPath: [],
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    },
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    back() {
      if (window.history.length <= 1) {
        this.$router.push({ path: '/' })
        return false
      } else {
        this.$router.back()
      }
    },
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(
        item => item.meta && item.meta.title,
      )
      /* const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' } }].concat(
          matched,
        )
      } */
      this.nowPath = matched
      this.levelList = matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false,
      )
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    // pathCompile(path) {
    //   console.log(path, 'path路径')
    //   // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
    //   const { params } = this.$route
    //   var toPath = compile(path)
    //   console.log(toPath(params), 'topath路径', params, 'params')
    //   return toPath(params)
    // },
    handleLink(item) {
      console.log(this.$store.state.user, '555555')
      // 药房订单重定向条件修改
      if (
        this.$store.state.user.platform == 'DRUG_STORE' &&
        this.nowPath[0].path == '/order'
      ) {
        item.redirect = '/order/allorder/orderList'
      }
      // 机构业务重定向条件修改
      if (
        this.$store.state.user.platform == 'ORG_WEB' &&
        this.nowPath[0].path == '/business'
      ) {
        item.redirect = '/business/consult'
      }
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    },
  },
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 60px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
