<template>
  <section class="view__card">
    <List v-model="query" :columns="columns" :tableData="tableData">
      <template v-slot:slot_gender="{ row }">
        <span style="color: red">{{ row.gender }}</span>
      </template>

      <!-- <template v-slot:fixed></template> -->
    </List>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { getSingleLog } from '@/api/setup'

export default {
  name: 'TableList',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: getSingleLog })],
  props: {
    getLog: {
      type: String,
    },
  },
  data() {
    return {
      query: {
        pageSize: 10,
        dateType: 0,
        searchType: 0,
        // 操作日志
        businessRel: this.getLog,
      },
    }
  },
  computed: {
    columns() {
      return {
        index: {
          hidden: true,
        },
        createTime: {
          minWidth: 160,
        },
        gender: {
          prop: 'slot_gender',
        },
      }
    },
  },
  methods: {
    getLogList() {
      this.$_fetchTableData(getSingleLog)
    },
  },
}
</script>
