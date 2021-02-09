<template>
  <div class="message__wrap message__text">
    <div>{{ orderIllness.illnessDesc }}</div>
    <div :style="{ marginTop: '10px' }">
      <el-image
        v-for="_ in orderIllness.picList"
        :key="_"
        :src="FILE_URL(_)"
        :preview-src-list="[FILE_URL(_)]"
        class="img"
      />
    </div>
    <div :style="bizType == 'CONSULT' ? 'display:none' : ''">
      <div :style="{ marginTop: '10px' }">就诊记录</div>
      <div
        v-if="orderIllness.historyMedicalInfo"
        :style="{ marginTop: '6px', color: '#0ab2c1' }"
      >
        <div>
          <div>就诊日期：{{ orderIllness.historyMedicalInfo.createTime }}</div>
          <div>{{ orderIllness.historyMedicalInfo.diagnose }}</div>
          <div>
            {{ orderIllness.historyMedicalInfo.doctorName }}
            {{ orderIllness.historyMedicalInfo.deptName }}
          </div>
        </div>
      </div>
      <div v-for="item in orderIllness.historyRpList" :key="item.id">
        <div :style="{ marginTop: '20px' }">药品清单 {{ item.drugNumber }}</div>
        <div
          v-for="(item, index) in item.contentList"
          :key="index"
          class="drug-list"
        >
          <div>{{ item.name }} (规格：{{ item.spec }}) x{{ item.total }}</div>
          <div :style="{ color: '#e45b5b' }">
            {{ item.useWaysText }} {{ item.useFrequencyText }}
          </div>
          <div :style="{ color: '#666' }">备注：{{ item.remark || '无' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { orderIllness } from '@/api/'
export default {
  name: 'Illness',
  props: {
    orderId: String,
    bizType: String,
  },
  data() {
    return {
      orderIllness: {},
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.orderIllness = await orderIllness({
        orderId: this.orderId,
      })
      console.log(this.orderIllness, '-----123---------')
    },
  },
}
</script>
<style>
/* .vue-recycle-scroller.ready .vue-recycle-scroller__item-view {
  will-change: initial;
  transform: initial !important;
} */
</style>
<style lang="scss" scoped>
.img {
  width: 90px;
  height: 90px;
  margin-right: 10px;
  object-fit: cover;
}
.drug-list {
  margin-top: 10px;
  padding: 10px;
  background-color: #ececec;
}
</style>
