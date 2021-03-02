<template>
  <section>
    <h3 class="view__title">基本信息</h3>
    <el-row class="view__content">
      <el-col :span="8">
        <span>类型</span>
        <!-- {{ $attrs.medicalType }} -->

        {{
          hisInfo.medicalType == 'MZ'
            ? '门诊'
            : hisInfo.medicalType == 'ZY'
            ? '住院'
            : '体检'
        }}
      </el-col>

      <el-col :span="8"> <span>唯一ID</span> {{ hisInfo.patientId }} </el-col>

      <el-col :span="8">
        <span>就诊渠道</span>
        {{ hisInfo.type == 'outer' ? '互联网' : '院内' }}
      </el-col>

      <!-- <el-col :span="8">
        <span>接诊医生</span>
        {{
          $attrs.medicalRecord
            ? $attrs.medicalRecord.docName
              ? $attrs.medicalRecord.docName
              : '暂无'
            : '暂无'
        }}
      </el-col> -->
      <el-col :span="8">
        <span>接诊医生</span>
        {{ hisInfo.doctorName }}
      </el-col>

      <!-- <el-col :span="8">
        <span>接诊时间</span>
        {{
          $attrs.medicalRecord
            ? $attrs.medicalRecord.visitTime
              ? $attrs.medicalRecord.visitTime
              : '暂无'
            : '暂无'
        }}
      </el-col> -->
      <el-col :span="8">
        <span>接诊时间</span>
        {{ hisInfo.visitDate }}
      </el-col>
    </el-row>

    <h3 class="view__title">患者信息</h3>
    <el-row class="view__content">
      <el-col :span="8">
        <span>就诊人</span>
        {{ hisInfo.patientName }}
      </el-col>

      <el-col :span="8">
        <span>性别</span>
        {{ hisInfo.sexDesc }}
      </el-col>

      <el-col :span="8">
        <span>年龄</span>
        {{ hisInfo.patientAge }} 岁
      </el-col>

      <el-col :span="24">
        <span>病情自述</span>
        {{ hisInfo.illnessDesc }}

        <div class="image-wrap">
          <el-image
            v-for="(_, index) in hisInfo.pic"
            :key="index"
            style="width: 120px; height: 120px"
            :src="FILE_URL(_)"
            fit="cover"
            :preview-src-list="[]"
          ></el-image>
        </div>
      </el-col>

      <el-col :span="24">
        <span>诊断</span>
        {{ hisInfo.diagnose }}
      </el-col>
    </el-row>

    <h3 class="view__title">医嘱记录</h3>
    <Prescription
      :isHistory="true"
      :historyList="hisInfo.rpList"
      :orderId="orderId"
      v-bind="{ variables }"
      v-if="hisInfo.rpList && hisInfo.rpList.length > 0"
    />
    <h3 class="view__title">检查报告</h3>
    <el-tabs
      tab-position="left"
      class="c__custom-tabs"
      v-if="hisInfo.examInfoList"
    >
      <el-tab-pan v-for="item in hisInfo.examInfoList" :key="item.reportNo">
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
          1
          <div class="portRight">
            <div class="miniTitle">报告时间</div>
            <div>{{ item.reportDtime }}</div>
          </div>
          <div class="portRight">
            <div class="miniTitle">检查描述</div>
            <div></div>
          </div>
          <div class="portRight">
            <div class="miniTitle">报告诊断</div>
            <div>左肩关节骨质未见明显异常，必要时进一步检查</div>
          </div>
          <div class="portRight">
            <div class="miniTitle">检查信息</div>
            <div>
              <span>患者姓名</span>{{ item.name }} {{ item.sex }}
              {{ item.age }}岁
            </div>
            <div><span>检查号</span>dr20180702010</div>
            <div><span>检查项目</span></div>
            <div><span>检查时间</span>{{ item.examDtime }}</div>
            <div><span>设备类型</span>dx</div>
            <div><span>申请科室</span>神{{ item.applyDeptName }}</div>
            <div><span>病人主诉</span></div>
            <div><span>临床诊断</span>{{ item.clinicDiag }}</div>
          </div>
        </div>
      </el-tab-pan>
    </el-tabs>

    <h3 class="view__title">检验报告</h3>
    <el-tabs
      tab-position="left"
      class="c__custom-tabs"
      v-if="hisInfo.labInfoList"
    >
      <el-tab-pane v-for="item in hisInfo.labInfoList" :key="item.reportNo">
        <template v-slot:label>
          <div>
            <el-row>
              <el-col :span="12"> 报告编号：{{ item.reportNo }} </el-col>
              <el-col :span="12" class="is-right">
                <span :style="{ color: variables.primary }">{{
                  item.name
                }}</span>
                ，
              </el-col>
              <el-col
                ><b>{{ item.labItemName }}</b></el-col
              >
              <el-col :span="8">申请医生：{{ item.applyDocName }}</el-col>
              <el-col :span="16" v-if="item.applyTime">申请时间：</el-col>
              <el-col :span="8">报告医生：{{ item.reportDocName }}</el-col>
              <el-col :span="16">缴费时间：</el-col>
            </el-row>
          </div>
        </template>

        <div style="background: #f2f2f2; padding: 20px">
          1
          <el-row style="line-height: 36px">
            <el-col :span="8">检验项目：{{ item.labItemName }}</el-col>
            <el-col :span="8">执行科室：{{ item.labDeptName }}</el-col>
            <el-col :span="8">申请日期：</el-col>
            <el-col :span="8">开单医生：{{ item.labDocName }}</el-col>
            <el-col :span="8">报告日期：{{ item.reportDtime }}</el-col>
            <el-col :span="8">报告医生：</el-col>
          </el-row>
          <el-table
            :data="item.labDetailList"
            style="width: 100%; margin-top: 10px"
          >
            <el-table-column type="name" label="检验项"> </el-table-column>
            <el-table-column prop="name" label="值"> </el-table-column>
            <el-table-column prop="address" label="单位"> </el-table-column>
            <el-table-column prop="address" label="参考"> </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

    <h3 class="view__title">患者病历</h3>
    <MedicalRecord
      v-if="hisInfo.medicalRecord"
      :isHistory="true"
      v-bind="{ ...hisInfo.medicalRecord, medicalName: hisInfo.patientName }"
    />
  </section>
</template>
<script>
import { hisRecord } from '@/api/prescription'
import Prescription from './Prescription'
import MedicalRecord from './MedicalRecord'
export default {
  components: {
    Prescription,
    MedicalRecord,
  },
  props: {
    orderId: String,
    medicalId: String,
    variables: Object,
  },
  data() {
    return {
      hisInfo: {},
    }
  },
  created() {
    this.getHisInfo()
  },
  methods: {
    // 获取历史就诊记录
    async getHisInfo() {
      this.hisInfo = await hisRecord({
        medicalId: this.$attrs.id,
      })
    },
    open() {},
  },
}
</script>
