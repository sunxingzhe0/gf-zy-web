<template>
  <!-- 诊室自动关闭倒计时 -->
  <div
    class="countdown"
    :class="{ expand: showState == 'expand' }"
    @click.stop="expansion"
  >
    <img
      class="icon"
      :class="{ left: showState == 'retract' }"
      :src="require('@/assets/zhankaihui@2x.png')"
      object-fit="aspectFit"
    />
    <span>
      {{ $attrs.status == 'IN_TREAT' ? '离服务结束' : '离诊室自动关闭' }}还剩
    </span>
    <span style="margin-left: 4px; color: #e45b5b">{{ countDown }}</span>
  </div>
</template>

<script>
export default {
  name: 'RoomCountdown',
  props: {
    countDown: String,
  },
  data() {
    return {
      animationData: {},
      showState: 'expand',
    }
  },
  methods: {
    expansion() {
      if (this.showState == 'expand') {
        this.showState = 'retract'
      } else {
        this.showState = 'expand'
      }
    },
  },
}
</script>

<style lang="scss">
.countdown {
  position: absolute;
  right: 0;
  top: 80px;
  z-index: 1;
  width: 260px;
  line-height: 36px;
  padding-left: 16px;
  border-top-left-radius: 36px;
  border-bottom-left-radius: 36px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
  background-color: #fff;
  color: #666;
  transition: 0.5s;
  font-size: 14px;

  .icon {
    width: 16px;
    margin-right: 10px;
    transform: rotate(90deg);

    &.left {
      transform: rotate(-90deg);
    }
  }
  &.expand {
    right: -220px;
  }
}
</style>
