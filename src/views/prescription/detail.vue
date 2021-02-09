<template>
  <section class="view__card view__detail">
    <header>
      <h3 class="view__title">
        <!-- 订单号：{{ id }} -->
        处方号：{{ id }}
        <el-tag :type="btnType[rpInfo.status]" size="mini">
          {{ statusText[rpInfo.status] }}
        </el-tag>
      </h3>
      <el-steps :active="activeStep" align-center class="steps">
        <el-step title="创建" :description="rpInfo.createTime"></el-step>
        <el-step title="提交" :description="rpInfo.submitTime"></el-step>
        <el-step title="审核" :description="rpInfo.auditTime"></el-step>
      </el-steps>
    </header>
    <el-tabs v-model="activeName">
      <el-tab-pane label="处方信息" name="info" lazy>
        <PatinetInfo :orderInfo="orderInfo"></PatinetInfo>
        <PrescriptionInfo
          :orderInfo="orderInfo"
          :prescriptionInfo="rpInfo"
        ></PrescriptionInfo>
        <InvoiceInfo :prescriptionInfo="rpInfo" :hasOrder="false"></InvoiceInfo>
        <div class="fixed-btns">
          <el-button @click="$router.back()" type="primary" plain>
            返回
          </el-button>
          <el-button
            v-if="rpInfo.status == 'PENDING_REVIEW'"
            @click="action('PASSED')"
            type="primary"
          >
            通过
          </el-button>
          <el-button
            v-if="rpInfo.status == 'PENDING_REVIEW'"
            @click="action('REJECTED')"
            type="danger"
            plain
          >
            驳回
          </el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-if="orderInfo.bizType != 'CONSULT'"
        label="历史就诊记录"
        name="history"
        key="history"
        lazy
      >
        <TreatmentHistoryInfo
          :medicalId="orderInfo.historyMedicalId"
        ></TreatmentHistoryInfo>
      </el-tab-pane>
      <el-tab-pane
        v-if="orderInfo.sessionId"
        name="diagnosisRecord"
        key="diagnosisRecord"
        label="诊疗记录"
        lazy
      >
        <ChatRecord :orderInfo="orderInfo"></ChatRecord>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="log" lazy>
        <OperateLog :businessId="id"></OperateLog>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="驳回原因"
      :visible.sync="dialog.visible"
      :close-on-click-modal="false"
      custom-class="component__dialog"
      append-to-body
      @open="handleDialogOpen"
    >
      <el-scrollbar>
        <el-form
          :model="dialog.model"
          :rules="rules"
          ref="ruleForm"
          label-width="auto"
        >
          <el-form-item label="选择模板">
            <el-select
              v-model="dialog.model.value"
              filterable
              style="width: 100%;"
              placeholder="请选择驳回原因模板"
              @change="dialog.model.reason = $event"
            >
              <el-option
                v-for="{ id, content } in dialog.options"
                :key="id"
                :label="content"
                :value="content"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="reason" label="原因">
            <el-input
              type="textarea"
              placeholder="请输入"
              v-model="dialog.model.reason"
              :autosize="{ minRows: 6, maxRows: 6 }"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              plain
              :disabled="!dialog.model.reason"
              :loading="dialog.pedding"
              @click="handleAddTemplate(dialog.model.reason)"
            >
              设为模板
            </el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <div slot="footer" class="is-center">
        <el-button size="mini" @click="dialog.visible = false">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          :loading="dialog.pedding"
          @click="submit('ruleForm')"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  operateRp,
  pageRefuse,
  saveRefuse,
  preDetailInfo,
} from '@/api/prescription'
import {
  ChatRecord,
  OperateLog,
  InvoiceInfo,
  PatinetInfo,
  PrescriptionInfo,
  TreatmentHistoryInfo,
} from '@/components/App'
import { orderDoctorWebDetail } from '@/api/business'

export default {
  name: 'Detail',
  props: {
    id: String,
  },
  components: {
    ChatRecord,
    OperateLog,
    InvoiceInfo,
    PatinetInfo,
    PrescriptionInfo,
    TreatmentHistoryInfo,
  },
  data() {
    return {
      rules: {
        reason: [
          { required: true, message: '请输入驳回原因', trigger: 'blur' },
        ],
      }, // 校验规则
      dialog: {
        pedding: false,
        visible: false,
        model: {
          value: '',
          reason: '',
        },
        options: [],
      }, // 弹窗信息
      rpInfo: {}, // 处方信息
      btnType: {
        DRAFT: 'info',
        PASSED: 'success',
        PENDING: 'primary',
        REJECTED: 'danger',
      }, // 状态按钮类型
      orderInfo: {}, // 订单信息
      statusText: {
        DRAFT: '草稿',
        PASSED: '已通过',
        PENDING_REVIEW: '待审核',
        REJECTED: '已驳回',
      },
      activeName: 'info', // 当前页签
    }
  },
  computed: {
    activeStep() {
      if (this.rpInfo.auditTime) return 3
      if (this.rpInfo.submitTime) return 2
      return 1
    },
  },
  created() {
    this.getPreInfo()
  },
  methods: {
    open() {
      this.$refs.recode.open()
    },
    async handleDialogOpen() {
      this.dialog.options = this.dialog.options.length
        ? this.dialog.options
        : await pageRefuse({ currentNum: 1, pageSize: 9999 }).then(({ list }) =>
            list.map(({ id, content }) => ({ id, content })),
          )
    },
    async handleAddTemplate(content) {
      if (this.dialog.model.reason == this.dialog.model.value) {
        this.$message({
          type: 'error',
          message: '此模板无需再次设置',
          showClose: true,
        })
        return false
      }
      this.dialog.pedding = true
      this.dialog.options.push({
        id: await saveRefuse({ content }).finally(() =>
          setTimeout(() => (this.dialog.pedding = false), 200),
        ),
        content,
      })

      this.$message({
        type: 'success',
        message: '完成',
        showClose: true,
      })
      // this.dialog.visible = false
    },
    submit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.dialog.pedding = true
          await this.action(
            this.dialog.statusType,
            this.dialog.model.reason,
          ).finally(() => setTimeout(() => (this.dialog.pedding = false), 200))
          this.dialog.visible = false
        }
      })
    },
    async action(statusType, reason) {
      if (statusType == 'REJECTED' && !reason) {
        this.dialog.statusType = statusType
        this.dialog.visible = true
        return
      }
      await operateRp({ id: this.rpInfo.id, statusType, reason })
      this.$message.success('操作成功')
      this.$store.dispatch(
        'updateList/changeFlag',
        'updateListFlagPendingPrescription',
      )
      this.$router.back()
    },
    // 获取处方详情
    async getPreInfo() {
      const res = await preDetailInfo({ rpId: this.id })
      this.getOrderInfo(res.orderId)
      this.rpInfo = res
    },
    // 获取订单信息
    async getOrderInfo(orderId) {
      this.orderInfo = await orderDoctorWebDetail({
        orderId,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';
@import '@/styles/_modules-detail.scss';
.el-tag {
  margin-left: 30px;
}
.allNum {
  margin-top: 20px;
  font-size: 14px;
  color: #666;
  span {
    margin-left: 30px;
  }
}
.fixed-btns {
  text-align: center;
}
</style>
