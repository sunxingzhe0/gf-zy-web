# table filter 表格筛选

## Attributes

| prop    | type     | default    | required | descripation                   |
| :------ | :------- | :--------- | :------- | :----------------------------- |
| v-model | `object` | -          | `true`   | 双向绑定数据                   |
| data    | `object` | -          | `true`   | 定义条件数据项 [`data`](#data) |
| label   | `string` | `筛选条件` | `false`  | 更多筛选项下前的 label         |

### data

| prop       | type             | default | required | descripation                                                                                     |
| :--------- | :--------------- | :------ | :------- | :----------------------------------------------------------------------------------------------- |
| 键名       | `string`         | -       | `false`  | 组件类型，可选值: `date` `search`，如果不传此参数就是更多筛选项                                  |  |
| 属性 props | `object`         | -       | `false`  | 详见[这里](#data-props)                                                                          |
| 属性 keys  | `string / array` | -       | `true`   | v-model 返回对象内的 key，返回多个值数组形式`[{selectKey}, [{ dateStart, dateEnd }] | inputKey]` |

### [Data Props](#data-props)

| is     | default                   | descripation                                                                                                                                            |
| :----- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| date   | 详见[这里](#date-default) | 合法的 [`el-date-picker`](https://element.eleme.cn/#/zh-CN/component/date-picker#attributes) attributes 和 `options` 定义下拉选择项详见[这里](#options) |
| search | -                         | 合法的 [`el-input`](https://element.eleme.cn/#/zh-CN/component/input#input-attributes) attributes 和 `options` 定义下拉选择项详见[这里](#options)       |

---

### [Date Default](#date-default)

```javascript
{
  clearable
  type="datetimerange"
  value-format="yyyy-MM-dd"
  size="small"
  unlink-panels
  range-separator="至"
  start-placeholder="开始日期"
  end-placeholder="结束日期"
  :picker-options="pickerOptions"
}

// pickerOptions
this.pickerOptions = {
  shortcuts: [
    {
      text: '最近一周',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      },
    },
    {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      },
    },
    {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      },
    },
  ],
}
```

### [Data Props Options](#options)

| name  | type              | descripation |
| :---- | :---------------- | :----------- |
| label | `number / string` | 显示名       |
| value | `number / string` | 返回值       |
