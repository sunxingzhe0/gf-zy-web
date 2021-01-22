import DragSize from './drag-size.js'

const install = function (Vue) {
  Vue.directive('drag-size', DragSize)
}

if (window.Vue) {
  window.clipboard = DragSize
  Vue.use(install); // eslint-disable-line
}

DragSize.install = install
export default DragSize
