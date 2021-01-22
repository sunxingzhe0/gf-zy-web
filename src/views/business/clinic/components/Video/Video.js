import AgoraRTC from 'agora-rtc-sdk'
import { Message } from 'element-ui'

import './Video.scss'
Message.info = function (msg) {
  Message({
    message: msg,
    showClose: true,
  })
}
Message.warning = function (msg) {
  Message({
    message: msg,
    type: 'warning',
    showClose: true,
  })
}
Message.error = function (msg) {
  Message({
    message: msg,
    type: 'error',
    showClose: true,
  })
}
Message.success = function (msg) {
  Message({
    message: msg,
    type: 'success',
    showClose: true,
  })
}

export function getDevices(next) {
  AgoraRTC.getDevices(function (items) {
    items
      .filter(function (item) {
        return ['audioinput', 'videoinput'].indexOf(item.kind) !== -1
      })
      .map(function (item) {
        return {
          name: item.label,
          value: item.deviceId,
          kind: item.kind,
        }
      })
    var videos = []
    var audios = []
    for (var i = 0; i < items.length; i++) {
      var item = items[i]
      if ('videoinput' == item.kind) {
        let name = item.label
        let value = item.deviceId
        if (!name) {
          name = 'camera-' + videos.length
        }
        videos.push({
          name: name,
          value: value,
          kind: item.kind,
        })
      }
      if ('audioinput' == item.kind) {
        let name = item.label
        let value = item.deviceId
        if (!name) {
          name = 'microphone-' + audios.length
        }
        audios.push({
          name: name,
          value: value,
          kind: item.kind,
        })
      }
    }
    next({ videos: videos, audios: audios })
  })
}

const rtc = {
  client: null,
  joined: false,
  published: false,
  localStream: null,
  remoteStreams: [],
  params: {},
}

function handleEvents(rtc) {
  // Occurs when an error message is reported and requires error handling.
  rtc.client.on('error', err => {
    console.log(err)
  })
  // Occurs when the peer user leaves the channel; for example, the peer user calls Client.leave.
  rtc.client.on('peer-leave', function (evt) {
    var id = evt.uid
    console.log('id', evt)
    const streams = rtc.remoteStreams.filter(e => id !== e.getId())
    const peerStream = rtc.remoteStreams.find(e => id === e.getId())
    if (peerStream && peerStream.isPlaying()) {
      peerStream.stop()
    }
    rtc.remoteStreams = streams
    removeView()
    console.log('peer-leave', id)
  })
  // Occurs when the local stream is published.
  rtc.client.on('stream-published', function (evt) {
    console.log('stream-published', evt)
  })
  // Occurs when the remote stream is added.
  rtc.client.on('stream-added', function (evt) {
    var remoteStream = evt.stream
    var id = remoteStream.getId()
    if (id !== rtc.params.uid) {
      rtc.client.subscribe(remoteStream, function (err) {
        console.log('stream subscribe failed', err)
      })
    }
    console.log('stream-added remote-uid: ', id)
  })
  // Occurs when a user subscribes to a remote stream.
  rtc.client.on('stream-subscribed', function (evt) {
    const remoteStream = evt.stream
    const id = remoteStream.getId()
    rtc.remoteStreams.push(remoteStream)
    addView(id)
    remoteStream.play(`remote_video_${id}`)
    console.log('stream-subscribed remote-uid: ', id)
  })
  // Occurs when the remote stream is removed; for example, a peer user calls Client.unpublish.
  rtc.client.on('stream-removed', function (evt) {
    const remoteStream = evt.stream
    const id = remoteStream.getId()
    if (remoteStream.isPlaying()) {
      remoteStream.stop(`remote_video_${id}`)
    }
    rtc.remoteStreams = rtc.remoteStreams.filter(function (stream) {
      return stream.getId() !== id
    })
    removeView()
    console.log('stream-removed remote-uid: ', id)
  })
  rtc.client.on('onTokenPrivilegeWillExpire', function () {
    // After requesting a new token
    // rtc.client.renewToken(token);
    console.log('onTokenPrivilegeWillExpire')
  })
  rtc.client.on('onTokenPrivilegeDidExpire', function () {
    // After requesting a new token
    // client.renewToken(token);
    console.log('onTokenPrivilegeDidExpire')
  })
}

/**
 * rtc: rtc object
 * option: {
 *  mode: string, "live" | "rtc"
 *  codec: string, "h264" | "vp8"
 *  appID: string
 *  channel: string, channel name
 *  uid: number
 *  token; string,
 * }
 **/
export function join(
  option = {
    mode: 'rtc',
    codec: 'h264',
    appID: this.AGORA_APPID,
    channel: parent.chat.sessionId,
    uid: `${parseInt(Math.random() * 1000000)}`,
  },
) {
  if (rtc.joined) {
    return
  }

  /**
   * A class defining the properties of the config parameter in the createClient method.
   * Note:
   *    Ensure that you do not leave mode and codec as empty.
   *    Ensure that you set these properties before calling Client.join.
   *  You could find more detail here. https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.clientconfig.html
   **/
  rtc.client = AgoraRTC.createClient({ mode: option.mode, codec: option.codec })

  rtc.params = option

  // handle AgoraRTC client event
  handleEvents(rtc)

  // init client
  rtc.client.init(
    option.appID,
    function () {
      console.log('init success')

      /**
       * Joins an AgoraRTC Channel
       * This method joins an AgoraRTC channel.
       * Parameters
       * tokenOrKey: string | null
       *    Low security requirements: Pass null as the parameter value.
       *    High security requirements: Pass the string of the Token or Channel Key as the parameter value. See Use Security Keys for details.
       *  channel: string
       *    A string that provides a unique channel name for the Agora session. The length must be within 64 bytes. Supported character scopes:
       *    26 lowercase English letters a-z
       *    26 uppercase English letters A-Z
       *    10 numbers 0-9
       *    Space
       *    "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
       *  uid: number | null
       *    The user ID, an integer. Ensure this ID is unique. If you set the uid to null, the server assigns one and returns it in the onSuccess callback.
       *   Note:
       *      All users in the same channel should have the same type (number or string) of uid.
       *      If you use a number as the user ID, it should be a 32-bit unsigned integer with a value ranging from 0 to (232-1).
       **/
      rtc.client.join(
        option.token ? option.token : null,
        option.channel,
        option.uid ? +option.uid : null,
        function (uid) {
          console.log(
            'join channel: ' + option.channel + ' success, uid: ' + uid,
          )
          rtc.joined = true

          rtc.params.uid = uid

          // create local stream
          rtc.localStream = AgoraRTC.createStream({
            streamID: rtc.params.uid,
            audio: true,
            video: true,
            screen: false,
            microphoneId: option.microphoneId,
            cameraId: option.cameraId,
          })

          // initialize local stream. Callback function executed after intitialization is done
          rtc.localStream.init(
            function () {
              console.log('init local stream success')
              // play stream with html element id "local_stream"
              rtc.localStream.play('local_stream')

              // publish local stream
              publish(rtc)
            },
            function (err) {
              // Message.error(
              //   'stream init failed, please open console see more detail',
              // )
              console.error('init local stream failed ', err)
            },
          )
        },
        function (err) {
          Message.error(
            'client join failed, please open console see more detail',
          )
          console.error('client join failed', err)
        },
      )
    },
    err => {
      Message.error('client init failed, please open console see more detail')
      console.error(err)
    },
  )
}

function publish(rtc) {
  if (!rtc.client) {
    Message.error('Please Join Room First')
    return
  }
  if (rtc.published) {
    Message.error('Your already published')
    return
  }
  var oldState = rtc.published

  // publish localStream
  rtc.client.publish(rtc.localStream, function (err) {
    rtc.published = oldState
    console.log('publish failed')
    Message.error('publish failed')
    console.error(err)
  })
  rtc.published = true
}

/* function unpublish(rtc) {
  if (!rtc.client) {
    Message.error('Please Join Room First')
    return
  }
  if (!rtc.published) {
    Message.error("Your didn't publish")
    return
  }
  var oldState = rtc.published
  rtc.client.unpublish(rtc.localStream, function (err) {
    rtc.published = oldState
    console.log('unpublish failed')
    Message.error('unpublish failed')
    console.error(err)
  })
  Message.info('unpublish')
  rtc.published = false
} */

export function leave() {
  if (!rtc.client) return
  else if (!rtc.joined) return
  /**
   * Leaves an AgoraRTC Channel
   * This method enables a user to leave a channel.
   **/
  rtc.client.leave(
    function () {
      // stop stream
      if (rtc.localStream.isPlaying()) {
        rtc.localStream.stop()
      }
      // close stream
      rtc.localStream.close()
      for (let i = 0; i < rtc.remoteStreams.length; i++) {
        const stream = rtc.remoteStreams.shift()

        if (stream.isPlaying()) {
          stream.stop()
          removeView()
        }
      }

      rtc.localStream = null
      rtc.remoteStreams = []
      rtc.client = null
      console.log('client leaves channel success')
      rtc.published = false
      rtc.joined = false
    },
    function (err) {
      console.error(err)
    },
  )
}

let videoNode = null

function addView(id) {
  const wrap =
    videoNode || (videoNode = document.querySelector('#remote_stream'))
  if (wrap.querySelector(`remote_video_${id}`)) return

  const node = document.createElement('div')
  node.id = `remote_video_${id}`
  node.className = 'video-placeholder'

  wrap.appendChild(node)
}

function removeView() {
  document.querySelector('#remote_stream').innerHTML = ''
}

/* function toggleMiniView(e) {
  if (!hasClass(e.target, 'video-placeholder')) return

  const views = videoNode.querySelectorAll('.video-placeholder')
  views.forEach(node => {
    toggleClass(node, ' mini')
  })
} */

export default ({ data, listeners }) => {
  const remoteStreamAttrs = {
    id: 'remote_stream',
    class: `remote_stream${data.attrs.mainScreen == 'local' ? ' mini' : ''}`,
  }
  const localStreamAttrs = {
    id: 'local_stream',
    class: `video-placeholder${
      data.attrs.mainScreen == 'remote' ? ' mini' : ''
    }`,
  }
  return (
    <section class="c__video" {...data} id="video">
      <div
        {...{ attrs: remoteStreamAttrs }}
        vOn:click_stop={listeners.changeMainScreen}
      ></div>
      <div
        {...{ attrs: localStreamAttrs }}
        vOn:click_stop={listeners.changeMainScreen}
      ></div>
      <el-button
        class="btn-fullscreen"
        icon="el-icon-full-screen"
        vOn:click_stop={listeners.toggleFullScreen}
      ></el-button>
      <el-button
        class="btn-close"
        plain
        type="danger"
        icon="el-icon-circle-close"
        vOn:click_stop={listeners.handleClose}
      >
        关闭视频
      </el-button>
    </section>
  )
}
