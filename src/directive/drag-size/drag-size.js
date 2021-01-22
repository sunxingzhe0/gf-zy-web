import { EventHandler } from '@/utils/eventHandler.js'
export default {
  bind(el, binding) {
    el.ext = {}
    el.ext.id = Math.random().toFixed(5) * 100000 + ''
    el.ext.startWidthOrHeight = 0
    el.ext.startXOrY = 0
    el.ext.mouseDown = false
    el.ext.elRev = el
    el.ext.position = binding.arg
    el.ext.isNS = el.ext.position == 'top' || el.ext.position == 'bottom'
    el.ext.clientName = el.ext.isNS ? 'clientY' : 'clientX'
    el.ext.rectName = el.ext.isNS ? 'height' : 'width'
    el.ext.tagName = binding.value?.child

    el.ext.dragMouseDown = function (e) {
      if (el.ext.tagName) {
        el.ext.childElRev =
          el.ext.elRev.querySelector(el.ext.tagName) || el.ext.elRev
        el.ext.tagName = ''
      }
      el.ext.startWidthOrHeight = el.ext.elRev.getBoundingClientRect()[
        el.ext.rectName
      ]
      el.ext.mouseDown = true
      el.ext.startXOrY = e[el.ext.clientName]

      // 绑定事件
      el.ext.dragMouseUp = function () {
        el.ext.mouseDown = false
        EventHandler.removeEventListener('mousemove.' + el.ext.id)
        EventHandler.removeEventListener('mouseup.' + el.ext.id)
        if (binding.value?.onDragUp) {
          binding.value.onDragUp({
            [el.ext.rectName]: el.ext.elRev.getBoundingClientRect()[
              el.ext.rectName
            ],
          })
        }
      }
      el.ext.dragMouseMove = function (e) {
        if (el.ext.mouseDown) {
          let height
          if (el.ext.position == 'top' || el.ext.position == 'left') {
            height =
              el.ext.startWidthOrHeight +
              el.ext.startXOrY -
              e[el.ext.clientName] +
              'PX'
          } else {
            height =
              el.ext.startWidthOrHeight +
              e[el.ext.clientName] -
              el.ext.startXOrY +
              'PX'
          }
          el.ext.elRev.style[el.ext.rectName] = height
          if (el.ext.childElRev) {
            el.ext.childElRev.style[el.ext.rectName] = height
          }
        }
      }
      EventHandler.addEventListener(
        'mousemove.' + el.ext.id,
        el.ext.dragMouseMove,
      )
      EventHandler.addEventListener('mouseup.' + el.ext.id, el.ext.dragMouseUp)
    }
  },
  inserted: function inserted(el) {
    const bar = document.createElement('div')
    bar.style.position = 'absolute'
    bar.style.zIndex = 10
    bar.style.cursor = el.ext.isNS ? 'ns-resize' : 'ew-resize'
    bar.style[el.ext.rectName] = '10px'
    bar.style[el.ext.position] = '-5px'
    if (el.ext.isNS) {
      bar.style.left = '0'
      bar.style.right = '0'
    } else {
      bar.style.top = '0'
      bar.style.bottom = '0'
    }
    bar.addEventListener('mousedown', el.ext.dragMouseDown)
    el.append(bar)
  },

  unbind(el) {
    el.removeEventListener('mousedown', el.ext.dragMouseDown)
  },
}
