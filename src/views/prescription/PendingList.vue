<template>
  <div class="view__card" v-loading="loading">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      showSelection
    >
      <template v-slot:slot_prescriptionPrice="{ row }">
        <span>￥{{ row.prescriptionPrice }}</span>
      </template>
      <template v-slot:footertool>
        <el-button
          v-show="'PENDING_REVIEW' === type"
          size="mini"
          type="primary"
          :disabled="!tableData.multipleSelection.length"
          @click="
            handleAudit(
              tableData.multipleSelection.map(({ id }) => id),
              'PASSED',
            )
          "
        >
          批量通过
        </el-button>
        <el-button
          v-show="'PENDING_REVIEW' === type"
          size="mini"
          plain
          type="primary"
          :disabled="!tableData.multipleSelection.length"
          @click="
            handleAudit(
              tableData.multipleSelection.map(({ id }) => id),
              'REJECTED',
            )
          "
        >
          批量驳回
        </el-button>
      </template>

      <template v-slot:fixed="{ row }">
        <router-link class="el-button el-button--text" :to="`detail/${row.id}`">
          查看
        </router-link>

        <el-button
          v-show="'PENDING_REVIEW' === type"
          type="text"
          @click="handleAudit([row.id], 'PASSED')"
        >
          通过
        </el-button>

        <el-button
          v-show="'PENDING_REVIEW' === type"
          type="text"
          @click="handleAudit([row.id], 'REJECTED')"
        >
          驳回
        </el-button>
      </template>
    </List>

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
              style="width: 100%"
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
    <!-- 认证相关 -->
    <el-dialog
      title="认证提示"
      :visible.sync="hasAuthShow"
      width="30%"
      :close-on-click-modal="false"
    >
      <div class="hasAuthBox">
        <span v-if="!hasExamine && hasAuth"
          >您还没有实名认证，请扫码前往移动端完成实名认证。</span
        >
        <span v-if="!hasAuth && hasExamine"
          >您还没有资质认证，请扫码前往移动端完成资质认证认证。</span
        >
        <span v-if="!hasExamine && !hasAuth"
          >您还没有实名和资质认证，请扫码前往移动端完成资质认证。</span
        >
        <img :src="erImg" class="MobileImg" />
        <span class="tips">*认证完毕后请关闭弹框并刷新页面。</span>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="hasAuthShow = false">取 消</el-button>
        <el-button type="primary" @click="hasAuthShow = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { List, mixin } from '@/components'
import { invalidFieldSetFocus } from '@/utils'

import { titleChooseList, deptChooseList } from '@/api'
import {
  webPageRpList,
  operateRp,
  pageRefuse,
  saveRefuse,
} from '@/api/prescription'
import { miniImg } from '@/api/setup'

const pre = {
  title: [],
  dept: [],
}

export default {
  inject: ['reload'],
  name: 'Prescription',
  props: {
    type: String,
  },
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: webPageRpList }])],
  data() {
    this.rules = {
      reason: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }],
    }

    return {
      filter: {
        date: {
          props: {
            options: [
              { label: '创建时间', value: 0 },
              { label: '提交时间', value: 1 },
              // { label: '审核时间', value: 2 },
            ],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '处方号', value: 0 },
              { label: '患者姓名', value: 1 },
              { label: '开立医师', value: 2 },
              { label: '诊断结果', value: 3 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '业务类型',
              options: [
                { label: '不限', value: '' },
                // { label: '在线咨询', value: 'CONSULT' },
                { label: '在线复诊', value: 'REPEAT_CLINIC' },
                { label: '慢病续方', value: 'CARRYON_PRESC' },
              ],
            },
            keys: 'business',
          },
          {
            props: {
              label: '业务形式',
              options: [
                { label: '不限', value: '' },
                { label: '图文', value: 'GRAPHIC' },
                { label: '视频', value: 'VIDEO' },
                // { label: '电话', value: 'PHONE' },
              ],
            },
            keys: 'consult',
          },
          {
            props: {
              label: '患者性别',
              options: [
                { label: '不限', value: '' },
                { label: '男', value: 1 },
                { label: '女', value: 0 },
              ],
            },
            keys: 'sex',
          },
          {
            props: {
              label: '患者年龄',
              is: 'InputRange',
            },
            keys: ['ageMin', 'ageMax'],
          },
          {
            props: {
              label: '医生职称',
              options: [
                { label: '不限', value: '' },
                ...pre.title.map(_ => ({ label: _.name, value: _.id })),
              ],
            },
            keys: 'titleId',
          },
          {
            props: {
              label: '科室',
              options: [
                { label: '不限', value: '' },
                ...pre.dept.map(_ => ({ label: _.name, value: _.id })),
              ],
            },
            keys: 'deptId',
          },
          {
            props: {
              label: '药品数量',
              is: 'InputRange',
            },
            keys: ['numberMin', 'numberMax'],
          },
          {
            props: {
              label: '金额',
              is: 'InputRange',
            },
            keys: ['priceMin', 'priceMax'],
          },
          // {
          //   props: {
          //     label: '处方状态',
          //     options: [
          //       { label: '不限', value: '' },
          //       { label: '草稿', value: 'DRAFT' },
          //       { label: '待审核', value: 'PENDING_REVIEW' },
          //       { label: '已驳回', value: 'REJECTED' },
          //       { label: '已通过', value: 'PASSED' },
          //     ],
          //   },
          //   keys: 'rpStatus',
          // },
        ],
      },
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
        rpStatus: this.type,
        pharmacyIds: this.$store.state.user.store.id,
      },
      dialog: {
        pedding: false,
        visible: false,
        model: {
          value: '',
          reason: '',
        },

        options: [],
      },
      // 是否认证弹框显示
      hasAuthShow: false,
      // 二维码
      erImg: '',
    }
  },
  computed: {
    updateListFlagPendingPrescription() {
      return this.$store.state.updateList.updateListFlagPendingPrescription
    },
    hasExamine() {
      return this.$store.state.user.hasExamine
    },
    hasAuth() {
      return this.$store.state.user.hasAuth
    },
    columns() {
      return {
        index: {
          hidden: true,
        },
        prescriptionPrice: {
          prop: 'slot_prescriptionPrice',
        },
        auditUser: {
          hidden: true,
        },
        serviceType: {
          formatter(row) {
            return row.serviceType === 'REPEAT_CLINIC'
              ? '在线复诊'
              : row.serviceType === 'CARRYON_PRESC'
              ? '慢病续方'
              : ''
          },
          minWidth: 90,
        },
        serviceMode: {
          formatter(row) {
            return row.serviceMode === 'GRAPHIC'
              ? '图文'
              : row.serviceMode === 'VIDEO'
              ? '视频'
              : ''
          },
          minWidth: 90,
        },
        status: {
          formatter(row) {
            return row.status === 'DRAFT'
              ? '草稿'
              : row.status === 'PENDING_REVIEW'
              ? '待审核'
              : row.status === 'REJECTED'
              ? '已驳回'
              : row.status === 'PASSED'
              ? '已通过'
              : ''
          },
          minWidth: 90,
        },
        memberSex: {
          formatter(row) {
            return row.memberSex === 0 ? '女' : row.memberSex === 1 ? '男' : ''
          },
        },
        memberAge: {
          formatter(row) {
            return row.memberAge + '岁'
          },
        },
        createDate: {
          minWidth: 180,
        },
        createTime: {
          minWidth: 150,
        },
        submitTime: {
          minWidth: 150,
        },
        auditTime: {
          minWidth: 180,
          hidden: this.$route.path === '/prescription/pending/list',
        },
        fixed: {
          minWidth: 200,
        },
        memberName: {
          minWidth: 90,
        },
        doctorName: {
          minWidth: 90,
        },
        number: {
          minWidth: 90,
        },
      }
    },
  },
  watch: {
    //全局监听刷新
    updateListFlagPendingPrescription() {
      this.$_fetchTableData(webPageRpList)
    },
    type: function (val) {
      this.query.rpStatus = val
      if ('PENDING_REVIEW' === val) {
        this.filter.date.props.options = [
          { label: '创建时间', value: 0 },
          { label: '提交时间', value: 1 },
        ]
      } else {
        this.filter.date.props.options = [
          { label: '创建时间', value: 0 },
          { label: '提交时间', value: 1 },
          { label: '审核时间', value: 2 },
        ]
      }
    },
    $route() {
      this.query = {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
        rpStatus: this.type,
        pharmacyIds: this.$store.state.user.store.id,
      }
    },
  },
  async beforeRouteEnter(to, from, next) {
    ;[pre.title, pre.dept] = await Promise.all([
      pre.title.length ? pre.title : titleChooseList(),
      pre.dept.length ? pre.dept : deptChooseList({ tree: false }),
    ])
    next()
  },
  methods: {
    // 获取实名制二维码
    async getminiImg() {
      const res = await miniImg({})
      this.erImg = res
    },
    async handleAudit(ids, statusType, reason) {
      if (!this.hasExamine || !this.hasAuth) {
        this.hasAuthShow = true
        this.getminiImg()
      } else {
        if ('REJECTED' === statusType && !reason) {
          this.dialog.ids = ids
          this.dialog.statusType = statusType
          this.dialog.visible = true
          return
        }

        if ('PASSED' === statusType) {
          this.$confirm('是否确认操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(async () => {
            this.passFnc(ids, statusType, reason)
          })
        } else {
          this.passFnc(ids, statusType, reason)
        }
      }
    },
    async passFnc(ids, statusType, reason) {
      let reasonId = this.dialog.options.filter(
        item => item.content == reason,
      )[0]?.id

      await Promise.all(
        ids.map(id => operateRp({ id, statusType, reason, reasonId })),
      )

      this.$message({
        type: 'success',
        message: '完成',
        showClose: true,
      })
      this.$_fetchTableData(webPageRpList)
    },
    async handleDialogOpen() {
      this.dialog.model = {
        value: '',
        reason: '',
      }
      this.dialog.options = this.dialog.options.length
        ? this.dialog.options
        : await pageRefuse({ currentNum: 1, pageSize: 9999 }).then(({ list }) =>
            list.map(({ id, content }) => ({ id, content })),
          )
    },

    async handleAddTemplate(content) {
      if (
        this.dialog.options.some(
          item => item.content == this.dialog.model.reason,
        )
      ) {
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
    },

    submit(formName) {
      this.$refs[formName].validate(async (valid, invalidFields) => {
        if (valid) {
          this.dialog.pedding = true
          await this.handleAudit(
            this.dialog.ids,
            this.dialog.statusType,
            this.dialog.model.reason,
          ).finally(() => setTimeout(() => (this.dialog.pedding = false), 200))
          this.dialog.visible = false
          this.$_fetchTableData(webPageRpList)
        } else {
          invalidFieldSetFocus(this.$refs[formName], invalidFields)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.c__tool ::v-deep .left-btns {
  min-height: 1px;
}
.hasAuthBox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .MobileImg {
    margin: 30px auto 40px;
  }
}
::v-deep .table-wrap .cell {
  font-size: 16px;
}
::v-deep .el-table .cell.el-tooltip {
  font-size: 14px;
  padding-left: 6px;
}
.el-select-dropdown__item {
  width: 400px;
}
</style>
