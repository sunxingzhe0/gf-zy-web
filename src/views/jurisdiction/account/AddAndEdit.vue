<template>
  <el-tabs v-if="id" v-model="activeName" type="border-card">
    <el-form ref="basicForm" :model="model" :rules="rules" label-width="120px">
      <h3 class="view__title">个人信息</h3>

      <el-form-item label="头像" prop="avatar">
        <el-image
          style="
            width: 100px;
            height: 100px;
            border-radius: 50%;
            vertical-align: bottom;
            overflow: hidden;
            text-align: center;
          "
          fit="cover"
          :src="FILE_URL(model.avatar)"
        >
          <template #error>
            <img src="@/assets/headerImg.png" alt="" />
            <!-- <i
                class="el-icon-user-solid"
                style="font-size: 60px; line-height: 100px;"
              ></i> -->
          </template>
        </el-image>

        <el-upload
          style="display: inline-block"
          action
          :show-file-list="false"
          :disabled="platformAccount"
          accept="image/png, image/jpeg, image/gif, image/webp"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeImageUpload"
          :http-request="httpRequestAvtar"
        >
          <el-button size="small" type="primary" :disabled="platformAccount"
            >选择照片</el-button
          >
          <el-button
            size="small"
            @click.stop="deleteAvatar"
            type="danger"
            :disabled="platformAccount"
            >删除</el-button
          >
        </el-upload>
      </el-form-item>

      <el-form-item label="登录账号" prop="account">
        {{ model.account }}
      </el-form-item>

      <el-row class="view__content" :gutter="20">
        <el-col :md="12">
          <el-form-item label="账号角色" prop="role">
            <div
              style="margin-left: -10px; overflow: hidden"
              v-show="model.roleId.length"
            >
              <el-tag
                style="margin: 0 0 10px 10px"
                v-for="{ name, id } in roles4Tag"
                :key="id"
                :closable="!oldEditInfo.authInfoLock"
                @close="handleClose(id)"
              >
                {{ name }}
              </el-tag>
            </div>

            <el-select
              v-show="showSelect"
              v-model="model.roleId"
              :disabled="platformAccount || oldEditInfo.authInfoLock"
              multiple
              filterable
            >
              <el-option
                v-for="{ name, id } in roles"
                :key="id"
                :label="name"
                :value="id"
              ></el-option>
            </el-select>

            <el-button
              v-show="!showSelect"
              icon="el-icon-plus"
              type="text"
              :disabled="platformAccount || oldEditInfo.authInfoLock"
              @click="showSelect = true"
            >
              添加
            </el-button>
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
            <!-- <el-select
                style="width: 100%;"
                v-model="model.workHistory"
                filterable
              ></el-select> -->
          </el-form-item>
        </el-col>

        <el-col :md="12">
          <el-form-item label="账号类型" prop="type">
            <el-radio-group v-model="model.type">
              <el-radio
                v-for="{ label, text } in accountType"
                :key="label"
                :label="label"
              >
                {{ text }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="model.name"
              :disabled="platformAccount || oldEditInfo.authInfoLock"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="性别">
            <el-select
              style="width: 100%"
              v-model="model.sex"
              :disabled="platformAccount || oldEditInfo.authInfoLock"
            >
              <el-option label="女" :value="0"></el-option>
              <el-option label="男" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="身份证">
            <el-input
              v-model="model.idCard"
              :disabled="platformAccount"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="model.phone"
              :disabled="platformAccount"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :md="12">
          <el-form-item label="任职医院">
            <el-select disabled style="width: 100%" :value="orgName" filterable>
              <el-option :label="orgName" :value="orgName"></el-option>
            </el-select>
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
          <el-form-item label="工号" prop="workNo">
            <el-input
              v-model="model.workNo"
              :disabled="platformAccount"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :md="12">
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="model.mail"></el-input>
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
              :disabled="platformAccount || oldEditInfo.authInfoLock"
              @change="setDefaultDept"
            >
              <el-option
                v-for="{ id, name } in pre.dept"
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
            <el-select
              style="width: 100%"
              v-model="model.defDeptId"
              filterable
              :disabled="platformAccount || oldEditInfo.authInfoLock"
            >
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
            label="药房"
            :prop="model.type === 'OTHER' ? '' : 'storeId'"
          >
            <el-select
              style="width: 100%"
              v-model="model.storeId"
              @change="changeStore"
              filterable
              multiple
            >
              <el-option
                v-for="{ id, name } in pre.store"
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
            <el-select
              style="width: 100%"
              v-model="model.titleId"
              filterable
              :disabled="platformAccount"
            >
              <el-option
                v-for="{ id, name } in pre.title"
                :key="id"
                :label="name"
                :value="id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :md="12">
          <el-form-item label="职务">
            <el-select
              style="width: 100%"
              v-model="model.dutyType"
              filterable
              :disabled="platformAccount"
            >
              <el-option
                v-for="{ value, label } in post"
                :key="value"
                :label="label"
                :value="value"
              ></el-option
            ></el-select>
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
      <h3 class="view__title">业务设置</h3>
      <Business
        ref="business"
        :doctorId="id"
        :defDeptId="model.defDeptId"
        :titleId="model.titleId"
      />
      <EditFooter class="is-center" style="z-index: 10">
        <el-button
          type="primary"
          :loading="loading"
          @click="submit('basicForm')"
        >
          保存
        </el-button>
      </EditFooter>
    </el-form>
    <!-- *************************** -->
  </el-tabs>
  <!-- 编辑结束 -->

  <!-- 新增开始 -->
  <el-form
    v-else
    ref="form"
    class="view__card"
    :model="model"
    :rules="rules"
    label-width="120px"
  >
    <el-form-item label="头像" prop="avatar">
      <el-image
        style="
          width: 100px;
          height: 100px;
          border-radius: 50%;
          vertical-align: bottom;
          overflow: hidden;
          text-align: center;
        "
        fit="cover"
        :src="FILE_URL(model.avatar)"
      >
        <template #error>
          <img src="@/assets/headerImg.png" alt="" />
          <!-- <i
            class="el-icon-user-solid"
            style="font-size: 60px; line-height: 100px;"
          ></i> -->
        </template>
      </el-image>

      <el-upload
        style="display: inline-block"
        action
        :show-file-list="false"
        accept="image/png, image/jpeg, image/gif, image/webp"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeImageUpload"
        :http-request="httpRequestAvtar"
      >
        <el-button size="small" type="primary">选择照片</el-button>
        <el-button size="small" @click.stop="deleteAvatar" type="danger"
          >删除</el-button
        >
      </el-upload>
    </el-form-item>

    <el-form-item label="账号类型" prop="type">
      <el-radio-group v-model="model.type">
        <el-radio
          v-for="{ label, text } in accountType"
          :key="label"
          :label="label"
        >
          {{ text }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="账号角色" prop="role">
      <div
        style="margin-left: -10px; overflow: hidden"
        v-show="model.roleId.length"
      >
        <el-tag
          style="margin: 0 0 10px 10px"
          v-for="{ name, id } in roles4Tag"
          :key="id"
          closable
          @close="handleClose(id)"
        >
          {{ name }}
        </el-tag>
      </div>

      <el-select v-show="showSelect" v-model="model.roleId" filterable multiple>
        <el-option
          v-for="{ name, id } in roles"
          :key="id"
          :label="name"
          :value="id"
        ></el-option>
      </el-select>

      <el-button
        v-show="!showSelect"
        icon="el-icon-plus"
        type="text"
        @click="showSelect = true"
      >
        添加
      </el-button>
    </el-form-item>

    <el-row class="view__content" :gutter="20">
      <el-col :md="12">
        <el-form-item label="登录帐号" prop="account">
          <el-input v-model="model.account"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="登录密码" prop="password">
          <el-input
            placeholder="请输入8-16位密码，包含大小写字母、数字、特殊字符"
            type="password"
            v-model="model.password"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="确认密码" prop="rePassword">
          <el-input type="password" v-model="model.rePassword"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="性别">
          <el-select style="width: 100%" v-model="model.sex">
            <el-option label="女" value="0"></el-option>
            <el-option label="男" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="手机号">
          <el-input v-model="model.phone"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="身份证">
          <el-input v-model="model.idCard"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="工号" prop="workNo">
          <el-input v-model="model.workNo"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="任职医院">
          <el-select disabled style="width: 100%" :value="orgName" filterable>
            <el-option :label="orgName" :value="orgName"></el-option>
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
              v-for="{ id, name } in pre.dept"
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
          label="药房"
          :prop="model.type === 'OTHER' ? '' : 'storeId'"
        >
          <el-select
            style="width: 100%"
            v-model="model.storeId"
            @change="changeStore"
            filterable
            multiple
          >
            <el-option
              v-for="{ id, name } in pre.store"
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
              v-for="{ id, name } in pre.title"
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
        <el-form-item label="从业年限">
          <el-date-picker
            v-model="model.workHistory"
            type="date"
            style="width: 100%"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
          <!-- <el-select
            style="width: 100%;"
            v-model="model.workHistory"
            filterable
          ></el-select> -->
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
        <el-form-item label="邮箱">
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
    <!-- <h3 class="view__title">业务设置</h3>
    <Business
      ref="business"
      :doctorId="id"
      :defDeptId="model.defDeptId"
      :titleId="model.titleId"
    /> -->
    <EditFooter class="is-center">
      <el-button type="primary" :loading="loading" @click="submit('form')">
        提交
      </el-button>
    </EditFooter>
  </el-form>
</template>

<script>
import { mapState } from 'vuex'
import { EditFooter } from '@/components'
import { Business } from './components'
import { invalidFieldSetFocus } from '@/utils'
import {
  validEmail,
  // isAccount,
  isPassword,
  isPhoneNumber,
  // isIDNumber,
} from '@/utils/validate'

import {
  accountGet,
  accountInsert,
  accountEdit,
  accountResetExamine,
  accountResetAuth,
  accountResetPhoneBind,
} from '@/api/authority'
import { compressImg } from '@/utils/compress'
import {
  uploadFile,
  roleChooseList,
  deptChooseList,
  drugStoreChooseList,
  titleChooseList,
} from '@/api'
import CryptoJS from 'crypto-js'
// import { jsonp } from 'vue-jsonp'
const pre = {
  info: {},
  roles: [],
  dept: [],
  store: [],
  post: [],
}

export default {
  name: 'AccountEdit',
  props: {
    id: String,
  },
  components: {
    EditFooter,
    Business,
  },
  data() {
    // beforeRouteEnter fetch data
    this.pre = pre
    this.post = [
      { label: '护理', value: 'NURSE' },
      { label: '药学', value: 'MEDICINE' },
      { label: '中药学', value: 'CHINESE_MEDICINE' },
      { label: '检验', value: 'CHECKOUT' },
      { label: '放射', value: 'RADIATE' },
      { label: '医师', value: 'PHYSICIAN' },
      { label: '康复技师', value: 'REHABILITATION_TECHNICIAN' },
    ]
    this.accountType = [
      { label: 'DOCTOR', text: '医生' },
      { label: 'DRUGER', text: '药师' },
      { label: 'NURSE', text: '护士' },
      { label: 'XZ', text: '咨询师' },
      { label: 'OTHER', text: '其他' },
    ]

    // const validateAccount = (rule, value, callback) => {
    //   if (!this.model.id && !isAccount(value)) {
    //     callback(new Error('帐号格式有误'))
    //   } else {
    //     callback()
    //   }
    // }

    const validatePassword = (rule, value, callback) => {
      // const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,16}/
      if (!isPassword(value)) {
        callback(new Error('请输入8-16位密码，包含大小写字母、数字、特殊字符'))
      } else {
        callback()
      }
    }

    const validateRePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.model.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    const validatePhone = (rule, value, callback) => {
      if (value && !isPhoneNumber(value)) {
        callback(new Error('手机号格式有误'))
      } else {
        callback()
      }
    }

    // const validateID = (rule, value, callback) => {
    //   if (value !== '' && !isIDNumber(value)) {
    //     callback(new Error('身份证格式有误'))
    //   } else {
    //     callback()
    //   }
    // }

    const validateEmail = (rule, value, callback) => {
      if (value && !validEmail(value)) {
        callback(new Error('邮箱格式有误'))
      } else {
        callback()
      }
    }

    this.rules = {
      type: [{ required: true, message: '请选择', trigger: 'blur' }],
      deptId: [{ required: true, message: '请选择', trigger: 'blur' }],
      defDeptId: [{ required: true, message: '请选择', trigger: 'change' }],
      account: [
        { required: true, message: '请输入', trigger: 'blur' },
        // { validator: validateAccount, trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入', trigger: 'blur' },
        { validator: validatePassword, trigger: 'blur' },
      ],
      rePassword: [
        { required: true, validator: validateRePass, trigger: 'blur' },
      ],
      sex: [{ required: true, message: '请选择', trigger: 'change' }],
      // defDeptId: [
      //   { required: true, trigger: 'blur', message: '请选择默认科室' },
      // ],
      name: [{ required: true, message: '请输入', trigger: 'blur' }],
      phone: [{ validator: validatePhone, required: false, trigger: 'blur' }],
      // idCard: [{ validator: validateID, trigger: 'blur' }],
      workNo: [{ required: true, message: '请输入', trigger: 'blur' }],
      storeId: [{ required: true, message: '请输入', trigger: 'blur' }],
      titleId: [{ required: true, message: '请选择', trigger: 'change' }],
      inHospital: [{ required: true, message: '请输入', trigger: 'blur' }],
      recommend: [{ required: true, message: '请输入', trigger: 'blur' }],
      star: [{ required: true, message: '请输入', trigger: 'blur' }],
      mail: [{ validator: validateEmail, required: false, trigger: 'blur' }],
      skilled: [{ required: true, message: '请输入', trigger: 'blur' }],
      intro: [{ required: true, message: '请输入', trigger: 'blur' }],
      practiceInfo: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
      academicInfo: [{ required: true, message: '请输入', trigger: 'blur' }],
      practiceArea: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
    }
    this.certificateEnum = {
      DRUG: '药师资格证',
      PHYS_QUAL: '医师资格证',
      DOCTOR_QUAL: '医师执业证',
      NURSE: '护士执业证',
      TECH: '专业技术资格证',
    }
    this.certificateExampleImg = require('@/assets/certificate-example.png')

    return {
      activeName: 'basic',
      show: false,
      show1: false,
      showSelect: false,
      roles: pre.roles,
      oldEditInfo: {},
      loading: false,
      model: {
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
        ...pre.info,
      },
      beforeDeptId: ['0'],
      beforeStoreId: [],
      certificate: pre.info.certs?.map(({ type }) => type) ?? [],
      // 从业年限日期限制
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        },
      },
    }
  },
  computed: {
    ...mapState('user', ['orgName']),
    isEdit() {
      return !!this.id
    },
    roles4Tag() {
      return this.roles.filter(({ id }) => this.model.roleId.includes(id))
    },
    dept4default() {
      return pre.dept.filter(({ id }) => this.model.deptId.includes(id))
    },
    platformAccount() {
      return this.model.source === 'MH'
    },
  },
  async beforeRouteEnter(to, from, next) {
    const { id } = to.params

    ;[pre.info, pre.roles, pre.dept, pre.store, pre.title] = await Promise.all([
      id ? accountGet({ id }) : {},
      roleChooseList({ showUser: false }),
      deptChooseList({ tree: false }).then(data => [
        { id: '0', name: '暂无' },
        ...data,
      ]),
      drugStoreChooseList({ filter: false }).then(data => [
        { id: '0', name: '暂无' },
        ...data,
      ]),
      titleChooseList(),
    ])
    if (id) {
      if (pre.info.deptId.length == 0) {
        pre.info.deptId = ['0']
        pre.info.defDeptId = '0'
      }
      if (pre.info.storeId.length == 0) {
        pre.info.storeId = ['0']
      }
    }
    //----------筛选新增匹配值
    console.log(pre)
    const deptsIds = pre.dept.map(i => i.id)
    if (pre.info.deptInfo) {
      pre.info.deptInfo.forEach(i => {
        if (!deptsIds.includes(i.id)) {
          pre.dept.push(i)
        }
      })
    }

    //____________
    next()
  },
  created() {
    if (this.model.idCard) {
      this.show = true
      this.show1 = true
    }
    this.$route.params.id && this.getoldEditInfo()
  },
  methods: {
    async getoldEditInfo() {
      this.oldEditInfo = await accountGet({ id: this.$route.params.id })
    },
    clear(type) {
      ;(type == 'phone' ? accountResetPhoneBind : accountResetAuth)({
        id: this.id,
      })
        .then(async () => {
          this.$message({
            type: 'success',
            message: '重置成功!',
          })
          console.log(this.$route)
          let getInfo = await accountGet({ id: this.$route.params.id })
          if (type == 'phone') {
            this.model.phone = ''
            this.model.phone = getInfo.phone
          } else {
            this.model.idCard = ''
            this.model.idCard = getInfo.idCard
          }
        })
        .catch(err => {
          this.$message({
            type: 'err',
            message: err.message,
          })
        })
    },
    deleteAvatar() {
      //确认删除当前选择的头像
      this.$confirm('是否删除已上传头像?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.model.avatar = ''
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(err => {
          console.log(err)
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        })
    },
    changeStore() {
      console.log(this.model.storeId)
      if (
        !this.beforeStoreId.some(item => item == '0') &&
        this.model.storeId.some(item => item == '0')
      ) {
        this.model.storeId = ['0']
      } else if (
        this.beforeStoreId.some(item => item == '0') &&
        this.model.storeId.length > 1
      ) {
        this.model.storeId = this.model.storeId.filter(item => item != '0')
      }
      this.beforeStoreId = this.model.storeId
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
    resolveCertificateChange(val) {
      const map = {}
      this.model.certs.forEach(item => (map[item.type] = item))

      this.model.certs = val.map(
        key =>
          map[key] ?? {
            fileId: [],
            type: key,
            certNo: '',
            practiceOrg: '',
          },
      )
    },
    handleAvatarSuccess(res) {
      this.model.avatar = res
    },
    handleImageSuccess(res, index, fileIndex) {
      this.model.certs[index].fileId.splice(fileIndex, 1, res)
    },
    deleteImg(index, fileIndex) {
      this.model.certs[index].fileId.splice(fileIndex, 1)
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

    //头像上传
    async httpRequestAvtar({ file, onProgress, onSuccess, onError }) {
      //压缩file
      const res = await compressImg(file, 10)
      const formData = new FormData()
      formData.append('file', res)
      uploadFile(formData, onProgress).then(onSuccess).catch(onError)
    },

    handleClose(id) {
      const _ = this.model.roleId.indexOf(id)

      if (_ > -1) this.model.roleId.splice(_, 1)
    },

    submit(formName) {
      //其他账号清除执业相关验证
      if (this.model.type === 'OTHER') {
        this.rules.practiceInfo[0].required = false
        this.rules.practiceArea[0].required = false
      } else {
        this.rules.practiceInfo[0].required = true
        this.rules.practiceArea[0].required = true
      }
      // return
      this.$refs[formName].validate(async (valid, invalidFields) => {
        if (valid) {
          let data = {}
          if (this.id) {
            data = await this.$refs.business.submit()
          }

          this.loading = true
          //加密密码

          const formparams = JSON.parse(JSON.stringify(this.model))
          formparams.password = CryptoJS.MD5(formparams.password).toString()
          formparams.rePassword = CryptoJS.MD5(formparams.rePassword).toString()

          await (this.id ? accountEdit : accountInsert)({
            ...formparams,
            // 科室 药房可选 暂无，排除掉
            deptId: this.model.deptId.filter(_ => _ && _ != 0),
            storeId: this.model.storeId.filter(_ => _ && _ != 0),
            defDeptId: this.model.defDeptId == '0' ? '' : this.model.defDeptId,
            phone: this.model.phone,
            idCard: this.model.idCard,
            ...data,
          }).finally(() => setTimeout(() => (this.loading = false), 200))

          this.$message({
            type: 'success',
            message: '完成',
            showClose: true,
          })
          //编辑下-改变当前账号角色登出账号
          // if (this.id) {
          //   if (
          //     this.oldEditInfo.roleId.length !== this.model.roleId.length &&
          //     this.id &&
          //     this.$store.state.user.userId == this.id
          //   ) {
          //     console.log('修改了角色-重新登录')
          //     this.$confirm('当前用户角色信息变化，请重新登录', '提示', {
          //       type: 'warning',
          //     }).then(async () => {
          //       await this.$store.dispatch('user/logout')
          //       this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          //     })
          //     return
          //     ///
          //     ///
          //     ///
          //     ///
          //   }
          // }
          if (this.id) {
            if (this.id && this.$store.state.user.userId == this.id) {
              console.log('修改了信息-重新登录')
              this.$confirm('当前用户信息变化，请重新登录', '提示', {
                type: 'warning',
              }).then(async () => {
                await this.$store.dispatch('user/logout')
                this.$router.push(`/login?redirect=${this.$route.fullPath}`)
              })
              return
              ///
              ///
              ///
              ///
            }
          }
          // this.$router.push({
          //   path: '/jurisdiction/account/list',
          //   query: { flag: 1 },
          // })
          this.$store.dispatch('user/getInfo')
          this.$store.dispatch('updateList/changeFlag', 'updateListAccount')
          this.$router.back()
        } else {
          invalidFieldSetFocus(this.$refs[formName], invalidFields)
        }
      })
    },

    async handleReset() {
      this.loading = true
      await accountResetExamine({ id: this.id }).finally(() =>
        setTimeout(() => (this.loading = false), 200),
      )
      this.model.examine = false
    },
  },
}
</script>

<style lang="scss" scoped>
@use '@/styles/_modules-detail.scss';
.reset_btn {
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -16px;
}
</style>
