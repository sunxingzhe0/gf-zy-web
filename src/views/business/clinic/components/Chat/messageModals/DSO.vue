<template>
  <div>
    <MyHandle :intoId="intoId"></MyHandle>
  </div>
</template>

<script>
import MyHandle from '@/views/business/myHandle/myHandle.vue'
export default {
  components: {
    MyHandle,
  },
  props: {
    intoId: String,
  },
}
</script>

<style lang="scss" scoped></style>
