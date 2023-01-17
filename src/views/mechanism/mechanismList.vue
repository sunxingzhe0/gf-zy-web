<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:footertool>
        <el-button size="mini" type="primary" @click="showDialog">
          新增机构
        </el-button>
      </template>
      <template v-slot:slot_state="{ row }">
        <el-switch
          v-model="row.state"
          @change="setEnable(row)"
          active-text="启用"
          inactive-text="禁用"
          :width="50"
          class="textSwitch"
        >
        </el-switch>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button size="mini" type="text" @click="edit(row)"> 编辑 </el-button>
        <el-button
          size="mini"
          type="text"
          @click="
            ;(resetDialog.visible = true),
              (resetDialog.model.id = row.id),
              (resetDialog.account = row.account)
          "
        >
          重置密码
        </el-button>
      </template>
    </List>
    <!-- 新增or编辑 -->
    <el-dialog
      :title="dialog.isAdd ? '新增机构' : `编辑机构`"
      :visible.sync="dialog.visible"
      append-to-body
      custom-class="component__dialog"
      @closed="handleClosed('editForm')"
    >
      <!-- 表单项 -->
      <el-form
        :model="editForm"
        :rules="rules"
        label-width="100px"
        ref="editForm"
      >
        <el-form-item label="机构头像" prop="logo" ref="imgItem">
          <div class="uploadImg">
            <el-image
              v-if="editForm.logo"
              :src="FILE_URL(editForm.logo)"
              class="avatar_round"
            >
            </el-image>
            <el-upload
              class="upload"
              action
              :limit="3"
              :show-file-list="false"
              :http-request="httpRequest"
              :before-upload="beforeAvatarUpload"
              :on-success="avaterChange"
            >
              <el-button size="mini" type="primary">上传</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="机构名称" prop="orgName">
          <el-input
            v-model="editForm.orgName"
            placeholder="请输入机构名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="机构Id" prop="platOrgId">
          <el-input
            v-model="editForm.platOrgId"
            placeholder="请输入机构Id"
            :disabled="!dialog.isAdd"
          ></el-input>
        </el-form-item>
        <el-form-item label="机构属性" prop="orgAtt" v-if="dialog.isAdd">
          <el-radio-group v-model="editForm.orgAtt">
            <el-radio label="HOSPITAL">医院</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="机构地址" prop="addressIds">
          <el-cascader
            v-model="editForm.addressIds"
            :options="options"
            @change="addressChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="" prop="address">
          <el-input
            v-model="editForm.address"
            placeholder="请输入详细地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contactName" v-if="!dialog.isAdd">
          <el-input
            v-model="editForm.contactName"
            placeholder="请输入联系人"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone" v-if="!dialog.isAdd">
          <el-input
            v-model="editForm.contactPhone"
            placeholder="请输入联系电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="管理员工号" prop="workNo" v-if="false">
          <el-input
            v-model="editForm.workNo"
            placeholder="请输入联系电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="account" v-if="dialog.isAdd">
          <el-input
            v-model="editForm.account"
            placeholder="请输入账号名称，一旦确认，不可修改"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password" v-if="dialog.isAdd">
          <el-input
            v-model="editForm.password"
            placeholder="请设置登录密码，6-18位，仅限字母、阿拉伯数字"
          ></el-input>
        </el-form-item>
        <el-form-item label="机构介绍" prop="intro" v-if="!dialog.isAdd">
          <el-input
            v-model="editForm.intro"
            placeholder="请输入内容"
            type="textarea"
            class="text"
          ></el-input>
        </el-form-item>
        <el-form-item label="账号状态" prop="userState" v-if="dialog.isAdd">
          <el-radio-group v-model="editForm.userState">
            <el-radio label="true">启用</el-radio>
            <el-radio label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <div class="is-center">
          <el-button size="mini" @click="dialog.visible = false">
            取消
          </el-button>
          <el-button
            size="mini"
            type="primary"
            :loading="dialog.loading"
            @click="submit(dialog.isAdd)"
          >
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 重置密码 -->
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
            placeholder="请输入8-16位密码，包含大小写字母、数字、特殊字符"
          ></el-input>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <div class="is-center">
          <el-button size="small" @click="resetDialog.visible = false">
            取消
          </el-button>
          <el-button size="small" type="primary" @click="resetConfirm('form')">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script>
import { invalidFieldSetFocus } from '@/utils'
import { isPassword } from '@/utils/validate'
import { List, mixin /* EditableText */ } from '@/components'
//地名
import {
  regionData,
  CodeToText /* TextToCode */,
} from 'element-china-area-data'
import { uploadFile } from '@/api'
import {
  initOrg,
  mechanismList,
  changeState,
  editInfo,
  getInfo,
} from '@/api/mechanismList'
import { accountResetPassword } from '@/api/authority'
import CryptoJS from 'crypto-js'
export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: mechanismList }])],
  data() {
    const validatePassword = (rule, value, callback) => {
      // const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,16}/
      if (!isPassword(value)) {
        callback(new Error('请输入8-16位密码，包含大小写字母、数字、特殊字符'))
      } else {
        callback()
      }
      // callback()
    }
    return {
      resetDialog: {
        visible: false,
        account: '',
        model: {
          id: '',
          password: '',
        },
      },
      //地址数据
      options: regionData,
      //表单数据
      editForm: {
        addressIds: [], //地址列表编码
        orgName: '', //机构名称
        platOrgId: '', //机构id
        orgAtt: 'HOSPITAL', //机构属性
        account: '', //	管理员账号
        password: '', //密码
        contactName: '', //联系人姓名
        contactPhone: '', //联系人姓名
        name: '', //管理员名
        workNo: '', //管理员工号
        logo: '', //机构logo
        province: '', //省
        city: '', //市
        area: '', //区/县
        address: '', //详细地址
        intro: '', //机构介绍
        userState: true, //账号状态
      },
      //验证规则
      rules: {
        logo: [{ required: true, message: '请上传头像', trigger: 'change' }],
        orgName: [{ required: true, message: '请输入机构名', trigger: 'blur' }],
        platOrgId: [
          { required: true, message: '请输入机构Id', trigger: 'blur' },
        ],
        orgAtt: [{ required: true, message: '请选择属性', trigger: 'change' }],
        addressIds: [
          { required: true, message: '请选择地址', trigger: 'change' },
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
        contactName: [
          { required: false, message: '请输入联系人', trigger: 'blur' },
        ],
        contactPhone: [
          { required: false, message: '请输入联系电话', trigger: 'blur' },
        ],
        workNo: [{ required: false, message: '请输入工号', trigger: 'blur' }],
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword },
        ],
        userState: [
          { required: true, message: '请选择账号状态', trigger: 'change' },
        ],
      },
      //请求参数
      query: {
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
      },
      //弹窗数据
      dialog: {
        visible: false,
        isAdd: true,
        model: {
          content: '',
        },
        user: '',
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
            options: [{ label: '创建时间', value: 0 }],
          },
          keys: ['dateType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [{ label: '机构名称', value: 0 }],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '测试',
              options: [{ label: '不限', value: '' }],
            },
            keys: 'a',
          },
          {
            props: {
              label: '测试',
              is: 'el-input',
            },
            data: {
              attrs: {
                placeholder: '请输入内容',
              },
              on: {
                change: console.log,
              },
            },
            keys: 'b',
          },
        ],
      }
    },
    columns() {
      return {
        fixed: {
          minWidth: 100,
        },
        index: {
          hidden: true,
        },
        state: {
          label: '状态',
          prop: 'slot_state',
          minWidth: 100,
        },
        createTime: {
          minWidth: 160,
        },
      }
    },
  },
  methods: {
    resetConfirm(formName) {
      this.$refs[formName].validate(async (valid, invalidFields) => {
        if (valid) {
          this.resetDialog.loading = true
          //加密
          this.resetDialog.model.password = CryptoJS.MD5(
            this.resetDialog.model.password,
          ).toString()
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
    //上传前-图片大小限制
    beforeAvatarUpload(file) {
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
    // 处理上传的事件函数
    httpRequest({ file, onProgress, onSuccess, onError }) {
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData, onProgress).then(onSuccess).catch(onError)
    },
    //头像上传成功回调
    avaterChange(res) {
      console.log(res)
      this.editForm.logo = res
      this.$refs.imgItem.resetField()
      this.$set(this.editForm, 'logo', res)
    },
    showDialog() {
      this.dialog.visible = true
      this.dialog.isAdd = true
    },
    async edit(row) {
      this.dialog.visible = true
      this.dialog.isAdd = false
      //获取机构详情
      const res = await getInfo({ id: row.id })
      this.editForm = res
    },
    //选择地址时
    addressChange(e) {
      console.log(e, '地址编号')
      let province = CodeToText[e[0]]
      let city = CodeToText[e[1]]
      let area = CodeToText[e[2]]
      if (province !== undefined) {
        this.editForm.city = province + '/'
      }
      if (city !== undefined) {
        this.editForm.city += city + '/'
      }
      if (area !== undefined) {
        this.editForm.city += area
      }
      //地址列表
      const addressIds = {
        province,
        city,
        area,
      }
      Object.assign(this.editForm, addressIds)
    },
    // 变更启用状态
    async setEnable(row) {
      console.log(row)
      await changeState({
        id: row.id,
        state: row.state,
      })
      // this.$_fetchTableData(deptOuterList)
      this.$message.success(row.state ? '启用成功!' : '禁用成功')
      /*    //变更后重新获取列表
      if (row.level == 1) {
        this.getDeptList()
      } */
    },

    //取消
    handleClosed(formName) {
      this.$refs[formName].resetFields()
    },
    //确认
    submit(status) {
      console.log(status)
      // return
      this.$refs.editForm.validate(async valid => {
        if (!valid) {
          return
        }
        console.log(this.editForm, '参数')
        if (status) {
          //新增
          await initOrg(this.editForm)
          this.$message.success('操作成功！')
        } else {
          //编辑
          await editInfo(this.editForm)
          this.$message.success('操作成功！')
        }
        this.dialog.visible = false
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.avatar_round {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.el-input {
  width: 90%;
}
.el-cascader {
  width: 90%;
}
.text {
  width: 90%;
}
.uploadImg {
  display: flex;
  .upload {
    margin-left: 10px;
    display: flex;
    align-items: center;
  }
}
</style>
