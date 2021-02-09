<template>
  <div class="app-info">
    <BlockTitle
      >处方信息
      <!-- <el-button @click="seeHistory" class="seeHistory">痕迹查看</el-button> -->
    </BlockTitle>
    <!-- <div> -->
    <div
      v-for="(item, index) in prescriptions"
      :key="index"
      :class="{ isBorder: prescriptions.length > 0 }"
      class="infoWrap"
    >
      <div class="app-info-row">
        <div class="app-info-item">
          <!-- <div class="app-info-label">关联处方</div> -->
          <div class="app-info-value">
            处方号：{{ item.id }}
            <!-- <span v-for="val in item.relRpIds" :key="val">{{ val }}</span> -->
          </div>
        </div>
      </div>
      <div class="topInfo">
        <div class="app-info-row">
          <div class="app-info-item">
            <div class="app-info-value">
              药品数量：{{ item.rpDrugList.length }}
            </div>
          </div>
        </div>

        <div class="app-info-row">
          <div class="app-info-item">
            <div class="app-info-value">
              医生：{{ item.doctorName }} {{ item.title }}
            </div>
          </div>
          <!--  <div class="app-info-item">
              <div class="app-info-label">开方时间</div>
              <div class="app-info-value">{{ item.createTime }}</div>
            </div> -->
        </div>

        <div class="app-info-row">
          <!-- <div class="app-info-item">
              <div class="app-info-label">审方医生</div>
              <div class="app-info-value">
                {{ item.auditUserName }} {{ item.auditUserTitle }}
              </div>
            </div> -->
          <div class="app-info-item time">
            <div class="app-info-value">审方时间：{{ item.auditTime }}</div>
          </div>
        </div>

        <!-- <div class="app-info-row">
          <div class="app-info-item">
            <div class="app-info-value">中成药：￥{{ item.chPatentFee }}</div>
          </div>
        </div> -->
        <template v-for="t in drugTypes">
          <div
            class="app-info-row"
            :key="t.id"
            v-if="
              item.contentList
                ? item.contentList.map(r => r.type).indexOf(t.id) > -1
                : item.rpDrugList
                ? item.rpDrugList.map(r => r.type).indexOf(t.id) > -1
                : false
            "
          >
            <div class="app-info-item">
              <!-- <div class="app-info-value">西药：￥{{ item.rpFee }}</div> -->
              <div class="app-info-value">
                {{ t.name }}：￥{{
                  getAllPrice(
                    t.id,
                    item.contentList
                      ? item.contentList
                      : item.rpDrugList
                      ? item.rpDrugList
                      : [],
                  )
                }}
              </div>
            </div>
          </div>
        </template>

        <div class="app-info-row">
          <div class="app-info-item">
            <div class="app-info-value allPrice">
              <!-- 合计：￥{{ +item.chPatentPrice + +item.prescriptionPrice  || '0.00'}} -->
              <!-- 合计：￥{{
                (
                  +(item.chPatentPrice || item.chPatentFee) +
                  +(item.prescriptionPrice || item.westFee)
                ).toFixed(2)
              }} -->
              合计：￥{{ item.rpFee || item.prescriptionPrice }}
            </div>
          </div>
        </div>
      </div>
      <PrescriptionItem
        ref="preData"
        scene="detail"
        :footerShow="false"
        :prescription="item"
      ></PrescriptionItem>
    </div>
  </div>
  <!-- <el-dialog> 1 </el-dialog> -->
  <!-- </div> -->
</template>
<script>
/*
@author        qiang
@name          OrderPrescription
@desc          订单详情处方
@props         orderId              string      订单id
               prescriptionInfo     object      处方订单信息
@emit
*/
import { curPre } from '@/api/prescription'
import { mapState } from 'vuex'
import { BlockTitle } from '@/components/Base'
import PrescriptionItem from '@/components/Prescription/PrescriptionItem'
export default {
  name: 'OrderPrescription',
  components: {
    BlockTitle,
    PrescriptionItem,
  },
  props: {
    orderId: {
      type: String,
      default: '',
    },
    prescriptionInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      prescriptions: [],
    }
  },
  computed: {
    ...mapState({
      drugTypes: state => state.drug.drugTypes,
    }),
  },
  created() {
    console.log(this.drugTypes, 1111)
  },
  methods: {
    async getPrescriptionInfo() {
      const res = await curPre({ orderId: this.orderId })
      console.log(this.drugTypes, 1111)
      this.prescriptions = res
      // console.log(this.prescriptions)
    },
    // 计算总价
    getAllPrice(id, list) {
      let arr = []
      arr = list
        .filter(item => item.type == id)
        .map(t => {
          return t.totalPrice ? parseFloat(t.totalPrice) : 0
        })
      console.log(arr)
      return eval(arr.join('+')).toFixed(2)
    },
    //痕迹查看
    // seeHistory() {
    //   console.log(123)
    // },
  },
  watch: {
    orderId: {
      handler(val) {
        if (val) this.getPrescriptionInfo()
      },
      immediate: true,
    },
    prescriptionInfo: {
      handler(val) {
        if (val) {
          let rpList = val.rpList || []
          rpList = rpList.map(item => ({
            ...item,
            rpDrugList: item.contentList,
          }))
          this.prescriptions = rpList
        }
      },
      immediate: true,
    },
  },
}
</script>
<style lang="scss" scoped>
.block-title {
  height: 28px;
  display: flex;
  align-items: center;
}
.seeHistory {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  margin-left: 10px;
}
.isBorder {
  border: 1px solid #e6e6e6;
}
.infoWrap {
  padding: 16px;
  margin-top: 20px;
  .topInfo {
    display: flex;
    justify-content: space-between;
  }
  .app-info-row {
    margin-bottom: 20px;
  }
  .app-info-item {
    margin-top: 0;
    .allPrice {
      color: #0ab2c1;
    }
  }
  .time {
    margin-right: 30px;
  }
}
</style>
