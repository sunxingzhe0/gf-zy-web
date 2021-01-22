import { formatDate, randomString } from '@/utils'

/**
 * 生成间隔时间消息
 * @param {{ serverTime: number | Date }[]} data 数据源
 * @param {number} index 参照数据项下标
 * @param {number} reverse 上一条数据下标偏移
 */
export function generatorIntervalTime(data, index, reverse = -1) {
  const previous = data[index + reverse]?.serverTime
    ? new Date(data[index + reverse].serverTime)
    : Date.now()
  const current = data[index]?.serverTime
    ? new Date(data[index].serverTime)
    : Date.now()

  const interval = 5 * 60 * 1000
  const day = 24 * 60 * 60 * 1000
  const d = Math.abs(current - previous)
  const todayStart = Date.now() - (Date.now() % 86400000)
  const bt = todayStart - current + (current % 86400000)

  const time =
    current < todayStart
      ? bt >= 7 * day
        ? formatDate(current, 'yyyy-MM-dd hh:mm')
        : '星期' +
          ['日', '一', '二', '三', '四', '五', '六'][current.getDay()] +
          formatDate(current, ' hh:mm')
      : formatDate(current, 'hh:mm')

  return d >= interval
    ? { tips: time, id: randomString(), createTime: Date.now() }
    : false
}

/**
 * emoji encode
 * @param {string}
 * @return {string}
 */
export function utf16toEntities(str) {
  const patt = /[\ud800-\udbff][\udc00-\udfff]/g // 检测utf16字符正则
  str = str.replace(patt, char => {
    let H
    let L
    let code
    let s

    if (char.length === 2) {
      H = char.charCodeAt(0) // 取出高位
      L = char.charCodeAt(1) // 取出低位
      code = (H - 0xd800) * 0x400 + 0x10000 + L - 0xdc00 // 转换算法
      s = `&#${code};`
    } else {
      s = char
    }

    return s
  })

  return str
}

/**
 * emoji decode
 * https://github.com/kekobin/blog/issues/69
 * @param {string}
 * @return {string}
 */
export function entitiestoUtf16(strObj) {
  const patt = /&#\d+;/g
  const arr = strObj.match(patt) || []

  let H
  let L
  let code

  for (let i = 0; i < arr.length; i += 1) {
    code = arr[i]
    code = code.replace('&#', '').replace(';', '')
    // 高位
    H = Math.floor((code - 0x10000) / 0x400) + 0xd800
    // 低位
    L = ((code - 0x10000) % 0x400) + 0xdc00
    code = `&#${code};`
    const s = String.fromCharCode(H, L)
    strObj = strObj.replace(code, s)
  }
  return strObj
}

/**
 * 处理光标问题
 * https://segmentfault.com/a/1190000005869372
 * @param {Range} range 记录的 range 对象
 * @param {Element} el 编辑框
 * @param {string} text
 */
export function resolveRange(range, el, text) {
  const selection = window.getSelection()

  if (range) {
    selection.removeAllRanges()
    selection.addRange(range)
  }

  if (selection.anchorNode.nodeName != '#text') {
    const textNode = document.createTextNode(text)

    if (el.childNodes.length > 0) {
      for (let i = 0; i < el.childNodes.length; i++) {
        if (i === selection.anchorOffset)
          el.insertBefore(textNode, el.childNodes[i])
      }
    } else {
      el.appendChild(textNode)
    }

    const range = document.createRange()
    range.selectNodeContents(textNode)
    range.setStart(textNode, textNode.length)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
  } else {
    const range = selection.getRangeAt(0)
    const textNode = range.startContainer
    const rangeStartOffset = range.startOffset
    textNode.insertData(rangeStartOffset, text)
    range.setStart(textNode, rangeStartOffset + text.length)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  range = selection.getRangeAt(0)
}

/**
 * 处理粘贴
 * @param {Event} e
 */
export function reslovePaste(e) {
  if ('clipboardData' in e) {
    const text = e.clipboardData.getData('text/plain') || ''
    if (text !== '') {
      document.execCommand('insertText', false, text)
    }
  } else {
    const text = window.clipboardData.getData('text') ?? ''
    if ('getSelection' in window) {
      const div = document.createElement('div')
      div.innerHTML = text
      window.getSelection().getRangeAt(0).insertNode(div)
    } else {
      document.selection.createRange().pasteHTML(text)
    }
  }
}

/**
 * 是否滚动到底部
 * @param {Element} el
 * @param {number} offset
 */
export function isScrollBottom(el, offset = 0) {
  const { scrollHeight, scrollTop, offsetHeight } = el
  return scrollTop + offsetHeight + offset >= scrollHeight
}
