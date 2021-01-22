<template functional>
  <section>
    <h3 class="view__title">患者信息</h3>
    <el-row class="view__content">
      <el-col :span="8">
        <span>就诊人</span>
        {{ parent.detailInfo.memberName }}
      </el-col>

      <el-col :span="8">
        <span>性别</span>
        {{ parent.detailInfo.memberSex == 1 ? '男' : '女' }}
      </el-col>

      <el-col :span="8">
        <span>年龄</span>
        {{ parent.detailInfo.memberAge }}岁
      </el-col>

      <el-col :span="8">
        <span>联系电话</span>
        {{ parent.detailInfo.memberPhone }}
      </el-col>

      <el-col :span="8">
        <span>业务类型</span>
        {{
          parent.detailInfo.serviceType == 'REPEAT_CLINIC'
            ? '在线复诊'
            : parent.detailInfo.serviceType == 'CONSULT'
            ? '在线咨询'
            : parent.detailInfo.serviceType == 'CARRYON_PRESC'
            ? '慢病续方'
            : '处方'
        }}
      </el-col>

      <el-col :span="8">
        <span>业务形式</span>
        {{
          parent.detailInfo.serviceMode == 'GRAPHIC'
            ? '图文'
            : parent.detailInfo.serviceMode == 'VIDEO'
            ? '视频'
            : '电话'
        }}
      </el-col>

      <el-col :span="24">
        <span>病情自诉</span>
        {{ parent.detailInfo.diseaseDesc }}
        <div class="image-wrap">
          <el-image
            v-for="_ in parent.detailInfo.picList"
            :key="_"
            style="width: 120px; height: 120px;"
            :src="parent.FILE_URL(_)"
            :preview-src-list="[]"
          ></el-image>
        </div>
      </el-col>

      <el-col :span="24">
        <span>诊断</span>
        {{ parent.detailInfo.diagnosis }}
      </el-col>
    </el-row>

    <h3 class="view__title">处方信息</h3>
    <el-row class="view__content">
      <el-col>
        <span>开方医生</span>
        {{ parent.detailInfo.doctorName }} {{ parent.detailInfo.title }}
      </el-col>

      <el-col>
        <span>药品数量</span>
        <template v-if="parent.detailInfo.rpDrugList">
          {{ parent.detailInfo.rpDrugList.length }}</template
        >
      </el-col>

      <el-col>
        <span>药品清单</span>
        <div style="width: 100%; padding-left: 75px;">
          <el-table
            :data="parent.detailInfo.rpDrugList"
            border
            size="mini"
            style="width: 100%;"
          >
            <el-table-column type="index" label="序号" width="70">
            </el-table-column>
            <el-table-column label="类型">
              <template slot-scope="scope">
                {{ scope.row.type == 'WESTERN_MEDICINE' ? '西药' : '中成药' }}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="药品名称"> </el-table-column>
            <el-table-column prop="spec" label="规格"> </el-table-column>
            <el-table-column prop="useWays" label="用药途径"> </el-table-column>
            <el-table-column prop="singleDose" label="单次剂量">
            </el-table-column>
            <el-table-column prop="useFrequency" label="用药频次">
            </el-table-column>
            <el-table-column prop="total" label="总量"> </el-table-column>
            <el-table-column label="医保"
              ><template slot-scope="scope">
                {{
                  scope.row.medicare == 'A'
                    ? '甲'
                    : scope.row.medicare == 'B'
                    ? '乙'
                    : scope.row.medicare == 'C'
                    ? '丙'
                    : '自费'
                }}
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价">
              <template slot-scope="scope">￥{{ scope.row.price }}</template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="总价"
              ><template slot-scope="scope"
                >￥{{ scope.row.totalPrice }}</template
              >
            </el-table-column>
            <el-table-column prop="receivePharmacy" label="接收方">
            </el-table-column>
            <el-table-column prop="remark" label="备注"> </el-table-column>
          </el-table>
          <div class="allNum">
            <span>中成药：￥{{ parent.detailInfo.chPatentPrice }}</span>
            <span>西药：￥{{ parent.detailInfo.westPrice }}</span>
            <span :style="{ color: parent.variables.primary, fontSize: '16px' }"
              >合计：￥{{ parent.detailInfo.prescriptionPrice }}</span
            >
          </div>
        </div>
      </el-col>

      <el-col
        class="flex-start-start"
        v-if="
          parent.detailInfo.relRpIds && parent.detailInfo.relRpIds.length > 0
        "
      >
        <span>关联处方</span>
        <div v-for="rpId in parent.detailInfo.relRpIds" :key="rpId">
          <span class="primary">{{ rpId }}</span>
          <router-link
            style="margin: 0 30px 0 10px; color: #000;"
            class="el-button el-button--text el-button--mini"
            :to="{
              path: '/business/prescription/detail/' + rpId,
            }"
          >
            查看详情
          </router-link>
          <!-- <el-button style="margin-left: 30px;" type="text">
            查看
          </el-button> -->
        </div>
        <!-- <span>关联处方</span>
        <div>
          <div v-for="(item, index) in parent.detailInfo.relRpIds" :key="index">
            <span class="primary">{{ item }}</span>
            <el-button
              style="margin-left: 30px;"
              type="text"
              v-clipboard:copy="parent.id"
              v-clipboard:success="
                parent.$message.bind(parent, {
                  type: 'success',
                  message: '复制成功',
                  showClose: true,
                })
              "
              v-clipboard:error="
                parent.$message.bind(parent, {
                  type: 'error',
                  message: '复制失败',
                  showClose: true,
                })
              "
            >
              复制
            </el-button>
          </div>
        </div> -->
      </el-col>
    </el-row>
  </section>
</template>
