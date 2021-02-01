import Vue from 'vue'
import { mapState } from 'vuex'
import { ObserveVisibility } from 'vue-observe-visibility'
Vue.directive('observe-visibility', ObserveVisibility)

import { addTemplate } from '@/api/template'
import { Illness, AuthorizeRecord } from './components'

// import variables from '@/styles/_variables.scss'
import './MessageItem.scss'

/* function substring(str) {
  if (typeof str !== 'string' || str.length === 0) return ''
  if (str.length < 51) return str?.replace(/<\/?.+?\/?>/g, '')
  return str?.replace(/<\/?.+?\/?>/g, '').substring(0, 50) + '...'
} */

async function visibilityChanged(/* message, isVisible, entry */) {
  // console.log(message)
  // handle custom message
}
/* handle common words fuck!! */
const commonWords = {
  check: function (message) {
    const isCommonWords = this.commonWords.list.some(
      ({ content }) => content === message.body,
    )

    Vue.set(message.support, 'isCommonWords', isCommonWords)
  },
  set: async function (message) {
    const template = await addTemplate({ content: message.body })
    this.commonWords.list.unshift(template)
    Vue.set(message.support, 'isCommonWords', true)
    this.$message({
      type: 'success',
      message: '完成',
      showClose: true,
    })
  },
}

export default Vue.extend({
  name: 'MessageItem',
  computed: {
    ...mapState('user', ['userId']),
  },
  methods: {
    async updateTemplate(message) {
      const template = await addTemplate({ content: message.body })
      // this.commonWords.list.unshift(template)
      console.log(template)
      this.$message({
        type: 'success',
        message: '添加常用语成功',
        showClose: true,
      })
      this.$emit('updateTemplate')
    },
    async changeTemplate(message) {
      console.log(message)
      this.$emit('changeTemplate', message)
    },
  },
  // eslint-disable-next-line
  render: function (h) {
    const props = this.$attrs
    const _this = this
    switch (props.childMessageType) {
      case 'DEFAULT':
        return (
          <div
            {...{
              directives:
                props.from === parent.userId &&
                typeof props.support.isCommonWords === 'undefined'
                  ? [
                      {
                        name: 'observe-visibility',
                        value: {
                          callback: commonWords.check.bind(parent, props),
                          once: true,
                        },
                      },
                    ]
                  : [],
            }}
          >
            <div class="message__wrap message__text">{props.body}</div>

            {!props.templateList.some(({ content }) => content == props.body) &&
              props.chatType == 'DOCTOR' && (
                <div class="is-right">
                  <el-button
                    type="text"
                    vOn:click_stop={() => _this.updateTemplate(props)}
                  >
                    设为常用语
                  </el-button>
                </div>
              )}

            {props.templateList.some(({ content }) => content == props.body) &&
              props.chatType == 'DOCTOR' && (
                <div class="is-right">
                  <el-button
                    type="text"
                    vOn:click_stop={() => _this.changeTemplate(props)}
                  >
                    修改常用语
                  </el-button>
                </div>
              )}
          </div>
        )

      case 'IMAGE':
        return (
          <div class="message__wrap image__wrap">
            <el-image fit="cover" src={this.FILE_URL(props.body)}></el-image>
          </div>
        )

      case 'VIDEO':
        return (
          <div class="message__wrap video__wrap">
            <video
              controls
              width="300"
              height="200"
              src={this.FILE_URL(props.body)}
            >
              抱歉，您的浏览器不支持内嵌视频，不过不用担心，你可以
              <a href={this.FILE_URL(props.body)} target="_blank">
                下载
              </a>
              并用你喜欢的播放器观看!
            </video>
          </div>
        )

      case 'RP': {
        const body = JSON.parse(props.body)
        return (
          <div
            class="message__wrap request__wrap link"
            vObserveVisibility={visibilityChanged.bind(parent, props)}
          >
            {/* <div class="request__content">
              {props.body.data ? (
                [
                  <el-image
                    class="__image"
                    src={parent.FILE_URL(props.body.data.img)}
                  >
                    <div class="__image__error" slot="error"></div>
                  </el-image>,
                  props.body.data?.title && (
                    <div class="title">{props.body.data?.title}</div>
                  ),
                  props.body.data?.text && (
                    <div class="text">{props.body.data?.text}</div>
                  ),
                ]
              ) : (
                <i class="el-icon-loading" style="font-size: 32px"></i>
              )}
              <i class="el-icon-d-arrow-right"></i>
            </div> */}
            <div class="request__content">
              <span>
                {body.type == 'PASSED'
                  ? `审核通过了${body.num}`
                  : `提交了${body.num}`}
                个处方，查看详情
              </span>
              <i class="el-icon-d-arrow-right"></i>
            </div>
          </div>
        )
      }

      case 'DIAS': {
        return (
          <div
            class="message__wrap request__wrap link"
            vObserveVisibility={visibilityChanged.bind(parent, props)}
          >
            <div class="request__content">
              <span>
                {props.body.indexOf('SUB_AGAIN') > -1 ? '更新' : '发送'}
                了诊断，查看详情
              </span>
              <i class="el-icon-d-arrow-right"></i>
            </div>
          </div>
        )
      }

      case 'EMH':
        return (
          <div
            class="message__wrap request__wrap link"
            vObserveVisibility={visibilityChanged.bind(parent, props)}
          >
            <div class="request__content">
              <span>
                {props.body.indexOf('SUB_AGAIN') > -1 ? '更新' : '发送'}
                了病历，查看详情
              </span>
              <i class="el-icon-d-arrow-right"></i>
            </div>
          </div>
        )

      case 'CRVIDEO':
        return (
          <div class="message__wrap message__text">
            [在线复诊]：
            {props.body === 'accept'
              ? '已接受'
              : props.body === 'refuse'
              ? '已拒绝'
              : props.body === 'leave'
              ? '已挂断'
              : '发起了视频聊天'}
          </div>
        )

      case 'ZJ':
        return (
          <div
            class="message__wrap request__wrap link"
            vObserveVisibility={visibilityChanged.bind(parent, props)}
          >
            <div class="request__content">
              <span>发送了一个预约单</span>
              {/* <i class="el-icon-d-arrow-right"></i> */}
            </div>
          </div>
        )

      case 'DSO':
        return (
          <div
            class="message__wrap request__wrap link"
            vObserveVisibility={visibilityChanged.bind(parent, props)}
          >
            <div class="request__content">
              <span>
                {props.body.indexOf('DISPOSE_SUBMIT') > -1
                  ? '发送了一个处置单，查看详情'
                  : ''}
              </span>
              <i class="el-icon-d-arrow-right"></i>
            </div>
          </div>
        )

      case 'ANY': {
        if (props.body.indexOf('ILLNESS') > -1) {
          return (
            <Illness
              orderId={this.$attrs.orderId}
              bizType={this.$attrs.bizType}
            />
          )
        } else if (props.body.indexOf('MEDICAL_APPLY') > -1) {
          return <AuthorizeRecord body={JSON.parse(props.body)} />
        } else {
          return ''
        }
      }

      default:
        return (
          <div class="message__wrap message__text">
            [不支持的消息]
            <p>{JSON.stringify(props)}</p>
          </div>
        )
    }
  },
})
