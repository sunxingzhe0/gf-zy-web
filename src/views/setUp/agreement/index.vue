<template>
  <div
    class="accountWrap view__card"
    :style="
      checkPermissionNum([
        'ORG_WEB_SET_UP_PROTOCOL_MANAGEMENT',
        'ZY_ORG_SETTING_XUZHI_MANAGEMENT',
      ]) > 1
        ? 'padding-top:30px'
        : ''
    "
  >
    <div
      :style="
        checkPermissionNum([
          'ORG_WEB_SET_UP_PROTOCOL_MANAGEMENT',
          'ZY_ORG_SETTING_XUZHI_MANAGEMENT',
        ]) > 1
          ? 'width: 210px; position: absolute;'
          : ''
      "
    >
      <el-tabs
        v-model="active"
        :type="
          checkPermissionNum([
            'ORG_WEB_SET_UP_PROTOCOL_MANAGEMENT',
            'ZY_ORG_SETTING_XUZHI_MANAGEMENT',
          ]) > 1
            ? ''
            : 'border-card'
        "
        :tab-position="
          checkPermissionNum([
            'ORG_WEB_SET_UP_PROTOCOL_MANAGEMENT',
            'ZY_ORG_SETTING_XUZHI_MANAGEMENT',
          ]) > 1
            ? 'left'
            : 'top'
        "
        :before-leave="beforeLeave"
      >
        <el-tab-pane
          v-if="checkPermission(['ORG_WEB_SET_UP_PROTOCOL_MANAGEMENT'])"
          label="互联网医院服务协议"
          name="4"
        >
        </el-tab-pane>
        <el-tab-pane
          v-if="checkPermission(['ORG_WEB_SET_UP_PROTOCOL_MANAGEMENT'])"
          label="自提授权协议"
          name="1"
        >
        </el-tab-pane>
        <el-tab-pane
          v-if="checkPermission(['ORG_WEB_SET_UP_PROTOCOL_MANAGEMENT'])"
          label="邮寄授权协议"
          name="2"
        >
        </el-tab-pane>
        <el-tab-pane
          v-if="checkPermission(['ORG_WEB_SET_UP_PROTOCOL_MANAGEMENT'])"
          label="用户隐私使用条款"
          name="3"
        >
        </el-tab-pane>
        <el-tab-pane
          v-if="checkPermission(['ORG_WEB_SET_UP_PROTOCOL_MANAGEMENT'])"
          label="在线咨询须知"
          name="5"
        >
        </el-tab-pane>
        <el-tab-pane
          v-if="checkPermission(['ORG_WEB_SET_UP_PROTOCOL_MANAGEMENT'])"
          label="在线复诊须知"
          name="6"
        >
        </el-tab-pane>
        <el-tab-pane
          v-if="checkPermission(['ORG_WEB_SET_UP_PROTOCOL_MANAGEMENT'])"
          label="慢病续方须知"
          name="7"
        >
        </el-tab-pane>
        <el-tab-pane
          v-if="checkPermission(['ORG_WEB_SET_UP_PROTOCOL_MANAGEMENT'])"
          label="互联网医院患者知情同意书"
          name="0"
        >
        </el-tab-pane>
        <el-tab-pane
          v-if="checkPermission(['ZY_ORG_SETTING_XUZHI_MANAGEMENT'])"
          label="挂号须知"
          name="zy_0"
        >
        </el-tab-pane>
        <el-tab-pane
          v-if="checkPermission(['ZY_ORG_SETTING_XUZHI_MANAGEMENT'])"
          label="体检须知"
          name="zy_1"
        >
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="account_main">
      <el-form label-width="80px" ref="ruleForm" :model="form">
        <el-form-item label="标题" prop="title">
          <el-input
            type="text"
            style="width: 400px"
            placeholder="请输入内容"
            v-model="form.title"
            maxlength="24"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <ckeditor
            :editor="editor"
            v-model="form.content"
            :config="{ language: 'zh-cn' }"
            @ready="onReady"
          ></ckeditor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn'
import { getAgrList, addAgreement, editArg } from '@/api/setup'
import { editTjIns, getTjIns } from '@/api/zyapi/index'
import checkPermission from '@/utils/permission'
import checkPermissionNum from '@/utils/permissionNum'
import MyUploadAdapter from '@/utils/MyUploadAdapter.js'
export default {
  data() {
    return {
      editor: ClassicEditor,
      active: checkPermission(['ORG_WEB_SET_UP_PROTOCOL_MANAGEMENT'])
        ? '4'
        : 'zy_0',
      form: {
        title: '',
        content: '',
      },
      detail: {},
      // 类型
      // type: '1',
    }
  },
  created() {
    this.showAgr()
  },
  methods: {
    checkPermission,
    checkPermissionNum,
    // 查看协议
    async showAgr() {
      console.log(this.active)
      let res =
        this.active.indexOf('zy') > -1
          ? await getTjIns({ type: this.active.split('_')[1] })
          : await getAgrList({
              genre: this.active,
            })

      // this.form = res
      if (res) {
        this.form.title = res.title
        this.form.content = res.content
        this.form.id = res.id
      } else {
        this.form.id = ''
        this.$refs.ruleForm.resetFields()
      }
      this.detail = res
    },
    // 保存提交
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // 有 id 则为编辑
          if (this.form.id) {
            if (this.active.indexOf('zy') > -1) {
              await editTjIns({
                ...this.form,
                insType: this.active.split('_')[1],
              })
            } else {
              await editArg({
                ...this.form,
              })
            }

            this.showAgr()
            this.$message.success('操作成功!')
          } else {
            if (this.active.indexOf('zy') > -1) {
              await editTjIns({
                ...this.form,
                insType: this.active.split('_')[1],
              })
            } else {
              // 无 id 为新增
              await addAgreement({
                ...this.form,
                type: this.active,
              })
            }

            this.showAgr()
            this.$message.success('操作成功!')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //tab切换拦截
    beforeLeave() {
      if (
        ((!this.detail || !this.detail.id) &&
          (this.form.title != '' || this.form.content != '')) ||
        (this.detail &&
          this.detail.id &&
          (this.form.title != this.detail.title ||
            this.form.content != this.detail.content))
      ) {
        //有修改
        return new Promise((res, rej) => {
          this.$confirm('编辑未保存是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              res()
              setTimeout(() => {
                this.afterChange()
              }, 100)
            })
            .catch(() => {
              rej()
            })
        })
      } else {
        setTimeout(() => {
          this.afterChange()
        }, 100)
      }
    },
    afterChange() {
      this.showAgr()
    },
    // tab 点击事件
    tabClick() {
      // this.showAgr()
    },
    // 自定义图片上传
    onReady(editor) {
      // Insert the toolbar before the editable area.
      editor.ui
        .getEditableElement()
        .parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement(),
        )
      // 自定义上传图片插件
      editor.plugins.get('FileRepository').createUploadAdapter = loader => {
        return new MyUploadAdapter(loader)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.accountWrap {
  padding: 0;
  position: relative;

  .account_main {
    padding: 0 90px;
    padding-left: 210px;
    ::v-deep.ck-content {
      min-height: 300px;
    }
  }
  .el-tabs--border-card {
    border: 0;
    box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
  }
  ::v-deep.el-tabs--border-card > .el-tabs__header {
    border: 0;
    background-color: #f2f2f2;
  }
  ::v-deep.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    border: 1px solid transparent;
  }
}
</style>
