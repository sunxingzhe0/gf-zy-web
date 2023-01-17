<template>
  <div class="hospita-info-BaseInfo">
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
      label-position="left"
    >
      <el-form-item label="机构LOGO">
        <div class="text flex-start-end">
          <!-- <el-avatar
            style="margin-right: 10px;"
            :size="100"
            :src="FILE_URL(form.logo)"
          >
          </el-avatar> -->
          <el-image :src="FILE_URL(form.logo)" class="avatar_round">
            <template slot="error">
              <svg-icon icon-class="guanfang-logo" />
            </template>
          </el-image>
          <el-upload
            v-if="!disabled_"
            style="margin-right: 10px"
            class="upload-demo"
            :show-file-list="false"
            action
            :on-success="avaterChange"
            :before-upload="beforeAvatarUpload"
            :http-request="httpRequest"
          >
            <el-button type="primary" size="mini" style="margin-left: 20px">
              {{ form.logo ? '更换' : '上传' }}
            </el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="医院图片">
        <div class="text flex-start-end">
          <el-image
            style="
              width: 100px;
              height: 100px;
              display: inline-block;
              margin-right: 10px;
            "
            :src="FILE_URL(form.picList[0])"
            :proview-src-list="form.picList.map(FILE_URL)"
            class="avatar"
          />
          <el-upload
            v-if="!disabled_"
            :show-file-list="false"
            action
            accept="image/png, image/jpeg, image/gif, image/webp"
            :on-success="res => hos(res, form.picList.length)"
            :before-upload="beforeAvatarUpload"
            :http-request="httpRequest"
          >
            <el-button type="primary" size="mini" style="margin-left: 20px">
              {{ form.picList[0] ? '更换' : '上传' }}
            </el-button>
            <!-- <div class="imgWrap flex-center">
            <div>
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <div>添加照片</div>
            </div>
          </div> -->
          </el-upload>
        </div>
      </el-form-item>

      <el-form-item label="互联网医院机构名称" prop="name">
        <div class="text">
          <el-input
            class="input"
            v-model="form.name"
            maxlength="24"
            show-word-limit
            :disabled="disabled_"
          ></el-input>
        </div>
      </el-form-item>
      <el-form-item label="等级等次" prop="level">
        <div class="text">
          <el-select
            v-model="form.level"
            placeholder="请选择"
            style="width: 400px"
            :disabled="disabled_"
          >
            <el-option
              v-for="(item, index) in hosLevelList"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="地址" prop="province">
        <el-cascader
          :options="options"
          class="input"
          style="margin-right: 10px"
          v-model="selectedOptions"
          @change="addressChange"
          :disabled="disabled_"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input
          class="input"
          v-model="form.address"
          :disabled="disabled_"
        ></el-input>
        <span v-if="!disabled_">
          <el-button @click="addAdress" type="primary" style="margin-left: 10px"
            >新增地址</el-button
          >
        </span>
        <div v-for="(item, i) in this.addAdressData" :key="i">
          <el-input
            style="margin-top: 10px"
            class="input"
            placeholder="请输入详细地址，包括省市区"
            v-model="item.val"
            :disabled="disabled_"
          ></el-input>
          <i
            v-if="!disabled_"
            @click="delItemList(i)"
            style="margin-left: 10px; font-size: 20px"
            class="el-icon-circle-close"
          ></i>
        </div>
      </el-form-item>
      <el-form-item label="执业许可证" prop="options">
        <el-input
          class="input"
          v-model="form.cert"
          :disabled="disabled_"
        ></el-input>
      </el-form-item>
      <el-form-item label="执业许可证照" prop="certPic">
        <el-image
          v-if="form.certPic"
          :src="FILE_URL(form.certPic)"
          class="avatar"
          v-model="form.certPic"
          style="width: 200px; height: 100px"
        />
        <el-upload
          :show-file-list="false"
          action
          accept="image/png, image/jpeg, image/gif, image/webp"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :http-request="httpRequest"
          style="display: inline-block; vertical-align: super"
        >
          <el-button
            v-if="!disabled_"
            type="primary"
            size="mini"
            style="margin-left: 10px"
          >
            更换
          </el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="医院介绍">
        <el-input
          type="textarea"
          class="input"
          v-model="form.intro"
          maxlength="3000"
          :rows="10"
          show-word-limit
          :disabled="disabled_"
        ></el-input>
      </el-form-item>
    </el-form>

    <div class="btnBox">
      <el-button v-if="!disabled_" type="default" @click="no_changes"
        >返回</el-button
      >
      <el-button v-if="!disabled_" type="primary" @click="submitForm"
        >保存</el-button
      >
      <el-button v-if="disabled_" type="primary" @click="changes"
        >修改</el-button
      >
    </div>
  </div>
</template>
<script>
// import { EditableText } from '@/components'
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import { hosInfo, edithosInfo } from '@/api/department'
import { compressImg } from '@/utils/compress'
import { uploadFile } from '@/api'
import { jsonp } from 'vue-jsonp'
export default {
  data() {
    return {
      addAdressData: [],
      disabled_: true,
      options: regionData,
      selectedOptions: [],
      form: {
        name: '',
        logo: '',
        level: '',
        province: '',
        city: '',
        area: '',
        address: '',
        cert: '',
        certPic: [],
        intro: '',
        picList: [],
        latitude: '',
        longitude: '',
      },
      // 医院等级等次
      hosLevelList: [
        {
          id: 'TH_TH',
          name: '三级',
        },
        {
          id: 'TH_SUPER',
          name: '三级特等',
        },
        {
          id: 'TH_F',
          name: '三级甲等',
        },
        {
          id: 'TH_S',
          name: '三级乙等',
        },
        {
          id: 'TH_T',
          name: '三级丙等',
        },
        {
          id: 'TW_F',
          name: '二级甲等',
        },
        {
          id: 'TW_S',
          name: '二级乙等',
        },
        {
          id: 'TW_T',
          name: '二级丙等',
        },
        {
          id: 'ON_F',
          name: '一级甲等',
        },
        {
          id: 'ON_S',
          name: '一级乙等',
        },
        {
          id: 'ON_T',
          name: '一级丙等',
        },
      ],
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '请填写机构名称' },
          {
            max: 24,
            message: '长度 24 个字符以内',
            trigger: 'blur',
          },
        ],
        level: [{ required: true, trigger: 'blur', message: '请选择等级' }],
        address: [
          { required: true, trigger: 'blur', message: '请填写详细地址' },
        ],
        province: [{ required: true, trigger: 'blur', message: '请选择地址' }],
        certPic: [{ required: true, trigger: 'blur', message: '请选择图片' }],
      },
    }
  },
  created() {
    this.getBasicInfo()
  },
  methods: {
    //删除

    delItemList(i) {
      this.addAdressData.splice(i, 1)
    },
    // 获取医院基本信息
    async getBasicInfo() {
      let res = await hosInfo()
      this.form = res
      //处理地址
      const caddressArr = res.address.split('、')
      this.form.address = caddressArr.slice(0, 1)[0]
      this.addAdressData = caddressArr.slice(1).map(v => {
        return { val: v }
      })
      //
      let arr = []
      if (res.province) {
        console.log(TextToCode[res.province])
        return
        // arr.push(TextToCode[res.province].code)
        // arr.push(TextToCode[res.province][res.city].code)
        // arr.push(TextToCode[res.province][res.city][res.area].code)
      }
      this.selectedOptions = arr
    },
    confirm(e) {
      console.log(e)
    },
    cancel() {},
    addressChange(e) {
      console.log(e)
      let province = CodeToText[e[0]]
      let city = CodeToText[e[1]]
      let area = CodeToText[e[2]]
      if (province !== undefined) {
        this.form.city = province + '/'
      }
      if (city !== undefined) {
        this.form.city += city + '/'
      }
      if (area !== undefined) {
        this.form.city += area
      }
      this.form.province = province
      this.form.city = city
      this.form.area = area
    },
    // 处理上传的事件函数
    async httpRequest({ file, onProgress, onSuccess, onError }) {
      //压缩上传图片
      const res = file.size / 1024 > 60 ? await compressImg(file, 50) : file
      console.log(res, '----')
      const formData = new FormData()
      formData.append('file', res)
      uploadFile(formData, onProgress).then(onSuccess).catch(onError)
    },
    // 执业可许
    handleAvatarSuccess(res) {
      // this.form.certPic = res
      this.$set(this.form, 'certPic', res)
    },
    // 医院照片
    hos(res) {
      this.$set(this.form.picList, [0], res)
    },
    // 头像赋值
    avaterChange(res) {
      this.$set(this.form, 'logo', res)
    },
    // 编辑
    changes() {
      this.disabled_ = false
    },
    // 取消
    no_changes() {
      this.getBasicInfo()
      this.disabled_ = true
    },
    beforeAvatarUpload(file) {
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
    //获取经纬度
    async getLocationdata() {
      const KEY = 'CFCBZ-IUCY3-SX335-3RKAP-PKBFO-Y3F7F'
      let url = 'https://apis.map.qq.com/ws/geocoder/v1/'
      let res = await jsonp(url, {
        key: KEY,
        output: 'jsonp',
        address:
          this.form.province +
          this.form.city +
          this.form.area +
          // this.form.address +
          this.form.name,
        region: this.form.province,
      })
      this.form.latitude = res.result.location.lat
      this.form.longitude = res.result.location.lng
    },
    // 提交
    submitForm() {
      this.$refs.ruleForm.validate(async valid => {
        const params = Object.assign(JSON.parse(JSON.stringify(this.form)), {
          address: this.addAdressData.length
            ? this.form.address +
              `、${this.addAdressData
                .filter(v => v.val)
                .map(v => v.val)
                .join('、')}`
            : this.form.address,
        })
        if (valid) {
          await this.getLocationdata()
          await edithosInfo({
            ...params,
          })
          this.$message.success('修改成功！')
          this.disabled_ = true
          this.getBasicInfo()
          this.$store.commit('user/SET_LOGO', this.form.logo)
        } else {
          this.$message.warning('请完善信息再提交！')
          return false
        }
      })
    },
    //新增地址
    addAdress() {
      this.addAdressData.push({
        val: '',
      })
    },
  },
}
</script>
<style lang="scss">
.el-icon-circle-close {
  cursor: pointer;
}
.hospita-info-BaseInfo {
  .el-textarea {
    .el-input__count {
      line-height: 20px;
      bottom: -24px;
    }
  }
}
</style>
<style lang="scss" scoped>
@import '@/styles/_variables';
.avatar_round {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.svg-icon {
  width: 100%;
  height: 100%;
  color: $--color-primary;
}
.imgWrap {
  width: 398px;
  height: 170px;
  border: 1px dashed #ccc;
  border-radius: 2px;
  text-align: center;
  color: #666;
  .el-upload {
    width: 100%;
    height: 100%;
  }
  i {
    font-size: 30px;
  }
}
.input {
  width: 400px;
}

.btnBox {
  padding: 30px 0 0 400px;
}
</style>
