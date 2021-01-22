<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_prescriptionNo="{ row }">
        <span>{{ row.id }}</span>
      </template>
      <template v-slot:slot_prescriptionPrice="{ row }">
        <span>￥{{ row.prescriptionPrice }}</span>
      </template>
      <template v-slot:fixed="{ row }">
        <router-link
          class="el-button el-button--text el-button--mini"
          :to="`detail/${row.id}`"
        >
          查看
        </router-link>
        <router-link
          v-if="row.status == 'REJECTED'"
          class="el-button el-button--text el-button--mini"
          :to="{ path: `edit/${row.id}`, query: { copyId: row.id } }"
        >
          复制
        </router-link>
        <el-button
          v-if="row.status == 'PENDING_REVIEW'"
          size="mini"
          type="text"
          @click="action('back', row.id)"
        >
          撤回
        </el-button>
        <router-link
          class="el-button el-button--text el-button--mini"
          v-if="row.status == 'DRAFT'"
          :to="`edit/${row.id}`"
        >
          修改
        </router-link>
        <el-button
          v-if="row.status == 'DRAFT' && row.number"
          size="mini"
          type="text"
          @click="action('submit', row.id)"
        >
          提交
        </el-button>
      </template>
    </List>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { webRpList, withdrawRp, submitRp } from '@/api/prescription'

const serviceModeMap = {
  GRAPHIC: '图文',
  VIDEO: '视频',
  PHONE: '电话',
}
const serviceTypeMap = {
  CONSULT: '在线资讯',
  REPEAT_CLINIC: '在线复诊',
  CARRYON_PRESC: '慢病续方',
}
const statusMap = {
  DRAFT: '草稿',
  PENDING_REVIEW: '待审核',
  REJECTED: '已驳回',
  PASSED: '已通过',
}
export default {
  name: 'TableList',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: webRpList })],
  data() {
    return {
      query: {
        pageSize: 10,
        timeType: 0,
        searchType: 0,
      },
    }
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [
              { label: '创建时间', value: 0 },
              { label: '开方时间', value: 1 },
            ],
          },
          keys: ['timeType'],
        },
        search: {
          props: {
            options: [
              { label: '处方号', value: 0 },
              { label: '患者姓名', value: 1 },
              { label: '关联服务订单', value: 2 },
              { label: '诊断', value: 3 },
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
                { label: '草稿', value: 'DRAFT' },
                { label: '待审核', value: 'PENDING_REVIEW' },
                { label: '已驳回', value: 'REJECTED' },
                { label: '已通过', value: 'PASSED' },
              ],
            },
            keys: 'rpStatus',
          },
        ],
      }
    },
    columns() {
      return {
        index: {
          hidden: true,
        },
        prescriptionNo: {
          prop: 'slot_prescriptionNo',
          minWidth: 120,
        },
        prescriptionPrice: {
          prop: 'slot_prescriptionPrice',
        },
        orderId: {
          minWidth: 160,
        },
        auditTime: {
          label: '开方时间',
        },
        createTime: {
          minWidth: 160,
        },
        fixed: {
          minWidth: 120,
        },
        memberSex: {
          formatter: (row, col, cell) => {
            return cell == '0' ? '女' : '男'
          },
        },
        memberAge: {
          formatter: (row, col, cell) => {
            return cell + '岁'
          },
        },
        serviceMode: {
          formatter: (row, col, cell) => {
            return serviceModeMap[cell]
          },
        },
        serviceType: {
          formatter: (row, col, cell) => {
            return serviceTypeMap[cell]
          },
        },
        status: {
          formatter: (row, col, cell) => {
            return statusMap[cell]
          },
        },
      }
    },
    updateListFlagPrescription() {
      return this.$store.state.updateList.updateListFlagPrescription
    },
  },
  watch: {
    //全局监听刷新
    updateListFlagPrescription() {
      this.$_fetchTableData()
    },
  },
  methods: {
    async action(type, id) {
      if (type == 'back') {
        await withdrawRp({ id })
      } else {
        await submitRp({
          submit: [{ id }],
        })
      }
      this.$message({
        message: '操作成功!',
        type: 'success',
      })
      this.$_fetchTableData()
    },
  },
}
</script>
