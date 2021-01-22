/* import { toQueryString } from './index'

export default function({ url, method, params = {}, data = {} } = {}) {
  const form = document.createElement('form')
  form.setAttribute('style', 'display: none')
  form.setAttribute('target', '_blank')
  form.setAttribute('method', method)
  form.setAttribute('action', process.env.VUE_APP_REMOTE_URL + url + toQueryString({ token: getToken(), ...params }))

  Object.entries(data).forEach(([name, value]) => {
    const input = document.createElement('input')
    input.setAttribute('name', name)
    input.setAttribute('value', value)
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
}
 */
import request from './request'

export default function (config) {
  return request({
    ...config,
    responseType: 'blob',
  }).then(({ data, headers }) => {
    let filename = ''
    if (config.name) {
      //机构端批量导入下载
      filename = config.name
    } else {
      if (headers['content-disposition']) {
        filename = headers['content-disposition'].match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
        )[1]
      } else {
        filename = decodeURIComponent(headers.attachment)
      }
    }

    downloadFile(filename, data)
  })
}

function downloadFile(fileName, content) {
  const blob = new Blob([content])
  if ('msSaveOrOpenBlob' in window.navigator) {
    window.navigator.msSaveOrOpenBlob(blob, fileName)
  } else {
    const a = document.createElement('a')
    a.download = fileName
    a.href = URL.createObjectURL(blob)
    a.click()
    URL.revokeObjectURL(blob)
  }
}
