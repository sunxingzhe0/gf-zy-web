export default function formatMessage(message) {
  const { body, childMessageType } = message

  switch (childMessageType) {
    case 'CRVIDEO':
      return (
        '[视频通话] ' +
        (body == 'accept'
          ? '已接受'
          : body == 'refuse'
          ? '已拒绝'
          : body == 'leave'
          ? '已挂断'
          : body == 'cancel'
          ? '取消了视频聊天'
          : '发起了视频聊天')
      )
    case 'IMAGE':
      return '[图片消息]'
    case 'RP':
      return (
        (body.indexOf('SUBMIT') > -1 ? '[提交了' : '[审核通过了') +
        JSON.parse(body).num +
        '个处方]'
      )
    case 'DIAS':
      return body.indexOf('SUB_AGAIN') > -1
        ? '[更新了诊断]，查看详情>>'
        : '[发送了诊断]，查看详情>>'
    case 'EMH':
      return body.indexOf('SUB_AGAIN') > -1
        ? '[更新了病历]，查看详情>>'
        : '[发送了病历]，查看详情>>'
    case 'DSO':
      return '[发送了一个处置单]，查看详情>>'
    case 'ZJ':
      return '[发送了一个预约单]'
    case 'ANY': {
      const type = JSON.parse(body).type
      return type == 'ILLNESS'
        ? '[病情描述]'
        : type == 'MEDICAL_APPLY'
        ? '[病历授权]'
        : ''
    }
    default:
      return body
  }
}
