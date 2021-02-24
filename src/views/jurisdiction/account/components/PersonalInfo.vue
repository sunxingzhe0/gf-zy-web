<template>
  <section class="view__card">
    <h3 class="view__title">实名信息</h3>
    <el-row class="view__content">
      <el-col :md="6">
        <span>姓名</span>
        {{ info.name }}
      </el-col>
      <el-col :md="6">
        <span>性别</span>
        {{ info.sex === 1 ? '男' : '女' }}
      </el-col>
      <el-col :md="6">
        <span>手机号</span>
        {{ info.phone || '-' }}
      </el-col>
      <el-col :md="6">
        <span>身份证号</span>
        {{ info.idCard || '-' }}
      </el-col>
      <!-- <el-col :md="3" class="is-right">
        <span>姓名</span>
      </el-col>
      <el-col :md="5">{{ info.name }}</el-col>

      <el-col :md="3" class="is-right">
        <span>性别</span>
      </el-col>
      <el-col :md="5">{{ info.sex === 1 ? '男' : '女' }}</el-col>

      <el-col :md="3" class="is-right">
        <span>手机号</span>
      </el-col>
      <el-col :md="5">{{ info.phone || '--' }}</el-col>
    </el-row>
    <el-row class="view__content">
      <el-col :md="3" class="is-right">
        <span>身份证号</span>
      </el-col>
      <el-col :md="5">{{ info.idCard }}</el-col> -->
      <!-- <span>姓名: {{ info.name }}</span>
      <span>性别: {{ info.sex === 1 ? '男' : '女' }}</span>
      <span>手机号: {{ info.phone || '--' }}</span>
      <span>身份证号: {{ info.idCard }}</span> -->
    </el-row>

    <h3 class="view__title">基本信息</h3>

    <el-row class="view__content">
      <el-col :span="24">
        <div class="flex">
          <span>头像</span>
          <el-image
            fit="cover"
            :src="FILE_URL(info.avatar)"
            class="avatar_round"
          >
            <img slot="error" class="image-slot" src="@/assets/headerImg.png" />
          </el-image>
        </div>
      </el-col>
    </el-row>

    <el-row class="view__content short_margin">
      <el-col :md="6">
        <span>账号类型</span>

        {{
          info.type === 'DOCTOR'
            ? '医生'
            : info.type === 'DRUGER'
            ? '药师'
            : info.type === 'NURSE'
            ? '护士'
            : info.type === 'OTHER'
            ? '其他'
            : ''
        }}
      </el-col>

      <el-col :md="6">
        <span>登录账号</span>
        {{ info.account || '-' }}
      </el-col>

      <el-col :md="6">
        <span>任职医院</span>
        {{ orgName || '-' }}
      </el-col>
      <el-col :md="6">
        <span>工号</span>
        {{ info.workNo || '-' }}
      </el-col>
    </el-row>

    <el-row class="view__content short_margin">
      <el-col :md="6">
        <span>科室</span>
        {{
          info.deptInfo
            .map(item => {
              return item.name
            })
            .join(',')
        }}
      </el-col>
      <el-col :md="6">
        <span>默认科室</span>
        {{ info.defDeptName || '-' }}
      </el-col>
      <el-col :md="6">
        <span>职称</span>
        {{ info.titleInfo || '-' }}
      </el-col>
      <el-col :md="6">
        <span>职务</span>

        {{ getdutyType(info.dutyType) || '-' }}
      </el-col>
    </el-row>

    <!-- <el-row class="view__content short_margin">
      <el-col :md="6" class="is-right">
        <span>药房</span>
        <span>{{
        info.storeInfo
          .map(item => {
            return item.name
          })
          .join(',')
      }}</span>
      </el-col></el-row
    > -->

    <el-row class="view__content short_margin">
      <el-col :md="6">
        <span>药房</span>

        {{
          info.storeInfo
            .map(item => {
              return item.name
            })
            .join(',')
        }}
      </el-col>
      <el-col :md="6">
        <span>从业年限</span>
        {{ info.workHistory || '-' }}
      </el-col>

      <el-col :md="6">
        <span>执业号</span>
        {{ info.workerCode || '-' }}
      </el-col>

      <el-col :md="6">
        <span>是否本院</span>
        {{ info.inHospital ? '是' : '否' }}
      </el-col>
    </el-row>

    <el-row class="view__content short_margin">
      <el-col :md="6">
        <span>是否推荐</span>
        {{ info.recommend ? '是' : '否' }}
      </el-col>
      <el-col :md="6">
        <span>明星科室</span>
        {{ info.star ? '是' : '否' }}
      </el-col>
      <el-col :md="6">
        <span>邮箱</span>
        {{ info.mail || '-' }}
      </el-col>
    </el-row>

    <h3 class="view__title">资格证书</h3>
    <el-row class="view__content short_margin">
      <template v-for="{ type, certNo, fileId } in info.certs">
        <el-col :key="`label_${type}`" :span="6">
          <div>
            <span>
              {{
                type === 'DRUG'
                  ? '药师资格证'
                  : type === 'PHYS_QUAL'
                  ? '医师资格证'
                  : type === 'DOCTOR_QUAL'
                  ? '医师执业证'
                  : type === 'NURSE'
                  ? '护士执业证'
                  : type === 'TECH'
                  ? '专业技术资格证'
                  : ''
              }}
            </span>
            <span class="cerNospan">{{ certNo }}</span>
          </div>
          <!-- <div class="image-wrap">
            <el-image
              v-for="_ in fileId"
              :key="_"
              style="width: 220px; height: 130px;"
              :src="FILE_URL(_)"
              :preview-src-list="fileId.map(FILE_URL)"
              fit="cover"
            ></el-image>
          </div> -->
        </el-col>
        <!-- <el-col :key="`value_${type}`" :md="5" style="padding-left: 15px;">
          {{ certNo }}
        </el-col> -->
        <el-col
          :key="`image_${type}`"
          :md="{ offset: 1, span: 20 }"
          style="padding-left: 30px;"
        >
          <div class="image-wrap">
            <el-image
              v-for="_ in fileId"
              :key="_"
              :src="FILE_URL(_)"
              style="width: 220px; height: 130px;"
              :preview-src-list="fileId.map(FILE_URL)"
              fit="cover"
            ></el-image>
          </div>
        </el-col>
      </template>
    </el-row>

    <h3 class="view__title">其他信息</h3>
    <el-row class="view__content">
      <el-col :span="24">
        <div class="otherInfo">
          <span>个人简介</span>
          <div class="info">{{ info.intro }}</div>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="otherInfo">
          <span>执业经历</span>
          <div class="info">{{ info.practiceInfo }}</div>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="otherInfo">
          <span>学术经历</span>
          <div class="info">{{ info.academicInfo }}</div>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="otherInfo">
          <span>执业范围</span>
          <div class="info">{{ info.practiceArea }}</div>
        </div>
      </el-col>
    </el-row>

    <EditFooter
      v-if="isAudit"
      class="is-center"
      @back="$router.push('/jurisdiction/account/list')"
    >
      <el-button size="small" type="primary" @click="handleClick(true)">
        通过
      </el-button>
      <el-button size="small" type="danger" plain @click="handleClick(false)">
        驳回
      </el-button>
    </EditFooter>

    <el-dialog
      title="驳回原因"
      :visible.sync="visible"
      custom-class="component__dialog"
      append-to-body
    >
      <el-form :model="model">
        <el-form-item
          prop="examineReason"
          :rules="{ required: true, message: '请输入驳回原因' }"
        >
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            maxlength="500"
            show-word-limit
            placeholder="请输入驳回原因"
            v-model="model.examineReason"
          ></el-input>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <div class="is-center">
          <el-button size="small" @click="visible = false"> 取消 </el-button>
          <el-button
            size="small"
            type="primary"
            @click="handleClick(false, model.examineReason)"
          >
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script>
import { EditFooter } from '@/components'
import { accountExamine } from '@/api/authority'

export default {
  name: 'PersonalInfo',
  props: {
    isAudit: Boolean,
    info: Object,
  },
  components: {
    EditFooter,
  },
  computed: {
    orgName() {
      return this.$store.state.user.orgName
    },
  },
  data() {
    return {
      visible: false,
      model: {
        examineReason: '',
      },
    }
  },
  methods: {
    getdutyType(type) {
      if (type == 'NURSE') {
        return '护理'
      } else if (type == 'MEDICINE') {
        return '药学'
      } else if (type == 'CHINESE_MEDICINE') {
        return '中药学'
      } else if (type == 'CHECKOUT') {
        return '检验'
      } else if (type == 'RADIATE') {
        return '放射'
      } else if (type == 'PHYSICIAN') {
        return '医师'
      } else if (type == 'REHABILITATION_TECHNICIAN') {
        return '康复技师'
      }
    },
    async handleClick(examine, examineReason) {
      if (!examine && !examineReason) {
        if (this.visible) {
          this.$message.info('请输入驳回理由')
        }
        this.visible = true
        return
      }

      await accountExamine({ id: this.info.id, examine, examineReason })

      this.$message({
        type: 'success',
        message: '完成',
        showClose: true,
      })
      this.$router.push('/jurisdiction/account/list?flag=1')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';
@import '@/styles/_modules-detail.scss';
::v-deep.sticky-footer {
  position: sticky;
  bottom: 0;
  margin: -30px 0 0 0;
  padding: 20px 0 0 0;
  background: $--color-white;
}

@supports (
  (-webkit-backdrop-filter: saturate(180%) blur(20px)) or
    (backdrop-filter: saturate(180%) blur(20px))
) {
  ::v-deep .sticky-footer {
    backdrop-filter: saturate(180%) blur(20px);
    background: rgba($--color-white, 0.8);
  }
}
.view__content {
  font-size: 14px;
  color: #1a1a1a;
  padding: 4px 0;
  padding-left: 40px;
  span {
    display: inline-block;
    white-space: nowrap;
    width: 80px;
    text-align: left;
    margin-right: 0px;
    color: #666;
  }
}
.short_margin {
  margin: 0;
}
.otherInfo {
  position: relative;
  padding-left: 80px;
  span {
    position: absolute;
    left: 0;
    color: #666;
  }
  .info {
    margin-bottom: 10px;
    color: #1a1a1a;
  }
}

.cerNospan {
  margin-left: 30px;
}
</style>
