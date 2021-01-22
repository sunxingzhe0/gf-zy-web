export const enumChatType = {
  0: 'SINGLE', //单聊 - 未使用
  1: 'GROUP', //群聊 - 未使用
  2: 'DOCTOR', //医生端标识
  3: 'USER',
}

export const enumChildMessageTypeEnum = {
  DEFAULT: 0, //默认(文字)
  GROUPOUT: 1, //退出会话
  GROUPIN: 2, //加入会话
  REVOKE: 3, //撤消消息
  AUDIO: 4, //离线语音
  IMAGE: 5, //图片
  VIDEO: 6, //视频
  CRVIDEO: 7, //诊室视频
  INVITE: 8, //邀请协助通知
  RECOMMENDDOCTOR: 9, //推荐医生

  REPORT: 17, //检查报告
  INTERROGATION: 18, //问诊
  ARTICLE: 19, //文章
  FOLLOWUP: 20, //随访
  NOTICE: 21, //通知

  MEMBER: 22, //同步操作指令-成员
  UPLOADILLNESS: 23, //同步操作指令-上传的检查和记录
  FOLLOWUPHISTORY: 24, //同步操作指令-随访历史
  INQUIRY: 25, //同步操作指令-问诊与评估
  IMG: 26, //同步操作指令-手机胶片

  RP: 27, //处方
  DIAS: 28, //诊断
  EMH: 29, //病历

  ANY: 30, //自定义类型
  ZJ: 31, //诊间预约
  DSO: 32, //处置单
}
