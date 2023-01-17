<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_activityName="{ row }">
        <el-button type="text" @click="goto(row)">{{
          row.activityName
        }}</el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button @click="seeInfo(row)" type="text"> 详情 </el-button>
      </template>
      <template v-slot:footertool>
        <el-button @click="exportData">导出</el-button>
      </template>
    </List>
    <RegistrationInfo
      :show="dialogVisible"
      :id="rowId"
      @onClose="handleClose"
    />
  </div>
</template>

<script>
import { List, mixin } from '@/components'
import { recordlist, recordExport } from '@/api/mindConsult/myActivity'
import RegistrationInfo from './components/RegistrationInfo.vue'
export default {
  components: {
    List,
    RegistrationInfo,
  },
  mixins: [mixin([{ fetchListFunction: recordlist }])],
  data() {
    this.filter = {
      date: {
        props: {
          options: [{ label: '报名时间', value: 0 }],
        },
        keys: ['timeType', 'signStartTime', 'signEndTime'],
      },
      inline: [
        {
          props: {
            label: '活动类型',
            is: 'el-select',
            options: [
              { label: '全部', value: '' },
              { label: '团体活动', value: '团体活动' },
              { label: '团体督导', value: '团体督导' },
              { label: '团体治疗', value: '团体治疗' },
            ],
          },
          keys: 'activityType',
        },
        {
          props: {
            label: '关键字',
            is: 'el-input',
          },
          data: {
            attrs: {
              placeholder: '姓名/电话/活动名称',
            },
          },
          keys: 'keywords',
        },
        {
          props: {
            label: '状态',
            is: 'el-select',
            options: [
              { label: '全部', value: '' },
              { label: '进行中', value: 1 },
              { label: '已结束', value: 2 },
              { label: '暂停', value: 3 },
              { label: '未开始', value: 4 },
            ],
          },
          keys: 'activityStatus',
        },
        // {
        //   props: {
        //     label: '报名时间',
        //     is: 'el-date-picker',
        //   },
        //   data: {
        //     attrs: {
        //       type: 'datetimerange',
        //       startPlaceholder: '开始日期',
        //       endPlaceholder: '结束日期',
        //     },
        //   },
        //   keys: ['signStartTime', 'signEndTime'],
        // },
        {
          props: {
            label: '活动状态',
            is: 'el-select',
            options: [
              { label: '全部', value: '' },
              { label: '报名成功', value: 1 },
              { label: '报名待审核', value: 2 },
              { label: '报名失败', value: 3 },
            ],
          },
          keys: 'signStatus',
        },
        {
          props: {
            label: '',
            is: 'el-checkbox',
          },
          data: {
            attrs: {
              label: '仅看退款的',
            },
            on: {
              change: e => {
                this.query.type = e
              },
            },
          },

          keys: 'type',
        },
      ],
    }
    return {
      statusTypes: ['报名成功', '报名审核', '报名失败'],
      dialogVisible: false,
      rowId: '',
      query: {
        pageSize: 10,
        currentNum: 1,
        timeType: 0,
        type: false,
        doctorId:
          this.$route.path === '/mindConsult/signupRecord'
            ? this.$store.state.user.userId
            : null,
      },
      columns: {
        index: {
          hidden: true,
        },
        activityStatus: {
          formatter(row) {
            const types = ['进行中', '已结束', '暂停', '未开始']
            return types[row.activityStatus - 1] || ''
          },
        },
        status: {
          formatter(row) {
            const types = ['报名成功', '报名审核', '报名失败']
            return types[row.status - 1] || ''
          },
        },
        activityName: {
          minWidth: 130,
          prop: 'slot_activityName',
        },
      },
    }
  },
  watch: {
    $route(to, from) {
      console.log(to, from)
      if (
        (from.path === '/reconciliation/signupRecord' &&
          to.path === '/mindConsult/signupRecord') ||
        (from.path === '/mindConsult/signupRecord' &&
          to.path === '/reconciliation/signupRecord')
      ) {
        this.query = {
          pageSize: 10,
          currentNum: 1,
          doctorId:
            this.$route.path === '/mindConsult/signupRecord'
              ? this.$store.state.user.userId
              : null,
        }
      }
    },
  },
  methods: {
    async exportData() {
      await recordExport(this.query)
    },
    handleClose() {
      this.dialogVisible = false
      this.rowId = null
    },
    async seeInfo(row) {
      this.dialogVisible = true
      this.rowId = row.id
    },
    goto(row) {
      this.$router.push(`/mindConsult/myActivity/info?id=${row.activityId}`)
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-checkbox__input {
  z-index: 0;
}
::v-deep .el-col {
  margin: 5px 0;
}
</style>
