<template>
  <!-- 批量导入 -->
  <el-dialog
    title="批量导入"
    :visible.sync="innerVisible"
    append-to-body
    custom-class="component__dialog"
    :close-on-click-modal="false"
    @close="close()"
  >
    <el-form ref="importForm" label-width="100px">
      <el-form-item prop="upload">
        <el-button size="small" type="primary" @click="download"
          >下载导入模板</el-button
        >
        <el-upload
          class="upload-demo"
          action
          accept=".xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :file-list="sonListS"
          :before-upload="beforeUpload"
          :before-remove="beforeRemove"
          :http-request="httpRequest"
          :on-change="hanleChange"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传<code>excel</code> 文件,且不超过2MB
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <div class="is-center">
        <el-button @click="close()">取消</el-button>
        <el-button type="primary" @click="submitTitle">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import {
  modularLexcel, //导入下载
} from '@/api/dictionary'
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    downTemplate: {
      type: String,
    },
    importFetch: {
      type: Function,
    },
  },
  data() {
    return {
      sonListS: [],
      fileData: null,
    }
  },
  computed: {
    innerVisible: {
      get: function () {
        return this.show
      },
      set: function (val) {
        console.log(val)
        this.$emit('onClose')
      },
    },
  },
  methods: {
    close(data) {
      this.$emit('onClose', data)
    },
    //下载导入模板
    async download() {
      modularLexcel(this.downTemplate)
    },
    beforeRemove(file) {
      return this.$confirm(`确定删除 ${file.name} ?`)
    },
    //上传文件
    beforeUpload(file) {
      let ExcalBar = ['xlsx']
      const isExcal =
        ExcalBar.indexOf(file.name.substring(file.name.lastIndexOf('.') + 1)) >
        -1
          ? true
          : false
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isExcal) {
        this.$message.error('上传excal只能是 excal 格式 !')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2 MB !')
      }
      return isExcal && isLt2M
    },
    httpRequest({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      this.fileData = formData
    },
    //批量导入替换上次的文件
    hanleChange(file, fileList) {
      this.sonListS = [fileList[fileList.length - 1]]
    },
    //批量导入
    submitTitle() {
      if (this.fileData) {
        this.close(this.fileData)
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        this.importFetch(this.fileData)
          .then(() => {
            this.$message.success('操作成功!')
            this.close(true)
          })
          .finally(() => {
            setTimeout(() => {
              loading.close()
            }, 1000)
          })
        this.close()
        this.sonListS = []
      } else {
        this.$message.warning('请上传文件')
      }
    },
  },
}
</script>
