<template functional>
  <section>
    <el-row class="view__content" v-if="parent.detailInfo.medicalRecord">
      <el-col :span="8">
        <span>病历编号</span>
        {{ parent.detailInfo.medicalRecord.visitNo }}
      </el-col>

      <el-col :span="8">
        <span>就诊时间</span>
        {{ parent.detailInfo.medicalRecord.visitTime }}
      </el-col>

      <el-col :span="8">
        <span>诊疗类型</span>
        {{ parent.detailInfo.medicalRecord.medicalType }}
      </el-col>

      <el-col>
        <span>就诊人</span>
        {{ parent.detailInfo.patientName }}
      </el-col>
      <!-- 病历修改前 -->
      <!-- 
      <el-col>
        <span>主诉</span>
        {{ parent.detailInfo.medicalRecord.chiefComplaint }}
      </el-col>

      <el-col>
        <span>现病史</span>
        {{ parent.detailInfo.medicalRecord.currentDisease }}
      </el-col>

      <el-col>
        <span>体格检查</span>
      </el-col>

      <el-col>
        <span>辅助检查</span>
        {{ parent.detailInfo.medicalRecord.auxiliaryExam }}
      </el-col>

      <el-col>
        <span>诊断</span>
        {{ parent.detailInfo.medicalRecord.diagDesc }}
      </el-col>

      <el-col>
        <span>处理意见</span>
      </el-col> -->
      <!-- 病历修改后 -->
      <el-col>
        <span>就诊方式</span>
        {{ parent.detailInfo.medicalRecord.seeWay }}
      </el-col>
      <el-col>
        <span>病情</span>
        {{ parent.detailInfo.medicalRecord.illness }}
      </el-col>
      <el-col>
        <span>辅助检查</span>
        {{ parent.detailInfo.medicalRecord.supCheck }}
      </el-col>
      <el-col>
        <span>初步诊断</span>
        {{ parent.detailInfo.medicalRecord.dtoList }}
      </el-col>
      <el-col>
        <span>处理意见</span>
        {{ parent.detailInfo.medicalRecord.dealIdea }}
      </el-col>
    </el-row>
  </section>
</template>
