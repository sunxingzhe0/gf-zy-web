<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <navbar class="fixed-header" />

      <section class="app-main">
        <el-scrollbar class="page-component__scroll">
          <transition :name="transitionName">
            <keep-alive>
              <router-view
                v-if="$route.meta.keepAlive"
                class="content__router-view"
              ></router-view>
            </keep-alive>
          </transition>
          <transition :name="transitionName">
            <router-view
              v-if="!$route.meta.keepAlive"
              class="content__router-view"
            ></router-view>
            <!-- <router-view class="content__router-view" /> -->
          </transition>
        </el-scrollbar>
      </section>
    </div>
    <!-- <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div> -->
  </div>
</template>

<script>
// import RightPanel from '@/components/RightPanel'
import {
  /* AppMain, */
  Navbar,
  /*  Settings,  */ Sidebar /* , TagsView  */,
} from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { createSocket } from '@/components/Socket'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    /* AppMain, */
    Navbar,
    /* RightPanel,
    Settings, */
    Sidebar,
    /* TagsView, */
  },
  mixins: [ResizeMixin],
  data() {
    return {
      transitionName: 'slide-left',
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
      }
    },
  },
  beforeRouteUpdate(to, from, next) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    next()
  },
  created() {
    this.IM = createSocket()
  },
  beforeDestroy() {
    this.IM.destroy()
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/_variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  background: #f2f2f2;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}

.app-main {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #f8f8f8;
}

.fixed-header + .app-main {
  padding-top: 45px;
  padding-left: 5px;
}
</style>

<style lang="scss">
@import '~@/styles/_variables.scss';
// fix css style bug in open el-dialog
/* .el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
} */

.page-component__scroll {
  height: calc(100vh - #{$app-header-height} - 5px);

  > .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}

.content__router-view {
  margin: $app-router-view-margin;
  min-height: calc(100vh - #{$router-view-offset-height});
  margin: 0;
  &[class*=' view__card'],
  &[class^='view__card'] {
    padding: $app-router-view-padding;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    background: $--color-white;
    overflow: auto;
  }

  &.slide-right-leave-active,
  &.slide-right-enter-active,
  &.slide-left-leave-active,
  &.slide-left-enter-active {
    position: absolute !important;
    width: auto;
    right: 0;
    left: 0;
  }

  &.el-tabs,
  > .el-tabs {
    > .el-tabs__content {
      overflow: visible;
    }
  }

  [data-title]::before {
    display: block;
    margin: 20px 0;
    font-size: 16px;
    font-weight: 500;
    color: $--color-text-primary;
    content: attr(data-title);
  }
}
</style>
