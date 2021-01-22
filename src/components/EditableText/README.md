# editableText 可编辑显示文本

## Props

| name        | type      | default  | required | descripation             |
| :---------- | :-------- | :------- | :------- | :----------------------- |
| value       | `any`     | `''`     | `false`  | 当前文本                 |
| text        | `string`  | `'编辑'` | `false`  | 触发编辑状态的按钮文本   |
| doubleclick | `boolean` | `true`   | `false`  | 是否启用双击触发编辑状态 |

## Event

| name    | type       | default | required | descripation                                      |
| :------ | :--------- | :------ | :------- | :------------------------------------------------ |
| cancel  | `function` | -       | `false`  | 点击取消触发的函数`function(oldValue)`            |
| confirm | `function` | -       | `false`  | 点击保存触发的函数 `function(newValue, oldValue)` |

## Slot

| name  | descripation                                     |
| :---- | :----------------------------------------------- |
| input | 自定义 `input` 编辑文本框，参数： `v-slot:input` |

```html
<template v-slot:input>
  <el-input v-model="value" />
</template>
```
