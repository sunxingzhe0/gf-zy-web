<template>
  <div class="date-line">
    <div class="date-line-wrap">
      <el-button icon="el-icon-arrow-left" circle @click="prev"></el-button>
      <div class="date-content" ref="dateRef">
        <div
          v-for="(item, index) in tiemDatas"
          :key="index"
          @click="changeDate(item, index)"
          :ref="`dateItem${index}`"
          :class="['date-item', isActive === index ? 'active' : '']"
        >
          <div>{{ item }}</div>
        </div>
      </div>
      <el-button icon="el-icon-arrow-right" circle @click="next"></el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tiemDatas: {
      type: Array,
    },
  },
  data() {
    return {
      isActive: 0,
    }
  },
  computed: {
    // currentIndex: function () {
    //   let currentIndex = 0
    //   this.tiemDatas.forEach((item, index) => {
    //     if (index === this.isActive) {
    //       currentIndex = index
    //     }
    //   })
    //   return currentIndex
    // },
  },
  methods: {
    changeDate(item, index) {
      this.isActive = index
      console.log(index)
      // let dateRef = this.$refs.dateRef
      // let itemTop = this.$refs[`dateItem${index}`][0].offsetLeft
      // dateRef.scrollLeft = itemTop - 200
      this.$emit('onchange', item)
    },
    next() {
      if (this.isActive < this.tiemDatas.length - 1) {
        this.isActive += 1
        let dateRef = this.$refs.dateRef
        let itemTop = this.$refs[`dateItem${this.isActive}`][0].offsetLeft - 40
        if (itemTop > dateRef.offsetWidth - 120) {
          dateRef.scrollLeft = itemTop
        }
        console.log(dateRef.offsetWidth, dateRef.scrollLeft)
        this.$emit('onchange', this.tiemDatas[this.isActive])
      }
    },
    prev() {
      if (this.isActive > 0) {
        console.log(this.isActive, '----')
        this.isActive -= 1
        let dateRef = this.$refs.dateRef
        let itemTop = this.$refs[`dateItem${this.isActive}`][0].offsetLeft
        dateRef.scrollLeft = itemTop - 120
        this.$emit('onchange', this.tiemDatas[this.isActive])
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.date-line {
  overflow: hidden;
  padding-bottom: 3px;
  margin-bottom: 30px;
}
.date-line-wrap {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e6e6e6;
  height: 46px;

  .el-button {
    width: 24px;
    height: 24px;
    padding: 0;
    margin-top: 10px;
  }
  .date-content {
    flex: 1;
    overflow: scroll;
    overflow-y: hidden;
    display: flex;
    height: 59px;
    flex-flow: nowrap;
    margin: 0 10px;
    .date-item {
      width: 120px;
      text-align: center;
      font-size: 14px;
      flex: none;
      line-height: 18px;
      position: relative;
      cursor: pointer;
      &::after {
        content: '';
        width: 6px;
        height: 6px;
        position: absolute;
        bottom: 0;
        left: 50%;
        margin-left: -3px;
        background: #808080;
        border-radius: 50%;
      }
      &.disable {
        color: #d4d4d4;
        &::after {
          background: #d4d4d4;
        }
      }
      &.active {
        color: $--color-primary;
        &::after {
          background: $--color-primary;
        }
      }
    }
  }
}
</style>
