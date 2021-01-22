<template>
  <div>
    <h4>病历详情</h4>
    <div class="flex-start-start mt-20">
      <div class="w300">病历编号：{{ info.diseId }}</div>
      <div>就诊时间：{{ info.medicalDate }}</div>
    </div>
    <div class="flex-start-start mt-20">
      <div class="w300">就诊人：{{ info.medicalName }}</div>
      <div>诊疗类型：{{ info.medicalType }}</div>
    </div>
    <div v-for="{ key, title, content } in dataList" :key="key">
      <h4>{{ title }}</h4>
      <div>{{ content }}</div>
    </div>
  </div>
</template>

<script>
import { findDiseaseByOrderId } from '@/api/business'
export default {
  name: 'EMH',
  data() {
    return {
      info: {},
      dataList: [
        {
          key: 'mainSuit',
          title: '主诉',
        },
        {
          key: 'nowDisease',
          title: '现病史',
        },
        {
          key: 'phyCheck',
          title: '体格检查',
        },
        {
          key: 'supCheck',
          title: '辅助检查',
        },
        {
          key: 'diagnosis',
          title: '诊断',
        },
        {
          key: 'dealIdea',
          title: '处理意见',
        },
      ],
    }
  },
  created() {
    this.findDisease()
  },
  methods: {
    async findDisease() {
      const data = await findDiseaseByOrderId({ orderId: this.$attrs.orderId })

      this.info = { ...data }
      this.dataList = this.dataList.map(item =>
        Object.assign(item, {
          content: data[item.key],
        }),
      )
    },
  },
}
</script>

<style scoped>
.mt-20 {
  margin-top: 20px;
}
.w300 {
  width: 300px;
}
</style>
