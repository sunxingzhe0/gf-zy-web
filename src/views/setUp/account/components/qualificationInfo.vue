<template>
  <div>
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
      :disabled="onlyShow"
      label-position="left"
    >
      <el-tag class="examineState">{{ examineStateList[examineState] }}</el-tag>

      <el-form-item label="科室" prop="defDeptId">
        <el-select
          class="input"
          v-model="form.defDeptId"
          placeholder="请选择科室"
        >
          <el-option
            v-for="(item, index) in department"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="技术职称" prop="titleId">
        <el-select
          class="input"
          v-model="form.titleId"
          placeholder="请选择技术职称"
        >
          <el-option
            v-for="(item, index) in title"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="执业范围" prop="practiceArea">
        <el-input
          type="textarea"
          class="input"
          maxlength="1000"
          :autosize="{ minRows: 6, maxRows: 12 }"
          placeholder="请输入，最多1000字"
          v-model="form.practiceArea"
        ></el-input>
        <div></div>
      </el-form-item>

      <el-form-item label="">
        <el-checkbox-group v-model="form.typeList" @change="changeCheckbox">
          <el-checkbox label="DRUG" value="DRUG">药师资格证</el-checkbox>
          <el-checkbox label="PHYS_QUAL" value="PHYS_QUAL"
            >医师资格证</el-checkbox
          >
          <el-checkbox label="DOCTOR_QUAL" value="DOCTOR_QUAL"
            >医师执业证</el-checkbox
          >
          <el-checkbox label="NURSE" value="NURSE">护士执业证</el-checkbox>
          <el-checkbox label="TECH" value="TECH">专业技术资格证</el-checkbox>
          <!-- <el-checkbox label="临床技师" value="PHYS_QUAL"></el-checkbox> -->
        </el-checkbox-group>
      </el-form-item>
      <div v-for="(cert, index) in certs" :key="index">
        <el-form-item
          :label="certificateEnum[cert.type]"
          v-show="form.typeList.includes(cert.type)"
        >
          <el-input
            style="width: 33%"
            v-model="cert.certNo"
            :placeholder="`请输入${certificateEnum[cert.type]}编号`"
          ></el-input>
          <div
            style="margin-top: 10px"
            v-for="(pic, _) in cert.fileId"
            :key="_"
          >
            <el-image
              style="
                vertical-align: bottom;
                overflow: hidden;
                width: 220px;
                height: 130px;
              "
              fit="cover"
              :src="FILE_URL(pic)"
              :preview-src-list="cert.fileId.map(FILE_URL)"
            ></el-image>

            <el-upload
              style="display: inline-block; margin-left: 10px"
              :show-file-list="false"
              action="https://jsonplaceholder.typicode.com/posts/"
              accept="image/png, image/jpeg, image/gif, image/webp"
              :on-success="res => handleImageSuccess(res, index, _)"
              :before-upload="beforeImageUpload"
              :http-request="httpRequest"
            >
              <el-button size="small" type="primary">选择照片</el-button>
              <el-button
                size="small"
                type="danger"
                @click.stop="deleteImg(index, _)"
                >删除</el-button
              >
            </el-upload>
          </div>

          <div style="margin-top: 10px" v-if="!onlyShow">
            <el-image
              style="
                vertical-align: bottom;
                overflow: hidden;
                width: 220px;
                height: 130px;
              "
              fit="cover"
              :src="certificateExampleImg"
              :preview-src-list="[certificateExampleImg]"
            ></el-image>

            <el-upload
              style="display: inline-block; margin-left: 10px"
              action
              :show-file-list="false"
              accept="image/png, image/jpeg, image/gif, image/webp"
              :on-success="
                res =>
                  handleImageSuccess(res, index, certs[index].fileId.length)
              "
              :before-upload="beforeImageUpload"
              :http-request="httpRequest"
            >
              <el-button size="small" type="primary">选择照片</el-button>
            </el-upload>
          </div>
        </el-form-item>
      </div>

      <!-- <el-form-item label="药师资格证编号">
        <el-input
          class="input"
          v-model="form.pharmacistNum"
          placeholder="请输入药师资格证编号"
        ></el-input>
        <div class="text flex-start-end cardWrap">
          <div class="cardImg">
            <img v-if="form.pharmacistImg" :src="form.pharmacistImg" />
            <span>药师资格证</span>
          </div>
          <el-upload
            style="margin-right: 10px;"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <el-button type="primary" size="mini">
              选择照片
            </el-button>
          </el-upload>
          <el-button
            type="danger"
            style="margin-bottom: 4px;"
            size="mini"
            @click="submitForm"
          >
            删除
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="医师资格证编号">
        <el-input
          class="input"
          v-model="form.pharmacistNum"
          placeholder="请输入医师资格证编号"
        ></el-input>
        <div class="text flex-start-end cardWrap">
          <div class="cardImg">
            <img v-if="form.pharmacistImg" :src="form.pharmacistImg" />
            <span>医师资格证1</span>
          </div>
          <el-upload
            style="margin-right: 10px;"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <el-button type="primary" size="mini">
              选择照片
            </el-button>
          </el-upload>
          <el-button
            type="danger"
            style="margin-bottom: 4px;"
            size="mini"
            @click="submitForm"
          >
            删除
          </el-button>
        </div>
        <div class="text flex-start-end cardWrap">
          <div class="cardImg">
            <img v-if="form.pharmacistImg" :src="form.pharmacistImg" />
            <span>医师资格证2</span>
          </div>
          <el-upload
            style="margin-right: 10px;"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <el-button type="primary" size="mini">
              选择照片
            </el-button>
          </el-upload>
          <el-button
            type="danger"
            style="margin-bottom: 4px;"
            size="mini"
            @click="submitForm"
          >
            删除
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="医师执业证编号">
        <el-input
          class="input"
          v-model="form.pharmacistNum"
          placeholder="请输入医师执业证编号"
        ></el-input>
        <div class="text flex-start-end cardWrap">
          <div class="cardImg">
            <img v-if="form.pharmacistImg" :src="form.pharmacistImg" />
            <span>医师执业证1</span>
          </div>
          <el-upload
            style="margin-right: 10px;"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <el-button type="primary" size="mini">
              选择照片
            </el-button>
          </el-upload>
          <el-button
            type="danger"
            style="margin-bottom: 4px;"
            size="mini"
            @click="submitForm"
          >
            删除
          </el-button>
        </div>
        <div class="text flex-start-end cardWrap">
          <div class="cardImg">
            <img v-if="form.pharmacistImg" :src="form.pharmacistImg" />
            <span>医师执业证1</span>
          </div>
          <el-upload
            style="margin-right: 10px;"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <el-button type="primary" size="mini">
              选择照片
            </el-button>
          </el-upload>
          <el-button
            type="danger"
            style="margin-bottom: 4px;"
            size="mini"
            @click="submitForm"
          >
            删除
          </el-button>
        </div>
        <div class="text flex-start-end cardWrap">
          <div class="cardImg">
            <img v-if="form.pharmacistImg" :src="form.pharmacistImg" />
            <span>医师执业证3</span>
          </div>
          <el-upload
            style="margin-right: 10px;"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <el-button type="primary" size="mini">
              选择照片
            </el-button>
          </el-upload>
          <el-button
            type="danger"
            style="margin-bottom: 4px;"
            size="mini"
            @click="submitForm"
          >
            删除
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="护士执业证编号">
        <el-input
          class="input"
          v-model="form.pharmacistNum"
          placeholder="请输入护士执业证编号"
        ></el-input>
        <div class="text flex-start-end cardWrap">
          <div class="cardImg">
            <img v-if="form.pharmacistImg" :src="form.pharmacistImg" />
            <span>护士资质证1</span>
          </div>
          <el-upload
            style="margin-right: 10px;"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <el-button type="primary" size="mini">
              选择照片
            </el-button>
          </el-upload>
          <el-button
            type="danger"
            style="margin-bottom: 4px;"
            size="mini"
            @click="submitForm"
          >
            删除
          </el-button>
        </div>
        <div class="text flex-start-end cardWrap">
          <div class="cardImg">
            <img v-if="form.pharmacistImg" :src="form.pharmacistImg" />
            <span>护士资质证2</span>
          </div>
          <el-upload
            style="margin-right: 10px;"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <el-button type="primary" size="mini">
              选择照片
            </el-button>
          </el-upload>
          <el-button
            type="danger"
            style="margin-bottom: 4px;"
            size="mini"
            @click="submitForm"
          >
            删除
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="专业技术资格证编号">
        <el-input
          class="input"
          v-model="form.pharmacistNum"
          placeholder="请输入专业技术资格证编号"
        ></el-input>
        <div class="text flex-start-end cardWrap">
          <div class="cardImg">
            <img v-if="form.pharmacistImg" :src="form.pharmacistImg" />
            <span>专业技术资格证</span>
          </div>
          <el-upload
            style="margin-right: 10px;"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <el-button type="primary" size="mini">
              选择照片
            </el-button>
          </el-upload>
          <el-button
            type="danger"
            style="margin-bottom: 4px;"
            size="mini"
            @click="submitForm"
          >
            删除
          </el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm"> 修改 </el-button>
      </el-form-item>
      </el-form-item> -->
    </el-form>

    <div style="padding-left: 140px">
      <el-button
        type="primary"
        v-show="show1"
        @click="
          () => {
            show1 = false
            show2 = true
            onlyShow = !onlyShow
          }
        "
      >
        修改
      </el-button>
      <el-button
        type="primary"
        v-show="examineState == 'TO_EXAMINE'"
        @click="recall"
      >
        撤回
      </el-button>
      <el-button type="primary" v-show="show2" @click="submitForm">
        提交
      </el-button>
      <el-button type="" v-show="show2" @click="resetMsg"> 取消 </el-button>
    </div>
  </div>
</template>
<script>
import { quaCert, deptList, titleList, saveQualAuth, recall } from '@/api/setup'

import { uploadFile } from '@/api'

export default {
  data() {
    this.certificateEnum = {
      DRUG: '药师资格证',
      PHYS_QUAL: '医师资格证',
      DOCTOR_QUAL: '医师执业证',
      NURSE: '护士执业证',
      TECH: '专业技术资格证',
    }
    this.certificateExampleImg = require('@/assets/certificate-example.png')
    // 审核状态枚举 examineState
    this.examineStateList = {
      TO_CONFIRM: '待确认',
      SUCCESS: '已认证',
      FAIL: '未认证',
      TO_EXAMINE: '待审核',
    }
    return {
      examineState: '',
      onlyShow: true,
      show1: true,
      show2: false,
      certs: [],
      form: {
        defDeptId: '',
        titleId: '',
        practiceArea: '',
        typeList: [],
        // pharmacistNum: '',
        // pharmacistImg: '',
      },
      // 科室下拉数据
      department: [],
      // 职称下拉数据
      title: [],
      rules: {
        defDeptId: [{ required: true, message: '请选择科室' }],
        titleId: [
          {
            required: true,
            message: '请选择技术职称',
          },
        ],
        practiceArea: [{ required: true, message: '请输入职业范围' }],
      },
    }
  },
  mounted() {
    this.getDeptList()
    this.getTitleList()
    this.getCertInfo()
  },
  methods: {
    handleImageSuccess(res, index, fileIndex) {
      this.certs[index].fileId.splice(fileIndex, 1, res)
    },
    deleteImg(index, fileIndex) {
      this.certs[index].fileId.splice(fileIndex, 1)
    },
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isWEBP = file.type === 'image/webp'

      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG && !isGIF && !isWEBP) {
        this.$message.error('上传头像图片只能是 JPG PNG GIF WEBP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG || isGIF || isWEBP) && isLt2M
    },
    httpRequest({ file, onProgress, onSuccess, onError }) {
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData, onProgress).then(onSuccess).catch(onError)
    },
    changeCheckbox() {
      // console.log(this.form.typeList)
      // for (let i = 0; i < this.form.typeList.length; i++) {
      //   const type = this.form.typeList[i]
      //   if (!this.certs[type]) {
      //     this.certs[type] = {
      //       certNo: '',
      //       fileId: [],
      //       practiceOrg: '',
      //       type: type,
      //     }
      //   }
      // }
      console.log(this.certs)
    },
    // 拉取科室
    async getDeptList() {
      const res = await deptList({
        tree: false,
        type: 'WEB', //区分web和h5返回方式有更改
      })
      this.department = res
    },
    // 撤回资质认证
    async recall() {
      await recall().then(() => {
        this.$message.success('撤回成功')
        this.resetMsg()
      })
    },
    // 拉取职称
    async getTitleList() {
      const res = await titleList({})
      this.title = res
    },
    // 拉取资质信息
    async getCertInfo() {
      this.certs = []
      const res = await quaCert({})
      console.log(res.defDeptId)
      this.form.defDeptId = res.defDeptId
      this.form.titleId = res.titleId
      this.form.practiceArea = res.practiceArea
      this.examineState = res.examineState
      // this.cert = res.cert
      for (let i = 0; i < res.certs.length; i++) {
        let content = res.certs[i]
        console.log(content.type)
        // console.log(res.cert.type)
        this.form.typeList.push(content.type)
        // this.certs[content.type] = content
        this.certs.push(content)
      }
      // key
      for (const key in this.certificateEnum) {
        // key
        if (!this.form.typeList.includes(key)) {
          this.certs.push({
            certNo: '',
            fileId: [],
            practiceOrg: '',
            type: key,
          })
        }
      }

      console.log(this.form.typeList)
      console.log(this.examineState, '99999')
      if (this.examineState == 'SUCCESS' || this.examineState == 'TO_EXAMINE') {
        this.show1 = false
      }
    },
    handleAvatarSuccess(res, file) {
      // this.form.imageUrl = URL.createObjectURL(file.raw)
      console.log(res, file)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    //重置页面
    resetMsg() {
      this.getCertInfo()
      this.show1 = true
      this.show2 = false
      this.onlyShow = true
    },
    submitForm() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // alert('submit!')
          console.log(this.form)
          console.log(this.certs)
          this.form.certs = []
          this.certs.forEach(element => {
            if (this.form.typeList.includes(element.type)) {
              this.form.certs.push(element)
            }
          })

          await saveQualAuth(this.form).then(() => {
            this.$message.success('修改成功')
            this.resetMsg()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.examineState {
  position: absolute;
  right: 105px;
  top: 105px;
}
.input {
  width: 400px;
}
.cardWrap {
  margin-top: 20px;
  .cardImg {
    border: 1px solid #ccc;
    border-radius: 2px;
    overflow: hidden;
    width: 220px;
    height: 130px;
    margin-right: 10px;
    background: url('~@/assets/cardBg.png') no-repeat center;
    position: relative;
    span {
      position: absolute;
      line-height: 130px;
      width: 100%;
      text-align: center;
      left: 0;
      top: 0;
    }
  }
}
</style>
