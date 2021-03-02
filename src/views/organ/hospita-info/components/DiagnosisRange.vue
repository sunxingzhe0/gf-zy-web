<template>
  <div>
    <div v-if="!isEdit">
      <div class="textContent" v-html="content"></div>
      <el-button type="primary" @click="isEdit = true">修改</el-button>
    </div>
    <div v-else>
      <div class="editMain">
        <ckeditor
          :editor="editor"
          v-model="body"
          :config="{ language: 'zh-cn' }"
          @ready="onReady"
        ></ckeditor>
      </div>
      <el-button @click="isEdit = false" style="margin-top: 20px"
        >返 回</el-button
      >
      <el-button type="primary" @click="submit" style="margin-top: 20px"
        >保 存</el-button
      >
    </div>

    <!-- <el-dialog
      :title="'编辑' + text"
      :visible.sync="isEdit"
      :close-on-click-modal="false"
      width=" 70%"
    >
      <div class="editMain">
        <ckeditor
          :editor="editor"
          v-model="body"
          :config="{ language: 'zh-cn' }"
        ></ckeditor>
      </div>
      <div slot="footer" class="dialog-footer is-center">
        <el-button size="mini" @click="isEdit = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn'
import { getDeptInfo, editDeptInfo } from '@/api/department'
import MyUploadAdapter from '@/utils/MyUploadAdapter.js'
export default {
  props: {
    value: {
      default: '',
    },
    text: {
      default: '',
    },
    type: {
      type: String,
    },
  },
  data() {
    return {
      isEdit: false,
      editor: ClassicEditor,
      content: '',
      body: '',
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    //提交
    async submit() {
      await editDeptInfo({
        body: this.body,
        textType: this.type,
      })
      this.$message.success('保存成功！')
      this.isEdit = false
      this.getInfo()
    },
    // 获取信息
    async getInfo() {
      const res = await getDeptInfo({
        textType: this.type,
      })
      this.body = res.body
      this.content = res.body
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
.textContent {
  word-break: break-word;
  font-size: 16px;
  color: #1a1a1a;
  line-height: 40px;
  margin-bottom: 30px;
}
.editMain {
  ::v-deep.ck-content {
    height: 400px;
  }
}
</style>
