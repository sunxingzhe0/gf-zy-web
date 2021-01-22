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
      <el-form-item label="个人简介" prop="intro">
        <div class="text" v-show="!isEdit">
          {{ form.intro }}
        </div>
        <el-input
          v-show="isEdit"
          type="textarea"
          class="input"
          :autosize="{ minRows: 6, maxRows: 12 }"
          placeholder="请输入"
          v-model="form.intro"
        ></el-input>
      </el-form-item>
      <el-form-item label="执业经历" prop="practiceInfo">
        <div class="text" v-show="!isEdit">
          {{ form.practiceInfo }}
        </div>
        <el-input
          v-show="isEdit"
          type="textarea"
          class="input"
          :autosize="{ minRows: 6, maxRows: 12 }"
          placeholder="请输入"
          v-model="form.practiceInfo"
        ></el-input>
      </el-form-item>

      <el-form-item label="学术经历" prop="academicInfo">
        <div class="text" v-show="!isEdit">
          {{ form.academicInfo }}
        </div>
        <el-input
          v-show="isEdit"
          type="textarea"
          class="input"
          :autosize="{ minRows: 6, maxRows: 12 }"
          placeholder="请输入"
          v-model="form.academicInfo"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" v-show="!isEdit" @click="isEdit = !isEdit">
          修改
        </el-button>
        <el-button type="primary" v-show="isEdit" @click="submitForm">
          保存
        </el-button>
        <el-button type="" v-show="isEdit" @click="getUnitIdList">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState } from 'vuex'
// import { accountGet } from '@/api/authority'
import { doctorIntro, changeSelfText } from '@/api/setup'
// import { keys } from 'lodash'

export default {
  data() {
    return {
      isEdit: false,
      form: {
        intro: '',
        practiceInfo: '',
        academicInfo: '',
      },
      rules: {
        intro: [{ required: true, message: '请输入个人简介' }],
        practiceInfo: [
          {
            required: true,
            message: '请输入执业经历',
          },
        ],
        academicInfo: [
          { required: true, trigger: 'blur', message: '请输入学术经历' },
        ],
      },
    }
  },
  computed: {
    ...mapState({ user: 'user' }),
  },
  mounted() {
    this.getUnitIdList()
  },
  methods: {
    async getUnitIdList() {
      let res = await doctorIntro({
        id: this.user.userId,
      })
      this.form = res
      this.isEdit = false
      // console.log(res)
      // form: {
      //   intro: '',
      //   practiceInfo: '',
      //   academicInfo: '',
      // },
      // this.form.intro = res.intro
      // this.form.practiceArea = res.practiceArea
      // this.form.academicInfo = res.academicInfo
    },
    submitForm() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let data = {
            intro: this.form.intro,
            practiceInfo: this.form.practiceInfo,
            academicInfo: this.form.academicInfo,
          }
          await changeSelfText(data).then(() => {
            this.$message.success('修改成功')
            this.getUnitIdList()
            // this.isEdit = false
            // this.resetMsg()
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
<style scoped>
.input {
  width: 60%;
}
.text {
  width: 60%;
  font-size: 15px;
  line-height: 26px;
  color: #1a1a1a;
  padding-top: 5px;
}
</style>
