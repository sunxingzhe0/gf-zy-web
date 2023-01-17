<template>
  <div class="view__card" style="padding-top: 60px">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="110px">
      <el-row>
        <el-col>
          <el-form-item label="标题" prop="title">
            <el-input
              class="input"
              placeholder="请输入"
              v-model="form.title"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="来源" prop="source">
            <el-input
              class="input"
              placeholder="请输入"
              v-model="form.source"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="状态" prop="state">
            <el-radio-group v-model="form.state">
              <el-radio :label="true">显示</el-radio>
              <el-radio :label="false">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="内容" prop="content">
            <div class="editor">
              <ckeditor
                :editor="editor"
                v-model="form.content"
                :config="{ language: 'zh-cn' }"
                @ready="onReady"
              ></ckeditor>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="pageBack">返回</el-button>
        <el-button type="primary" @click="submit">{{ txt }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn'
import { addInfo, editInfo, infoDetail } from '@/api/setup'
import MyUploadAdapter from '@/utils/MyUploadAdapter.js'
export default {
  data() {
    return {
      editor: ClassicEditor,
      txt: '提交',
      form: {
        title: '',
        source: '',
        state: true,
        content: '',
      },
      rules: {
        source: [{ required: true, message: '请输入来源' }],
        title: [{ required: true, message: '请输入标题' }],
        content: [{ required: true, message: '请输入内容' }],
        state: [{ required: true, message: '请选择状态' }],
      },
    }
  },
  created() {
    if (this.$route.query.id) {
      this.txt = '保存'
      this.getInfoDetail()
    }
  },
  methods: {
    // 获取对应id的详情数据
    async getInfoDetail() {
      let res = await infoDetail({
        id: this.$route.query.id,
      })
      this.form.id = this.$route.query.id
      this.form.content = res.content
      this.form.source = res.source
      this.form.title = res.title
      this.form.state = res.state
    },
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          if (this.form.id) {
            await editInfo({
              ...this.form,
            })
            this.$message.success('操作成功!')
            // this.$router.push('/set-up/information/list')
            // this.$router.push({
            //   path: '/set-up/information/list',
            //   query: { flag: 1 },
            // })
          } else {
            await addInfo({
              ...this.form,
            })
            this.$message.success('操作成功!')
            // this.$router.push('/set-up/information/list')
            // this.$router.push({
            //   path: '/set-up/information/list',
            //   query: { flag: 1 },
            // })
          }
          this.$store.dispatch('updateList/changeFlag', 'updateListInformation')
          this.$router.back()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //返回上一页
    pageBack() {
      this.$router.back(-1)
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
.editor {
  ::v-deep.ck-content {
    min-height: 300px;
  }
}
.input {
  width: 400px;
}
</style>
