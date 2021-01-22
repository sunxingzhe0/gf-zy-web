<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      has-export
      @handleCommand="handleCommand"
      alwaysShowBtn
    >
      <template v-slot:slot_timeSize="{ row }">
        <el-popover
          placement="right"
          width="400"
          trigger="hover"
          v-if="row.timeSize > 0"
        >
          <div>
            <div v-for="(item, index) in row.timeList" :key="index">
              {{ index + 1 }}.{{ `${item.startTime}~${item.endTime}` }}
            </div>
          </div>
          <el-button slot="reference" type="text">{{ row.timeSize }}</el-button>
        </el-popover>
        <el-button v-else type="text">{{ row.timeSize }}</el-button>
      </template>
    </List>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { recordStatistics, exportRecord } from '@/api/zyapi/statistics'
export default {
  name: 'TableList',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: recordStatistics })],
  data() {
    return {
      query: {
        pageSize: 10,
        currentNum: 1,
        type: '',
      },
    }
  },
  computed: {
    filter() {
      return {
        inline: [
          {
            props: {
              label: '报告日期',
              is: 'el-date-picker',
            },
            data: {
              attrs: {
                type: 'datetimerange',
                valueFormat: 'yyyyMMddHHmmss',
                size: 'small',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期',
                defaultTime: ['00:00:00', '23:59:59'],
              },
            },

            keys: ['startTime', 'endTime'],
          },
          {
            props: {
              label: '报告类型',
              is: 'el-select',
              options: [
                { label: '不限', value: '' },
                { label: '检查', value: '检查' },
                { label: '检验', value: '检验' },
              ],
            },
            keys: 'type',
          },
        ],
      }
    },
    columns() {
      return {
        applyTime: {
          minWidth: 140,
        },
        reportTime: {
          minWidth: 140,
        },
        visitNo: {
          minWidth: 120,
        },
        opt: {
          hidden: true,
        },
        index: {
          hidden: true,
        },
        fixed: {
          minWidth: 60,
        },
        payPrice: {
          formatter(row) {
            return `￥${row.payPrice}`
          },
        },
      }
    },
  },
  methods: {
    handleCommand(command) {
      console.log(command)
      let selecData = this.tableData.multipleSelection
      if (selecData.length == 0 && command != 'query') {
        this.$message({
          type: 'warning',
          message: '请选择需要操作的问题',
        })
        return false
      }
      let ids = []
      selecData.forEach(i => {
        ids.push({ id: i.id })
      })
      if (command == 'query') {
        exportRecord(this.query)
      }
      if (command == 'selection') {
        let select = []
        ids.forEach(i => [select.push(i.id)])
        console.log(select)
        exportRecord({ ids: select.join(',') })
      }
    },
    goto(type, id, docId) {
      this.$router.push(
        `/shift/doctor-rules/${type}?id=${id}${docId ? '&docId=' + docId : ''}`,
      )
    },
  },
}
</script>
