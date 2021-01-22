<template>
  <div class="has-logo">
    <logo :collapse="isCollapse">
      <el-image :src="FILE_URL(logo)" class="sidebar-logo">
        <template slot="error">
          <svg-icon icon-class="guanfang-logo" />
        </template>
      </el-image>
    </logo>

    <el-scrollbar wrap-class="scrollbar-wrapper menuWrap">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/_variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar', 'logo']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    /* showLogo() {
      return this.$store.state.settings.sidebarLogo
    }, */
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';
.sidebar-logo {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 50%;
  vertical-align: middle;
  background: $--color-primary;
  border-radius: 50%;
  color: $--color-white;

  > svg {
    margin-right: 0 !important;
    width: 60%;
    height: 60%;
  }
}
</style>
