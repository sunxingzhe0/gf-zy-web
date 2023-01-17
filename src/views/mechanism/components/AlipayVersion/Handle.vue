<template>
  <div class="applet-handle">
    <div class="top mb-10">
      <div class="left">
        <div class="head-title">
          <div class="line"></div>
          <div class="title">体验版操作</div>
        </div>
        <div class="form-item">
          <div class="title require">版本号</div>
          <el-input
            v-model="version"
            class="input"
            placeholder="请输入版本号"
            clearable
          ></el-input>
          <el-button type="primary" @click="createSubmit">生成</el-button>
          <el-button type="primary" plain @click="querySubmit">查询</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </div>
      <div class="right">
        <img :src="appletPath" v-if="appletPath" />
      </div>
    </div>
    <div class="submit-form mb-10">
      <div class="head-title">
        <div class="line"></div>
        <div class="title">提交审核操作</div>
      </div>
      <el-form
        :model="submitForm"
        :rules="submitRules"
        ref="submitForm"
        label-width="90px"
      >
        <div class="form">
          <el-form-item label="版本号" prop="appVersion" class="width25">
            <el-input v-model="submitForm.appVersion"></el-input>
          </el-form-item>
          <el-form-item label="中文名称" prop="appName" class="width25">
            <el-input v-model="submitForm.appName"></el-input>
          </el-form-item>
          <el-form-item label="英文名称" prop="appEnglishName" class="width25">
            <el-input v-model="submitForm.appEnglishName"></el-input>
          </el-form-item>
          <el-form-item label="客服电话" prop="servicePhone" class="width25">
            <el-input v-model="submitForm.servicePhone"></el-input>
          </el-form-item>
        </div>
        <div class="form">
          <el-form-item label="客服邮箱" prop="serviceEmail" class="width25">
            <el-input v-model="submitForm.serviceEmail"></el-input>
          </el-form-item>
          <el-form-item label="服务区域" prop="regionType" class="width25">
            <el-select v-model="submitForm.regionType" style="width: 100%">
              <el-option label="全球" value="GLOBAL"></el-option>
              <el-option label="中国" value="CHINA"></el-option>
              <!-- <el-option label="指定区域" value="LOCATION"> </el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="应用简介" prop="appSlogan" class="width50">
            <el-input
              type="text"
              v-model="submitForm.appSlogan"
              maxlength="32"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
        <div class="form">
          <el-form-item label="应用描述" prop="appDesc" class="width50">
            <el-input
              type="textarea"
              v-model="submitForm.appDesc"
              :autosize="{ minRows: 2, maxRows: 5 }"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="版本描述" prop="versionDesc" class="width50">
            <el-input
              type="textarea"
              v-model="submitForm.versionDesc"
              :autosize="{ minRows: 2, maxRows: 5 }"
              maxlength="500"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
        <div class="form">
          <el-form-item label="小程序备注" prop="memo" class="width100">
            <el-input
              type="textarea"
              v-model="submitForm.memo"
              :autosize="{ minRows: 2, maxRows: 5 }"
              maxlength="500"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
        <div class="form">
          <el-form-item label="小程序截图" class="width50 upload">
            <el-upload
              ref="uploadImg"
              action="#"
              accept="image/png,image/jpg,image/PNG,image/JPG"
              list-type="picture-card"
              :auto-upload="false"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :limit="5"
              :class="{ hide: uploadDisabled }"
              :file-list="submitForm.photo"
            >
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">
                只能上传2-5张格式为jpg/png的截图，且单个截图不超过4M
              </div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-form-item>
          <div class="width50 footer-btn">
            <el-button type="primary" plain @click="submitReview('submitForm')"
              >提交审核</el-button
            >
            <el-button @click="resetForm('submitForm')">重置</el-button>
            <el-button type="danger" plain @click="cancelReview()"
              >撤销审核</el-button
            >
          </div>
        </div>
      </el-form>
    </div>
    <div class="up-dowm-form">
      <div class="head-title">
        <div class="line"></div>
        <div class="title">版本相关操作</div>
      </div>
      <div class="form-item">
        <div class="title require">版本号</div>
        <el-input
          v-model="appVersion"
          placeholder="请输入版本号"
          class="input"
          clearable
        ></el-input>
        <el-button type="primary" plain @click="upDowmApp(1)"
          >小程序上架</el-button
        >
        <el-button @click="upDowmApp(2)">小程序下架</el-button>
        <el-button type="primary" plain @click="backVersion"
          >回滚版本</el-button
        >
        <el-button @click="backCreate">退回开发</el-button>
        <el-button type="danger" plain @click="delVersion">删除版本</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  miniExperienceCreate,
  miniExperienceQuery,
  miniExperienceCancel,
  miniAuditApply,
  miniAuditCancel,
  miniOnline,
  miniOffline,
  miniAuditedCancel,
  miniRollback,
  miniDelete,
} from '@/api/mechanismList'
export default {
  data() {
    // let uploadPass = (rule, value, callback) => {
    //   let uploadList = this.$refs.uploadImg.uploadFiles
    //   if (uploadList.length == 0) {
    //     callback(new Error('请上传截图'))
    //   } else if (uploadList.length < 2) {
    //     callback(new Error('至少上传两张截图'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      version: '',
      appletPath: '',
      appVersion: '',
      submitForm: {
        appVersion: '',
        appName: '重庆市精神卫生中心',
        appEnglishName: 'CQSJSWSZX',
        serviceEmail: 'chenjianbo@guanfangyiliao.com',
        servicePhone: '18680893658',
        appSlogan: '预约就医在线挂缴查。',
        appDesc: '为用户实现线上（掌上）预约挂号、缴费、报告查询等便民服务。',
        versionDesc:
          '为用户实现线上（掌上）预约挂号、缴费、报告查询等便民服务。优化部分功能体验。',
        memo: '为用户实现线上（掌上）预约挂号、缴费、报告查询等便民服务。',
        regionType: 'CHINA',
      },
      dialogImageUrl: '',
      dialogVisible: false,
      uploadDisabled: false,
      submitRules: {
        appVersion: [
          { required: true, message: '请输入版本号', trigger: 'blur' },
        ],
        appName: [
          { required: true, message: '请输入小程序名称', trigger: 'blur' },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur',
          },
        ],
        appEnglishName: [
          { required: true, message: '请输入小程序名称', trigger: 'blur' },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个英文和数字字符',
            trigger: 'blur',
          },
        ],
        serviceEmail: [
          { required: true, message: '请输入客服邮箱', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change'],
          },
        ],
        servicePhone: [
          { required: true, message: '请输入客服电话', trigger: 'blur' },
        ],
        appSlogan: [
          { required: true, message: '请输入应用简介', trigger: 'blur' },
          {
            min: 10,
            max: 32,
            message: '长度在 10 到 32 个英文和数字字符',
            trigger: 'blur',
          },
        ],
        appDesc: [
          { required: true, message: '请输入应用描述', trigger: 'blur' },
          {
            min: 20,
            max: 200,
            message: '长度在 20 到 200 个英文和数字字符',
            trigger: 'blur',
          },
        ],
        versionDesc: [
          { required: true, message: '请输入版本描述', trigger: 'blur' },
          {
            min: 30,
            max: 500,
            message: '长度在 30 到 500 个英文和数字字符',
            trigger: 'blur',
          },
        ],
        regionType: [
          { required: true, message: '请选择服务区域', trigger: 'change' },
        ],
        // photo: [{ validator: uploadPass }],
      },
    }
  },
  methods: {
    //生成体验版
    async createSubmit() {
      if (!this.version) {
        this.$message.warning('请输入要生成的版本号')
      } else {
        await miniExperienceCreate({
          version: this.version,
        })
        this.$message.success('生成成功！')
      }
    },
    //查询体验版
    async querySubmit() {
      if (!this.version) {
        this.$message.warning('请输入要查询的版本号')
      } else {
        // let times = null
        // times = setInterval(async () => {
        //   let res = await miniExperienceQuery({
        //     version: this.version,
        //   })
        //   this.appletPath = res.expQrCodeUrl
        //   if (this.appletPath) {
        //     this.$message.success('查询成功！')
        //     clearInterval(times)
        //   }
        // }, 1000)
        let res = await miniExperienceQuery({
          version: this.version,
        })
        this.appletPath = res.expQrCodeUrl
        if (this.appletPath) {
          this.$message.success('查询成功！')
        } else {
          this.$message.warning('未查询到小程序版本请再次查询！')
        }
      }
    },
    //取消
    async cancel() {
      if (!this.version) {
        this.$message.warning('请输入要取消的版本号')
      } else {
        await miniExperienceCancel({
          version: this.version,
        })
        this.$message.success('取消成功！')
        this.version = ''
        this.appletPath = ''
      }
    },
    //提交审核
    submitReview(formName) {
      let uploadList = this.$refs.uploadImg.uploadFiles
      console.warn(uploadList)
      this.$refs[formName].validate(async valid => {
        if (!valid) return
        // if (uploadList.length < 2)
        //   return this.$message.warning('至少上传两张图片')
        await miniAuditApply({
          appVersion: this.submitForm.appVersion,
          appName: this.submitForm.appName,
          appEnglishName: this.submitForm.appEnglishName,
          serviceEmail: this.submitForm.serviceEmail,
          servicePhone: this.submitForm.servicePhone,
          appSlogan: this.submitForm.appSlogan,
          appDesc: this.submitForm.appDesc,
          versionDesc: this.submitForm.versionDesc,
          memo: this.submitForm.memo,
          regionType: this.submitForm.regionType,
          firstScreenShot: uploadList[0] || [],
          secondScreenShot: uploadList[1] || [],
          thirdScreenShot: uploadList[2] || [],
          fourthScreenShot: uploadList[3] || [],
          fifthScreenShot: uploadList[4] || [],
        })
        this.$message.success('提交审核成功！')
      })
    },
    //撤销审核
    cancelReview() {
      if (!this.submitForm.appVersion)
        return this.$message.warning('请输入版本号！')
      this.$confirm('此操作将撤销审核, 是否继续?', '提示', {
        type: 'warning',
      }).then(async () => {
        await miniAuditCancel({
          version: this.submitForm.appVersion,
        })
        this.$message.success('撤销审核成功！')
      })
    },
    //上架，下架
    upDowmApp(type) {
      if (!this.appVersion) return this.$message.warning('请输入版本号！')
      this.$confirm(`请确认是否${type == 1 ? '上' : '下'}架该版本!`, '提示', {
        type: 'warning',
      }).then(async () => {
        type === 1
          ? await miniOnline({
              version: this.appVersion,
            })
          : await miniOffline({
              version: this.appVersion,
            })
        this.$message.success(`${type == 1 ? '上' : '下'}架成功！`)
      })
    },
    //退回开发
    backCreate() {
      if (!this.appVersion) return this.$message.warning('请输入版本号！')
      this.$confirm('请确认是否退回开发!', '提示', {
        type: 'warning',
      }).then(async () => {
        await miniAuditedCancel({
          version: this.appVersion,
        })
        this.$message.success('退回开发成功！')
      })
    },
    //回滚版本
    backVersion() {
      if (!this.appVersion) return this.$message.warning('请输入版本号！')
      this.$confirm('请确认是否回滚版本!', '提示', {
        type: 'warning',
      }).then(async () => {
        await miniRollback({
          version: this.appVersion,
        })
        this.$message.success('回滚版本成功！')
      })
    },
    //删除版本
    delVersion() {
      if (!this.appVersion) return this.$message.warning('请输入版本号！')
      this.$confirm('请确认是否删除版本!', '提示', {
        type: 'warning',
      }).then(async () => {
        await miniDelete({
          version: this.appVersion,
        })
        this.$message.success('删除版本成功！')
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    //移除图片事件
    handleRemove(file, fileList) {
      if (fileList.length < 5) {
        this.uploadDisabled = false
      }
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //限制图片上传数量
    handleChange(file, fileList) {
      if (file.size / 1024 / 1024 > 4) {
        this.$message.warning('不能上传大于4M的截图')
        this.$refs.uploadImg.handleRemove()
      }
      if (fileList.length > 4) {
        this.uploadDisabled = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.applet-handle {
  width: 100%;
  padding: 10px 0 0 10px;
  .head-title {
    display: flex;
    width: 100%;
    height: 30px;
    align-items: center;
    margin-bottom: 15px;
    .line {
      width: 3px;
      height: 20px;
      background: #0ab2c1;
      margin-right: 5px;
    }
    .title {
      font-size: 16px;
      color: #333;
    }
  }
  .top {
    width: 100%;
    display: flex;
    .left {
      width: 60%;
    }
    .right {
      width: 40%;
      position: relative;
      img {
        position: absolute;
        top: 0;
        left: 10px;
        width: 100px;
        height: 100px;
      }
    }
  }
  .form-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .title {
      width: 65px;
      font-size: 14px;
      color: #4d4d4d;
      flex-shrink: 0;
    }
    .require {
      &::before {
        content: '*';
        color: #f74a4a;
        margin-right: 4px;
      }
    }
    .input {
      width: 245px;
      margin-right: 15px;
    }
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  .submit-form {
    width: 100%;
    padding-right: 20px;
    box-sizing: border-box;
    .form {
      width: 100%;
      display: flex;
      .width20 {
        width: 20%;
      }
      .width25 {
        width: 25%;
      }
      .width33 {
        width: 33%;
      }
      .width50 {
        width: 50%;
      }
      .width100 {
        width: 100%;
      }
      ::v-deep .el-form-item {
        margin-bottom: 19px;
      }
    }
    .footer-btn {
      display: flex;
      height: 106px;
      align-items: flex-end;
      justify-content: flex-end;
    }
  }
  .up-dowm-form {
    width: 100%;
    .form {
      display: flex;
      width: 100%;
      .item {
        width: 25%;
      }
    }
  }
  .upload {
    margin-bottom: 0;
    ::v-deep .el-upload--picture-card {
      width: 80px;
      height: 80px;
      line-height: 90px;
    }
    ::v-deep .el-upload-list--picture-card .el-upload-list__item {
      width: 80px;
      height: 80px;
      margin-bottom: 0px;
    }
    ::v-deep .el-upload__tip {
      margin-top: 0;
    }
    ::v-deep .el-form-item__label {
      .require {
        &::before {
          content: '*';
          color: #f74a4a;
          margin-right: 4px;
        }
      }
    }
  }
  .hide {
    ::v-deep .el-upload--picture-card {
      display: none;
    }
  }
}
</style>
