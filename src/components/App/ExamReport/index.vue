<template>
  <div class="app-info">
    <BlockTitle>检查报告</BlockTitle>
    <el-tabs tab-position="left" class="c__custom-tabs">
      <el-tab-pan v-for="item in examInfoList" :key="item.reportNo">
        <template v-slot:label>
          <div>
            <el-row>
              <el-col :span="12"> 报告编号：{{ item.reportNo }} </el-col>
              <el-col :span="12" class="is-right">
                <span :style="{ color: variables.primary }">
                  {{ item.name }}
                </span>
                ，
              </el-col>
              <el-col>
                <b>{{ item.reportTitle }}</b>
              </el-col>
              <el-col :span="8">申请医生：{{ item.applyDocName }}</el-col>
              <el-col :span="16" v-if="item.applyTime">
                申请时间：{{ item.applyTime }}
              </el-col>
              <el-col :span="8">报告医生：</el-col>
              <el-col :span="16">缴费时间：</el-col>
            </el-row>
          </div>
        </template>

        <div style="background: #f2f2f2; padding: 15px 20px 6px 20px">
          <div class="portRight">
            <div class="miniTitle">报告时间</div>
            <div>{{ item.applyDtime }}</div>
          </div>
          <div class="portRight">
            <div class="miniTitle">检查描述</div>
            <div></div>
          </div>
          <div class="portRight">
            <div class="miniTitle">报告诊断</div>
            <div></div>
          </div>
          <div class="portRight">
            <div class="miniTitle">检查信息</div>
            <div>
              <span>患者姓名</span>{{ item.name }} {{ item.sex }}
              {{ item.age }}
            </div>
            <div><span>检查号</span>{{ item.reportNo }}</div>
            <div><span>检查项目</span>{{ item.reportTitle }}</div>
            <div><span>检查时间</span>{{ item.examDtime }}</div>
            <div><span>设备类型</span></div>
            <div><span>申请科室</span>{{ item.applyDeptName }}</div>
            <div><span>病人主诉</span></div>
            <div><span>临床诊断</span>{{ item.clinicDiag }}</div>
          </div>
        </div>
      </el-tab-pan>
    </el-tabs>
  </div>
</template>
<script>
import { BlockTitle } from '@/components/Base'
export default {
  name: 'ExamReport',
  components: {
    BlockTitle,
  },
  props: {
    examInfoList: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
