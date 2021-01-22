<template>
  <div class="app-info">
    <BlockTitle>检验报告</BlockTitle>
    <el-tabs tab-position="left" class="c__custom-tabs">
      <el-tab-pane v-for="item in labInfoList" :key="item.reportNo">
        <template v-slot:label>
          <div>
            <el-row class="tag-list">
              <el-col :span="12">
                报告编号：{{ item.reportNo || '暂无' }}
              </el-col>
              <!-- <el-col :span="12" class="is-right">
                <span :style="{ color: variables.primary }">{{
                  item.name
                }}</span>
                ，
              </el-col> -->
              <!-- <el-col
                ><b>{{ item.labItemName }}</b></el-col> -->
              <el-col :span="12"
                >申请医生：{{ item.applyDocName || '暂无' }}</el-col
              >
              <el-col :span="12" v-if="item.applyTime"
                >申请时间：{{ item.applyTime || '暂无' }}</el-col
              >
              <el-col :span="12"
                >报告医生：{{ item.reportDocName || '暂无' }}</el-col
              >
              <el-col :span="12">缴费时间：</el-col>
            </el-row>
          </div>
        </template>

        <div style="background: #f2f2f2; padding: 20px;">
          <el-row style="line-height: 36px;">
            <el-col :span="8"
              >检验项目：{{ item.labItemName || '暂无' }}</el-col
            >
            <el-col :span="8"
              >执行科室：{{ item.labDeptName || '暂无' }}</el-col
            >
            <el-col :span="8">申请日期：</el-col>
            <el-col :span="8">开单医生：{{ item.labDocName || '暂无' }}</el-col>
            <el-col :span="8"
              >报告日期：{{ item.reportDtime || '暂无' }}</el-col
            >
            <el-col :span="8"
              >报告医生：{{ item.reportDocName || '暂无' }}</el-col
            >
          </el-row>
          <el-table
            :data="item.labInfoList"
            style="width: 100%; margin-top: 10px;"
          >
            <el-table-column type="name" label="检验项"> </el-table-column>
            <el-table-column prop="name" label="值"> </el-table-column>
            <el-table-column prop="address" label="单位"> </el-table-column>
            <el-table-column prop="address" label="参考"> </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { BlockTitle } from '@/components/Base'
export default {
  name: 'InspectReport',
  components: {
    BlockTitle,
  },
  props: {
    labInfoList: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
