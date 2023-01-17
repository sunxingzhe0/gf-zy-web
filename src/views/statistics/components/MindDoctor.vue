<template>
  <section class="view__card mind-doctor">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :table-data="tableData"
    >
      <template v-slot:footertool>
        <el-button
          @click="exportMindDoctor"
          :disabled="!tableData.list.length > 0"
          >导出</el-button
        >
      </template>
    </List>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { mindDoctorStats, exportDoctorStats } from '@/api/statistics'
import apiProjectSet from '@/api/mindConsult/projectSet'

export default {
  name: 'mind-doctor',
  components: { List },
  mixins: [mixin({ fetchListFunction: mindDoctorStats })],
  data() {
    return {
      itemList: [],
      query: {
        currentNum: 1,
        pageSize: 10,
        timeType: 0,
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
        inline: [
          {
            props: {
              label: '项目',
              is: 'el-select',
              options: [{ label: '全部', value: '' }].concat(
                this.itemList.map(_ => {
                  return {
                    label: _.name,
                    value: _.id,
                  }
                }),
              ),
            },
            keys: 'itemId',
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
        doctor: {
          width: 100,
        },
        patientAmount: {
          minWidth: 100,
        },
        patientCount: {
          minWidth: 100,
        },
        leaveCount: {
          minWidth: 100,
        },
        treatmentFee: {
          minWidth: 100,
        },
        refundFee: {
          minWidth: 120,
        },
      }
    },
  },

  created() {
    this.getItemList()
  },
  methods: {
    async getItemList() {
      let res = await apiProjectSet.itemList({
        currentNum: 1,
        pageSize: 9999999,
      })
      this.itemList = res.list
    },
    //导出列表数据
    async exportMindDoctor() {
      await exportDoctorStats(this.query)
    },
  },
}
</script>
<style lang="scss" scoped>
.mind-doctor {
  .c__list {
    width: 100%;
    height: calc(100vh - 120px);
  }
}
</style>
