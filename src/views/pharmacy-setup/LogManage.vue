<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
    </List>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { fetchList } from '@/api/list'

export default {
  name: 'LogManage',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: fetchList })],
  data() {
    return {
      query: {
        pageSize: 10,
        dateType: 0,
        searchType: 0,
      },
    }
  },

  methods: {},
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [{ label: '操作时间', value: 0 }],
          },
          keys: ['dateType'],
        },
        search: {
          props: {
            options: [{ label: '操作内容', value: 0 }],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        /* inline: [
          {
            props: {
              label: 'test',
              is: 'el-input',
            },
            data: {
              attrs: {
                type: 'password',
              },
            },
          },
        ], */
        popover: [
          {
            props: {
              label: '测试',
              options: [{ label: '不限', value: '' }],
            },
            keys: 'a',
          },
          {
            props: {
              label: '测试',
              is: 'el-input',
            },
            data: {
              attrs: {
                placeholder: '请输入内容',
              },
              on: {
                change: console.log,
              },
            },
            keys: 'b',
          },
        ],
      }
    },
    columns() {
      return {
        createTime: {
          minWidth: 160,
        },
        index: {
          hidden: true,
        },
        education: {
          hidden: true,
        },
        gender: {
          hidden: true,
        },
        zodiac: {
          hidden: true,
        },
        blood: {
          hidden: true,
        },
        constellation: {
          hidden: true,
        },
        name: {
          hidden: true,
        },
        age: {
          hidden: true,
        },
        maritalType: {
          hidden: true,
        },
        phone: {
          hidden: true,
        },
        userName: {
          hidden: true,
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
