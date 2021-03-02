<template>
  <section class="view__card" v-loading="loading">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_recommend="{ row, $index }">
        <el-switch
          v-model="row.recommend"
          @change="handleChange($event, row, $index, 'recommend')"
        ></el-switch>
      </template>
      <template v-slot:slot_star="{ row, $index }">
        <el-switch
          v-model="row.star"
          @change="handleChange($event, row, $index, 'star')"
        ></el-switch>
      </template>
      <template v-slot:slot_state="{ row, $index }">
        <el-switch
          :value="row.userState"
          active-text="启用"
          :inactive-text="row.userState == 2 ? '停用' : '禁用'"
          :active-value="1"
          :width="50"
          class="textSwitch"
          @change="handleChange($event, row, $index, 'state')"
        ></el-switch>
      </template>

      <template v-slot:slot_business="{ row, $index }">
        <el-switch
          v-model="row.business"
          @change="handleChange($event, row, $index, 'business')"
        ></el-switch>
      </template>

      <template v-slot:slot_seq="{ row }">
        <EditableText
          icon="el-icon-edit"
          v-model="row.seq"
          @confirm="resolveSortChange($event, row)"
        />
      </template>

      <template v-slot:fixed="{ row }">
        <router-link class="el-button el-button--text" :to="`detail/${row.id}`">
          查看
        </router-link>

        <router-link class="el-button el-button--text" :to="`edit/${row.id}`">
          修改
        </router-link>

        <router-link
          v-if="row.examineState === 'TO_EXAMINE'"
          class="el-button el-button--text"
          :to="`audit/${row.id}`"
        >
          审核
        </router-link>

        <el-button
          type="text"
          @click="
            ;(resetDialog.visible = true),
              (resetDialog.model.id = row.id),
              (resetDialog.account = row.account)
          "
          >重置密码</el-button
        >
      </template>

      <template v-slot:footertool>
        <router-link
          type="primary"
          class="el-button el-button--primary"
          to="add"
        >
          新增帐号
        </router-link>
        <el-button type="primary" plain @click="importDialog.visible = true">
          批量导入
        </el-button>
      </template>
    </List>

    <el-dialog
      title="重置密码"
      :visible.sync="resetDialog.visible"
      append-to-body
      custom-class="component__dialog"
      @closed="handleClosed('form')"
    >
      <el-form
        ref="form"
        :model="resetDialog.model"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item prop="password" label="密码">
          <el-input
            type="password"
            v-model="resetDialog.model.password"
          ></el-input>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <div class="is-center">
          <el-button size="small" @click="resetDialog.visible = false">
            取消
          </el-button>
          <el-button size="small" type="primary" @click="submit('form')">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      title="批量导入"
      :visible="importDialog.visible"
      append-to-body
      custom-class="component__dialog"
      @closed="handleClosed('importForm')"
    >
      <el-form
        ref="importForm"
        :model="importDialog.model"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item prop="upload">
          <el-upload
            class="upload-demo"
            action
            accept=".xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :file-list="importDialog.fileList"
            :before-upload="beforeUpload"
            :http-request="httpRequest"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传 <code>excel</code> 文件，且不超过 2MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <div class="is-center">
          <el-button size="small" @click="importDialog.visible = false">
            取消
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="importSave('importForm')"
          >
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script>
import { List, mixin, EditableText } from '@/components'
import { invalidFieldSetFocus } from '@/utils'
import {
  accountList,
  accountChangeOrder,
  accountChangeState,
  accountChangeRecommend,
  updateAccountBizState,
  accountResetPassword,
  updateChangeStar,
} from '@/api/authority'
import {
  roleChooseList,
  deptChooseList,
  drugStoreChooseList,
  titleChooseList,
} from '@/api'

const pre = {
  role: [],
  dept: [],
  store: [],
  title: [],
}

export default {
  name: 'TableList',
  components: {
    List,
    EditableText,
  },
  mixins: [mixin({ fetchListFunction: accountList })],
  watch: {
    $route: {
      handler() {
        console.log(1111)
        this.getPath()
        //深度监听，同时也可监听到param参数变化
      },
      deep: true,
    },
  },
  data() {
    this.rules = {
      password: [{ required: true, message: '请输入密码' }],
    }

    return {
      query: {
        pageSize: 10,
        timeType: 0,
        searchType: 0,
        roleId: this.$route.query.id ?? '',
        deptId: this.$route.query.deptId ?? '',
        titleId: this.$route.query.titleId ?? '',
        examineState: this.$route.query.examineState ?? '',
        deptOuterId: this.$route.query.deptOuterId ?? '',
      },

      resetDialog: {
        visible: false,
        loading: false,
        account: '',
        model: {
          id: '',
          password: '',
        },
      },

      importDialog: {
        visible: false,
        fileList: [],
      },
    }
  },
  computed: {
    account() {
      return this.$store.state.user.account
    },
    filter() {
      return {
        date: {
          props: {
            options: [
              { label: '创建时间', value: 0 },
              { label: '最后登录时间', value: 1 },
              { label: '认证时间', value: 2 },
              { label: '实名时间', value: 3 },
            ],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '姓名', value: 0 },
              { label: '工号', value: 1 },
              { label: '员工账号', value: 2 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '账号类型',
              options: [
                { label: '不限', value: '' },
                { label: '医生', value: 'DOCTOR' },
                { label: '药师', value: 'DRUGER' },
                { label: '护士', value: 'NURSE' },
                { label: '其他', value: 'OTHER' },
              ],
            },
            keys: 'employeeType',
          },
          {
            props: {
              label: '账号身份',
              options: [
                { label: '不限', value: '' },
                ...pre.role.map(_ => ({ label: _.name, value: _.id })),
              ],
            },
            keys: 'roleId',
          },
          {
            props: {
              label: '性别',
              options: [
                { label: '不限', value: '' },
                { label: '男', value: '1' },
                { label: '女', value: '0' },
              ],
            },
            keys: 'sex',
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
              label: '默认科室',
              options: [
                { label: '不限', value: '' },
                ...pre.dept.map(_ => ({ label: _.name, value: _.id })),
              ],
            },
            keys: 'defDeptId',
          },
          // {
          //   props: {
          //     label: '药房',
          //     options: [
          //       { label: '不限', value: '' },
          //       ...pre.store.map(_ => ({ label: _.name, value: _.id })),
          //     ],
          //   },
          //   keys: 'storeId',
          // },
          {
            props: {
              label: '职称',
              options: [
                { label: '不限', value: '' },
                ...pre.title.map(_ => ({ label: _.name, value: _.id })),
              ],
            },
            keys: 'titleId',
          },
          {
            props: {
              label: '是否推荐',
              options: [
                { label: '不限', value: '' },
                { label: '是', value: true },
                { label: '否', value: false },
              ],
            },
            keys: 'recommend',
          },

          {
            props: {
              label: '帐号状态',
              options: [
                { label: '不限', value: '' },
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
                { label: '停用', value: 2 },
              ],
            },
            keys: 'userState',
          },
          {
            props: {
              label: '业务配置自定义',
              options: [
                { label: '不限', value: '' },
                { label: '启用', value: true },
                { label: '禁用', value: false },
              ],
            },
            keys: 'business',
          },
          {
            props: {
              label: '实名认证',
              options: [
                { label: '不限', value: '' },
                { label: '是', value: true },
                { label: '否', value: false },
              ],
            },
            keys: 'auth',
          },
          {
            props: {
              label: '资质认证',
              options: [
                { label: '不限', value: '' },
                { label: '待确认', value: 'TO_CONFIRM' },
                { label: '是', value: 'SUCCESS' },
                { label: '否', value: 'FAIL' },
                { label: '待审核', value: 'TO_EXAMINE' },
              ],
            },
            keys: 'examineState',
          },
          // {
          //   props: {
          //     label: '业务范围',
          //     options: [
          //       { label: '不限', value: '' },
          //       { label: '在线咨询', value: 'CONSULT' },
          //       { label: '在线复诊', value: 'REPEAT_CLINIC' },
          //       { label: '慢病续方', value: 'CARRYON_PRESC' },
          //     ],
          //   },
          //   keys: 'businessType',
          // },
          // {
          //   props: {
          //     label: '业务范围',
          //     options: [
          //       { label: '不限', value: '' },
          //       { label: '图文', value: 'GRAPHIC' },
          //       { label: '视频', value: 'VIDEO' },
          //       { label: '电话', value: 'PHONE' },
          //     ],
          //   },
          //   keys: 'consultType',
          // },
          {
            props: {
              label: '业务范围',
              options: [
                { label: '不限', value: '+' },
                { label: '在线咨询（图文）', value: 'CONSULT+GRAPHIC' },
                { label: '在线复诊（图文）', value: 'REPEAT_CLINIC+GRAPHIC' },
                { label: '在线复诊（视频）', value: 'REPEAT_CLINIC+VIDEO' },
                { label: '慢病续方（图文）', value: 'CARRYON_PRESC+GRAPHIC' },
              ],
            },
            keys: 'businessType+consultType',
          },
          {
            props: {
              label: '诊疗次数',
              is: 'InputRange',
            },
            keys: ['diagNumStart', 'diagNumEnd'],
          },
          {
            props: {
              label: '评分',
              is: 'InputRange',
            },
            keys: ['scoreStart', 'scoreEnd'],
          },
        ],
      }
    },
    columns() {
      return {
        index: {
          hidden: true,
        },
        workNo: {
          label: '工号',
        },
        employeeType: {
          formatter(row) {
            return row.employeeType === 'DOCTOR'
              ? '医生'
              : row.employeeType === 'DRUGER'
              ? '药师'
              : row.employeeType === 'NURSE'
              ? '护士'
              : row.employeeType === 'OTHER'
              ? '其他'
              : ''
          },
          minWidth: 100,
        },
        star: {
          prop: 'slot_star',
          minWidth: 100,
        },
        diagNum: { minWidth: 100 },
        account: { minWidth: 100 },
        roleName: { minWidth: 100 },
        deptName: { minWidth: 100 },
        recommend: {
          prop: 'slot_recommend',
          minWidth: 100,
        },
        state: {
          prop: 'slot_state',
          minWidth: 160,
        },
        userState: {
          prop: 'slot_state',
          minWidth: 160,
        },
        business: {
          prop: 'slot_business',
          minWidth: 140,
        },
        auth: {
          formatter(row) {
            return row.auth ? '是' : '否'
          },
          minWidth: 100,
        },
        examineState: {
          formatter(row) {
            return row.examineState === 'TO_CONFIRM'
              ? '待确认'
              : row.examineState === 'SUCCESS'
              ? '是'
              : row.examineState === 'FAIL'
              ? '否'
              : row.examineState === 'TO_EXAMINE'
              ? '待审核'
              : row.examineState === 'TO_DOWN'
              ? '否'
              : ''
          },
          minWidth: 100,
        },
        businessArea: {
          formatter(row) {
            return Array.isArray(row.businessArea)
              ? row.businessArea
                  .map(
                    _ =>
                      `${
                        _.bizType === 'CONSULT'
                          ? '在线咨询'
                          : _.bizType === 'REPEAT_CLINIC'
                          ? '在线复诊'
                          : _.bizType === 'CARRYON_PRESC'
                          ? '慢病续方'
                          : ''
                      }（${
                        _.bizWay === 'GRAPHIC'
                          ? '图文'
                          : _.bizWay === 'VIDEO'
                          ? '视频'
                          : _.bizWay === 'PHONE'
                          ? '电话'
                          : ''
                      }）`,
                  )
                  .join(', ')
              : row.businessArea
          },
          minWidth: 100,
        },
        businessType: {
          formatter(row) {
            return row.businessType === 'CONSULT'
              ? '在线咨询'
              : row.businessType === 'REPEAT_CLINIC'
              ? '在线复诊'
              : row.businessType === 'CARRYON_PRESC'
              ? '慢病续方'
              : ''
          },
        },
        consultType: {
          formatter(row) {
            return row.consultType === 'GRAPHIC'
              ? '图文'
              : row.consultType === 'VIDEO'
              ? '视频'
              : row.consultType === 'PHONE'
              ? '电话'
              : ''
          },
        },
        seq: {
          prop: 'slot_seq',
          minWidth: 160,
        },
        createTime: {
          minWidth: 160,
        },
        lastLoginTime: {
          label: '最后登录时间',
          minWidth: 160,
        },
        fixed: {
          minWidth: 260,
        },
      }
    },
  },
  async beforeRouteEnter(to, from, next) {
    ;[pre.role, pre.dept, pre.store, pre.title] = await Promise.all([
      roleChooseList({ showUser: true }),
      deptChooseList({ tree: false }),
      drugStoreChooseList({ filter: false }),
      titleChooseList(),
    ])
    next()
  },
  // activated() {
  //   if (this.$route.query?.flag == 1) {
  //     this.query = {
  //       pageSize: 10,
  //       timeType: 0,
  //       searchType: 0,
  //       roleId: this.$route.query.id ?? '',
  //       deptId: this.$route.query.deptId ?? '',
  //       titleId: this.$route.query.titleId ?? '',
  //       examineState: this.$route.query.examineState ?? '',
  //     }
  //     this.$_fetchTableData()
  //   }
  // },
  methods: {
    getPath() {
      let routeQuery = this.$route.query
      // console.log(routeQuery)
      Object.entries(routeQuery).forEach(([key, value]) => {
        if (key in this.query && this.query[key] != value) {
          this.query = {
            pageSize: 10,
            timeType: 0,
            searchType: 0,
            currentNum: 1,
            roleId: this.$route.query.id ?? '',
            deptId: this.$route.query.deptId ?? '',
            titleId: this.$route.query.titleId ?? '',
            examineState: this.$route.query.examineState ?? '',
            deptOuterId: this.$route.query.deptOuterId ?? '',
          }
          this.$_fetchTableData()
        }
      })
      if (this.$route.query?.flag == 1) {
        this.$_fetchTableData()
      }
    },
    handleCommand(command) {
      if (command !== 'query' && this.tableData.multipleSelection.length < 1) {
        this.$message({
          type: 'warning',
          message: '请先勾选需要处理的数据',
          showClose: true,
        })
        return
      }

      switch (command) {
        case 'abc':
          {
            console.log('的彼得德比地')
          }
          break
      }
    },

    async resolveSortChange(seq, { id }) {
      await accountChangeOrder({ id, seq })

      this.$message({
        type: 'success',
        message: '完成',
        showClose: true,
      })

      this.$_fetchTableData()
    },

    async handleChange(state, { id }, index, tag) {
      if (state == 1) {
        state = true
      }
      if (tag == 'state') {
        this.tableData.list[index].userState = state ? 1 : false
      }
      await (tag === 'recommend'
        ? accountChangeRecommend
        : tag === 'state'
        ? accountChangeState
        : tag == 'star'
        ? updateChangeStar
        : updateAccountBizState)(
        tag === 'recommend'
          ? { id, recommend: state }
          : tag === 'state'
          ? { id, state: state }
          : tag == 'star'
          ? { id, star: state }
          : { docId: id, custom: state ? 1 : '0' },
      ).catch(err => {
        this.tableData.list[index][tag] = !state
        throw Error(err)
      })
      this.$_fetchTableData()
      // this.tableData.list[index][tag] = state

      let tip =
        tag == 'state'
          ? state
            ? '帐号启用成功'
            : '帐号禁用成功'
          : tag == 'recommend'
          ? state
            ? '推荐成功'
            : '已取消推荐'
          : tag == 'business' || tag == 'star'
          ? state
            ? '开启成功'
            : '关闭成功'
          : tag == 'star'
          ? state
            ? '设置成功'
            : ''
          : ''
      this.$message({
        type: 'success',
        message: tip,
        showClose: true,
      })
    },
    submit(formName) {
      this.$refs[formName].validate(async (valid, invalidFields) => {
        if (valid) {
          this.resetDialog.loading = true
          await accountResetPassword(this.resetDialog.model).finally(() =>
            setTimeout(() => (this.resetDialog.loading = false), 200),
          )

          console.log(this.account)
          if (this.account == this.resetDialog.account) {
            await this.$store.dispatch('user/logout')
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            this.$message({
              type: 'success',
              message: '修改成功，请重新登录',
              showClose: true,
            })
          } else {
            this.$message({
              type: 'success',
              message: '完成',
              showClose: true,
            })
          }
          this.resetDialog.visible = false
        } else {
          invalidFieldSetFocus(this.$refs[formName], invalidFields)
        }
      })
    },

    handleClosed(formName) {
      this.$refs[formName].resetFields()
    },

    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    beforeUpload(file) {
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isPNG) {
        this.$message.error('上传头像图片只能是 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isPNG && isLt2M
    },
    httpRequest({ file, onProgress, onSuccess, onError }) {
      const formData = new FormData()
      formData.append('file', file)
      Promise.resove(formData, onProgress)
        .then(onSuccess)
        .catch(onError)
        .finally(() => {
          this.importDialog.loading = false
        })
    },
  },
}
</script>
