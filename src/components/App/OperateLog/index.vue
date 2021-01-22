<template>
  <section class="view__card">
    <List v-model="query" :columns="columns" :tableData="tableData"> </List>
  </section>
</template>

<script>
/*
@author        qiang
@name          OperateLog
@desc          操作日志
@props          
               businessId  string      订单id
@emit
*/
import { List, mixin } from '@/components'
import { loggerBillData } from '@/api/log'
export default {
  name: 'OperateLog',
  props: {
    businessId: {
      type: String,
      default: '',
    },
  },
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: loggerBillData })],
  data() {
    return {
      query: {
        businessRel: this.businessId,
      },
      columns: {
        index: {
          hidden: true,
        },
        createTime: {
          minWidth: 160,
        },
      },
    }
  },
}
</script>
