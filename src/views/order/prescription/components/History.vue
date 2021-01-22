<template functional>
  <section>
    <h3 class="view__title">基本信息</h3>
    <el-row class="view__content">
      <el-col :span="8">
        <span>类型</span>
        {{
          parent.hisInfo.medicalType == 'MZ'
            ? '门诊'
            : parent.hisInfo.medicalType == 'ZY'
            ? '住院'
            : parent.hisInfo.medicalType == 'TJ'
            ? '体检'
            : ''
        }}
      </el-col>

      <el-col :span="8">
        <span>唯一ID</span> {{ parent.hisInfo.patientId }}
      </el-col>

      <el-col :span="8">
        <span>就诊渠道</span>
        {{
          parent.hisInfo.type == 'outer'
            ? '互联网'
            : parent.hisInfo.type == 'inner'
            ? '院内'
            : ''
        }}
      </el-col>

      <!-- <el-col :span="8">
        <span>接诊医生</span>
        {{
          parent.hisInfo.medicalRecord
            ? parent.hisInfo.medicalRecord.docName
              ? parent.hisInfo.medicalRecord.docName
              : '暂无'
            : '暂无'
        }}
      </el-col> -->
      <el-col :span="8">
        <span>接诊医生</span>
        {{ parent.hisInfo.doctorName }}
      </el-col>

      <!-- <el-col :span="8">
        <span>接诊时间</span>
        {{
          parent.hisInfo.medicalRecord
            ? parent.hisInfo.medicalRecord.visitTime
              ? parent.hisInfo.medicalRecord.visitTime
              : '暂无'
            : '暂无'
        }}
      </el-col> -->
      <el-col :span="8">
        <span>接诊时间</span>
        {{ parent.hisInfo.visitDate }}
      </el-col>
    </el-row>

    <h3 class="view__title">患者信息</h3>
    <el-row class="view__content">
      <el-col :span="8">
        <span>就诊人</span>
        {{ parent.hisInfo.patientName }}
      </el-col>

      <el-col :span="8">
        <span>性别</span>
        {{ parent.hisInfo.sexDesc }}
      </el-col>

      <el-col :span="8">
        <span>年龄</span>
        {{
          parent.hisInfo.patientAge == 'null' ? 0 : parent.hisInfo.patientAge
        }}岁
      </el-col>

      <el-col :span="24">
        <span>病情自诉</span>
        {{ parent.hisInfo.illnessDesc }}

        <div class="image-wrap">
          <el-image
            v-for="(_, index) in parent.hisInfo.pic"
            :key="index"
            style="width: 120px; height: 120px;"
            :src="parent.FILE_URL(_)"
            fit="cover"
            :preview-src-list="[]"
          ></el-image>
        </div>
      </el-col>

      <el-col :span="24">
        <span>病毒性肺炎</span>
        {{ parent.hisInfo.diagnose }}
      </el-col>
    </el-row>

    <h3 class="view__title">医嘱记录</h3>
    <el-row class="view__content">
      <el-col :span="24">
        <span>处方单</span>
        <el-button type="primary" size="mini" @click="parent.open()" plain
          >痕迹查看</el-button
        >
      </el-col>
      <el-col :span="24" style="padding-left: 60px;">
        <el-card
          shadow="hover"
          v-for="(item, index) in parent.detailInfo.rpList"
          :key="index"
        >
          <template v-slot:header>
            <b>处方号：{{ item.rpNo }}</b>
            <el-row style="color: #666; font-size: 14px;">
              <el-col :md="8" :lg="2"
                >数量:{{ item.contentList.length }}</el-col
              >
              <el-col :md="8" :lg="6"
                >医生：{{ item.auditName }} {{ item.title }}</el-col
              >
              <el-col :md="8" :lg="4">{{ item.auditTime }}</el-col>
              <el-col :md="8" :lg="4">西药：￥{{ item.westFee }} </el-col>
              <el-col :md="8" :lg="4">中成药：￥{{ item.chPatentFee }} </el-col>
              <el-col
                :md="8"
                :lg="4"
                :style="{ color: parent.variables.danger }"
              >
                合计：￥{{ item.rpFee }}
              </el-col>
            </el-row>
          </template>
          <el-table :data="item.contentList" border style="width: 100%;">
            <el-table-column type="index" label="序号" width="60">
            </el-table-column>
            <el-table-column prop="item.contentList.type" label="类型">
            </el-table-column>
            <el-table-column prop="name" label="药品名称"> </el-table-column>
            <el-table-column prop="spec" label="规格"> </el-table-column>
            <el-table-column prop="useWays" label="用药途径"> </el-table-column>
            <el-table-column prop="singleDose" label="单次剂量">
            </el-table-column>
            <el-table-column prop="useFrequency" label="用药频次">
            </el-table-column>
            <el-table-column prop="total" label="总量"> </el-table-column>
            <el-table-column label="医保">{{
              medicare == 'ME_FEE'
                ? '自费'
                : medicare == 'A'
                ? '甲'
                : medicare == 'B'
                ? '乙'
                : '丙'
            }}</el-table-column>
            <el-table-column prop="price" label="单价"> </el-table-column>
            <el-table-column prop="totalPrice" label="总价"> </el-table-column>
            <el-table-column prop="pharmacyName" label="接收方">
            </el-table-column>
            <el-table-column prop="remark" label="备注"> </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <h3 class="view__title">检查报告</h3>
    <el-tabs
      tab-position="left"
      class="c__custom-tabs"
      v-if="parent.detailInfo.examInfoList"
    >
      <el-tab-pan
        v-for="(item, index) in parent.detailInfo.examInfoList"
        :key="index"
      >
        <template v-slot:label>
          <div>
            <el-row>
              <el-col :span="12"> 报告编号：{{ item.reportNo }} </el-col>
              <el-col :span="12" class="is-right">
                <span :style="{ color: parent.variables.primary }">{{
                  item.name
                }}</span>
                ，
              </el-col>
              <el-col
                ><b>{{ item.reportTitle }}</b></el-col
              >
              <el-col :span="8">申请医生：{{ item.applyDocName }}</el-col>
              <el-col :span="16" v-if="item.applyTime"
                >申请时间：{{ item.applyTime }}</el-col
              >
              <el-col :span="8">报告医生：</el-col>
              <el-col :span="16">缴费时间：</el-col>
            </el-row>
          </div>
        </template>

        <div style="background: #f2f2f2; padding: 15px 20px 6px 20px;">
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

      <!-- <el-tab-pane>
        <template v-slot:label>
          <div>
            <el-row>
              <el-col :span="12">
                报告编号：NO.11010
              </el-col>
              <el-col :span="12" class="is-right">
                <span :style="{ color: parent.variables.primary }">刘力菲</span>
                ，正常
              </el-col>
              <el-col><b>项目名称</b></el-col>
              <el-col :span="8">申请医生：XXX</el-col>
              <el-col :span="16">申请时间：2020.04.01 10:00:00</el-col>
              <el-col :span="8">报告医生：XXX</el-col>
              <el-col :span="16">缴费时间：2020.04.01 10:00:00</el-col>
            </el-row>
          </div>
        </template>

        <div style="background: #f2f2f2; padding: 15px 20px 6px 20px;">
          2
          <div class="portRight">
            <div class="miniTitle">报告时间</div>
            <div>2019-01-09 09:00:01</div>
          </div>
          <div class="portRight">
            <div class="miniTitle">检查描述</div>
            <div>左肩关节骨质结构完整，关节结构尚正常，未见明显异常</div>
          </div>
          <div class="portRight">
            <div class="miniTitle">报告诊断</div>
            <div>左肩关节骨质未见明显异常，必要时进一步检查</div>
          </div>
          <div class="portRight">
            <div class="miniTitle">检查信息</div>
            <div><span>患者姓名</span>李明明 女 55岁</div>
            <div><span>检查号</span>dr20180702010</div>
            <div><span>检查项目</span>左肩关节，正侧位</div>
            <div><span>检查时间</span>2018-09-09 09:00:01</div>
            <div><span>设备类型</span>dx</div>
            <div><span>申请科室</span>神经内科</div>
            <div><span>病人主诉</span>头晕、摔倒、右膝疼，一周</div>
            <div><span>临床诊断</span>晕厥，脑出血</div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane>
        <template v-slot:label>
          <div>
            <el-row>
              <el-col :span="12">
                报告编号：NO.11010
              </el-col>
              <el-col :span="12" class="is-right">
                <span :style="{ color: parent.variables.primary }">刘力菲</span>
                ，正常
              </el-col>
              <el-col><b>项目名称</b></el-col>
              <el-col :span="8">申请医生：XXX</el-col>
              <el-col :span="16">申请时间：2020.04.01 10:00:00</el-col>
              <el-col :span="8">报告医生：XXX</el-col>
              <el-col :span="16">缴费时间：2020.04.01 10:00:00</el-col>
            </el-row>
          </div>
        </template>

        <div style="background: #f2f2f2; padding: 15px 20px 6px 20px;">
          3
          <div class="portRight">
            <div class="miniTitle">报告时间</div>
            <div>2019-01-09 09:00:01</div>
          </div>
          <div class="portRight">
            <div class="miniTitle">检查描述</div>
            <div>左肩关节骨质结构完整，关节结构尚正常，未见明显异常</div>
          </div>
          <div class="portRight">
            <div class="miniTitle">报告诊断</div>
            <div>左肩关节骨质未见明显异常，必要时进一步检查</div>
          </div>
          <div class="portRight">
            <div class="miniTitle">检查信息</div>
            <div><span>患者姓名</span>李明明 女 55岁</div>
            <div><span>检查号</span>dr20180702010</div>
            <div><span>检查项目</span>左肩关节，正侧位</div>
            <div><span>检查时间</span>2018-09-09 09:00:01</div>
            <div><span>设备类型</span>dx</div>
            <div><span>申请科室</span>神经内科</div>
            <div><span>病人主诉</span>头晕、摔倒、右膝疼，一周</div>
            <div><span>临床诊断</span>晕厥，脑出血</div>
          </div>
        </div>
      </el-tab-pane> -->
    </el-tabs>

    <h3 class="view__title">检验报告</h3>
    <el-tabs
      tab-position="left"
      class="c__custom-tabs"
      v-if="parent.detailInfo.labInfoList"
    >
      <el-tab-pane
        v-for="(item, index) in parent.detailInfo.labInfoList"
        :key="index"
      >
        <template v-slot:label>
          <div>
            <el-row>
              <el-col :span="12"> 报告编号：{{ item.reportNo }} </el-col>
              <el-col :span="12" class="is-right">
                <span :style="{ color: parent.variables.primary }">{{
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

        <div style="background: #f2f2f2; padding: 20px;">
          1
          <el-row style="line-height: 36px;">
            <el-col :span="8">检验项目：{{ item.labItemName }}</el-col>
            <el-col :span="8">执行科室：{{ item.labDeptName }}</el-col>
            <el-col :span="8">申请日期：</el-col>
            <el-col :span="8">开单医生：{{ item.labDocName }}</el-col>
            <el-col :span="8">报告日期：{{ item.reportDtime }}</el-col>
            <el-col :span="8">报告医生：</el-col>
          </el-row>
          <el-table :data="tableData" style="width: 100%; margin-top: 10px;">
            <el-table-column type="name" label="检验项"> </el-table-column>
            <el-table-column prop="name" label="值"> </el-table-column>
            <el-table-column prop="address" label="单位"> </el-table-column>
            <el-table-column prop="address" label="参考"> </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane>
        <template v-slot:label>
          <div>
            <el-row>
              <el-col :span="12">
                报告编号：NO.11010
              </el-col>
              <el-col :span="12" class="is-right">
                <span :style="{ color: parent.variables.primary }">刘力菲</span>
                ，正常
              </el-col>
              <el-col><b>项目名称</b></el-col>
              <el-col :span="8">申请医生：XXX</el-col>
              <el-col :span="16">申请时间：2020.04.01 10:00:00</el-col>
              <el-col :span="8">报告医生：XXX</el-col>
              <el-col :span="16">缴费时间：2020.04.01 10:00:00</el-col>
            </el-row>
          </div>
        </template>

        <div style="background: #f2f2f2; padding: 20px;">
          2
          <el-row style="line-height: 36px;">
            <el-col :span="8">检验项目：血常规</el-col>
            <el-col :span="8">执行科室：检验科</el-col>
            <el-col :span="8">申请日期：2020-14-24 11:30</el-col>
            <el-col :span="8">开单医生：肖大宝</el-col>
            <el-col :span="8">报告日期：2020-14-24 11:30</el-col>
            <el-col :span="8">报告医生：肖大宝</el-col>
          </el-row>
          <el-table :data="tableData" style="width: 100%; margin-top: 10px;">
            <el-table-column type="name" label="检验项"> </el-table-column>
            <el-table-column prop="name" label="值"> </el-table-column>
            <el-table-column prop="address" label="单位"> </el-table-column>
            <el-table-column prop="address" label="参考"> </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <template v-slot:label>
          <div>
            <el-row>
              <el-col :span="12">
                报告编号：NO.11010
              </el-col>
              <el-col :span="12" class="is-right">
                <span :style="{ color: parent.variables.primary }">刘力菲</span>
                ，正常
              </el-col>
              <el-col><b>项目名称</b></el-col>
              <el-col :span="8">申请医生：XXX</el-col>
              <el-col :span="16">申请时间：2020.04.01 10:00:00</el-col>
              <el-col :span="8">报告医生：XXX</el-col>
              <el-col :span="16">缴费时间：2020.04.01 10:00:00</el-col>
            </el-row>
          </div>
        </template>

        <div style="background: #f2f2f2; padding: 20px;">
          3
          <el-row style="line-height: 36px;">
            <el-col :span="8">检验项目：血常规</el-col>
            <el-col :span="8">执行科室：检验科</el-col>
            <el-col :span="8">申请日期：2020-14-24 11:30</el-col>
            <el-col :span="8">开单医生：肖大宝</el-col>
            <el-col :span="8">报告日期：2020-14-24 11:30</el-col>
            <el-col :span="8">报告医生：肖大宝</el-col>
          </el-row>
          <el-table :data="tableData" style="width: 100%; margin-top: 10px;">
            <el-table-column type="name" label="检验项"> </el-table-column>
            <el-table-column prop="name" label="值"> </el-table-column>
            <el-table-column prop="address" label="单位"> </el-table-column>
            <el-table-column prop="address" label="参考"> </el-table-column>
          </el-table>
        </div>
      </el-tab-pane> -->
    </el-tabs>

    <h3 class="view__title">患者病历</h3>
  </section>
</template>
