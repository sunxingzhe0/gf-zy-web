<template>
  <div>
    <el-form
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm"
      label-position="left"
    >
      <el-form-item label="帐号名称">
        <div class="text">{{ account }}</div>
      </el-form-item>
      <el-form-item label="角色身份">
        <div class="text">{{ roleName }}</div>
      </el-form-item>

      <el-form-item label="手机号">
        <div class="text">
          {{ phone }}
          <el-button
            v-if="phone == '-'"
            size="mini"
            type="primary"
            plain
            class="mL20"
            @click="dialogVisiblePhone = true"
            >绑定</el-button
          >
          <el-button
            v-else
            size="mini"
            type="primary"
            plain
            class="mL20"
            @click="dialogVisiblePhone = true"
            >更换</el-button
          >
        </div>
      </el-form-item>

      <el-form-item label="密码">
        <div class="text">
          ********
          <el-button
            size="mini"
            type="primary"
            plain
            class="mL20"
            @click="dialogVisible = true"
            >修改</el-button
          >
        </div>
      </el-form-item>
    </el-form>

    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="640px"
      :close-on-click-modal="false"
      @close="closeDia"
    >
      <el-form
        :model="formPwd"
        :rules="rulePwd"
        ref="formPwd"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="帐号名称">
          <div class="text">{{ account }}</div>
        </el-form-item>
        <el-form-item label="角色身份">
          <div class="text">{{ roleName }}</div>
        </el-form-item>
        <el-form-item label="原密码" prop="oldPassword">
          <div class="flex">
            <el-input
              type="password"
              class="input"
              v-model="formPwd.oldPassword"
              @blur="check"
            ></el-input>

            <div class="judge" v-if="oldpwd !== 0">
              <div class="error" v-if="oldpwd === 1">
                <img src="@/assets/error.png" alt="" />
                <span>密码错误</span>
              </div>
              <div class="success" v-if="oldpwd === 2">
                <img src="@/assets/success.png" alt="" />
                <span>密码正确</span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            type="password"
            class="input"
            v-model="formPwd.newPassword"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            type="password"
            class="input"
            v-model="formPwd.confirmPassword"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDia" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitPwd" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改手机号 -->
    <el-dialog
      :title="phone == '-' ? '绑定手机号' : '修改手机号'"
      :visible.sync="dialogVisiblePhone"
      width="50%"
      :close-on-click-modal="false"
      @close="closeBindPhone"
    >
      <el-form
        :model="formPhone"
        :rules="rulePhone"
        ref="formPhone"
        label-width="80px"
      >
        <el-form-item label="帐号名称">
          <div class="text">{{ account }}</div>
        </el-form-item>
        <el-form-item label="角色身份">
          <div class="text">{{ roleName }}</div>
        </el-form-item>
        <el-form-item v-if="phone != '-'" label="原手机号">
          <div>
            <div class="text">{{ phone }}</div>
          </div>
        </el-form-item>
        <el-form-item label="验证码" prop="code" v-if="phone != '-'">
          <div class="flex">
            <el-input
              type="code"
              class="input"
              v-model="formPhone.code"
              @blur="checkPhone('MEMBER_BINDING')"
            >
              <template slot="append">
                <span v-if="oldCodeNum > 0">{{ oldCodeNum }}s后再试</span>
                <span v-else @click="checkCode('MEMBER_BINDING')"
                  >获取验证码</span
                >
              </template>
            </el-input>

            <div class="judge" v-if="oldCode !== 0">
              <div class="error" v-if="oldCode === 1">
                <img src="@/assets/error.png" alt="" />
                <span>验证码错误</span>
              </div>
              <div class="success" v-if="oldCode === 2">
                <img src="@/assets/success.png" alt="" />
                <span>验证码正确</span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="phone == '-'" label="手机号" prop="newPhone">
          <div>
            <el-input type="code" class="input" v-model="formPhone.newPhone">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item v-else label="新手机号" prop="newPhone">
          <div>
            <el-input type="code" class="input" v-model="formPhone.newPhone">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="验证码" prop="newCode">
          <div class="flex">
            <el-input
              type="code"
              class="input"
              v-model="formPhone.newCode"
              @blur="checkPhone('BINDING')"
            >
              <template slot="append">
                <span v-if="newCodeNum > 0">{{ newCodeNum }}s后再试</span>
                <span v-else @click="checkCode('BINDING')">获取验证码</span>
              </template>
            </el-input>

            <div class="judge" v-if="newCode !== 0">
              <div class="error" v-if="newCode === 1">
                <img src="@/assets/error.png" alt="" />
                <span>验证码错误</span>
              </div>
              <div class="success" v-if="newCode === 2">
                <img src="@/assets/success.png" alt="" />
                <span>验证码正确</span>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblePhone = false" size="mini"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitPhone" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { isPassword } from '@/utils/validate'
import {
  editPassword,
  checkOldPwd,
  editPhone,
  changePhone,
  checkPhoneCode,
  firstBindPhone,
  // finishResetPhone,
  finishFirstBindPhone,
} from '@/api/setup'
export default {
  computed: {
    account() {
      return this.$store.state.user.account
    },
    roleName() {
      let arr = []
      this.$store.state.user.roleList.forEach(element => {
        arr.push(element.name)
      })

      return arr.join(',')
    },
    phone() {
      return this.$store.state.user.phone
        ? this.$store.state.user.phone.replace(
            this.$store.state.user.phone.substring(4, 8),
            '****',
          )
        : '-'
    },
  },
  data() {
    const validatePwd = (rule, value, callback) => {
      if (!isPassword(value)) {
        callback(Error('密码为6-18位，可用阿拉伯数字和英文字母'))
      } else {
        callback()
      }
    }
    const validateNewPwd = (rule, value, callback) => {
      if (value != this.formPwd.newPassword) {
        callback(Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      timer: null,
      // 展示表单
      // account: this.$store.state.user.account,
      // roleName: this.$store.state.user.roleName,
      // phone: this.$store.state.user.phone
      //   ? this.$store.state.user.phone.replace(
      //       this.$store.state.user.phone.substring(3, 7),
      //       '****',
      //     )
      //   : '-',
      // 修改密码表单
      oldCodeNum: 0,
      newCodeNum: 0,
      formPwd: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      // 修改手机号表单
      formPhone: {
        code: '',
        newCode: '',
        newPhone: '',
      },
      // 修改密码规则
      rulePwd: {
        oldPassword: [{ required: true, message: '请输入原始密码' }],
        newPassword: [
          {
            required: true,
            message: '请输入新密码',
          },
          {
            validator: validatePwd,
            trigger: 'blur',
          },
        ],
        confirmPassword: [
          {
            required: true,
            message: '请确认新密码',
          },
          { trigger: 'blur', validator: validateNewPwd },
        ],
      },
      rulePhone: {
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
        newCode: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
        newPhone: [
          { required: true, trigger: 'blur', message: '请输入新手机号' },
        ],
      },
      // 修改密码弹框
      dialogVisible: false,
      // 修改手机号弹框
      dialogVisiblePhone: false,
      // 原密码是否正确
      oldpwd: 0,
      // 判断原手机号验证码
      oldCode: 0,
      // 判断新手机号验证码
      newCode: 0,
      // 倒计时获取验证码
      // text1: '获取验证码',
      // text2: '获取验证码',
    }
  },
  created() {
    console.log(this.$store.state.user)
  },
  mounted() {
    //全局计时器
    this.tartAllTime()
    setTimeout(() => {
      if (this.$route.query.phone) {
        this.dialogVisiblePhone = true
      }
    }, 500)
  },
  methods: {
    // 退出登录
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 预校验旧密码
    async check() {
      let res = await checkOldPwd({
        oldPassword: this.formPwd.oldPassword,
      }).catch(error => {
        console.log(error)
      })
      console.log(res)
    },
    // 修改密码提交
    submitPwd() {
      this.$refs.formPwd.validate(async valid => {
        if (valid) {
          await editPassword({
            oldPassword: this.formPwd.oldPassword,
            password: this.formPwd.newPassword,
          })
          this.$message.success('修改密码成功，请重新登录')
          this.dialogVisible = false
          this.logout()
        } else {
          this.$message.warning('请先完善表单再提交')
          return false
        }
      })
    },
    // 关闭弹框重置表单
    closeDia() {
      this.dialogVisible = false
      this.$refs.formPwd.resetFields()
    },
    closeBindPhone() {
      this.$refs.formPhone.resetFields()
    },
    // 预校验验证码
    async checkPhone(type) {
      if (type == 'MEMBER_BINDING') {
        let res = await checkPhoneCode({
          phone: this.$store.state.user.phone,
          code: this.formPhone.code,
          type: 'MEMBER_BINDING',
        }).catch(error => {
          if (error) {
            this.oldCode == 1
          }
        })
        this.oldCode == 2
        console.log(res)
      } else {
        let res = await checkPhoneCode({
          phone: this.formPhone.newPhone,
          code: this.formPhone.newCode,
          type: 'BINDING',
        }).catch(error => {
          console.log(error)
        })
        console.log(res)
      }
    },
    // 发送验证码倒计时
    // countDown(textType) {
    //   let newNum = 60
    //   this[textType] = newNum-- + ' 后重新发送'
    //   clearInterval(this.timer)
    //   this.timer = setInterval(() => {
    //     this[textType] = newNum-- + ' 后重新发送'
    //     if (newNum == 0) {
    //       console.log(22222)

    //       this[textType] = '重新获取'
    //       clearInterval(this.timer)
    //     }
    //   }, 1000)
    // },
    tartAllTime() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        // this[textType] = newNum-- + ' 后重新发送'
        // console.log(this.oldCodeNum)
        this.oldCodeNum <= 0 ? (this.oldCodeNum = 0) : this.oldCodeNum--
        this.newCodeNum <= 0 ? (this.newCodeNum = 0) : this.newCodeNum--

        // if (newNum == 0) {
        //   console.log(22222)

        //   this[textType] = '重新获取'
        //   clearInterval(this.timer)
        // }
      }, 1000)
    },
    // 解绑手机号发送验证码
    async checkCode(type) {
      if (type == 'MEMBER_BINDING') {
        // this.countDown('text1')
        let res = await changePhone({
          phone: this.$store.state.user.phone,
          type: 'MEMBER_BINDING',
        })
        this.oldCodeNum = 60
        console.log(res)
      } else {
        // this.countDown('text2')
        let res = await changePhone({
          phone: this.formPhone.newPhone,
          type: 'BINDING',
        })
        this.newCodeNum = 60
        console.log(res)
      }
    },
    // 修改手机号提交
    submitPhone() {
      if (this.phone == '-') {
        this.$refs.formPhone.validate(async valid => {
          if (valid) {
            this.formPhone.newCode &&
              this.formPhone.newPhone &&
              firstBindPhone({
                code: this.formPhone.newCode,
                phone: this.formPhone.newPhone,
                // "phone":"13068042626",
                // "code":"123456"
              }).then(res => {
                // console.log(res)
                finishFirstBindPhone({ bizToken: res }).then(res2 => {
                  console.log(res2)
                  this.$message.success('修改手机号成功')
                  this.$store.commit('user/SET_PHONE', this.formPhone.newPhone)
                  this.dialogVisiblePhone = false
                })
                // console.log(res)
              })
          }
        })
      } else {
        this.$refs.formPhone.validate(async valid => {
          if (valid) {
            let res = await editPhone({
              phone: this.$store.state.user.phone,
              ...this.formPhone,
            })
            console.log(res)

            this.$message.success('修改手机号成功')
            this.$store.commit('user/SET_PHONE', this.formPhone.newPhone)
            this.dialogVisiblePhone = false
          } else {
            this.$message.warning('请先完善表单再提交')
            return false
          }
        })
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
}
</script>
<style scoped lang="scss">
.input {
  width: 400px;
}
.mL20 {
  margin-left: 20px;
}
.judge {
  .success,
  .error {
    display: flex;
    align-items: center;
    img {
      width: 16px;
      height: 16px;
      margin-right: 10px;
    }
  }
}

.text {
  width: 420px;
}

::v-deep .el-input-group__append {
  background: #fff;
  color: #0ab2c1;
  cursor: pointer;
}
</style>
