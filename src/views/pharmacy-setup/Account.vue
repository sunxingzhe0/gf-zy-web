<template>
  <section class="view__card">
    <div class="accountBox">
      <div class="accountItem">
        <div class="title">帐号名称</div>
        <div class="value">admin</div>
      </div>
      <div class="accountItem">
        <div class="title">角色身份</div>
        <div class="value">超级管理员</div>
      </div>
      <div class="accountItem">
        <div class="title">手机号</div>
        <div class="value">151****2156</div>
        <div class="showMore">更换</div>
      </div>
      <div class="accountItem">
        <div class="title">密码</div>
        <div class="value">**********</div>
        <div class="showMore">更改</div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Account',

  data() {
    return {}
  },

  methods: {
    // 点击查看更多
    showMore() {
      this.dialogVisible = true
    },
  },
  computed: {},
}
</script>

<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.accountBox {
  margin: 60px 0 0 100px;
  .accountItem {
    display: flex;
    font-size: 16px;
    margin-bottom: 20px;
    font-weight: 500;
    .title {
      width: 70px;
      text-align: right;
      color: #666666;
      margin-right: 20px;
    }
    .value {
      color: #333333;
      margin-right: 20px;
    }
    .showMore {
      cursor: pointer;
      color: $--color-primary;
    }
  }
}
</style>
