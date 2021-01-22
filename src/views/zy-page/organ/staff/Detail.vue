<template>
  <section class="view__card">
    <el-form ref="ruleForm" label-width="100px">
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
              :src="FILE_URL(infoData.avatar)"
            >
              <template #error>
                <img src="~@/assets/headerImg.png" />
              </template>
            </el-image>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="17" :md="12" :lg="10">
          <el-form-item label="账号类型" prop="type">
            {{ infoData.type }}
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            {{ infoData.name }}
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            {{ infoData.sex }}
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            {{ infoData.phone }}
          </el-form-item>
          <el-form-item label="身份证" prop="idCard">
            {{ infoData.idCard }}
          </el-form-item>
          <el-form-item label="工号" prop="workNo">
            {{ infoData.workNo }}
          </el-form-item>
          <el-form-item label="任职医院" prop="orgName">
            {{ orgName }}
          </el-form-item>
          <el-form-item label="科室" prop="deptId">
            {{ infoData.deptName }}
          </el-form-item>
          <el-form-item label="默认科室" prop="defDeptId">
            {{ infoData.defDeptId }}
          </el-form-item>
          <el-form-item label="职称" prop="titleId">
            {{ infoData.titleName }}
          </el-form-item>
          <el-form-item label="擅长" prop="skilled">
            {{ infoData.skilled }}
          </el-form-item>
          <el-form-item label="个人简介" prop="intro">
            {{ infoData.intro }}
          </el-form-item>
          <el-form-item label="明星专家" prop="recommend">
            {{ infoData.recommend }}
          </el-form-item>
          <el-form-item label="账号状态" prop="state">
            {{ infoData.state }}
          </el-form-item>
          <el-form-item>
            <el-button @click="$router.back()">返回</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>
<script>
import { doctorIntro } from '@/api/zyapi/organization'
export default {
  data() {
    return {
      orgName: this.$store.state.user.orgName,
      infoData: {},
      id: '',
    }
  },
  created() {
    let id = this.$route.query.id
    console.log(id)
    if (id) {
      this.id = id
      this.getdoctorIntro()
    }
  },
  methods: {
    // 获取编辑内容
    async getdoctorIntro() {
      this.infoData = await doctorIntro({ id: this.id })
    },
  },
}
</script>
