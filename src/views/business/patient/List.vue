<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:fixed="{ row }">
        <el-button
          size="mini"
          type="text"
          @click="unBundling(row)"
          v-if="row.phone"
        >
          解绑
        </el-button>
      </template>
    </List>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { patientPserList, clearUserPhone } from '@/api/business'

export default {
  name: 'TableList',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: patientPserList })],
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
            options: [{ label: '注册时间', value: 0 }],
          },
          keys: ['timeType'],
        },
        search: {
          props: {
            options: [
              { label: '患者姓名', value: 0 },
              { label: '身份证', value: 1 },
              { label: '患者ID', value: 2 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '手机号',
              options: [
                { label: '不限', value: '' },
                // { label: '在线咨询', value: 'CONSULT' },
                { label: '有', value: '1' },
                { label: '无', value: '0' },
              ],
            },
            keys: 'bindPhone',
          },
          {
            props: {
              label: '消费金额',
              is: 'InputRange',
            },
            keys: ['startMoney', 'endMoney'],
          },
        ],
      }
    },
    columns() {
      return {
        index: {
          hidden: true,
        },
        payFee: {
          formatter(row) {
            if (row.payFee) {
              return '¥' + row.payFee
            } else {
              return '-'
            }
          },
        },
      }
    },
  },
  methods: {
    //解绑
    async unBundling(row) {
      this.$confirm('是否确认解除已绑定的手机号？', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
      })
        .then(async () => {
          await clearUserPhone({ id: row.id }).then(() => {
            this.$_fetchTableData()
          })
        })
        .catch(() => {})
    },
  },
}
</script>
