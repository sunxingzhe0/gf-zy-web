<template>
  <div class="timeList">
    <div
      class="group"
      :class="{ active: index == isActive }"
      v-for="(val, index) in tiemDatas"
      :key="index"
      @click="activeChange(index)"
    >
      <span>{{ val }}</span>
      <div class="circular">
        <div class="within"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tiemDatas: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      isActive: 0,
    }
  },
  methods: {
    activeChange(index) {
      this.isActive = index
    },
  },
}
</script>

<style lang="scss" scoped>
.timeList {
  width: 1400px;
  display: flex;
  color: #7f7f7f;
  margin-bottom: 40px;
  .group {
    flex: 1;
    // width: 120px;
    height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 2px solid #f2f2f2;
    position: relative;
    font-size: 12px;
    cursor: pointer;
    .circular {
      position: absolute;
      left: 50%;
      bottom: -4px;
      margin-right: 4px;
      width: 8px;
      height: 8px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.38);
      display: flex;
      justify-content: center;
      align-items: center;
      .within {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #fff;
      }
    }
  }
  .active {
    span {
      transform: scale(1.3);
      color: #27b2c1;
    }
    .circular {
      transform: scale(1.5);
      .within {
        background: #27b2c1;
      }
    }
  }
}
</style>
