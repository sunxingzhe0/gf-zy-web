<template>
  <section ref="wrap" class="c__chat">
    <header>
      <strong>{{ bizInfo.memberName }}</strong>
      <span v-if="bizInfo.status == 'IN_TREAT'">
        {{ currentTime | dealTime }}
      </span>
    </header>

    <!-- 诊室自动关闭倒计时 -->
    <RoomCountdown
      v-if="bizInfo.countDown"
      :countDown="bizInfo.countDown"
      :status="bizInfo.status"
    ></RoomCountdown>
    <main @click="commonWords.visible = false">
      <DynamicScroller
        class="scroller"
        ref="scroller"
        :items="items"
        :min-item-size="54"
      >
        <template #before>
          <infinite-loading
            :distance="distance"
            :identifier="identifier"
            direction="top"
            @infinite="infiniteHandler"
          >
            <div slot="no-more" style="margin-top: 10px; font-size: 14px;">
              已经到顶啦
            </div>

            <template #no-results>
              <Empty />
            </template>
          </infinite-loading>
          <div v-if="bizInfo.bizType == 'CONSULT'" class="question-tip">
            本次服务，患者可以向您咨询
            <span :style="{ color: '#e45c5c' }">{{
              bizInfo.questionNum || 0
            }}</span>
            个问题
          </div>
        </template>

        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :size-dependencies="[item.support]"
            :data-index="index"
            :data-active="active"
            class="c__chat-message"
            :class="itemClass(item)"
            :data-receipt="itemReceipt(item)"
          >
            <span v-if="item.tips">{{ item.tips }}</span>

            <template v-else>
              <el-avatar
                v-if="item.avatar"
                :key="item.avatar"
                :src="FILE_URL(item.avatar)"
                class="avatar"
              >
                <i class="el-icon-user-solid"></i>
              </el-avatar>
              <el-avatar
                v-else
                class="avatar"
                icon="el-icon-user-solid"
              ></el-avatar>

              <MessageItem
                v-if="items.length > 0"
                v-bind="{
                  ...item,
                  bizType: bizInfo.bizType,
                  templateList: commonWords.list,
                  orderId,
                  messageData: viewMessageDialogData,
                }"
                @click.native="handleMessageClick(item)"
                @updateTemplate="updateTemplate"
                @changeTemplate="changeTemplate"
              />
            </template>
          </DynamicScrollerItem>
        </template>

        <template #after>
          <div v-observe-visibility="visibilityChanged"></div>
        </template>
      </DynamicScroller>

      <transition name="page">
        <div class="c__chat-message-tips" v-show="showMessageTips">
          <el-button type="text" @click="scrollToBottom">
            你有新消息（点击查看）
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
        </div>
      </transition>

      <!-- <transition name="fade-transform">
        <div class="c__chat-record-btn" v-show="showRecordBtn">
          <el-button type="text" @click="recordVisible = true">
            查看更多聊天记录
            <i class="el-icon-arrow-right el-icon--right"></i>
          </el-button>
        </div>
      </transition>-->

      <div
        class="c__chat-footer"
        :style="
          ['APPOINTMENT', 'WAIT_TREAT'].includes(bizInfo.status)
            ? 'height:150px'
            : 'height:' + initHeight
        "
      >
        <template v-if="['APPOINTMENT', 'WAIT_TREAT'].includes(bizInfo.status)">
          <div v-if="bizInfo.bizType == 'CARRYON_PRESC'" class="begin-work">
            <el-button type="primary" plain @click="refuseWork">拒绝</el-button>
            <el-button
              type="primary"
              :style="{ marginLeft: '40px' }"
              @click="beginWork"
              >开始接诊</el-button
            >
          </div>
          <div v-else-if="bizInfo.wayType == 'VIDEO'" class="begin-work">
            <el-button type="primary" @click="beginWork">开始接诊</el-button>
          </div>
        </template>

        <el-tabs
          v-show="
            bizInfo.bizType == 'CONSULT' ||
            (bizInfo.bizType == 'REPEAT_CLINIC' &&
              bizInfo.wayType == 'GRAPHIC') ||
            bizInfo.status == 'IN_TREAT' ||
            bizInfo.status == 'FINISH'
          "
          type="border-card"
          v-model="activeName"
          :style="{
            height: `${footerHeight}px`,
            maxHeight: height + 'px',
            minHeight: '50px',
          }"
          :class="{ prescription: activeName === 'prescription' }"
          @tab-click="tabChange"
          v-drag-size:top="{
            child: '.el-tabs',
            onDragUp,
          }"
          :before-leave="tabBeforeChange"
        >
          <el-tab-pane name="message" lazy class="message-wrap">
            <template v-slot:label>
              <svg-icon icon-class="message"></svg-icon> 聊天
            </template>

            <el-scrollbar
              class="common-words wrap-overflow-x-auto"
              v-show="commonWords.visible"
            >
              <a
                v-for="({ id, content }, index) in commonWords.list"
                :key="id"
                href="javascript:;"
                @click.stop="resolveAddCommonWords({ id, content })"
              >
                <!-- @dblclick="commonWords.editId = id" -->
                <el-input
                  size="mini"
                  :style="{
                    'pointer-events':
                      commonWords.editId !== id ? 'none' : 'auto',
                  }"
                  v-model="commonWords.list[index].content"
                ></el-input>

                <!-- <el-button
                  type="text"
                  @click.stop="resolveAddCommonWords({ id, content })"
                  >选中</el-button
                > -->
                <el-button
                  type="text"
                  @click.stop="resolveEditCommonWords(index)"
                  >{{ commonWords.editId !== id ? '修改' : '保存' }}</el-button
                >
                <el-button
                  type="text"
                  @click.stop="resolveDelCommonWords(id, index)"
                  >删除</el-button
                >
              </a>
            </el-scrollbar>

            <el-scrollbar class="content wrap-overflow-x-auto">
              <pre
                class="edit-area"
                contenteditable
                placeholder="请输入内容"
                ref="editArea"
                @input="e => (message = e.target.innerText)"
                @paste.prevent="reslovePaste"
                @keyup.enter.prevent.exact="sendMessage()"
                @click="setRange"
                @keyup="setRange"
              ></pre>
            </el-scrollbar>

            <div class="toolbar">
              <div>
                <el-button
                  v-if="bizInfo.status == 'IN_TREAT'"
                  size="mini"
                  type="danger"
                  plain
                  @click="handleClose"
                  >结束服务</el-button
                >
              </div>

              <transition name="page" v-if="bizInfo.wayType == 'VIDEO'">
                <el-button
                  v-show="enableVideo"
                  size="mini"
                  :disabled="bizInfo.status == 'FINISH'"
                  icon="el-icon-video-camera"
                  @click="handleCallVideo"
                  >{{ showVideo ? '关闭' : '发起' }}视频</el-button
                >
              </transition>

              <el-button
                size="mini"
                plain
                icon="el-icon-chat-line-square"
                @click.stop="commonWords.visible = !commonWords.visible"
                >常用语</el-button
              >

              <el-upload
                style="margin: 0 10px; display: inline-block;"
                action
                :show-file-list="false"
                accept="image/png, image/jpeg, image/gif, image/webp"
                :on-success="handleImageSuccess"
                :before-upload="beforeImageUpload"
                :http-request="httpRequest"
              >
                <el-button size="mini" plain icon="el-icon-picture"
                  >图片</el-button
                >
              </el-upload>
              <el-button
                size="mini"
                type="primary"
                :loading="pending"
                @click="sendMessage()"
                >发送</el-button
              >
            </div>
          </el-tab-pane>
          <el-tab-pane
            v-if="bizInfo.bizType != 'CONSULT'"
            name="diagnosis"
            lazy
          >
            <template v-slot:label>
              <svg-icon icon-class="chat-diagnosis"></svg-icon> 诊断
            </template>
            <Diagnosis
              v-bind="bizInfo"
              @send="backMessage"
              @cancel="backMessage"
              ref="diagnosis"
            ></Diagnosis>
          </el-tab-pane>
          <el-tab-pane
            v-if="bizInfo.bizType != 'CONSULT'"
            name="medicalRecord"
            lazy
          >
            <template v-slot:label>
              <svg-icon icon-class="chat-medical-record"></svg-icon> 病历
            </template>
            <Medical
              :clearValid="clearValid"
              ref="medicalRecord"
              v-bind="bizInfo"
              @send="sendMedical"
            />
          </el-tab-pane>
          <el-tab-pane v-if="bizInfo.bizType != 'CONSULT'" name="prescription">
            <template v-slot:label>
              <svg-icon icon-class="chat-prescription"></svg-icon> 处方
            </template>
            <div style="height: 100%;">
              <Prescription
                inClinic
                ref="prescription"
                v-if="bizInfo.diagnosis"
                :createParams="createParams"
                :orderId="createParams.orderId"
              ></Prescription>
            </div>
          </el-tab-pane>

          <el-tab-pane name="handle" lazy>
            <template v-slot:label>
              <svg-icon
                icon-class="chat-chuzhi"
                style="font-size: 20px; margin-bottom: -2px;"
              ></svg-icon
              >处置</template
            >
            <Handle :bizInfo="{ ...bizInfo, sex: $attrs.sex }"></Handle>
          </el-tab-pane>

          <el-tab-pane name="roomOrder" lazy>
            <template v-slot:label>
              <svg-icon
                icon-class="chat-yuyue"
                style="font-size: 20px; margin-bottom: -2px;"
              ></svg-icon
              >诊间预约</template
            >
            <RoomOrder :bizInfo="bizInfo" @toogleTab="toogleTab"></RoomOrder>
          </el-tab-pane>
        </el-tabs>
      </div>
    </main>

    <!-- preview image -->
    <el-image
      ref="previewImage"
      class="preview-image-helper"
      :src="previewImageHelper"
      :preview-src-list="previewSrcList"
    ></el-image>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="viewMessageDialogShow"
      width="60%"
      top="50px"
    >
      <component
        v-if="viewMessageDialogShow"
        :is="viewMessageDialogComponent"
        :viewMessageDialogData="viewMessageDialogData"
        :orderId="orderId"
      ></component>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="viewMessageDialogShow = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { ObserveVisibility } from 'vue-observe-visibility'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import InfiniteLoading from 'vue-infinite-loading'
import { mapState } from 'vuex'
import {
  addResizeListener,
  removeResizeListener,
} from 'element-ui/src/utils/resize-event'

import { Empty } from '@/components'
import Prescription from '@/components/Prescription'
import MessageItem from './MessageItem.js'
import { createSocket } from '@/components/Socket'
import { DIAS, EMH, RP } from './messageModals'

import { reslovePaste, generatorIntervalTime, isScrollBottom } from './helper'
import { enumChatType, enumChildMessageTypeEnum } from './enums'
import {
  historyMessage,
  uploadFile,
  finishChat,
  beginChat,
  orderAudit,
  updateChatTime,
  video,
  clinicInfo,
} from '@/api'
import {
  findTemplateData,
  editTemplate,
  delTemplate,
  updateTemplateNum,
} from '@/api/template'
import {
  Diagnosis,
  Medical,
  RoomCountdown,
  Handle,
  RoomOrder,
} from './components'
import DragSize from '@/directive/drag-size'

export default {
  name: 'Chat',
  model: {
    prop: 'showVideo',
    event: 'toggle-video',
  },
  filters: {
    dealTime(val) {
      if (val === 'end') {
        return '已结束'
      }
      const hour = Math.floor(val / 3600)
      const min = Math.floor((val / 60) % 60)
      const ss = val % 60

      if (hour) {
        return `当前会话时长 ${hour}时${min}分${ss}秒`
      }
      return `当前会话时长 ${min}分${ss}秒`
    },
  },
  props: {
    showVideo: [Boolean, String],
    orderId: String,
    sessionId: String,
  },
  components: {
    DynamicScroller,
    DynamicScrollerItem,
    InfiniteLoading,
    Empty,
    MessageItem,
    Diagnosis,
    Prescription,
    Medical,
    DIAS,
    EMH,
    RP,
    RoomCountdown,
    Handle,
    RoomOrder,
  },
  directives: {
    'observe-visibility': ObserveVisibility,
    DragSize,
  },
  data() {
    this.itemClass = function ({ from, tips, childMessageType, chatType }) {
      return {
        'is-self':
          from === this.userId && (chatType == 'DOCTOR' || chatType == 2),
        'is-tips': tips,
        [childMessageType?.toLowerCase?.()]:
          typeof childMessageType === 'string',
      }
    }

    this.itemReceipt = function () {
      // return item.from === this.userId ? (item.new ? '未读' : '已读') : false
      return false
    }

    this.historyQuery = {
      msgId: -1,
      pageNum: 10,
    }

    return {
      clearValid: true,
      dialogTitle: '',
      duration: new Date(),

      distance: -Infinity,
      identifier: +new Date(),

      items: [],

      message: '',
      pending: false,

      commonWords: {
        editId: '',
        visible: false,
        list: [],
      },

      showMessageTips: false,
      previewImageHelper: '',

      activeName: 'message',

      timer: null,
      currentTimer: null,
      nowTime: new Date().getTime(), // 当前时间

      /* main size */
      height: 0,

      bizInfo: {},

      viewMessageDialogShow: false,
      viewMessageDialogComponent: '',
      viewMessageDialogData: null,
      initHeight: (localStorage.getItem('footer_panel_height') || '200') + 'px',
      dailogTitle: '查看消息内容',
    }
  },
  computed: {
    ...mapState('user', ['userId', 'titleId']),
    /* duration() {
      if (!this.activation) return ''
      return `
        ${Math.floor(this.duration / 60 / 60)}小时
        ${Math.floor((this.duration / 60) % 60)}分
        ${this.duration % 60}秒
      `
    }, */

    footerHeight() {
      const arr = [
        'prescription',
        'diagnosis',
        'medicalRecord',
        'handle',
        'roomOrder',
      ]
      return arr.includes(this.activeName)
        ? this.height
        : this.commonWords.visible
        ? 400
        : localStorage.getItem('footer_panel_height') || 200
    },

    previewSrcList() {
      return this.items.reduce((_, { childMessageType, body }) => {
        if (childMessageType === 'IMAGE' && body) {
          _.push(this.FILE_URL(body))
        }
        return _
      }, [])
    },

    currentTime() {
      if (this.bizInfo.acceptsTime) {
        const startTime = new Date(this.bizInfo.acceptsTime).getTime()
        return parseInt((this.nowTime - startTime) / 1000)
      }
      return 'end'
    },

    showRecordBtn() {
      return this.items.filter(_ => !_.tips).length > 10
    },

    enableVideo() {
      return this.$route.query.active === 'REPEAT_CLINIC'
    },

    createParams() {
      return {
        titleId: this.titleId,
        userId: this.bizInfo.userId,
        orderId: this.bizInfo.orderId,
        memberId: this.bizInfo.memberId,
        serviceType: this.bizInfo.bizType,
        serviceMode: this.bizInfo.wayType,
        memberName: this.bizInfo.memberName,
        treatmentTime: this.bizInfo.createTime,
        memberSex: this.$attrs.sex === '男' ? 1 : 0,
      }
    },
  },
  watch: {
    footerHeight() {
      console.log(this.footerHeight)
    },
    sessionId: function (value, oldValue) {
      oldValue && this.clean()
      value && this.init()
    },
    orderId: function () {
      this.getClinicInfo()
      this.activeName = 'message'
    },
    closeTimeCompute(newVal) {
      if (newVal == '00 : 00 : 00') {
        // 这是刷新左边列表 直接调用泪目
        this.beginWork()
      }
    },
  },
  created() {
    this.orderId && this.getClinicInfo()
  },
  mounted() {
    this.calcSize = () => {
      this.height = this.$refs.wrap.offsetHeight - 20
    }
    addResizeListener(this.$refs.wrap, this.calcSize)
  },
  beforeDestroy() {
    this.clean()
    removeResizeListener(this.$refs.wrap, this.calcSize)
  },
  methods: {
    async init() {
      this.currentTimer = setInterval(() => {
        this.nowTime = new Date().getTime()
      }, 1000)

      this.distance = 100
      this.identifier += 1

      this.timer = setInterval(() => this.duration++, 1000)
      this.$nextTick(() => {
        this.$refs.editArea?.focus()
      })

      this.IM = createSocket()

      //已读消息
      this.IM.readMessage(this.sessionId)
      this.$emit('reFreshUnReadMessages', this.sessionId)

      // 注册接收信息
      this.mid = this.IM.use('6', message => {
        if (message.info.to !== `#${this.sessionId}`) return
        const newMsg = {
          ...message.info,
          id: message.info.msgId,
          chatType:
            enumChatType[message.info.chatType] || message.info.chatType,
          childMessageType:
            Object.keys(enumChildMessageTypeEnum).find(
              key =>
                enumChildMessageTypeEnum[key] ===
                  message.info.childMessageType ||
                key == message.info.childMessageType,
            ) ?? '',
          support: {},
          // avatar:
        }
        if (Array.isArray(newMsg.id)) {
          const indexs = newMsg.id
            .map(item => {
              const index = this.items.findIndex(it => it.id === item)
              return index
            })
            .filter(item => item !== -1)
          indexs.forEach(index => {
            const item = this.items[index]
            item.status = newMsg.status
            item.optContent = newMsg.optContent
            this.items.splice(index, 1, item)
          })
        } else {
          const index = this.items.findIndex(item => item.id === newMsg.id)
          if (index !== -1) {
            this.items.splice(index, 1, newMsg)
          } else {
            this.items.push(newMsg)
          }
        }

        this.IM.readMessage(this.sessionId)
        this.$emit('reFreshUnReadMessages', this.sessionId)

        if (
          message.info.childMessageType ===
            enumChildMessageTypeEnum['CRVIDEO'] &&
          ['leave', 'refuse'].includes(message.info.body)
        )
          this.$emit('toggle-video', false)

        if (isScrollBottom(this.$refs.scroller.$el)) this.scrollToBottom()
        else this.showMessageTips = true
      })

      // 获取常用语
      this.commonWords.list = await findTemplateData({ pageSize: 9999 }).then(
        ({ list }) => list,
      )
    },
    async updateTemplate() {
      this.commonWords.list = await findTemplateData({ pageSize: 9999 }).then(
        ({ list }) => list,
      )
    },
    changeTemplate(message) {
      this.commonWords.visible = true
      let index = 0

      for (let i = 0; i < this.commonWords.list.length; i++) {
        const element = this.commonWords.list[i]
        if (element.content == message.body) {
          index = i
        }
      }
      this.resolveEditCommonWords(index)
    },
    isSelf(message) {
      return (
        message.from === this.userId &&
        (message.chatType == 'DOCTOR' || message.chatType == 2)
      )
    },
    tabChange({ name }) {
      if (this.bizInfo.orderId) {
        if (name == 'diagnosis' && this.$refs[name]) {
          this.$refs[name].loadDiagnosis()
        }
        if (name == 'medicalRecord' && this.$refs[name]) {
          this.$refs[name].getDiseaseInClinic()
        }
        if (name === 'prescription' && this.$refs[name]) {
          this.$refs[name].cancel()
        }
      }
      //是否验证
      if (name != 'medicalRecord') {
        this.clearValid = false
      } else {
        this.clearValid = true
      }
    },
    tabBeforeChange(activeName) {
      if (this.bizInfo.status === 'FINISH' && activeName === 'roomOrder') {
        this.$message.info('该服务已结束，不能进行诊间预约')
        return false
      }
      if (activeName === 'prescription' && !this.bizInfo.diagnosis) {
        this.$message.info('开立诊断，才能开立处方')
        return false
      }
      return true
    },
    clean() {
      this.distance = -Infinity
      this.timer && this.deleteInterval('timer')
      this.interval && this.deleteInterval('interval')
      this.currentTimer && this.deleteInterval('currentTimer')

      this.historyQuery.msgId = -1
      this.items = []
      this.message = ''
      if (this.$refs.editArea) this.$refs.editArea.innerHTML = ''
      this.IM?.eject('6', this.mid)
      this.mid = null
    },
    scrollToBottom() {
      this.$refs.scroller.scrollToBottom()
      this.showMessageTips = false
    },
    // scroller slot after into view
    visibilityChanged(isVisible) {
      if (isVisible) this.showMessageTips = false
    },
    // 结束服务
    handleClose() {
      this.$confirm('确认结束服务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          finishChat({ orderId: this.orderId }).then(() => {
            this.clean()
            this.$emit('close', this.bizInfo)
          })
        })
        .catch(() => {})
    },
    async refuseWork() {
      const params = {
        orderId: this.orderId,
        reply: false,
      }
      await orderAudit(params)
      this.$emit('reloadConversationList')
      this.getClinicInfo()
    },
    async beginWork() {
      await beginChat({
        orderId: this.orderId,
      })
      this.$emit('reloadConversationList')
      this.interval && this.deleteInterval('interval')

      this.getClinicInfo()
    },
    async fetchHistory() {
      const { userId, sessionId } = this
      const data = await historyMessage({
        userId,
        sessionId,
        ...this.historyQuery,
      })

      this.items.unshift(
        ...data.reduce((_, item, index) => {
          let avatar = this.$store.getters.avatar
          if (!this.isSelf(item)) {
            avatar = this.bizInfo.userAvatar
          }
          _.unshift({
            ...item,
            support: {},
            avatar: avatar,
          })

          // 根据间隔生成事件
          const intervalTime = generatorIntervalTime(data, index, 1)
          intervalTime && _.unshift(intervalTime)

          return _
        }, []),
      )

      if (this.historyQuery.msgId === -1) this.scrollToBottom()
      this.historyQuery.msgId = data[data.length - 1]?.msgId

      return data.length === 0
    },

    async infiniteHandler($state) {
      const isCompleted = await this.fetchHistory()
      isCompleted ? $state.complete() : $state.loaded()
    },

    /**
     * 输入框相关
     */
    handleCallVideo() {
      this.sendMessage('CRVIDEO', this.showVideo ? 'leave' : '')
      this.$emit('toggle-video', this.showVideo ? false : this.sessionId)

      if (!this.showVideo) video({ orderId: this.orderId })
    },
    resolveAddCommonWords({ id, content }) {
      updateTemplateNum({ id })
      this.message += content
      this.$refs.editArea.innerHTML += content
      this.commonWords.visible = false
    },
    async resolveEditCommonWords(index) {
      const { id, content } = this.commonWords.list[index]
      if (this.commonWords.editId != id) {
        this.commonWords.editId = id
        this.$nextTick(() => {
          document
            .querySelectorAll('.common-words .el-scrollbar__view > a')
            [index].querySelector('input')
            .focus()
        })
        return
      }

      await editTemplate({ id, content })
      this.commonWords.list[index].content = content
      this.commonWords.editId = ''

      this.$message({
        type: 'success',
        message: '修改成功',
        showClose: true,
      })
    },
    async resolveDelCommonWords(id, index) {
      await delTemplate({ id })
      this.commonWords.list.splice(index, 1)

      this.$message({
        type: 'success',
        message: '删除成功',
        showClose: true,
      })
    },
    handleImageSuccess(id) {
      this.sendMessage('IMAGE', id)
    },
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isWEBP = file.type === 'image/webp'

      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG && !isGIF && !isWEBP) {
        this.$message.error('上传头像图片只能是 JPG PNG GIF WEBP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG || isGIF || isWEBP) && isLt2M
    },
    httpRequest({ file, onProgress, onSuccess, onError }) {
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData, onProgress).then(onSuccess).catch(onError)
    },
    reslovePaste,
    setRange() {
      this.range = window.getSelection().getRangeAt(0)
    },
    backMessage() {
      this.activeName = 'message'
      this.getClinicInfo()
    },
    sendMessage(childMessageType = 'DEFAULT', body = this.message) {
      body = body.replace(/\s+|[\r\n]/g, '')
      if (childMessageType == 'DEFAULT' && body.length == 0) {
        this.$message.warning('请输入要发送的内容！')
        return false
      } else {
        if (this.pending || !navigator.onLine || this.IM.getSocketState() !== 1)
          return

        this.pending = true

        // 消息回执
        const _ = this.IM.use('104', message => {
          if (!message.status.state) {
            this.$message({
              type: 'error',
              message: `消息发送失败:${message.status.message}`,
              showClose: true,
            })
          } else {
            this.items.push({
              ...message.status,
              from: this.userId,
              body,
              childMessageType,
              childType: 'DOCTOR',
              id: message.status.msgId,
              support: {},
              chatType: 'DOCTOR',
              avatar: this.$store.getters.avatar,
            })

            this.$nextTick(() => {
              this.scrollToBottom()
            })

            this.message = ''
            this.$refs.editArea.innerHTML = ''
          }

          this.pending = false
          this.IM.eject('104', _)
        })

        this.IM.sendMessage({
          RequestType: 4,
          info: {
            messageType: 0,
            childMessageType: enumChildMessageTypeEnum[childMessageType] ?? 0,
            to: this.sessionId,
            body,
          },
        })

        if (this.bizInfo.status === 'WAIT_TREAT') this.beginWork()

        updateChatTime({
          orderId: this.orderId,
          sessionId: this.sessionId,
        })
      }
    },

    /**
     * 消息内的事件处理
     */
    handleMessageClick(item) {
      const { childMessageType, body } = item
      this.dailogTitle = '查看消息内容'
      switch (childMessageType) {
        case 'IMAGE':
          this.previewImageHelper = body ? this.FILE_URL(body) : ''
          this.$refs.previewImage?.clickHandler()

          break
        case 'DIAS':
          this.dialogTitle = '诊断详情'
          this.viewMessageDialogComponent = childMessageType
          this.viewMessageDialogData = item
          this.viewMessageDialogShow = true
          break
        case 'EMH':
          this.dialogTitle = '病历详情'
          this.viewMessageDialogComponent = childMessageType
          this.viewMessageDialogShow = true
          break
        case 'RP':
          this.activeName = 'prescription'
          break
        case 'DSO':
          this.activeName = 'handle'
          break
        case 'ZJ':
        // this.activeName = 'handle'
        // break;
      }
    },

    sendMedical() {
      this.deleteInterval('interval')
      setTimeout(() => {
        this.$emit('reloadConversationList')
        this.getClinicInfo()
      }, 1000)
      this.backMessage()
    },

    async getClinicInfo() {
      const bizInfo = (await clinicInfo({ orderId: this.orderId })) ?? {}
      this.bizInfo = { ...bizInfo }

      const { status, startTime, closeTime } = bizInfo
      let countDownTimestamp = null

      if (status == 'APPOINTMENT' && startTime) {
        countDownTimestamp = +new Date(startTime.replace(/-/g, '/'))
      } else if (
        ['WAIT_TREAT', 'IN_TREAT', 'FINISH'].includes(status) &&
        closeTime
      ) {
        countDownTimestamp = +new Date(closeTime.replace(/-/g, '/'))
      }

      if (countDownTimestamp) {
        this.countDownFunc(countDownTimestamp)
        this.interval = setInterval(() => {
          this.countDownFunc(countDownTimestamp)
        }, 1000)
      } else {
        this.interval && this.deleteInterval('interval')
      }
    },
    countDownFunc(countDownTimestamp) {
      const time = countDownTimestamp - +new Date()

      if (time <= 0) {
        this.deleteInterval('interval')
        this.$set(this.bizInfo, 'countDown', null)
        this.$emit('reloadConversationList')
        this.getClinicInfo()
        return
      }

      const h = parseInt(time / 1000 / 60 / 60)
      const m = parseInt((time / 1000 / 60) % 60)
      const s = parseInt(((time / 1000) % 60) % 60)

      this.$set(
        this.bizInfo,
        'countDown',
        `${('0' + h).substr(-2)} : ${('0' + m).substr(-2)} : ${('0' + s).substr(
          -2,
        )}`,
      )
    },
    onDragUp(data) {
      localStorage.setItem('footer_panel_height', data.height)
      this.initHeight =
        (localStorage.getItem('footer_panel_height') || '200') + 'px'
      console.log(this.initHeight)
    },

    // 切换tab
    toogleTab(tabName) {
      this.activeName = tabName
    },

    deleteInterval(interval) {
      clearInterval(this[interval])
      this[interval] = null
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_variables.scss';

.c__chat {
  .begin-work {
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    background: rgba(255, 255, 255, 0.8);
  }
  > header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    border-bottom: 1px solid $--color-info-light;
    font-size: 14px;

    strong {
      font-size: 20px;
      color: $--color-text-primary;
    }
  }

  // main
  > main {
    display: flex;
    flex-flow: column;
    flex-direction: column;
    position: relative;
    /* 头工具栏高度 80  margin-top 10  el-tabs header height 39  header height 60 */
    height: calc(
      100vh - #{$router-view-offset-height} - 40px - 10px - 39px - 40px - 20px
    );
  }
  .scroller {
    flex: 1;
  }
  .c__chat-footer {
    position: relative;
    height: 200px;
  }

  .preview-image-helper {
    > img,
    .el-image__error {
      display: none;
    }
  }
}

.c__chat-message-tips {
  width: 50%;
  position: absolute;
  top: calc(100% - 260px - 36px);
  right: 0;
  left: 0;
  padding: 0 20px;
  background: rgba($--color-white, 0.98);
}

@supports (
  (-webkit-backdrop-filter: saturate(180%) blur(20px)) or
    (backdrop-filter: saturate(180%) blur(20px))
) {
  .c__chat-message-tips {
    backdrop-filter: saturate(180%) blur(20px);
    background: rgba($--color-white, 0.8);
  }
}

.c__chat-record-btn {
  position: absolute;
  top: 36px;
  right: 0;
  z-index: 1;
  padding: 0 10px;
  background: $--color-white;
  border-radius: 18px 0 0 18px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

  > .el-button--text {
    color: #999;
  }
}

.c__chat-message {
  display: flex;
  min-height: 54px;
  padding: 12px;

  &[data-receipt]::before {
    flex: auto 0 0;
    align-self: center;
    margin-right: 10px;
    font-size: 12px;
    color: $--color-info;
    content: attr(data-receipt);
  }

  .avatar {
    flex: auto 0 0;
    margin: 0 12px;
    height: 30px;
    width: 30px;
    line-height: 30px;
    border-radius: 50%;
    overflow: hidden;
    & > img {
      width: 100%;
    }
  }

  &.is-self {
    justify-content: flex-end;

    .avatar {
      order: 1;
    }

    .message__text {
      color: #fff;
      background-color: $--color-primary;
    }
  }

  &.is-tips {
    justify-content: center;
    align-items: center;

    > span {
      padding: 0 20px;
      border-radius: 12px;
      font-size: 12px;
      line-height: 18px;
      color: #999;
      background-color: #f5f5f5;
    }
  }
}
.c__chat-footer {
  > .el-tabs {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    border-width: 1px 0 0;
    box-shadow: none;
    // transition: height 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
    // will-change: height;

    .el-tabs__content {
      height: calc(100% - 39px);
      padding: 5px;
    }

    .el-tab-pane {
      height: 100%;
    }
  }

  .message-wrap {
    display: flex;
    flex-direction: column;
  }

  .edit-area {
    display: block;
    margin: 0;
    min-height: 80px;
    outline: none;
    border: 0;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: inherit;
    line-height: 1.6;

    &:empty::before {
      font-size: 12px;
      color: #999;
      content: attr(placeholder);
    }
  }

  .common-words {
    margin: 0;
    min-height: 100px;
    max-height: 200px;
    border-bottom: 2px solid #f1f1f1;

    a {
      display: flex;
      align-items: center;
      border: 1px solid #f1f1f1;

      > .el-input {
        margin: 0 10px;

        + * {
          margin-right: auto;
        }

        > .el-input__inner {
          border-color: transparent;
        }
      }

      > .el-button {
        visibility: hidden;
      }

      &:hover {
        background: $--color-info-lighter;

        > .el-button {
          visibility: initial;
        }
      }
    }
  }

  .content {
    flex: 1;
  }

  .toolbar {
    display: flex;
    margin-top: 10px;

    > *:first-child {
      margin-right: auto;
    }
  }
}
.question-tip {
  width: 320px;
  margin: 20px auto 0;
  padding: 6px 0;
  border-radius: 40px;
  text-align: center;
  font-size: 14px;
  background-color: #e6e6e6;
  color: #343434;
}
</style>
<style lang="scss" scoped>
.prescription ::v-deep {
  .el-tabs__content {
    padding: 0 0 5px;
  }
  .drugs-list-body {
    height: calc(100% - 76px);
  }
}
</style>
