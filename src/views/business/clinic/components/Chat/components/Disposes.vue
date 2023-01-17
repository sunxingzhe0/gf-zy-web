<template>
  <div class="main">
    <header class="flex-between">
      <span>检验单/检查单</span>
      <el-button
        plain
        size="mini"
        type="primary"
        @click="addItem()"
        :disabled="disabled"
        style="margin-right: 5px"
        :title="disabled ? '最多只能有一个草稿' : ''"
      >
        新建
      </el-button>
    </header>
  </div>
</template>

<script>
import * as business from '@/api/business'
export default {
  props: {
    bizInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      allTableData: [], //所有处置单
      disabled: false,
    }
  },
  methods: {
    //获取所有处置单
    async getAllTableData(orderId) {
      const res = await business.disposeWebList({
        pageSize: 999,
        sorted: 'DESC',
        field: 'create_time',
        orderId,
      })
    },
    //新建草稿
    addItem() {
      console.log(this.allTableData)
    },
  },
  watch: {
    bizInfo: {
      handler(newVal, oldVal) {
        if (newVal.orderId === oldVal.orderId) return
        this.getAllTableData(newVal.orderId)
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
