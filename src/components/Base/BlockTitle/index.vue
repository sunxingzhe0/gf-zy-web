<template>
  <div class="block-title">
    <slot></slot>
  </div>
</template>
<script>
/*
@author        qiang
@name          块标题
@desc          块标题：左侧强调线
@props         <slot>
@emit          none
*/
export default {
  name: 'BlockTitle',
}
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';
.block-title {
  height: 18px;
  display: flex;
  font-size: 18px;
  color: #333333;
  font-weight: bold;
  margin: 15px 0 0;
  font-family: PingFang SC;
  &::before {
    content: '';
    width: 2px;
    height: 18px;
    display: block;
    margin-right: 10px;
    background: $--color-primary;
  }
}
</style>
