<template>
  <section class="view__card">
    <h3 class="view__title">实名信息</h3>
    <el-row class="view__content">
      <el-col :md="3" class="is-right">
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
      <el-col :md="5">{{ info.idCard }}</el-col>
    </el-row>

    <h3 class="view__title">基本信息</h3>

    <el-row class="view__content">
      <el-col :md="3" class="is-right">
        <span>头像</span>
      </el-col>
      <el-col :md="21">
        <el-image fit="cover" :src="FILE_URL(info.avatar)" class="avatar_round">
          <img slot="error" class="image-slot" src="@/assets/headerImg.png" />
        </el-image>

        <!-- <el-avatar
          style="vertical-align: top;"
          :size="100"
          :src="FILE_URL(info.avatar)"
        >
          <i
            class="el-icon-user-solid"
            style="font-size: 30px; color: #fff; line-height: inherit;"
          ></i>
        </el-avatar> -->
      </el-col>
    </el-row>

    <el-row class="view__content short_margin">
      <el-col :md="3" class="is-right">
        <span>账号类型</span>
      </el-col>
      <el-col :md="5">
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

      <el-col :md="3" class="is-right">
        <span>登录账号</span>
      </el-col>
      <el-col :md="5">{{ info.account }}</el-col>

      <el-col :md="3" class="is-right">
        <span>任职医院</span>
      </el-col>
      <el-col :md="5">{{ orgName }}</el-col>
    </el-row>

    <el-row class="view__content short_margin">
      <el-col :md="3" class="is-right">
        <span>工号</span>
      </el-col>
      <el-col :md="5">{{ info.workNo }}</el-col>
      <el-col :md="3" class="is-right">
        <span>科室</span>
      </el-col>
      <el-col :md="5">{{
        info.deptInfo
          .map(item => {
            return item.name
          })
          .join(',')
      }}</el-col>
      <el-col :md="3" class="is-right">
        <span>默认科室</span>
      </el-col>
      <el-col :md="5">{{ info.defDeptName }}</el-col>
    </el-row>

    <el-row class="view__content short_margin">
      <el-col :md="3" class="is-right">
        <span>职称</span>
      </el-col>
      <el-col :md="5">{{ info.titleInfo }}</el-col>
      <el-col :md="3" class="is-right">
        <span>职务</span>
      </el-col>
      <el-col :md="5">{{ getdutyType(info.dutyType) }}</el-col>
      <el-col :md="3" class="is-right">
        <span>药房</span>
      </el-col>
      <el-col :md="5">{{
        info.storeInfo
          .map(item => {
            return item.name
          })
          .join(',')
      }}</el-col></el-row
    >

    <el-row class="view__content short_margin">
      <el-col :md="3" class="is-right">
        <span>从业年限</span>
      </el-col>
      <el-col :md="5">{{ info.workHistory }}</el-col>

      <el-col :md="3" class="is-right">
        <span>执业号</span>
      </el-col>
      <el-col :md="5">{{ info.workerCode }}</el-col>

      <el-col :md="3" class="is-right">
        <span>是否本院</span>
      </el-col>
      <el-col :md="5">{{ info.inHospital ? '是' : '否' }}</el-col>
    </el-row>

    <el-row class="view__content short_margin">
      <el-col :md="3" class="is-right">
        <span>是否推荐</span>
      </el-col>
      <el-col :md="5">{{ info.recommend ? '是' : '否' }}</el-col>
      <el-col :md="3" class="is-right">
        <span>明星科室</span>
      </el-col>
      <el-col :md="5">{{ info.star ? '是' : '否' }}</el-col>
      <el-col :md="3" class="is-right">
        <span>邮箱</span>
      </el-col>
      <el-col :md="5">{{ info.mail }}</el-col>
    </el-row>

    <h3 class="view__title">资格证书</h3>
    <el-row class="view__content short_margin">
      <template v-for="{ type, certNo, fileId } in info.certs">
        <el-col :key="`label_${type}`" :md="3" class="is-right">
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
        </el-col>
        <el-col :key="`value_${type}`" :md="5" style="padding-left: 15px;">
          {{ certNo }}
        </el-col>
        <el-col
          :key="`image_${type}`"
          :md="{ offset: 3, span: 20 }"
          style="padding-left: 15px;"
        >
          <div class="image-wrap">
            <el-image
              v-for="_ in fileId"
              :key="_"
              style="width: 220px; height: 130px;"
              :src="FILE_URL(_)"
              :preview-src-list="fileId.map(FILE_URL)"
              fit="cover"
            ></el-image>
          </div>
        </el-col>
      </template>
    </el-row>

    <h3 class="view__title">其他信息</h3>
    <el-row class="view__content">
      <el-col :md="3" class="is-right">
        <span>个人简介</span>
      </el-col>
      <el-col :md="21" tag="p" style="margin-top: 0;">{{ info.intro }}</el-col>
    </el-row>
    <el-row class="view__content">
      <el-col :md="3" class="is-right">
        <span>执业经历</span>
      </el-col>
      <el-col :md="21" tag="p" style="margin-top: 0;">{{
        info.practiceInfo
      }}</el-col>
    </el-row>
    <el-row class="view__content">
      <el-col :md="3" class="is-right">
        <span>学术经历</span>
      </el-col>
      <el-col :md="21" tag="p" style="margin-top: 0;">{{
        info.academicInfo
      }}</el-col>
    </el-row>

    <el-row class="view__content">
      <el-col :md="3" class="is-right">
        <span>执业范围</span>
      </el-col>
      <el-col :md="21" tag="p" style="margin-top: 0;">{{
        info.practiceArea
      }}</el-col>
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
          <el-button size="small" @click="visible = false">
            取消
          </el-button>
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

::v-deep .sticky-footer {
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
  color: #646464;
  padding: 10px 0;
  .is-right {
    min-height: 16px;
    span {
      display: inline-block;
      white-space: nowrap;
      width: 80px;
      text-align: left;
      margin-right: 0px;
    }
  }
}
.short_margin {
  margin: 0;
}
</style>
<style lang="scss">
.view__content {
  .el-col {
    min-height: 1px;
  }
}
</style>
