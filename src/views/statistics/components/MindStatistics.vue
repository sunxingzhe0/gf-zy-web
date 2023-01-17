<template>
  <section class="view__statistics-mind">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="医生业务" name="doctor"> </el-tab-pane>
      <el-tab-pane label="患者挂号" name="patient"> </el-tab-pane>
    </el-tabs>
    <div class="mind-content">
      <MindDoctor v-if="activeName === 'doctor'" />
      <MindPatient v-if="activeName === 'patient'" />
    </div>
  </section>
</template>

<script>
import MindDoctor from './MindDoctor'
import MindPatient from './MindPatient'
export default {
  name: 'MindStatistics',
  components: { MindDoctor, MindPatient },
  data() {
    return {
      activeName: 'doctor',
    }
  },
}
</script>

<style lang="scss" scoped>
.view__statistics-mind {
  background-color: #ffffff;
  .mind-content {
    padding: 15px;
  }
  &::v-deep {
    .c__filter {
      background-color: #ffffff;
    }
    .el-tabs--border-card > .el-tabs__content {
      padding: 0;
    }
    .el-tabs--border-card {
      border-width: 0;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0);
    }
    .el-tabs--border-card > .el-tabs__header {
      border: 0;
      background-color: #f2f2f2;
    }
    .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
      border: 1px solid transparent;
    }
  }
}
</style>
