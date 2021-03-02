<template>
  <div>
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm"
      label-position="left"
    >
      <el-form-item label="头像">
        <div class="text flex-start-end">
          <el-image :src="FILE_URL(user.avatar)" class="avatar_round">
            <img slot="error" class="image-slot" src="@/assets/headerImg.png" />
          </el-image>
          <!-- <el-avatar
            style="margin-right: 10px;"
            :size="100"
            :src="
              user.avatar.indexOf('http') > -1
                ? user.avatar
                : FILE_URL(user.avatar)
            "
          >
            <img src="~@/assets/headerImg.png" />
          </el-avatar> -->
          <el-upload
            style="margin-right: 10px"
            class="upload-demo"
            action
            accept="image/png, image/jpeg, image/gif, image/webp"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
            :http-request="httpRequest"
          >
            <el-button type="primary" size="mini"> 选择照片 </el-button>
          </el-upload>
          <el-button
            type="danger"
            style="margin-bottom: 4px"
            size="mini"
            @click="deleteAvatar"
          >
            删除
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="登录账号" prop="name">
        <div class="text">{{ user.account }}</div>
      </el-form-item>

      <el-form-item label="账号类型" prop="name">
        <div class="text">{{ user.roleName }}</div>
      </el-form-item>
      <el-form-item label="任职医院" prop="name">
        <div class="text">{{ user.orgName }}</div>
      </el-form-item>
      <el-form-item label="工号" prop="name">
        <div class="text">{{ user.workNo }}</div>
      </el-form-item>
      <el-form-item label="从业年限">
        <div class="text">{{ user.workHistory || '-' }}</div>
      </el-form-item>
      <el-form-item label="邮箱">
        <div class="text">{{ user.mail || '-' }}</div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { changeAvater } from '@/api/setup'
import { uploadFile } from '@/api'
export default {
  data() {
    return {
      form: {
        name: '',
      },
      // account: '',
      // accountType: '',
      // hospital: '',
      // workId: '',
      // workYear: '',
      // mali: '',
      rules: {
        name: [{ required: true }],
      },
    }
  },
  // filters: {
  //   getYear(date) {
  //     if (!date || date == '') {
  //       return '-'
  //     }
  //     let year = new Date().getFullYear() - new Date(date).getFullYear()
  //     return year <= 0 ? '少于1年' : year + '年'
  //   },
  // },
  computed: {
    ...mapState({ user: 'user' }, { avatar: 'avatar' }),
  },
  methods: {
    //删除头像
    async deleteAvatar() {
      await changeAvater({
        avatar: 'deleted',
      })
      this.$store.commit('user/SET_AVATAR', 'deleted')
    },
    // 上传图片
    httpRequest({ file, onProgress, onSuccess, onError }) {
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData, onProgress).then(onSuccess).catch(onError)
    },
    async handleAvatarSuccess(res) {
      console.log(res)
      // this.form.imageUrl = URL.createObjectURL(file.raw)
      await changeAvater({
        avatar: res,
      })
      this.$store.commit('user/SET_AVATAR', res)
      // console.log(this.$store)
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
  },
  // watch: {
  //   user: {
  //     handler() {
  //       this.form.imgUrl = this.user.avatar
  //     },
  //     deep: true,
  //   },
  // },
}
</script>
<style scoped>
.demo-ruleForm ::v-deep.el-form-item__label {
  text-align: left;
}
</style>
