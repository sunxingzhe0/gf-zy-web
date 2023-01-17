<template>
  <div class="login-container">
    <el-row class="login-wrapper" type="flex">
      <el-col :md="10" class="login-aside"></el-col>
      <el-col :md="14">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          autocomplete="on"
          label-position="left"
        >
          <div class="title-container">
            <h3 class="title">{{ defaultSettings.title }}</h3>
          </div>

          <el-form-item prop="account">
            <el-input
              ref="account"
              v-model="loginForm.account"
              placeholder="请填写登录账号"
              name="account"
              type="text"
              tabindex="1"
              autocomplete="on"
              @input="inputChange"
              @change="accountChange"
            >
              <template v-slot:prefix>
                <span class="svg-container">
                  <svg-icon icon-class="login-user" />
                </span>
              </template>
            </el-input>
          </el-form-item>

          <el-tooltip
            v-model="capsTooltip"
            content="大写锁定打开"
            placement="right"
            manual
          >
            <el-form-item prop="password">
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="请输入密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              >
                <template v-slot:prefix>
                  <span class="svg-container">
                    <svg-icon icon-class="login-password" />
                  </span>
                </template>

                <template v-slot:suffix>
                  <span class="show-pwd" @click="showPwd">
                    <svg-icon
                      :icon-class="
                        passwordType === 'password' ? 'eye' : 'eye-open'
                      "
                    />
                  </span>
                </template>
              </el-input>
            </el-form-item>
          </el-tooltip>

          <el-form-item prop="code" class="login-form__code">
            <el-input
              v-model="loginForm.code"
              ref="code"
              placeholder="请输入验证码"
              tabindex="3"
              autocomplete="off"
              @keyup.enter.native="handleLogin"
            >
              <template v-slot:prefix>
                <span class="svg-container">
                  <svg-icon icon-class="login-verification" />
                </span>
              </template>

              <template v-slot:suffix>
                <img
                  style=""
                  :src="verification"
                  @click="getVerification('focus')"
                  @error="onError"
                />
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="remember" size="mini">
            <el-row>
              <el-col :span="12">
                <el-checkbox v-model="loginForm.remember">
                  记住密码
                </el-checkbox>
              </el-col>
              <el-col :span="12" class="is-right">
                <el-popover
                  placement="top-end"
                  width="200"
                  trigger="hover"
                  content="请联系管理员找回密码。"
                >
                  <el-button slot="reference" type="text">忘记密码</el-button>
                </el-popover>
              </el-col>
            </el-row>
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%"
            @click.native.prevent="handleLogin"
          >
            登录
          </el-button>
        </el-form>
      </el-col>
    </el-row>
    <img class="login-logo" src="@/assets/login-logo.png" alt="" />
  </div>
</template>

<script>
import $store from '@/utils/$store'
import defaultSettings from '@/settings'
// import SocialSign from './components/SocialSignin'
import { humanValidate } from '@/api/user'
import { hasOperate } from '@/utils/listening'
export default {
  name: 'Login',
  // components: { SocialSign },
  data() {
    // const validatePassword = (rule, value, callback) => {
    //   // const reg =
    //   //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,16}/
    //   // if (!reg.test(value)) {
    //   //   callback(new Error('请输入8-16位密码，包含大小写字母、数字、特殊字符'))
    //   // } else {
    //   //   callback()
    //   // }
    //   // callback()
    // }
    return {
      loginForm: {
        account: '',
        password: '',
        code: '',
        imgCode: '',
        remember: false,
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', message: '请输入账号' }],
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '密码不能为空' /* validator: validatePassword */,
          },
        ],
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      verification: '',
    }
  },
  computed: {
    defaultSettings() {
      return defaultSettings
    },
  },
  watch: {
    $route: {
      handler: function (route) {
        console.log(route, '路由--')
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true,
    },
  },
  created() {
    const account = $store.loadAccount()
    if (account)
      this.loginForm = Object.assign(
        {},
        Array.isArray(account) ? account[account.length - 1] : account,
      )
    // window.addEventListener('storage', this.afterQRScan)
    for (var i = 1; i < 1000; i++) {
      clearInterval(i)
    }
  },
  mounted() {
    if (this.loginForm.account === '') {
      this.$refs.account.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.getVerification()
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async getVerification(focus) {
      this.loginForm.code = ''
      const { account } = this.loginForm
      let obj_ = {}
      obj_ = await humanValidate({ account: account.trim() })
      this.verification = obj_.base64
      this.loginForm.imgCode = obj_.key
      if (focus) {
        setTimeout(this.$refs.code.focus, 0)
      }
      // setTimeout(this.$refs.code.focus, 0)
    },
    onError() {
      // this.$message({
      //   type: 'warning',
      //   message: '请一分钟后再试',
      //   showClose: true,
      //   duration: 3000,
      // })
    },
    accountChange() {
      const account = $store.loadAccount()
      if (account) {
        if (Array.isArray(account)) {
          let accountItem = account.filter(
            item => this.loginForm.account == item.account,
          )
          if (accountItem.length > 0) {
            this.loginForm.password = accountItem[0].password
          } else {
            this.loginForm.password = ''
          }
        }
      }
    },
    inputChange() {
      this.loginForm.password = ''
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              if (this.loginForm.remember) {
                $store.saveAccount(this.loginForm)
              }

              console.log('登录成功跳转', this.otherQuery)
              this.$router.push({
                path: '/',
                query: this.otherQuery,
                // path: this.redirect || '/',
              })
              this.loading = false

              for (var i = 1; i < 100; i++) {
                clearInterval(i)
              }
              //监听操作
              hasOperate(1800000, async () => {
                await this.$store.dispatch('user/logout')
                const confirm = await this.$confirm(
                  '长时间未操作，已为您退出登录，请重新登录！',
                  '提示',
                  {
                    type: 'warning',
                    showClose: false,
                    showCancelButton: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                  },
                )
                if (confirm !== 'confirm') return
                setTimeout(() => {
                  this.$router.push(`/login?redirect=${this.$route.fullPath}`)
                }, 300)
              })
            })
            .catch(() => {
              this.loading = false
              this.getVerification()
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  },
}
</script>

<style lang="scss">
@import '@/styles/_variables.scss';

$dark_gray: #889aa4;

.login-container {
  position: relative;
  min-height: 100%;
  width: 100%;
  background: url('~@/assets/login/background.png') no-repeat 0 / cover;
  overflow: hidden;
  .login-logo {
    position: fixed;
    top: 20px;
    left: 20px;
  }

  .login-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    width: 820px;
    height: 440px;
    background: $--color-white;
  }

  .login-aside {
    background: url('~@/assets/login/login-form-aside.png') no-repeat 50% /
      cover;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: relative;
    margin: 0 auto;
    width: 520px;
    max-width: 100%;
    height: 100%;
    padding: 6%;
    overflow: hidden;
  }

  .el-input__prefix {
    left: 11px;
    color: #5e6875;
  }

  .el-input__suffix {
    right: 11px;
  }

  .el-input--prefix .el-input__inner {
    padding-left: 50px;
  }
  .el-input--suffix .el-input__inner {
    padding-right: 36px;
  }

  .login-form__code {
    .el-input__suffix {
      img {
        padding-top: 1px;
        width: 89px;
        height: 34px;
      }
    }

    .el-input--suffix .el-input__inner {
      padding-right: 100px;
    }
  }

  .svg-container {
    color: $--color-primary;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      margin: 0px auto 6%;
      font-size: 20px;
      color: $--color-primary;
      text-align: center;
      font-weight: bold;
      & + .is-center {
        font-size: 14px;
      }
    }
  }

  .show-pwd {
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
