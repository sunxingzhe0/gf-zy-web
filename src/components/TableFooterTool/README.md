# table footer tool 表格底部工具栏

## Props

| name       |       type        | default                                            | required | descripation                                           |
| :--------- | :---------------: | :------------------------------------------------- | :------- | :----------------------------------------------------- |
| table-ref  |     `string`      | -                                                  | `true`   | `<el-table ref="[name]">`                              |
| bats       |    `object[]`     | -                                                  | `false`  | 批量操作 dropdown [bats](#bats)                        |
| has-export |     `boolean`     | `true`                                             | `false`  | 是否有导出按钮                                         |
| v-model    |     `object`      | -                                                  | `true`   | 分页器返回的 当前页码(`currentNum`)和页面大小(`pageSize`) |
| total      | `number / string` | `0`                                                | `true`   | 接口返回的数据总数                                     |
| page-props |     `object`      | `{ currentPage: 'currentNum', pageSize: 'pageSize' }` | `false`  | 自定义`currentPage / pageSize`的属性值                 |

### bats

| name    | type     | descripation |
| :------ | :------- | ------------ |
| label   | `string` | 显示名(唯一) |
| command | `string` | 指令         |

## Slot

| name | descripation             |
| :--- | :----------------------- |
| -    | 自定义 footer 的操作按钮 |
