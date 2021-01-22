// import axios from 'axios'
import { uploadFile } from '@/api' //上传
import { getToken } from '@/utils/auth'
import { toQueryString } from '@/utils'
/**
 * 自定义上传图片插件
 */
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader
  }
  async upload() {
    const data = new FormData()
    data.append('file', await this.loader.file)
    const id = await uploadFile(data)
    // 后台返回数据：
    // {"code":0,"msg":"success","data":{"url":"/upload/struts2.jpeg"}}
    // 方法返回数据格式： {default: "url"}
    return {
      default:
        process.env.VUE_APP_REMOTE_URL +
        'mi' +
        '/api/v1/file/download' +
        toQueryString({ token: getToken(), fileId: id }),
    }
  }
}
export default MyUploadAdapter
