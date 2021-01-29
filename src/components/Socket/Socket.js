import protobuf from 'protobufjs'
import jsonDescriptor from './imessage.json'
import { MessageBox } from 'element-ui'
import { merge } from 'lodash'

import store from '@/store'

import {
  userSyncData,
  userSyncVersion,
  userImSequence,
  sessionLastMessage,
} from '@/api'

/**
 * im login
 */
function login({
  timestamp = +new Date(),
  systemType = 'WEB',
  deviceType = 'WEB',
} = {}) {
  this.sendMessage({
    RequestType: 1,
    login: {
      token: store.state.user.socketToken,
      timestamp,
      systemType,
      deviceType,
    },
  })

  setUserSyncVersion()
}

async function setUserSyncVersion() {
  const userId = store.state.user.userId
  store.dispatch('im/setUserSyncVersion', await userSyncVersion({ userId }))
}

async function handleSync() {
  const userId = store.state.user.userId
  const version = store.state.im.version
  if (userId && version) {
    const { syncData } = await userSyncData({
      userId,
      version,
    })

    const commands = syncData.map(item => item.command)
    const SYNC_MESSAGE_INDEX = commands.findIndex(
      item => item === 'SYNC_MESSAGE' || item === 'SYNC_MESSAGE_ANS',
    )

    if (SYNC_MESSAGE_INDEX > -1) {
      const sequence = await userImSequence({ userId })
      store.dispatch('im/updateSequence', sequence)
      getLastMessage(
        syncData[SYNC_MESSAGE_INDEX].body.sessionId.substr(1),
        this,
      )
    }

    new Set(commands).forEach(cmd => {
      this.handlers[cmd]?.forEach(handler => {
        handler(syncData.filter(({ command }) => command === cmd))
      })
    })

    setUserSyncVersion()
  }
}

async function getLastMessage(sessionId, _) {
  const info = await sessionLastMessage({ sessionId })
  _.handlers?.['6']?.forEach(handler => {
    !info.to && (info.to = info.sessionId)
    handler({ RequestType: 6, info })
  })
}

function updateProps() {
  store.dispatch('im/setMessageTicket', {
    ticket: this.receivedMessage.ticket,
    sequence:
      this.receivedMessage.status?.sequence > -1
        ? this.receivedMessage.status.sequence
        : store.state.im.messageTicket.sequence,
    msgId:
      this.receivedMessage.status?.msgId > -1
        ? this.receivedMessage.status.msgId
        : store.state.im.messageTicket.msgId,
  })
}

/**
 * 发送心跳
 */
function sendHeartbeat() {
  if (this.timer) return

  this.timer = setInterval(() => {
    if (this.socket?.readyState !== 1) {
      this.destroy()
      this.connect()
      return
    }

    this.sendMessage({
      RequestType: 3,
      ticket: store.state.im.messageTicket.ticket,
    })
  }, this.interval)
}

const messageTicket = {
  sequence: 0,
  version: '',
  ticket: 0,
  msgId: -1,
}

function Socket(url = process.env.VUE_APP_WSS_URL) {
  this.IMessage = protobuf.Root.fromJSON(jsonDescriptor).lookupType('IMessage')

  this.url = url
  this.socket = null

  // heartbeat timer
  this.timer = null
  this.interval = 20000

  // IM property
  this.receivedMessage = null

  // handlers
  this.handlers = {}

  // 重连定时器
  this.reconnectTimer = null
}

Socket.prototype.connect = function (url = this.url) {
  if (!navigator.onLine || !store.state.user.socketToken) return
  clearInterval(this.reconnectTimer)
  this.reconnectTimer = null

  this.socket = new WebSocket(url)
  // Set binaryType to 'arraybuffer'
  this.socket.binaryType = 'arraybuffer'

  // Connection opened
  this.socket.addEventListener('open', event => {
    console.log('WebSocket is open now.', event)
    login.call(this)
  })

  // Listen for messages
  this.socket.addEventListener('message', event => {
    const message = this.IMessage.decode(new Uint8Array(event.data))
    this.receivedMessage = message
    console.log(
      `%csocket message:`,
      'background: #4ab7bd; color: #fff; padding: 1px',
      message,
    )

    this.handleMessage()
  })

  this.socket.addEventListener('error', event => {
    console.log('WebSocket error observed:', event)
    this.reconnect()
  })

  this.socket.addEventListener('close', event => {
    console.log('WebSocket is closed now.', event)

    store.dispatch('im/setMessageTicket', messageTicket)
    this.reconnect()
  })
}

Socket.prototype.reconnect = function () {
  if (this.reconnectTimer) return
  this.reconnectTimer = setInterval(() => {
    if (store.state.user.socketToken) {
      this.connect(process.env.VUE_APP_WSS_URL)
    } else {
      clearInterval(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }, 3000)
}

Socket.prototype.use = function (RequestType, callback) {
  this.handlers[RequestType] = [...(this.handlers[RequestType] ?? []), callback]
  return this.handlers[RequestType].length - 1
}

Socket.prototype.eject = function (RequestType, id) {
  const handlers = this.handlers[RequestType]
  handlers.splice(id ?? 0, typeof id === 'number' ? 1 : handlers.length)
}

Socket.prototype.handleMessage = async function () {
  const message = this.receivedMessage
  if (!message) return

  switch (message.RequestType) {
    case 0:
      handleSync.call(this, message)
      break
    case 5:
      this.sendMessage({
        RequestType: 105,
        status: {
          state: true,
        },
      })
      break
    case 6: {
      const sessionId = message.info.to.substr(1)
      store.dispatch('messages/addMessages', { sessionId, message })
      break
    }
    case 101:
      sendHeartbeat.call(this)
      updateProps.call(this)
      break
    case 102: {
      store.dispatch('user/logout', true)
      MessageBox.confirm(
        message.status?.message || '您的帐号在其他设备上进行了登录',
        '确认注销',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '留在此页',
          type: 'warning',
        },
      ).then(() => {
        location.reload()
      })
      break
    }
    case 104:
      /**
       * 处理消息回执
       */
      store.dispatch('im/updateSequence', message.status.sequence)

      break
  }

  this.handlers[message.RequestType]?.forEach(handler => {
    handler(message)
  })
}

Socket.prototype.sendMessage = function (message) {
  if (this.getSocketState() !== 1) return

  const { ticket, msgId, sequence } = store.state.im.messageTicket
  const mergedMessage = merge(message, {
    ticket,
    info: {
      from: store.state.user.userId,
      fromNickName: store.state.user.name,
      msgId,
      sequence,
      chatType: 2,
      clientTime: new Date().getTime(),
      conferenceId: `id_${+new Date()}`,
      to:
        message.info?.to?.indexOf('#') !== 0
          ? '#' + message.info?.to
          : message.info?.to,
    },
  })

  const buffer = this.IMessage.encode(
    this.IMessage.create(mergedMessage),
  ).finish()

  this.socket.send(buffer)
}

// 接收消息回执
Socket.prototype.readMessage = function (sessionId) {
  const messages = store.state.messages[sessionId]
  messages?.forEach(({ info }) => {
    this.sendMessage({
      RequestType: 106,
      status: {
        state: true,
        msgId: info.msgId,
      },
    })
  })
  messages && store.dispatch('messages/clearMessages', sessionId)
}

Socket.prototype.destroy = function () {
  clearInterval(this.timer)

  this.sendMessage({
    RequestType: 2,
  })

  this.socket.close()
  this.socket = null
}

Socket.prototype.getSocketState = function () {
  return this.socket.readyState
}

export { Socket }
export default Socket
