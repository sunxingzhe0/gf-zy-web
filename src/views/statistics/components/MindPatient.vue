<template>
  <section class="view__card mind-patient">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :table-data="tableData"
    >
      <template v-slot:footertool>
        <el-button
          @click="exportMindPatient"
          :disabled="!tableData.list.length > 0"
          >导出</el-button
        >
      </template>
    </List>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { mindPatientStats, exportPatientStats } from '@/api/statistics'
export default {
  name: 'mind-patient',
  components: { List },
  mixins: [mixin({ fetchListFunction: mindPatientStats })],
  data() {
    return {
      query: {
        currentNum: 1,
        pageSize: 10,
        timeType: 0,
        keywords: null,
      },
    }
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [{ label: '日期', value: 0 }],
          },
          keys: ['timeType', 'dateHigh', 'dateLow'],
        },
        popover: [
          {
            props: {
              label: '关键字',
              is: 'el-input',
            },
            data: {
              attrs: {
                placeholder: '患者/就诊卡号/医生',
              },
            },
            keys: 'keywords',
          },
        ],
      }
    },

    columns() {
      return {
        index: {
          hidden: true,
        },
        serialNumber: {
          hidden: true,
        },
        leaveCount: {
          minWidth: 100,
        },
        refundFee: {
          minWidth: 120,
        },
      }
    },
  },
  methods: {
    //导出
    async exportMindPatient() {
      await exportPatientStats(this.query)
    },
  },
}
</script>
<style lang="scss" scoped>
.mind-patient {
  .c__list {
    width: 100%;
    height: calc(100vh - 120px);
  }
}
</style>
