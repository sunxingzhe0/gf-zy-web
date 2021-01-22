<template>
  <section class="clinic-court-file">
    <nav class="nav-bar-left">
      <el-tabs tab-position="left" style="height: 100%;">
        <el-tab-pane label="随访计划">
          <el-table :data="tableData" style="width: 100%;">
            <el-table-column prop="date" label="日期"> </el-table-column>
            <el-table-column prop="name" label="姓名"> </el-table-column>
            <el-table-column prop="address" label="地址"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="风险评估 2020-01-06"></el-tab-pane>
        <el-tab-pane label="设备自测"></el-tab-pane>
        <el-tab-pane label="上传档案 2020-01-06"></el-tab-pane>
        <el-tab-pane label="健康评估"></el-tab-pane>
      </el-tabs>
    </nav>
  </section>
</template>

<script>
export default {
  name: 'clinic-court-file',
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
@import '@/styles/_variables.scss';

.clinic-court-file {
  height: calc(100vh - #{$router-view-offset-height} - 40px - 39px - 40px);

  .nav-bar-left {
    height: 100%;
  }

  .is-left {
    width: 180px;
  }
}
</style>
