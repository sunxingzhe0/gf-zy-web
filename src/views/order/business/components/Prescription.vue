<template>
  <section>
    <el-row class="view__content">
      <el-col :span="24" v-if="info.length > 0">
        <span>处方单</span>
        <el-button
          plain
          type="primary"
          size="mini"
          @click="open"
          v-if="!isHistory"
        >
          痕迹查看
        </el-button>
      </el-col>
      <el-col
        :span="24"
        style="margin-bottom: 20px; padding-left: 60px;"
        v-for="item in info"
        :key="item.id"
      >
        <el-card shadow="hover">
          <template v-slot:header>
            <!-- <b>处方号：{{ item.prescriptionNo }}</b> -->
            <b>处方号：{{ item.id }}</b>
            <el-row style="color: #666; font-size: 14px;">
              <el-col :md="8" :lg="2"
                >数量:{{ item.number || item.drugNumber }}</el-col
              >
              <el-col :md="8" :lg="7">
                医生：{{ item.doctorName }} {{ item.title }}
              </el-col>
              <el-col :md="8" :lg="6">审方时间：{{ item.auditTime }}</el-col>
              <el-col :md="8" :lg="3"
                >西药：{{ item.westPrice || item.westFee }}
              </el-col>
              <el-col :md="8" :lg="3"
                >中成药：{{ item.chPatentPrice || item.chPatentFee }}
              </el-col>
              <el-col
                :md="8"
                :lg="3"
                :style="{ color: $attrs.variables.danger }"
              >
                合计：{{ item.prescriptionPrice || item.rpFee }}
              </el-col>
            </el-row>
          </template>
          <el-table
            :data="item.rpDrugList || item.contentList"
            border
            style="width: 100%;"
          >
            <el-table-column type="index" label="序号" width="60">
            </el-table-column>
            <el-table-column prop="type" label="类型">
              <template slot-scope="scoped">
                {{ formatter(scoped.row) }}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="药品名称"> </el-table-column>
            <el-table-column prop="spec" label="规格"> </el-table-column>
            <el-table-column prop="useWays" label="用药途径"> </el-table-column>
            <el-table-column prop="singleDose" label="单次剂量">
            </el-table-column>
            <el-table-column prop="useFrequency" label="用药频次">
            </el-table-column>
            <el-table-column prop="total" label="总量"> </el-table-column>
            <el-table-column prop="address" label="医保">
              <template slot-scope="scoped">
                {{
                  scoped.row.medicare == 'ME_FEE'
                    ? '自费'
                    : scoped.row.medicare == 'A'
                    ? '甲'
                    : scoped.row.medicare == 'B'
                    ? '乙'
                    : '丙'
                }}
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价"> </el-table-column>
            <el-table-column prop="totalPrice" label="总价"> </el-table-column>
            <el-table-column prop="receivePharmacy" label="接收方">
            </el-table-column>
            <el-table-column prop="remark" label="备注"> </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { curPre } from '@/api/prescription'
export default {
  name: 'Prescription',
  props: {
    orderId: String,
    isHistory: Boolean,
    historyList: Array,
  },

  data() {
    return {
      info: [],
    }
  },
  computed: {
    ...mapState({
      drugTypes: state => state.drug.drugTypes,
    }),
  },
  mounted() {
    if (!this.isHistory) {
      this.getData()
    } else {
      this.info = this.historyList
    }
    console.log(this.info)
  },
  methods: {
    async getData() {
      this.info = await curPre({
        orderId: this.orderId,
      })
    },
    open() {},
    formatter(row) {
      const item = this.drugTypes.find(item => item.id === row.type)
      return item ? item.name : '-'
    },
  },
}
</script>

<style lang="scss" scoped></style>
