<template>
  <div class="view__card">
    <el-form :model="formData" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="标题">
        <el-input
          class="input"
          placeholder="请输入标题"
          v-model="formData.title"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input class="input" type="number" v-model="formData.seq"></el-input>
      </el-form-item>
      <el-form-item label="正文">
        <div class="editor">
          <ckeditor
            :editor="editor"
            v-model="formData.content"
            :config="{ language: 'zh-cn' }"
            @ready="onReady"
          ></ckeditor>
        </div>
      </el-form-item>
    </el-form>
    <div class="btns">
      <el-button type="primary" plain @click="back">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import { introAdd, introEdit, introGet } from '@/api/organization'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn'
import MyUploadAdapter from '@/utils/MyUploadAdapter'
export default {
  name: 'editDepteInfo',
  data() {
    return {
      editor: ClassicEditor,
      formData: {
        title: '',
        seq: '',
        content: '',
      },
      rules: {},
    }
  },
  created() {
    this.$route.query.id && this.getInfo(this.$route.query.id)
  },
  methods: {
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
    //取消
    back() {
      this.$router.push({
        path: '/organ/department/list',
        query: { active: '2' },
      })
    },
    //新增编辑科室简介
    async save() {
      if (this.$route.query.id) {
        await this.editDepetInfo()
      } else {
        await this.addDepetInfo()
      }
      setTimeout(() => {
        this.$router.push({
          path: '/organ/department/list',
          query: { active: '2' },
        })
      }, 1000)
    },
    async addDepetInfo() {
      await introAdd(this.formData)
      this.$message.success('新增成功')
    },
    async editDepetInfo() {
      await introEdit(this.formData)
      this.$message.success('编辑成功')
    },
    async getInfo(id) {
      this.formData = await introGet(id)
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-input--medium .el-input__inner {
  width: 400px;
}
.editor {
  ::v-deep.ck-content {
    min-height: 500px;
  }
}
.btns {
  display: flex;
  justify-content: center;
}
</style>
