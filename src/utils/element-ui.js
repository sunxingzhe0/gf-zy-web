/* eslint-disable-next-line no-unused-vars */
import { VNode } from 'vue'

export function resolveCellClassName(props = []) {
  return function ({ /* row,  */ column /* rowIndex, columnIndex */ }) {
    if (props.includes(column.property) || props.includes(column.label)) {
      return 'clickable'
    }
  }
}

/**
 * 验证失败设置焦点
 * @param {VNode} form
 * @param {Object} invalidFields
 */
export function invalidFieldSetFocus(form, invalidFields) {
  const { fields } = form
  // console.log(form)
  const fieldProp = Object.keys(invalidFields)[0]
  // const field = fields.find(({ prop }) => prop === fieldProp)
  // // console.log(field.$el.querySelector('input'))
  // field.$el.scrollIntoView({ behavior: 'smooth' })
  // field.$el.querySelector('input')?.focus()
  // field.$el.querySelector('textarea')?.focus()

  const field = fields
    .filter(({ prop }) => prop === fieldProp)
    .map(item => item.$el)
  // let showField = field[field.length - 1]
  // console.log(field)
  field.forEach(element => {
    element.scrollIntoView({ behavior: 'smooth' })
    element.querySelector('input')?.focus()
    element.querySelector('textarea')?.focus()
  })
  // showField.scrollIntoView({ behavior: 'smooth' })
  // showField.querySelector('input')?.focus()
  // showField.querySelector('textarea')?.focus()
}
