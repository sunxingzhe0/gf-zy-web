<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:fixed="{ row }">
        <router-link
          class="el-button el-button--text"
          :to="{
            path: '/reconciliation/checkFormList/detail',
            query: { userId: row.id },
          }"
        >
          查看
        </router-link>
      </template>
    </List>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { webBasinsList } from '@/api/business'

// const getPayWay = {
//   WECHAT_PAY: '微信支付',
//   ICBC_PAY: '微信支付',
//   ALI_PAY: '支付宝支付',
//   OFFLINE_PAY: '线下支付',
// }
export default {
  name: 'reconciliation_checkFormList',
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: webBasinsList }])],
  data() {
    this.filter = {
      date: {
        props: {
          options: [{ label: '填报时间', value: 0 }],
        },
        keys: ['timeType', 'startTime', 'endTime'],
      },
      search: {
        props: {
          options: [
            { label: '姓名', value: 0 },
            { label: '电话', value: 1 },
            { label: '身份证号', value: 2 },
          ],
        },
        keys: ['searchType', 'searchKeywords'],
      },
      popover: [
        {
          props: {
            label: '是否异常',
            options: [
              { label: '不限', value: '' },
              { label: '正常', value: 0 },
              { label: '异常', value: 1 },
            ],
          },
          keys: 'errState',
        },
        {
          props: {
            label: '院区',
            options: [
              { label: '不限', value: '' },
              { label: '金紫山院区', value: '1' },
              { label: '歌乐山院区', value: '2' },
              { label: '心咨中心院区', value: '3' },
            ],
          },
          keys: 'hospId',
        },
      ],
    }
    return {
      query: {
        timeType: 0,
        searchType: 0,
        currentNum: 1,
        pageSize: 10,
        field: 'payTime',
        errState: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        name: {
          minWidth: 90,
        },
        phone: {
          minWidth: 120,
        },
        idCard: {
          minWidth: 180,
        },

        fixed: {
          minWidth: 70,
        },
        basinsType: {
          formatter(row) {
            const TYPES = ['核酸预约', '扫码', '流调表', '挂号']
            return TYPES[row.basinsType]
          },
        },
        errState: {
          formatter(row) {
            return row.errState ? '异常' : '正常'
          },
        },
      },
    }
  },
}
</script>

<style lang="scss" scoped></style>
