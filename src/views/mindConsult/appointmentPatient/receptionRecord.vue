<template>
  <div class="view__card_page">
    <el-tabs type="border-card">
      <el-tab-pane label="录入记录" lazy v-if="$route.query.all != 'true'">
        <BlockTitle style="margin-bottom: 15px">患者信息 </BlockTitle>
        <div v-if="infoData.delay == 4" class="status">
          <img src="@/assets/supplement.png" />
        </div>
        <el-row>
          <el-col :span="24"
            >{{ infoData.patientName }} {{ infoData.gender }} {{ infoData.age }}
            {{ infoData.phone }}
          </el-col>
          <el-col :span="8">就诊号：{{ infoData.cardNo || '-' }} </el-col>
          <el-col :span="8">就诊次数：{{ infoData.patientNum || '-' }} </el-col>
          <el-col :span="8">出生日期：{{ infoData.birthday || '-' }} </el-col>
          <el-col :span="8">身份证号：{{ infoData.idCard || '-' }} </el-col>
          <el-col :span="8">项目名称：{{ infoData.entryName || '-' }} </el-col>
          <el-col :span="8"
            >医生：{{ infoData.doctor }} {{ infoData.title }}
            {{ infoData.dept }}
          </el-col>
          <el-col :span="8">接诊时间：{{ infoData.acceptTime || '-' }} </el-col>
          <el-col :span="8">结束时间：{{ infoData.endTime || '-' }} </el-col>
          <el-col :span="8" v-if="infoData.delay == 4"
            >补录人：{{ infoData.reserveDoc || '-' }}
            {{ infoData.reserveDocTitle || '-' }}
            {{ infoData.reserveDocDept || '-' }}</el-col
          >
          <el-col :span="8" v-if="infoData.delay == 4"
            >补录时间：{{ infoData.reserveTime || '-' }}
          </el-col>
        </el-row>
        <BlockTitle style="margin-bottom: 15px">录入内容 </BlockTitle>
        <div
          class="enter-warp"
          v-if="infoData.inputList && infoData.inputList.length"
        >
          <div class="enter-item">
            <div class="title">主观信息：</div>
            <div class="item-content">
              {{ infoData.inputList[0].content }}
            </div>
          </div>
          <div class="enter-item">
            <div class="title">客观信息：</div>
            <div class="item-content">
              {{ infoData.inputList[0].content2 }}
            </div>
          </div>
          <div class="enter-item">
            <div class="title">评估：</div>
            <div class="item-content">
              {{ infoData.inputList[0].content3 }}
            </div>
          </div>
          <div class="enter-item">
            <div class="title">计划：</div>
            <div class="item-content">
              {{ infoData.inputList[0].content4 }}
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="风险报告" lazy>
        <BlockTitle style="margin-bottom: 15px">患者信息 </BlockTitle>
        <div v-if="infoData.delay == 4" class="status">
          <img src="@/assets/supplement.png" />
        </div>
        <el-row>
          <el-col :span="24"
            >{{ infoData.patientName }} {{ infoData.gender }} {{ infoData.age }}
            {{ infoData.phone }}
          </el-col>
          <el-col :span="8">就诊号：{{ infoData.cardNo || '-' }} </el-col>
          <el-col :span="8">就诊次数：{{ infoData.patientNum || '-' }} </el-col>
          <el-col :span="8">出生日期：{{ infoData.birthday || '-' }} </el-col>
          <el-col :span="8">身份证号：{{ infoData.idCard || '-' }} </el-col>
          <el-col :span="8">项目名称：{{ infoData.entryName || '-' }} </el-col>
          <el-col :span="8"
            >医生：{{ infoData.doctor }} {{ infoData.title }}
            {{ infoData.dept }}
          </el-col>
          <el-col :span="8">接诊时间：{{ infoData.acceptTime || '-' }} </el-col>
          <el-col :span="8">结束时间：{{ infoData.endTime || '-' }} </el-col>
          <el-col :span="8" v-if="infoData.delay == 4"
            >补录人：{{ infoData.reserveDoc || '-' }}
            {{ infoData.reserveDocTitle || '-' }}
            {{ infoData.reserveDocDept || '-' }}</el-col
          >
          <el-col :span="8" v-if="infoData.delay == 4"
            >补录时间：{{ infoData.reserveTime || '-' }}
          </el-col>
        </el-row>
        <BlockTitle style="margin-bottom: 15px">风险报告 </BlockTitle>
        <RiskReport :isHistory="true" :reservationId="$route.query.id" />
      </el-tab-pane>
      <el-tab-pane label="360视图" lazy>
        <iframe
          v-if="archives"
          :src="archives"
          width="100%"
          class="iframeWa"
          else
        ></iframe>
        <div v-else style="height: 700px">暂无数据</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { BlockTitle } from '@/components/Base'
import apiXzPatient from '@/api/mindConsult/appointmentPatient'
import { getCdrHtmlUrl } from '@/api'
import RiskReport from './components/riskReport.vue'
import { access_url } from '@/utils/wss-http'
export default {
  components: {
    BlockTitle,
    RiskReport,
  },
  data() {
    return {
      infoData: {},
      archives: '',
    }
  },
  created() {
    this.findgetReserveInfo()
  },
  methods: {
    async findgetReserveInfo() {
      let res = await apiXzPatient.getReserveInfo({
        id: this.$route.query.id,
      })
      this.infoData = res
      this.getUrl(res)
    },
    //获取360视图链接
    async getUrl({ cardNo }) {
      const res = await getCdrHtmlUrl({
        // orgId: this.$store.state.user.orgId,
        cardNo,
      })
      if (!res) return
      setTimeout(() => {
        this.archives = access_url + res
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.view__card_page {
  position: relative;
  .status {
    position: absolute;
    right: 20px;
    top: 30px;
    color: #0ab2c1;
  }
}
.line {
  border-top: 1px solid #e6e6e6;
  margin-top: 8px;
}
::v-deep .el-col {
  margin: 8px 0;
  color: #4d4d4d;
}
.imgList {
  display: flex;
  margin-top: 10px;
  margin-bottom: 20px;
  > div {
    margin-right: 15px;
  }
  .imgItem {
    width: 100px;
    height: 100px;
    position: relative;
    > i {
      color: red;
      position: absolute;
      right: -10px;
      top: -10px;
      font-size: 20px;
    }
  }
}
.uploader {
  width: 100px;
  height: 100px;
  border: 1px dashed #ccc;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
  i {
    font-size: 28px;
    margin-bottom: 10px;
  }
}
.codeWrap {
  padding-left: 10px;
  margin-top: 30px;
  .timeLine {
    margin-top: 20px;
    padding-left: 140px;
    .content-wrap {
      min-height: 90px;
      position: relative;
      .creatInfo {
        position: absolute;
        width: 140px;
        text-align: right;
        top: 0;
        left: -180px;
        color: #666;
        margin-bottom: 15px;
        > div {
          margin-bottom: 10px;
        }
        i {
          font-size: 18px;
          margin-left: 10px;
        }
      }
    }
  }
}

.btns {
  margin-bottom: 20px;
}
.iframeWa {
  border: none;
  height: calc(100vh - 157px);
  overflow-y: scroll;
  /* position: relative; */
  /* top: -100px; */
}
.enter-warp {
  color: #4d4d4d;
}
.enter-item {
  margin-bottom: 40px;
  .title {
    margin-bottom: 10px;
  }
}
</style>
