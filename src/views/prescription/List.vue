<template>
  <div class="view__card" v-loading="loading">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_prescriptionPrice="{ row }">
        <span>￥{{ row.prescriptionPrice }}</span>
      </template>

      <template v-slot:fixed="{ row }">
        <router-link class="el-button el-button--text" :to="`detail/${row.id}`">
          查看
        </router-link>
      </template>
    </List>
  </div>
</template>

<script>
import { List, mixin } from '@/components'
import { titleChooseList, deptChooseList } from '@/api'
import { webPageRpList } from '@/api/prescription'
const pre = {
  title: [],
  dept: [],
}

export default {
  inject: ['reload'],
  name: 'prescription_passed',
  props: {
    type: String,
  },
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: webPageRpList }])],
  data() {
    this.rules = {
      reason: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }],
    }

    return {
      filter: {
        date: {
          props: {
            options: [
              { label: '创建时间', value: 0 },
              { label: '提交时间', value: 1 },
              { label: '审核时间', value: 2 },
            ],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '处方号', value: 0 },
              { label: '患者姓名', value: 1 },
              { label: '开立医师', value: 2 },
              { label: '诊断结果', value: 3 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '业务类型',
              options: [
                { label: '不限', value: '' },
                // { label: '在线咨询', value: 'CONSULT' },
                { label: '在线复诊', value: 'REPEAT_CLINIC' },
                { label: '慢病续方', value: 'CARRYON_PRESC' },
              ],
            },
            keys: 'business',
          },
          {
            props: {
              label: '业务形式',
              options: [
                { label: '不限', value: '' },
                { label: '图文', value: 'GRAPHIC' },
                { label: '视频', value: 'VIDEO' },
                // { label: '电话', value: 'PHONE' },
              ],
            },
            keys: 'consult',
          },
          {
            props: {
              label: '患者性别',
              options: [
                { label: '不限', value: '' },
                { label: '男', value: 1 },
                { label: '女', value: 0 },
              ],
            },
            keys: 'sex',
          },
          {
            props: {
              label: '患者年龄',
              is: 'InputRange',
            },
            keys: ['ageMin', 'ageMax'],
          },
          {
            props: {
              label: '医生职称',
              options: [
                { label: '不限', value: '' },
                ...pre.title.map(_ => ({ label: _.name, value: _.id })),
              ],
            },
            keys: 'titleId',
          },
          {
            props: {
              label: '科室',
              options: [
                { label: '不限', value: '' },
                ...pre.dept.map(_ => ({ label: _.name, value: _.id })),
              ],
            },
            keys: 'deptId',
          },
          {
            props: {
              label: '药品数量',
              is: 'InputRange',
            },
            keys: ['numberMin', 'numberMax'],
          },
          {
            props: {
              label: '金额',
              is: 'InputRange',
            },
            keys: ['priceMin', 'priceMax'],
          },
          // {
          //   props: {
          //     label: '处方状态',
          //     options: [
          //       { label: '不限', value: '' },
          //       { label: '草稿', value: 'DRAFT' },
          //       { label: '待审核', value: 'PENDING_REVIEW' },
          //       { label: '已驳回', value: 'REJECTED' },
          //       { label: '已通过', value: 'PASSED' },
          //     ],
          //   },
          //   keys: 'rpStatus',
          // },
        ],
      },
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
        rpStatus: this.type,
        pharmacyIds: this.$store.state.user.store.id,
      },
      dialog: {
        pedding: false,
        visible: false,
        model: {
          value: '',
          reason: '',
        },

        options: [],
      },
      // 是否认证弹框显示
      hasAuthShow: false,
      // 二维码
      erImg: '',
      isFirstEnter: false,
    }
  },
  computed: {
    updateListFlagPendingPrescription() {
      return this.$store.state.updateList.updateListFlagPendingPrescription
    },
    hasExamine() {
      return this.$store.state.user.hasExamine
    },
    hasAuth() {
      return this.$store.state.user.hasAuth
    },
    columns() {
      return {
        index: {
          hidden: true,
        },
        prescriptionPrice: {
          prop: 'slot_prescriptionPrice',
        },
        auditUser: {
          hidden: true,
        },
        serviceType: {
          formatter(row) {
            return row.serviceType === 'REPEAT_CLINIC'
              ? '在线复诊'
              : row.serviceType === 'CARRYON_PRESC'
              ? '慢病续方'
              : ''
          },
          minWidth: 90,
        },
        serviceMode: {
          formatter(row) {
            return row.serviceMode === 'GRAPHIC'
              ? '图文'
              : row.serviceMode === 'VIDEO'
              ? '视频'
              : ''
          },
          minWidth: 90,
        },
        status: {
          formatter(row) {
            return row.status === 'DRAFT'
              ? '草稿'
              : row.status === 'PENDING_REVIEW'
              ? '待审核'
              : row.status === 'REJECTED'
              ? '已驳回'
              : row.status === 'PASSED'
              ? '已通过'
              : ''
          },
          minWidth: 90,
        },
        memberSex: {
          formatter(row) {
            return row.memberSex === 0 ? '女' : row.memberSex === 1 ? '男' : ''
          },
        },
        memberAge: {
          formatter(row) {
            return row.memberAge + '岁'
          },
        },
        createDate: {
          minWidth: 180,
        },
        createTime: {
          minWidth: 150,
        },
        submitTime: {
          minWidth: 150,
        },
        auditTime: {
          minWidth: 180,
          hidden: this.$route.path === '/prescription/pending/list',
        },
        fixed: {
          minWidth: 80,
        },
        memberName: {
          minWidth: 90,
        },
        doctorName: {
          minWidth: 90,
        },
        number: {
          minWidth: 90,
        },
      }
    },
  },
  watch: {
    //全局监听刷新
    updateListFlagPendingPrescription() {
      console.log(this.updateListFlagPendingPrescription)
      this.$_fetchTableData(webPageRpList)
    },
    type(val) {
      this.query.rpStatus = val
    },
    $route(to, from) {
      if (
        (this.type == 'PASSED' &&
          from.path.indexOf('/prescription/passed/list') == -1 &&
          to.path.indexOf('/prescription/passed/detail') == -1) ||
        (this.type == 'REJECTED' &&
          from.path.indexOf('/prescription/rejected/detail') == -1 &&
          to.path.indexOf('/prescription/rejected/detail') == -1)
      ) {
        this.init()
      }
    },
  },
  async beforeRouteEnter(to, from, next) {
    ;[pre.title, pre.dept] = await Promise.all([
      pre.title.length ? pre.title : titleChooseList(),
      pre.dept.length ? pre.dept : deptChooseList({ tree: false }),
    ])
    next()
  },
  methods: {
    init() {
      this.query = {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
        rpStatus: this.type,
        pharmacyIds: this.$store.state.user.store.id,
        isFilterMore: true,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.c__tool ::v-deep .left-btns {
  min-height: 1px;
}
.hasAuthBox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .MobileImg {
    margin: 30px auto 40px;
  }
}
::v-deep .table-wrap .cell {
  font-size: 16px;
}
::v-deep .el-table .cell.el-tooltip {
  font-size: 14px;
  padding-left: 6px;
}
.el-select-dropdown__item {
  width: 400px;
}
</style>
