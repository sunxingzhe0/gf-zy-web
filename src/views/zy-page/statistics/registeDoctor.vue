<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      alwaysShowBtn
      has-export
      @handleCommand="handleCommand"
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

      <!-- <template v-slot:fixed="{ row }">
        <el-button type="text" @click="goto('detail', row.id, row.docId)">查看</el-button>
      </template> -->
    </List>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { noTypes } from '@/api/zyapi/payment'
import { orderGhData, exportOrderGhData } from '@/api/zyapi/statistics'
import { deptChooseList } from '@/api/index'
const pre = {
  dept: [],
  noType: [],
}
export default {
  name: 'TableList',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: orderGhData })],
  data() {
    return {
      query: {
        pageSize: 10,
        currentNum: 1,
        timeType: 0,
        ghType: 0,
      },
    }
  },
  computed: {
    filter() {
      return {
        inline: [
          {
            props: {
              label: '预约就诊日期',
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
              label: '科室',
              is: 'el-select',
              options: [
                { label: '不限', value: '' },
                ...pre.dept.map(_ => ({ label: _.name, value: _.syncCode })),
              ],
            },
            keys: 'deptId',
          },
          {
            props: {
              label: '就诊类型',
              is: 'el-select',
              options: [
                { label: '不限', value: '' },
                ...pre.noType.map(_ => ({
                  label: _.name,
                  value: _.id,
                })),
              ],
            },
            keys: 'patientType',
          },
        ],
      }
    },
    columns() {
      return {
        payTime: {
          minWidth: 160,
        },
        opt: {
          hidden: true,
        },
        index: {
          hidden: true,
        },
        deptName: {
          minWidth: 100,
        },
        orderRange: {
          minWidth: 160,
        },
        createDate: {
          minWidth: 160,
        },
        visitNo: {
          minWidth: 100,
        },
        payPrice: {
          formatter(row) {
            return `￥${row.payPrice}`
          },
          minWidth: 120,
        },
      }
    },
  },
  async beforeRouteEnter(to, from, next) {
    ;[pre.dept, pre.noType] = await Promise.all([
      deptChooseList({ tree: false }),
      noTypes(),
    ])
    next()
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
        ids.push({ orderId: i.orderId })
      })
      if (command == 'query') {
        exportOrderGhData(this.query)
      }
      if (command == 'selection') {
        let select = []
        ids.forEach(i => [select.push(i.orderId)])

        exportOrderGhData({ orderIds: select })
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
