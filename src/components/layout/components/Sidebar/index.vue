<template>
  <div class="has-logo">
    <!--  医技预约不需要 -->
    <logo :collapse="isCollapse" v-if="!appointment">
      <template>
        <el-image
          :src="FILE_URL(logo)"
          :class="sidebar.opened ? 'sidebar-logo' : ''"
          v-if="!isShowLogo"
        >
          <template slot="error">
            <svg-icon icon-class="guanfang-logo" />
          </template>
        </el-image>
        <div
          v-if="sidebar.opened"
          style="
            font-size: 14px;
            line-height: 0;
            position: absolute;
            bottom: 20px;
            left: 0;
            text-align: center;
            width: 100%;
          "
        >
          互联网医院
        </div>
      </template>
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
          v-for="route in permissionRoutes"
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
import checkPermission from '@/utils/permission'
import checkPermissionNum from '@/utils/permissionNum'
export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      permissionRoutes: [],
      appointment: /appointment/.test(window.location.href),
    }
  },
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
    isShowLogo() {
      console.log(checkPermission(['PLATFORM']))
      return checkPermission(['PLATFORM'])
    },
  },
  watch: {
    permission_routes() {
      this.getlist()
    },
  },
  created() {
    this.getlist()
  },
  methods: {
    getlist() {
      if (
        checkPermission(['ORG_WEB_MECHANISM']) &&
        checkPermissionNum([
          'ORG_WEB',
          'DRUG_STORE',
          'DRUG_DOC',
          'DOC_WEB',
          'ZY_ORG_ORG',
        ]) == 1
      ) {
        let list = [...this.permission_routes]

        if (list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].name == 'organ') {
              console.log(list[i], 11111)

              list.splice(0, 0, list[i]) //index:元素需要放置的位置索引，从0开始
              list.splice(i + 1, 1) //移除原来位置上的该元素

              break
            }
          }
        }
        this.permissionRoutes = list
        console.log(list)
        this.$router.push(list[0].path)
      } else {
        this.permissionRoutes = [...this.permission_routes]
      }
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
  width: 65px;
  height: 65px;
  vertical-align: middle;
  background: $--color-primary;
  border-radius: 50%;
  color: $--color-white;

  > svg {
    margin-right: 0 !important;
    width: 65px;
    height: 65px;
  }
  .logo-text {
    font-size: 14px !important;
    line-height: 0 !important;
  }
}
::v-deep .sidebar-logo-container {
  line-height: 110px;
}
</style>
