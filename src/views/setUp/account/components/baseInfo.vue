<template>
  <div>
    <!-- 头像 -->
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
    </el-form>
    <!-- 其他信息 -->
    <el-form ref="basicForm" :model="model" :rules="rules" label-width="120px">
      <el-row class="view__content" :gutter="20">
        <el-col :md="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="model.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="性别">
            <el-select style="width: 100%" v-model="model.sex">
              <el-option label="女" :value="0"></el-option>
              <el-option label="男" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="身份证">
            <el-input v-model="model.idCard"></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="model.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="工号" prop="workNo">
            <el-input v-model="model.workNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="任职医院">
            <el-select
              disabled
              style="width: 100%"
              :value="user.orgName"
              filterable
            >
              <el-option
                :label="user.orgName"
                :value="user.orgName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item
            label="科室"
            :prop="model.type === 'DOCTOR' ? 'deptId' : ''"
          >
            <el-select
              style="width: 100%"
              v-model="model.deptId"
              filterable
              multiple
              @change="setDefaultDept"
            >
              <el-option
                v-for="{ id, name } in depts"
                :key="id"
                :label="name"
                :value="id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :md="12">
          <el-form-item
            label="默认科室"
            :prop="model.type === 'DOCTOR' ? 'defDeptId' : ''"
          >
            <el-select style="width: 100%" v-model="model.defDeptId" filterable>
              <el-option
                v-for="{ id, name } in dept4default"
                :key="id"
                :label="name"
                :value="id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :md="12">
          <el-form-item
            label="职称"
            :prop="model.type === 'DOCTOR' ? 'titleId' : ''"
          >
            <el-select style="width: 100%" v-model="model.titleId" filterable>
              <el-option
                v-for="{ id, name } in titles"
                :key="id"
                :label="name"
                :value="id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :md="12">
          <el-form-item label="职务">
            <el-select style="width: 100%" v-model="model.dutyType" filterable>
              <el-option
                v-for="{ value, label } in post"
                :key="value"
                :label="label"
                :value="value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="从业年限" prop="workHistory">
            <el-date-picker
              v-model="model.workHistory"
              type="date"
              style="width: 100%"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="明星专家">
            <el-select style="width: 100%" v-model="model.star" filterable>
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :md="12">
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="model.mail"></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="擅长">
            <el-input
              v-model="model.skilled"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6 }"
              placeholder="请输入擅长内容，最多1000字"
              maxlength="1000"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :md="12">
          <el-form-item label="个人简介">
            <el-input
              v-model="model.intro"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6 }"
              placeholder="请输入个人经历、学术贡献，最多1000字"
              maxlength="1000"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="btns">
        <el-button type="primary" @click="submit('basicForm')">
          保存
        </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
// import { EditFooter } from '@/components'
import { mapState } from 'vuex'
import { changeAvater } from '@/api/setup'
import { uploadFile, deptChooseList, titleChooseList } from '@/api'
import { accountGet, accountEdit } from '@/api/authority'
export default {
  // components: { EditFooter },
  data() {
    return {
      form: {
        name: '',
      },
      loading: false,
      post: [
        { label: '护理', value: 'NURSE' },
        { label: '药学', value: 'MEDICINE' },
        { label: '中药学', value: 'CHINESE_MEDICINE' },
        { label: '检验', value: 'CHECKOUT' },
        { label: '放射', value: 'RADIATE' },
        { label: '医师', value: 'PHYSICIAN' },
        { label: '康复技师', value: 'REHABILITATION_TECHNICIAN' },
      ],
      model: {
        orgName: '',
        avatar: '',
        type: 'DOCTOR',
        roleId: [],
        account: '',
        password: '',
        rePassword: '',
        name: '',
        sex: '',
        phone: '',
        idCard: '',
        workNo: '',
        deptId: ['0'],
        defDeptId: '',
        storeId: [],
        titleId: '',
        inHospital: true,
        recommend: true,
        star: false,
        mail: '',
        intro: '',
        practiceInfo: '',
        academicInfo: '',
        practiceArea: '',
        certs: [],
        dutyType: null,
      },
      beforeDeptId: ['0'],
      depts: [],
      titles: [],
      rules: {
        name: [{ required: true }],
      },
      // 从业年限日期限制
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        },
      },
    }
  },

  computed: {
    ...mapState({ user: 'user' }, { avatar: 'avatar' }),
    dept4default() {
      return this.depts.filter(({ id }) => this.model.deptId.includes(id))
    },
  },
  created() {
    this.getoldEditInfo()
    this.getdeptChooseList()
    this.gettitleChooseList()
  },
  methods: {
    async gettitleChooseList() {
      this.titles = await titleChooseList()
    },
    async getdeptChooseList() {
      let res = await deptChooseList({ tree: false })
      this.depts = [{ id: '0', name: '暂无' }, ...res]
    },
    async getoldEditInfo() {
      this.loading = true
      this.model = await accountGet({ id: this.user.userId })
      this.loading = false
    },
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
      this.model.avatar = res
      // await changeAvater({
      //   avatar: res,
      // })
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
    setDefaultDept() {
      if (
        !this.beforeDeptId.some(item => item == '0') &&
        this.model.deptId.some(item => item == '0')
      ) {
        this.model.deptId = ['0']
      } else if (
        this.beforeDeptId.some(item => item == '0') &&
        this.model.deptId.length > 1
      ) {
        this.model.deptId = this.model.deptId.filter(item => item != '0')
      }
      this.beforeDeptId = this.model.deptId
      if (!this.dept4default.some(({ id }) => id === this.model.defDeptId))
        this.model.defDeptId = this.dept4default[0]?.id ?? ''
    },
    async submit() {
      await accountEdit({
        ...this.model,
        // 科室 药房可选 暂无，排除掉
        deptId: this.model.deptId.filter(_ => _ && _ != 0),
        storeId: this.model.storeId.filter(_ => _ && _ != 0),
        defDeptId: this.model.defDeptId == '0' ? '' : this.model.defDeptId,
        phone: this.model.phone,
        idCard: this.model.idCard,
      })
      this.$message({
        type: 'success',
        message: '完成',
        showClose: true,
      })
      this.getoldEditInfo()
    },
  },
}
</script>
<style scoped>
.demo-ruleForm ::v-deep.el-form-item__label {
  text-align: left;
}
.text {
  display: flex;
  align-items: center;
}
.btns {
  display: flex;
  justify-content: center;
}
</style>
