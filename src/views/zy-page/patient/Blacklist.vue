<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="remove(row.patientCard)">移除</el-button>
      </template>
    </List>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { blackList, removeBlackList } from '@/api/zyapi/patient'

export default {
  name: 'TableList',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: blackList })],
  data() {
    return {
      query: {
        pageSize: 10,
        dateType: 0,
        searchType: 0,
      },
    }
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [{ label: '创建时间', value: 0 }],
          },
          keys: ['dateType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '患者姓名', value: 0 },
              { label: '手机号', value: 1 },
              { label: '身份证号', value: 2 },
              { label: '就诊卡号', value: 3 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '性别',
              options: [
                { label: '不限', value: '' },
                { label: '女', value: 0 },
                { label: '男', value: 1 },
              ],
            },
            keys: 'sex',
          },
          {
            props: {
              label: '取消预约次数',
              isInteger: true,
              is: 'InputRange',
            },
            keys: ['cancelStart', 'cancelEnd'],
          },
          {
            props: {
              label: '爽约次数',
              isInteger: true,
              is: 'InputRange',
            },
            keys: ['doveStart', 'doveEnd'],
          },
        ],
      }
    },
    columns() {
      return {
        blackTime: {
          minWidth: 160,
        },
        index: {
          hidden: true,
        },
      }
    },
  },
  methods: {
    remove(patientCard) {
      this.$confirm('确定将该用户移除黑名单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await removeBlackList({ patientCard: patientCard })
          this.$message.success('操作成功！')
          this.$_fetchTableData()
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_modules-detail.scss';
</style>
