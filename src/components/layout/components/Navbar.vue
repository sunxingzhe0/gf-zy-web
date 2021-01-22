<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="navbar-center">
      <h3 class="org-name">{{ orgName }}</h3>
      <el-tag size="small" v-if="enumPlatform[platform]">
        {{ enumPlatform[platform] }}
      </el-tag>

      <el-dropdown
        @command="SET_DEFAULT_STORE"
        v-show="store.list.length > 1 && isShowChangeList"
      >
        <span
          ><span>{{ store.name }}</span> <i class="el-icon-caret-bottom"></i
        ></span>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in store.list"
            :key="item.id"
            :command="item"
            :disabled="store.id === item.id"
          >
            {{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <div @click="toMyMessage()" style="display: inline-block;">
          <el-badge
            class="right-menu-item hover-effect"
            :value="message"
            :max="99"
            :hidden="message < 1"
          >
            <svg-icon icon-class="navbar-message" />
          </el-badge>
        </div>

        <div class="right-menu-item account-wrapper">
          <el-image :src="FILE_URL(avatar)" class="avatar_round">
            <img slot="error" class="image-slot" src="@/assets/headerImg.png" />
          </el-image>
          <el-popover
            placement="top-start"
            trigger="hover"
            :content="roleListNames"
          >
            <span slot="reference"
              ><b>{{ name }} </b>{{ title }} {{ dept.name }}</span
            >
          </el-popover>
          <!-- <el-avatar :size="30" :src="FILE_URL(avatar)">
            <i class="el-icon-user-solid"></i>
          </el-avatar> -->

          <!-- 隐藏除名称账号之外的信息 -->

          <!-- <span></span> -->

          <!-- <el-dropdown @command="SET_DEFAULT_DEPT">
            <span>{{ dept.name }}</span>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in dept.list"
                :key="item.id"
                :command="item"
                :disabled="dept.id === item.id"
              >
                {{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->

          <span>({{ account }})</span>
        </div>
        <!-- <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
      </template>

      <el-popconfirm
        class="right-menu-item hover-effect"
        title="是否退出登录？"
        @confirm="logout"
      >
        <svg-icon slot="reference" icon-class="navbar-logout" />
      </el-popconfirm>
      <!-- <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>Dashboard</el-dropdown-item>
          </router-link>
          <a
            target="_blank"
            href="https://github.com/PanJiaChen/vue-element-admin/"
          >
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a
            target="_blank"
            href="https://panjiachen.github.io/vue-element-admin-site/#/"
          >
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import { mapGetters, mapState, mapMutations } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
/* import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch' */
import { queryAnyData } from '@/api/index'
import { debounce } from 'lodash'
export default {
  inject: ['reload'],
  components: {
    Breadcrumb,
    Hamburger,
    /* ErrorLog,
    Screenfull,
    SizeSelect,
    Search, */
  },
  data() {
    this.enumPlatform = {
      USER: '用户',
      DOC_WEB: '医生',
      DOC_MOBILE: '医生',
      DRUG_DOC: '药师',
      DRUG_STORE: '药房',
      ORG_WEB: '机构',
      PLATFORM: '平台',
    }

    return {
      message: 0,
      roleListNames: '',
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'introduction',
      'name',
      'roleList',
    ]),
    ...mapState('user', [
      'orgName',
      'dept',
      'store',
      'platform',
      'title',
      'account',
      'userTypeList',
    ]),
    updateListFlagNavNotice() {
      return this.$store.state.updateList.updateListFlagNavNotice
    },
    //是否显示药房切换
    isShowChangeList() {
      console.log(this.userTypeList)
      let list = this.userTypeList.map(item => {
        return item.clientType
      })
      let status1 = list.includes('DRUG_DOC') || list.includes('DRUG_STORE')
      let paths = ['message', 'set-up', 'template']
      let status2 = paths.includes(this.$route.path.split('/')[1])
      let status3 = this.store.list.length > 1
      return status1 && !status2 && status3
    },
  },
  created() {
    this.getMessgae()
    // console.log()
    this.roleListNames = this.roleList.map(({ name }) => name).join(',')
  },
  mounted() {
    this.checkPhone()
  },
  watch: {
    'store.id': {
      handler() {
        // this.$router.go(0)
        this.reload()
        // window.location.href += '?storeid=' + val
        // window.location.reload()
      },
    },
    updateListFlagNavNotice() {
      this.getMessgae()
    },
  },
  methods: {
    ...mapMutations('user', ['SET_DEFAULT_DEPT', 'SET_DEFAULT_STORE']),
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 检查是不是绑定了手机号 没有则跳过去
    checkPhone() {
      const userPhone = this.$store.state.user.phone
      if (!userPhone) {
        if (checkPermission(['ORG_WEB'])) {
          this.$confirm('您还未绑定手机号，是否去绑定？', '提示', {
            confirmButtonText: '去绑定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              // this.$router.push({ name: 'account', query: { phone: true } })
              this.$router.push({ path: '/set-up/account' })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '为保证您的权益，请尽快绑定手机号！',
              })
            })
        }
      }
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    getMessgae: debounce(async function () {
      let noticeNumber = []
      if (checkPermission(['ORG_WEB_SET_UP_SYSTEM_MESSAGE'])) {
        noticeNumber.push('2')
      }
      if (checkPermission(['DRUG_STORE_SET_UP_SYSTEM_MESSAGE'])) {
        noticeNumber.push('1')
      }
      if (
        checkPermission([
          'DOC_WEB_SET_UP_SYSTEM_MESSAGE',
          'DRUG_DOC_NEWS_SYSTEM_MESSAGE',
        ])
      ) {
        noticeNumber.push('0')
      }
      noticeNumber = await Promise.all(
        noticeNumber.map(item => queryAnyData({ readType: 1, scope: item })),
      )
      console.log(noticeNumber)
      // debugger
      noticeNumber = noticeNumber.map(item => item.total)
      this.message = noticeNumber.reduce((_, item) => {
        return (_ += item)
      })
      // console.log(this.message)
      // [
      //   queryAnyData({ readType: 1, scope: 0 }),
      //   queryAnyData({ readType: 1, scope: 1 }),
      //   queryAnyData({ readType: 1, scope: 2 }),
      // ]
      // // const num = await queryAnyData({
      // //   readType: 1,
      // //   scope: 1,
      // //   // storeId: this.$store.state.user.store.id,
      // // })
      // console.log(Object.entries(noticeNumber).map(([key,value]) => {
      //   return
      // })
      // this.message = Object.entries(noticeNumber)
    }, 500),
    toMyMessage() {
      // console.log(this.$route.path)
      // this.$route.path != '/set-up/systemMsg/list' &&
      //   this.$router.push('/set-up/systemMsg/list')
      if (checkPermission(['DRUG_DOC_NEWS_SYSTEM_MESSAGE'])) {
        this.$router.push('/message/systemMsg/list')
      } else {
        this.$router.push('/set-up/systemMsg/list')
      }

      // 'DOC_WEB_SET_UP_SYSTEM_MESSAGE',
      // 'ORG_WEB_SET_UP_SYSTEM_MESSAGE',
      // 'DRUG_STORE_SET_UP',

      // DRUG_DOC_NEWS_SYSTEM_MESSAGE
      // this.$router.push(this.$route.path == '/set-up/systemMsg/list' ? )
    },
  },
}
</script>

<style lang="scss" scoped>
.avatar_round {
  width: 30px;
  height: 30px;
  font-size: 0px;
}
.navbar {
  display: flex;
  justify-content: space-between;
  height: 40px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 40px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .navbar-center {
    flex: auto;
    display: flex;
    justify-content: center;
    align-items: center;

    .org-name {
      margin: 0;
      font-size: 16px;
    }

    > * + * {
      margin-left: 10px;
    }
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 40px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }

      &.el-badge {
        ::v-deep .el-badge__content {
          width: 21px;
          border-radius: 50%;
          padding: 0;
          font-size: 8px;
          line-height: 16px;
        }
        ::v-deep .el-badge__content.is-fixed {
          top: 11px;
          right: 17px;
        }
      }

      &:last-child {
        margin-right: 20px;
      }
    }

    .account-wrapper {
      display: inline-flex;
      justify-content: space-around;
      align-items: center;
      margin: 0 30px;
      font-size: 16px;

      .el-avatar {
        margin-right: 10px;
      }

      > * + * {
        margin-left: 6px;
      }
    }

    /* .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    } */
  }
}
.el-dropdown {
  cursor: pointer;
}
</style>
