<template>
  <div>
    <div v-for="{ id, createTime, rpDrugList } in rpList" :key="id">
      <div>
        <span>处方号：{{ id }}</span>
        <span class="ml-40">创建时间：{{ createTime }}</span>
        <span class="ml-40">数量：{{ rpDrugList.length }}</span>
      </div>
      <el-table :data="rpDrugList" style="width: 100%">
        <el-table-column
          v-for="{ prop, label, width, formatter } in columns"
          :key="prop"
          :prop="prop"
          :label="label"
          :width="width"
          :formatter="formatter"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { rpList } from '@/api/prescription'
import { mapState } from 'vuex'
export default {
  name: 'RP',
  data() {
    this.columns = [
      {
        prop: 'type',
        label: '类型',
        width: 70,
        formatter: this.formatter,
      },
      {
        prop: 'name',
        label: '药品名称',
      },
      {
        prop: 'spec',
        label: '规格',
        width: 80,
      },
      {
        prop: 'useWays',
        label: '用药途径',
        width: 80,
      },
      {
        prop: 'singleDose',
        label: '单次剂量',
        width: 80,
      },
      {
        prop: 'useFrequency',
        label: '用药频次',
        width: 80,
      },
      {
        prop: 'treatment',
        label: '疗程',
        width: 50,
        formatter: ({ treatment, treatmentUnit }) => treatment + treatmentUnit,
      },
      {
        prop: 'total',
        label: '总量',
        width: 50,
      },
      {
        prop: 'medicare',
        label: '医保',
        width: 60,
        formatter: ({ medicare }) =>
          medicare === 'A'
            ? '甲'
            : medicare === 'B'
            ? '乙'
            : medicare === 'C'
            ? '丙'
            : '自费',
      },
      {
        prop: 'price',
        label: '单价',
        width: 80,
      },
      {
        prop: 'totalPrice',
        label: '总价',
        width: 80,
      },
      {
        prop: 'receivePharmacy',
        label: '接收方',
      },
      {
        prop: 'remark',
        label: '备注',
      },
    ]
    return {
      rpList: [],
    }
  },
  computed: {
    ...mapState({
      drugTypes: state => state.drug.drugTypes,
    }),
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const list = await rpList({ orderId: this.$attrs.orderId })
      this.rpList = list.map(item => {
        item.rpDrugList.map(drug => {
          drug.price = '￥' + drug.price
          drug.totalPrice = '￥' + drug.totalPrice
          return drug
        })
        return item
      })
    },
    formatter(row) {
      const item = this.drugTypes.find(item => item.id === row.type)
      return item ? item.name : '-'
    },
  },
}
</script>

<style scoped>
.ml-40 {
  margin-left: 40px;
}
</style>
