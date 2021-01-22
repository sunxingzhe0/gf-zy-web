<template>
  <div>
    <el-row :gutter="10">
      <!-- <el-col :xs="22" :sm="10" :md="8" :lg="4" :xl="2">
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="姓名" prop="name">
            <div class="text">{{ name }}</div>
          </el-form-item>

          <el-form-item label="性别" prop="name">
            <div class="text">{{ sex === 1 ? '男' : '女' }}</div>
          </el-form-item>
          <el-form-item label="手机号">
            <div class="text" v-if="phone">{{ phone }}</div>
          </el-form-item>
          <el-form-item label="身份证">
            <div class="text">{{ idCard }}</div>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :xs="22" :sm="10" :md="14" :lg="18" :xl="18">
        <div class="codeImg">
          <img src="~@/assets/logo.png" />
          <div class="tips">立即扫码，前往移动端完成实名认证</div>
        </div>
      </el-col> -->

      <el-col :span="6">
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
          label-position="left"
        >
          <el-form-item label="姓名" prop="name">
            <div class="text">{{ name }}</div>
          </el-form-item>

          <el-form-item label="性别" prop="name">
            <div class="text">{{ sex === 1 ? '男' : '女' }}</div>
          </el-form-item>
          <el-form-item label="手机号">
            <div class="text" v-if="phone">{{ phone }}</div>
          </el-form-item>
          <el-form-item label="身份证">
            <div class="text">{{ idCard }}</div>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="14">
        <div class="codeImg" v-show="!hasAuth">
          <img :src="erImg" />
          <div class="tips">立即扫码，前往移动端完成实名认证</div>
        </div>
      </el-col>
      <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
        <el-tag v-if="hasAuth" type="success">已实名</el-tag>
        <el-tag v-else type="error">未实名</el-tag>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import { mapState } from 'vuex'
import { getRealInfo, miniImg } from '@/api/setup'

export default {
  data() {
    return {
      form: {
        imageUrl: '',
        name: '-',
      },
      rules: {
        name: [{ required: true }],
      },
      // phone: this.$store.state.user.phone.replace(
      //   this.$store.state.user.phone.subString(3, 7),
      //   '****',
      // ),
      name: '',
      phone: '',
      sex: '',
      hasAuth: '',
      idCard: '',
      erImg: '',
    }
  },
  created() {
    this.getInfo()
    this.getminiImg()
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取实名信息
    async getInfo() {
      const res = await getRealInfo({})
      console.log(res, '123')
      this.name = res.name

      this.phone = res.phone
        ? res.phone.replace(res.phone.substring(3, 7), '****')
        : '-'
      this.sex = res.sex
      this.idCard = res.idCard
        ? res.idCard.replace(res.idCard.substring(6, 13), '****')
        : '-'
      //  res.idCard
      this.hasAuth = res.hasAuth
    },
    // 获取实名制二维码
    async getminiImg() {
      const res = await miniImg({})
      this.erImg = res
      // this.erImg = this.base64ImgtoFile(res)
      // console.log(this.erImg, '二维码')
    },
    // base64图片转换
    base64ImgtoFile(dataurl, filename = 'file') {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let suffix = mime.split('/')[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.codeImg {
  text-align: center;
  width: 230px;
  img {
    width: 185px;
    height: 185px;
  }
  .tips {
    font-size: 14px;
    color: #666;
    margin-top: 25px;
  }
}
</style>
