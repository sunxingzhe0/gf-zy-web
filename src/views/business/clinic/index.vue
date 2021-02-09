<template>
  <section class="view__clinic">
    <header class="clinic__header">
      <el-button-group>
        <router-link
          v-for="{ label, value } in headerNav"
          :key="value"
          class="el-button el-button--medium"
          :class="active === value ? 'el-button--primary' : 'el-button--info'"
          :to="{ path: $route.path, query: { active: value } }"
          >{{ label }}</router-link
        >
      </el-button-group>

      <el-row class="clinic__header-filter" :gutter="20">
        <el-col :span="14">
          <span>时间段</span>
          <el-date-picker
            style="width: calc(100% - 4em);"
            v-model="conversation.date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyyMMddHHmmss"
            :default-time="['00:00:00', '23:59:59']"
            @change="
              ;[conversation.query.startTime, conversation.query.endTime] =
                $event || []
            "
          ></el-date-picker>
        </el-col>

        <el-col :span="10">
          <span>患者姓名</span>
          <el-input
            style="width: calc(100% - 5em - 10px);"
            v-model="conversation.query.search"
            placeholder="请输入"
          >
            <template v-slot:suffix>
              <i class="el-input__icon el-icon-search"></i>
            </template>
          </el-input>
        </el-col>
      </el-row>
    </header>

    <main class="clinic__main" ref="main">
      <div
        class="clinic__left-panel"
        v-drag-size:right="{ onDragUp }"
        ref="leftPanel"
        :style="'width:' + initWidth"
        v-loading="loadingLeft"
      >
        <el-tabs
          v-model="activeNameType"
          @tab-click="handleChangeType"
          type="border-card"
        >
          <el-tab-pane label="全部" name="all"></el-tab-pane>
          <el-tab-pane label="图文" name="图文"></el-tab-pane>
          <el-tab-pane label="视频" name="视频"></el-tab-pane>
        </el-tabs>
        <!-- <div class="minus">
          <el-button
            @click="toggle"
            size="mini"
            type="text"
            :icon="show ? 'el-icon-minus' : 'el-icon-plus'"
          ></el-button>
        </div> -->
        <transition name="page">
          <LiveVideo
            v-show="showVideo"
            class="clinic__video min230"
            :class="{ 'is-fullscreen': isFullScreen }"
            :mainScreen="mainScreen"
            @handleClose="handleClose"
            @toggleFullScreen="isFullScreen = !isFullScreen"
            @changeMainScreen="
              mainScreen = mainScreen == 'local' ? 'remote' : 'local'
            "
          />
        </transition>
        <ConversationList
          :data="conversation.list"
          :active-session-id="chat.sessionId"
          @handleClick="handleClick"
        />
      </div>

      <el-tabs
        class="clinic__tabs"
        :class="{ disable: !chat.sessionId }"
        v-model="activeName"
        type="border-card"
      >
        <el-tab-pane label="正在聊天" name="chat" lazy>
          <Chat
            ref="chat"
            v-model="showVideo"
            v-bind="chat"
            @close="closeChat"
            @reFreshUnReadMessages="reFreshUnReadMessages"
            @reloadConversationList="fetchConversationList"
          />
        </el-tab-pane>
        <el-tab-pane label="就诊档案" name="treatmentRecord" lazy>
          <div
            v-if="archives.length == 0"
            style="margin: 240px 0; color: #999;"
            class="is-center"
          >
            请在右侧点击请求查看患者档案
          </div>
          <iframe
            v-if="isShow"
            :src="archives"
            width="100%"
            class="iframeWa"
            else
          ></iframe>
        </el-tab-pane>
        <!-- <el-tab-pane label="院外档案" name="out" lazy>
          <CourtFile />
        </el-tab-pane> -->
      </el-tabs>

      <RightPanel
        v-bind="{
          ...chat,
          type:
            activeName === 'in'
              ? 'inner'
              : activeName === 'out'
              ? 'outer'
              : 'outer',
        }"
        @clinic="openTreatmentRecord"
      />
    </main>
  </section>
</template>

<script>
import { debounce } from 'lodash'
import NProgress from 'nprogress'
import LiveVideo, { join, leave } from './components/Video'
import ConversationList from './components/ConversationList'
import Chat from './components/Chat'
// import CourtFile from './components/courtFile'
import RightPanel from './components/RightPanel/index'
import { createSocket } from '@/components/Socket'
import DragSize from '@/directive/drag-size/index'
import { webDoctorSessionData } from '@/api'
import moment from 'moment'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import { logov } from '@/api/business'
export default {
  name: 'Clinic',
  components: {
    LiveVideo,
    ConversationList,
    Chat,
    // CourtFile,
    RightPanel,
  },
  directives: { DragSize },
  data() {
    this.startWidth = 0
    this.startX = 0
    this.mouseDown = false
    const [startTime, endTime] = [
      moment().startOf('day').format('YYYYMMDDHHmmss'),
      moment().endOf('day').format('YYYYMMDDHHmmss'),
    ]
    return {
      isShow: false,
      archives: [], //档案
      loadingLeft: false,
      activeNameType: 'all',
      activeName: 'chat', //默认
      conversation: {
        date: [startTime, endTime],
        query: {
          startTime,
          endTime,
          search: '',
        },
        list: [],
      },
      showVideo: false,
      isFullScreen: false,
      mainScreen: 'remote',

      chat: {},
      initWidth: (localStorage.getItem('l_panel_width') || '230') + 'px',
    }
  },
  computed: {
    headerNav() {
      return [
        { label: '在线咨询', value: 'CONSULT' },
        { label: '在线复诊', value: 'REPEAT_CLINIC' },
        { label: '慢病续方', value: 'CARRYON_PRESC' },
      ]
    },
    active() {
      return this.$route.query.active || this.headerNav[0].value
    },
  },
  watch: {
    'conversation.query': {
      handler: function () {
        this.fetchConversationList()
      },
      deep: true,
      immediate: true,
    },
    showVideo: function (val) {
      val
        ? join({
            mode: 'rtc',
            codec: 'h264',
            appID: this.AGORA_APPID,
            channel: val,
          })
        : leave()
    },
  },
  created() {
    this.init()
  },
  async beforeRouteUpdate(to, from, next) {
    await this.fetchConversationList()
    if (this.showVideo !== true) {
      next()
      return
    }

    this.$confirm('离开当前页面会关闭视频, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        this.handleClose()
        next()
      })
      .catch(() => {
        // hack
        NProgress.done()
        next(false)
      })
  },
  beforeRouteLeave(to, from, next) {
    if (this.showVideo !== true) {
      next()
      return
    }

    this.$confirm('离开当前页面会关闭视频, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        this.handleClose()
        next()
      })
      .catch(() => {
        next(false)
      })
  },
  mounted() {
    // setTimeout(() => {
    //   this.closeChat({
    //     wayType: 'VIDEO',
    //   })
    // }, 2000)
  },
  methods: {
    //结束服务
    closeChat(bizInfo) {
      this.fetchConversationList()
      this.chat = {}
      console.log(this.conversation.list.WAIT_TREAT)
      if (
        bizInfo &&
        bizInfo.wayType == 'VIDEO' &&
        this.conversation.list.WAIT_TREAT.some(({ bizType }) => bizType == 1)
      ) {
        this.$confirm('服务已结束，是否继续下一个?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            let item = this.conversation.list.WAIT_TREAT.filter(
              ({ bizType }) => bizType == 1,
            )[0]
            this.chat = { ...item }
            this.$nextTick(() => {
              this.$refs['chat'].beginWork()
            })
          })
          .catch(() => {
            // next(false)
          })
      }
    },
    init() {
      const IM = createSocket()
      IM.use('SYNC_SESSION', message => {
        message?.length && this.fetchConversationList()
      })
      IM.use('6', ({ info }) => {
        const sessionId = info.to.substr(1)
        this.reFreshUnReadMessages(sessionId)
      })
    },
    //档案
    openTreatmentRecord(item) {
      let path = ''
      let prefix = '/cdr/#/diagnosis/diagnosis'
      if (process.env.NODE_ENV === 'development') {
        prefix = 'https://wxapp.chuntaoyisheng.com/cdr/#/diagnosis/diagnosis'
      }
      this.isShow = false
      //outer 互联网  inner院内
      if (item.type == 'outer') {
        path = `${prefix}?tk=${getToken()}&typeName=${
          item.medicalType
        }&orderId=${item.orderId}&medicalId=${item.id}`
      } else {
        path = `${prefix}?tk=${getToken()}&typeName=${item.medicalType}&mpiId=${
          item.cardNo
        }&ehrId=${item.visitNo}`
      }
      setTimeout(() => {
        this.isShow = true
        this.archives = path
        this.activeName = 'treatmentRecord'
      })
    },
    handleClose() {
      this.isFullScreen = false
      this.$refs.chat.handleCallVideo()
    },

    fetchConversationList: debounce(async function () {
      this.loadingLeft = true
      const list = await webDoctorSessionData({
        ...this.conversation.query,
        tab: this.active,
      })
        .then(({ WAIT_TREAT = [], IN_TREAT = [], FINISH = [] } = {}) => ({
          WAIT_TREAT,
          IN_TREAT,
          FINISH,
        }))
        .finally(() => {
          this.loadingLeft = false
        })

      for (const [key, value] of Object.entries(list)) {
        list[key] = Object.assign(value, {
          [key]: value.map(session =>
            Object.assign(session, {
              unReadMessages: store.state.messages[session.sessionId]?.length,
            }),
          ),
        })
      }

      this.conversation.list = list

      this.loadingLeft = false
      if (this.activeNameType != 'all') {
        this.conversation.list.WAIT_TREAT = this.conversation.list.WAIT_TREAT.filter(
          item => item.bizTypeName == this.activeNameType,
        )
        this.conversation.list.IN_TREAT = this.conversation.list.IN_TREAT.filter(
          item => item.bizTypeName == this.activeNameType,
        )
        this.conversation.list.FINISH = this.conversation.list.FINISH.filter(
          item => item.bizTypeName == this.activeNameType,
        )
      }
      !Object.values(this.conversation.list)
        .flat()
        .map(({ sessionId }) => sessionId)
        .includes(this.chat.sessionId) && (this.chat = {})
    }, 500),

    handleClick(item) {
      this.chat = { ...item }
      this.archives = ''
      this.activeName = 'chat'
    },
    handleChangeType() {
      this.fetchConversationList()
    },
    onDragUp(data) {
      localStorage.setItem('l_panel_width', data.width)
    },
    reFreshUnReadMessages(id) {
      const sessions = Object.values(this.conversation.list)
        .flat()
        .filter(({ sessionId }) => sessionId === id)

      if (sessions.length) {
        const status = sessions[0].status
        const idx = this.conversation.list[status]
          .map(({ sessionId }) => sessionId)
          .indexOf(id)

        this.conversation.list[status][idx].unReadMessages =
          store.state.messages[id]?.length
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_variables.scss';

$header-height: 80px;

%block {
  flex: 1;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  background: $--color-white;
}

.clinic__left-panel {
  flex: none;
  user-select: none;
  overflow: hidden;
  .el-tabs {
    border: none;
    .el-tabs__header {
      border-bottom: none;
      .el-tabs__nav {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .el-tabs__item {
          width: 33.33%;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .el-tabs__content {
      padding: 0;
    }
  }
  .minus {
    text-align: right;
    padding-right: 15px;
  }
  .min230 {
    min-width: 230px;
  }

  .drag-bar {
    position: absolute;
    top: 0;
    right: -5px;
    bottom: 0;
    width: 10px;
    cursor: ew-resize;
    z-index: 10;
  }
}

.view__clinic {
  min-width: 1200px;
  color: #666;

  > * + * {
    margin-top: 4px;
  }
}

.clinic__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 45px;
  padding: 10px;
  @extend %block;

  .el-button-group > .el-button {
    padding: 10px 20px;
    border: none;

    &.el-button--info {
      color: #656565;
      background: #f1f1f1;
    }
  }
}
.clinic__header-filter {
  max-width: 760px;

  .el-col > span {
    margin-right: 10px;
  }
}

.clinic__main {
  display: flex;
  position: relative;
  height: calc(100vh - #{$router-view-offset-height} - 40px - 10px);

  > * {
    @extend %block;
  }

  > * + * {
    margin-left: 4px;
  }
}

.clinic__left-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 350px;
  min-width: 230px;
}
.clinic__video {
  position: relative;
  height: 400px;
  background: $--color-black;
}

.clinic__tabs {
  flex: 2;
  width: 0; /* or overflow: hidden; 不让子元素撑开box */
  border: none;
  overflow: hidden;

  &.disable {
    position: relative;
    pointer-events: none;

    &::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: $--color-white;
      opacity: 0.8;
      content: '';
      z-index: 1000;
    }
  }
  .iframeWa {
    border: none;
    height: calc(100vh - 157px);
  }
  .c__chat {
    margin: -15px;
  }
}
</style>
