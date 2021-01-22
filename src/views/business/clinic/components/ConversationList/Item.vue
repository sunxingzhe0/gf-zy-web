<template functional>
  <section class="c__conversation-item" :class="data.class" v-on="listeners">
    <div class="info">
      <template v-if="props.sex">
        <strong>{{ props.memberName }}</strong>
        {{ props.sex }}
      </template>
      <template v-if="props.age">, {{ props.age }} </template>
      <el-tag size="mini">{{ props.bizTypeName }}</el-tag>
      <el-tag
        v-if="props.unReadMessages"
        type="danger"
        size="mini"
        effect="dark"
        style="margin-left: 10px;"
        >{{ props.unReadMessages }}</el-tag
      >
      <br />
      {{ props.showTime }}
    </div>
  </section>
</template>

<style lang="scss">
@import '@/styles/_variables.scss';

.c__conversation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 60px;
  border-left: 2px solid transparent;
  cursor: pointer;
  transition-property: background-color, border-color, color;
  transition-duration: 0.6s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  &.hover {
    border-left-color: currentColor;
    background: $--color-primary-light-9;
    color: $--color-primary;
  }

  strong {
    font-size: 14px;
  }

  .tag {
    position: absolute;
    top: 0;
    right: 0;
    width: 12px;
    height: 12px;
    line-height: 10px;
    text-align: center;
    border-radius: 50%;
    background-color: #f74a4a;
    color: #fff;
    font-size: 12px;
  }

  .info {
    font-size: 14px;
    color: #666;
    white-space: nowrap;
  }
}
</style>
