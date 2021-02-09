<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_serviceType="{ row }"
        >{{
          row.serviceType == 'CONSULT'
            ? '在线咨询'
            : row.serviceType == 'REPEAT_CLINIC'
            ? '在线复诊'
            : '慢病续方'
        }}
      </template>
      <template v-slot:slot_prescriptionPrice="{ row }">
        <span>￥{{ row.prescriptionPrice }}</span>
      </template>
      <template v-slot:slot_serviceMode="{ row }"
        >{{
          row.serviceMode == 'GRAPHIC'
            ? '图文'
            : row.serviceMode == 'VIDEO'
            ? '视频'
            : '电话'
        }}
      </template>
      <template v-slot:slot_status="{ row }"
        >{{
          row.status == 'DRAFT'
            ? '草稿'
            : row.status == 'PENDING_REVIEW'
            ? '待审核'
            : row.status == 'REJECTED'
            ? '已驳回'
            : '已通过'
        }}
      </template>
      <!-- <template v-slot:slot_prescriptionPrice="{ row }">
        ¥{{ row.prescriptionPrice }}
      </template> -->
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="info(row.id)">
          查看
        </el-button>
      </template>
    </List>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import { getRpManage } from '@/api/order'
import {
  roleChooseList,
  deptChooseList,
  drugStoreChooseList,
  titleChooseList,
} from '@/api'
const sexMap = {
  0: '女',
  1: '男',
}
const pre = {
  role: [],
  dept: [],
  store: [],
  title: [],
}
export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: getRpManage }])],
  data() {
    this.filter = {
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
            { label: '审核人', value: 4 },
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
              // { label: '在线资讯', value: 'CONSULT' },
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
            label: '医生职称',
            options: [
              { label: '不限', value: '' },
              ...pre.title.map(_ => ({ label: _.name, value: _.id })),
            ],
          },
          keys: 'titleName',
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
        {
          props: {
            label: '处方状态',
            options: [
              { label: '不限', value: '' },
              // { label: '草稿', value: 'DRAFT' },
              { label: '待审核', value: 'PENDING_REVIEW' },
              { label: '已驳回', value: 'REJECTED' },
              { label: '已通过', value: 'PASSED' },
            ],
          },
          keys: 'rpStatus',
        },
      ],
    }
    return {
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        createDate: {
          minWidth: 180,
        },
        fixed: {
          minWidth: 60,
        },

        doctorName: { minWidth: 120 },
        memberName: { minWidth: 120 },
        number: { minWidth: 120 },

        serviceType: {
          prop: 'slot_serviceType',
          minWidth: 120,
        },
        serviceMode: {
          prop: 'slot_serviceMode',
          minWidth: 120,
        },
        status: {
          prop: 'slot_status',
          minWidth: 120,
        },
        prescriptionPrice: {
          prop: 'slot_prescriptionPrice',
        },
        auditTime: {
          minWidth: 150,
        },
        submitTime: {
          minWidth: 150,
        },
        createTime: {
          minWidth: 150,
        },
        memberSex: {
          formatter: (row, col, cell) => {
            return sexMap[cell]
          },
        },
      },
    }
  },
  async beforeRouteEnter(to, from, next) {
    ;[pre.role, pre.dept, pre.store, pre.title] = await Promise.all([
      roleChooseList({ showUser: true }),
      deptChooseList({ tree: false }),
      drugStoreChooseList(),
      titleChooseList(),
    ])
    next()
  },
  methods: {
    info(id) {
      let str = this.$route.fullPath.replace('list', 'detail')
      this.$router.push(`${str}/${id}`)
    },
  },
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
</style>
