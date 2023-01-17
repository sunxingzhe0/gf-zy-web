<template>
  <div class="page">
    <el-tabs type="border-card">
      <!--  -->
      <el-tab-pane label="录入" lazy>
        <BlockTitle style="margin-bottom: 15px">患者信息 </BlockTitle>
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
          <!-- <el-col :span="8">咨询室：{{ infoData.cardNo || '-' }} </el-col> -->
          <el-col :span="8">接诊时间：{{ infoData.acceptTime || '-' }} </el-col>
          <el-col :span="8">结束时间：{{ infoData.endTime || '-' }} </el-col>
        </el-row>
        <BlockTitle style="margin-bottom: 15px"
          >录入内容
          <i
            v-if="!editStatus"
            class="el-icon-edit"
            @click="
              () => {
                editStatus = true
              }
            "
          ></i
        ></BlockTitle>
        <div class="enter-warp">
          <div class="enter-item">
            <div class="title">主观信息：</div>
            <el-input
              v-if="editStatus"
              type="textarea"
              v-model="enterInputs.content"
            ></el-input>
            <div class="item-content" v-else>
              {{ enterInputs.content || '-' }}
            </div>
          </div>
          <div class="enter-item">
            <div class="title">客观信息：</div>
            <el-input
              v-if="editStatus"
              type="textarea"
              v-model="enterInputs.content2"
            ></el-input>
            <div class="item-content" v-else>
              {{ enterInputs.content2 || '-' }}
            </div>
          </div>
          <div class="enter-item">
            <div class="title">评估：</div>
            <el-input
              v-if="editStatus"
              type="textarea"
              v-model="enterInputs.content3"
            ></el-input>
            <div class="item-content" v-else>
              {{ enterInputs.content3 || '-' }}
            </div>
          </div>
          <div class="enter-item">
            <div class="title">计划：</div>
            <el-input
              v-if="editStatus"
              type="textarea"
              v-model="enterInputs.content4"
            ></el-input>
            <div class="item-content" v-else>
              {{ enterInputs.content4 || '-' }}
            </div>
          </div>
          <div class="btns-item" v-if="editStatus">
            <el-button @click="cancelEnter">取消</el-button>
            <el-button type="primary" @click="confirmSave">保存</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="风险报告" lazy>
        <BlockTitle style="margin-bottom: 15px">患者信息 </BlockTitle>
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
          <!-- <el-col :span="8">咨询室：{{ infoData.cardNo || '-' }} </el-col> -->
          <el-col :span="8">接诊时间：{{ infoData.acceptTime || '-' }} </el-col>
          <el-col :span="8">结束时间：{{ infoData.endTime || '-' }} </el-col>
        </el-row>
        <BlockTitle style="margin-bottom: 15px">风险报告 </BlockTitle>
        <RiskReport :reservationId="$route.query.id" />
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
import { access_url } from '@/utils/wss-http'
import { getCdrHtmlUrl } from '@/api'
import RiskReport from './components/riskReport.vue'
export default {
  components: {
    BlockTitle,
    RiskReport,
  },
  data() {
    return {
      archives: '',
      infoData: {},
      editStatus: false, //录入编辑状态
      enterInputs: {
        //录入内容绑定值
        content: '',
        content2: '',
        content3: '',
        content4: '',
      },

      itemVisitNo: '',
    }
  },
  mounted() {
    this.findgetReserveInfo()
  },
  methods: {
    //保存录入
    confirmSave() {
      //详情有录入信息存在，即比编辑 反之新增
      if (this.infoData.inputList && this.infoData.inputList[0]?.id) {
        this.submit(true)
      } else {
        this.submit()
      }
    },
    //取消录入
    cancelEnter() {
      this.editStatus = false
      this.initEnterContent(this.infoData)
    },
    //初始化录入内容
    initEnterContent(data) {
      this.enterInputs =
        data.inputList && data.inputList[0].id
          ? JSON.parse(JSON.stringify(data.inputList[0]))
          : {
              content: '',
              content2: '',
              content3: '',
              content4: '',
            }
    },

    //详情数据
    async findgetReserveInfo() {
      let res = await apiXzPatient.getReserveInfo({
        id: this.$route.query.id,
      })
      this.infoData = res
      if (res.inputList && res.inputList.length === 0) {
        //无录入内容时显示编辑状态
        this.editStatus = true
      }
      this.initEnterContent(res)
      /* _______ */
      // await this.getmedicalList(res)
      this.getUrl(res)
    },

    //录入提交
    async submit(isEdit) {
      let userInfo = this.$store.state.user
      if (
        !this.enterInputs.content ||
        !this.enterInputs.content2 ||
        !this.enterInputs.content3 ||
        !this.enterInputs.content4
      ) {
        return this.$message.error('请填写内容')
      }
      this.editStatus = false
      if (isEdit) {
        await apiXzPatient.editInput({
          content: this.enterInputs.content,
          content2: this.enterInputs.content2,
          content3: this.enterInputs.content3,
          content4: this.enterInputs.content4,
          createUser: userInfo.name,
          dept: userInfo.dept.name,
          // picIds: this.editRow.imgIds.join(','),
          reserveId: this.$route.query.id,
          id: this.enterInputs.id,
        })
        await this.findgetReserveInfo()
        this.$message.success('保存成功！')
        this.editRow = null
      } else {
        await apiXzPatient.inputContent({
          content: this.enterInputs.content,
          content2: this.enterInputs.content2,
          content3: this.enterInputs.content3,
          content4: this.enterInputs.content4,
          createUser: userInfo.name,
          dept: userInfo.dept.name,
          // picIds: this.inputList.imgIds.join(','),
          reserveId: this.$route.query.id,
        })
        await this.findgetReserveInfo()
        this.$message.success('提交成功！')
      }
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
.view__statistics-mind {
  background-color: #ffffff;
  .mind-content {
    padding: 0 15px 15px;
  }
  &::v-deep {
    .el-tabs--border-card > .el-tabs__content {
      padding: 15px 0 0;
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
  margin-top: 20px;
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
.btns-item {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
.el-icon-edit {
  color: #0ab2c1;
  margin-left: 20px;
}
.item-content {
  text-indent: 1em;
  font-size: 14px;
}
</style>
