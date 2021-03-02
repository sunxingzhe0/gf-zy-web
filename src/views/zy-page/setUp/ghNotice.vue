<template>
  <div class="accountWrap view__card">
    <el-tabs type="border-card" v-model="active" :before-leave="beforeLeave">
      <el-tab-pane label="挂号须知" name="0"> </el-tab-pane>
      <el-tab-pane label="体检须知" name="1"> </el-tab-pane>
    </el-tabs>
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
import { editTjIns, getTjIns } from '@/api/zyapi/index'
import MyUploadAdapter from '@/utils/MyUploadAdapter.js'
export default {
  data() {
    return {
      editor: ClassicEditor,
      active: '0',
      form: {
        title: '',
        content: '',
        id: '',
      },
      detail: {},
    }
  },
  mounted() {
    this.getTjInsInfo()
  },
  methods: {
    // 获取须知
    async getTjInsInfo() {
      let res = await getTjIns({ type: this.active })
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
    //tab切换拦截
    beforeLeave() {
      console.log(this.detail)
      console.log(this.form)
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
                this.getTjInsInfo()
              }, 100)
            })
            .catch(() => {
              rej()
            })
        })
      } else {
        setTimeout(() => {
          this.getTjInsInfo()
        }, 100)
      }
    },
    async submit() {
      await editTjIns({ ...this.form, insType: this.active })
      this.getTjInsInfo()
      this.$message.success('操作成功!')
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
  .account_main {
    padding: 0 90px;
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
