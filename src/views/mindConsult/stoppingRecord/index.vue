<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      tableClass="institutionalusers"
    >
      <template v-slot:slot_patientName="{ row }">
        <el-button type="text" @click="goto(row)">{{
          row.patientName
        }}</el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <template v-if="$route.path === '/mindConsult/allStoppingRecord/list'">
          <el-button type="text" v-if="row.status == 2" @click="add(row, true)">
            同意
          </el-button>
          <el-button
            type="text"
            v-if="row.status == 2"
            @click="add(row, false)"
          >
            拒绝
          </el-button>
        </template>
        <el-button
          @click="withdraw(row)"
          type="text"
          v-if="
            row.status == 2 &&
            $route.path !== '/mindConsult/allStoppingRecord/list'
          "
        >
          撤回
        </el-button>
      </template>
    </List>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
// import apiLeaveApproval from '@/api/mindConsult/leaveApproval'
import apiProjectSet from '@/api/mindConsult/projectSet'
import apiScheduleTemplate from '@/api/mindConsult/scheduleTemplate'
let pre = {
  itemList: [],
}
export default {
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: apiScheduleTemplate.stopPageList,
      },
    ]),
  ],
  data() {
    this.filter = {
      date: {
        props: {
          options: [{ label: '停诊日期', value: 0 }],
        },
        keys: ['timeType', 'startTime', 'endTime'],
      },
      popover: [
        {
          props: {
            label: '关键字',
            is: 'el-input',
          },
          data: {
            attrs: {
              placeholder: '停诊原因/患者姓名/电话/就诊卡号/医生/申请人/审批人',
            },
          },
          keys: 'keyword',
        },
        {
          props: {
            label: '项目',
            options: pre.itemList.map(_ => {
              return {
                label: _.name,
                value: _.id,
                index: _.name,
              }
            }),
          },
          keys: 'activityType',
        },
        {
          props: {
            label: '状态',
            options: [
              { label: '不限', value: '' },
              { label: '已关闭', value: 0 },
              { label: '正常', value: 1 },
              { label: '停诊申请中', value: 2 },
              { label: '同意', value: 3 },
              { label: '驳回', value: 4 },
            ],
          },
          keys: 'status',
        },
        {
          props: {
            label: '审批结果',
            options: [
              { label: '不限', value: '' },
              { label: '已同意', value: true },
              { label: '已拒绝', value: false },
            ],
          },
          keys: 'auditResult',
        },
      ],
    }
    return {
      infoData: {},
      loading: false,
      isAdd: false,
      editRow: {},
      fundTypeList: [],
      query: {
        timeType: 0,
        pageSize: 10,
        currentNum: 1,
        doctorId:
          this.$route.path === '/mindConsult/stoppingRecord/list'
            ? this.$store.state.user.userId
            : null,
      },
      columns: {
        index: {
          hidden: true,
        },
        fixed: {
          minWidth: 146,
        },
        status: {
          formatter(row) {
            const statusTypes = ['已关闭', '正常', '停诊申请中', '同意', '驳回']
            return statusTypes[row.status]
          },
        },
        auditResult: {
          formatter(row) {
            return row.auditResult == true
              ? '同意'
              : row.auditResult == false
              ? '拒绝'
              : ''
          },
        },
        refundRel: {
          formatter(row) {
            return row.refundRel == 1 ? '是' : row.refundRel == 0 ? '否' : ''
          },
        },
        scheduleDate: {
          minWidth: 120,
        },
        scheduleTime: {
          minWidth: 100,
        },
        itemName: {
          minWidth: 140,
        },
        phone: {
          minWidth: 120,
        },
        postponeScheduleDate: {
          minWidth: 120,
        },
        postponeScheduleTime: {
          minWidth: 100,
        },
        patientName: {
          prop: 'slot_patientName',
        },
        price: {
          minWidth: 120,
        },
        applyTime: {
          minWidth: 160,
        },
        auditTime: {
          minWidth: 160,
        },
      },
    }
  },
  async beforeRouteEnter(to, from, next) {
    let res = await apiProjectSet.itemList({
      currentNum: 1,
      pageSize: 9999999,
    })
    pre.itemList = res.list
    next()
  },
  watch: {
    $route(to, from) {
      if (
        from.path === '/mindConsult/stoppingRecord/list' ||
        from.path === '/mindConsult/allStoppingRecord/list'
      ) {
        this.init()
      }
    },
  },
  methods: {
    init() {
      this.query = {
        timeType: 0,
        pageSize: 10,
        currentNum: 1,
        doctorId:
          this.$route.path === '/mindConsult/stoppingRecord/list'
            ? this.$store.state.user.userId
            : null,
      }
    },
    //同意/拒绝
    async add(row, state) {
      if (state) {
        this.$confirm(`确定${state ? '同意' : '拒绝'}该申请?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          await apiScheduleTemplate.stopAudit({
            stopId: row.id,
            auditResult: state,
            patientId: row.patientId,
            newScheduleId: row.newScheduleId,
          })
          this.$message({
            type: 'success',
            message: '操作成功!',
          })
          this.$_fetchTableData()
        })
      } else {
        this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: value => {
            console.log(value)
            if (!value) {
              return '请输入理由'
            }
            return true
          },
        }).then(async ({ value }) => {
          await apiScheduleTemplate.stopAudit({
            stopId: row.id,
            auditResult: state,
            auditRemark: value,
            patientId: row.patientId,
          })
          this.$message({
            type: 'success',
            message: '操作成功!',
          })
          this.$_fetchTableData()
        })
      }
    },
    goto(row) {
      let path = this.$route.path.split('/list')
      this.$router.push(`${path[0]}/patientDetail?patientId=${row.patientId}`)
    },
    withdraw(row) {
      this.$confirm('是否确定撤回该申请？', '提示', {
        type: 'warning',
      }).then(async () => {
        await apiScheduleTemplate.stopWithdraw({ stopId: row.id })
        this.$message.success('操作成功!')
        this.$_fetchTableData()
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.institutionalusers {
  ::v-deep .prepend-select-date {
    width: 140px;
  }
}
::v-deep .c__filter .prepend-select-date .el-input__inner {
  width: 100%;
}
</style>
