<template>
  <section class="view__card">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
      <el-row>
        <el-col :xs="24" :sm="7" :md="5" :lg="4">
          <el-form-item label="头像" prop="avatar">
            <el-image
              style="
                width: 100px;
                height: 100px;
                border-radius: 50%;
                vertical-align: bottom;
                overflow: hidden;
                text-align: center;
                display: block;
                margin-bottom: 10px;
              "
              fit="cover"
              :src="FILE_URL(form.avatar)"
            >
              <template #error>
                <img src="~@/assets/headerImg.png" />
              </template>
            </el-image>

            <el-upload
              style="display: inline-block;"
              action
              :show-file-list="false"
              accept="image/png, image/jpeg, image/gif, image/webp"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeImageUpload"
              :http-request="httpRequest"
            >
              <el-button size="small" type="primary">选择照片</el-button>
              <!-- <el-button size="small" type="danger">删除</el-button> -->
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="17" :md="12" :lg="10">
          <el-form-item label="账号类型" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio label="DOCTOR">医生</el-radio>
              <el-radio label="DRUGER">药师</el-radio>
              <el-radio label="NURSE">护士</el-radio>
              <el-radio label="OTHER">其他</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select
              v-model="form.sex"
              placeholder="请选择性别"
              style="width: 100%;"
            >
              <el-option label="女" :value="0"></el-option>
              <el-option label="男" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="身份证" prop="idCard">
            <el-input v-model="form.idCard"></el-input>
          </el-form-item>
          <el-form-item label="工号" prop="workNo">
            <el-input v-model="form.workNo"></el-input>
          </el-form-item>
          <el-form-item label="任职医院" prop="orgName">
            <el-input disabled v-model="form.orgName"></el-input>
          </el-form-item>
          <el-form-item label="科室" prop="deptId">
            <el-select
              v-model="form.deptId"
              multiple
              placeholder="请选择科室"
              @change="setDefaultDept"
              style="width: 100%;"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in deptList"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="默认科室" prop="defDeptId">
            <el-select
              v-model="form.defDeptId"
              placeholder="请选择默认科室"
              style="width: 100%;"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in dept4default"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职称" prop="titleId">
            <el-select
              v-model="form.titleId"
              placeholder="请选择职称"
              style="width: 100%;"
            >
              <el-option
                :label="item.name"
                v-for="(item, index) in titleList"
                :key="index"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="擅长" prop="skilled">
            <el-input
              type="textarea"
              maxlength="1000"
              :autosize="{ minRows: 4, maxRows: 6 }"
              show-word-limit
              v-model="form.skilled"
            ></el-input>
          </el-form-item>
          <el-form-item label="个人简介" prop="intro">
            <el-input
              type="textarea"
              maxlength="1000"
              :autosize="{ minRows: 4, maxRows: 6 }"
              show-word-limit
              v-model="form.intro"
            ></el-input>
          </el-form-item>
          <el-form-item label="明星专家" prop="recommend">
            <el-radio-group v-model="form.recommend">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="账号状态" prop="state">
            <el-radio-group v-model="form.state">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button @click="$router.back()">返回</el-button>
            <el-button type="primary" @click="onSubmit">{{
              form.id ? '保存' : '提交'
            }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>
<script>
import { uploadFile } from '@/api/index'
import { deptChooseList, titleChooseList } from '@/api/zyapi/index'
import {
  employeeAdd,
  employeeEdit,
  employeeGet,
} from '@/api/zyapi/organization'
export default {
  data() {
    return {
      deptList: [],
      titleList: [],
      form: {
        avatar: '',
        type: '',
        name: '',
        sex: '',
        phone: '',
        idCard: '',
        workNo: '',
        orgName: this.$store.state.user.orgName,
        deptId: [],
        defDeptId: '',
        titleId: '',
        recommend: false,
        state: true,
        intro: null,
        skilled: null,
      },
      rules: {
        avatar: [{ required: true, message: '请上传头像', trigger: 'blur' }],
        type: [{ required: true, message: '请选择账号类型', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        workNo: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        deptId: [{ required: true, message: '请选择科室', trigger: 'blur' }],
        defDeptId: [
          { required: true, message: '请选择默认科室', trigger: 'blur' },
        ],
        titleId: [{ required: true, message: '请选择职称', trigger: 'blur' }],
        recommend: [
          { required: true, message: '请选择明星专家', trigger: 'blur' },
        ],
        state: [{ required: true, message: '请选择账号状态', trigger: 'blur' }],
      },
    }
  },
  computed: {
    dept4default() {
      return this.deptList.filter(({ id }) => this.form.deptId.includes(id))
    },
  },
  created() {
    this.getdeptChooseList()
    this.gettitleChooseList()
    let id = this.$route.query.id
    console.log(this.$route)
    if (id) {
      this.form.id = id
      this.getemployeeGet()
    }
  },
  methods: {
    // 获取编辑内容
    async getemployeeGet() {
      let infoData = await employeeGet({ id: this.form.id })
      Object.assign(this.form, infoData)
    },
    async getdeptChooseList() {
      this.deptList = await deptChooseList({ tree: false })
    },
    async gettitleChooseList() {
      this.titleList = await titleChooseList()
    },
    setDefaultDept() {
      if (!this.dept4default.some(({ id }) => id === this.form.defDeptId))
        this.form.defDeptId = this.dept4default[0]?.id ?? ''
    },
    //上传头像
    handleAvatarSuccess(res) {
      this.form.avatar = res
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
    onSubmit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          if (this.form.id) {
            await employeeEdit(this.form)
            this.$message.success('修改成功！')
          } else {
            await employeeAdd(this.form)
            this.$message.success('添加成功！')
          }
          this.$router.back()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>
