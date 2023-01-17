<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    center
    :before-close="handleClose"
    :append-to-body="true"
  >
    <div class="msg">
      请打开重庆市精神卫生中心小程序登录医生端扫描二维码授权
    </div>
    <div class="code">
      <img
        style="width: 120px; height: 120px"
        :src="`https://api.qrserver.com/v1/create-qr-code?data=${code}`"
      />
    </div>
  </el-dialog>
</template>

<script>
import { generateCodeMark, pollingMonitor } from '@/api/user'
export default {
  data() {
    return {
      dialogVisible: false,
      code: null,
      timer: null,
    }
  },
  created() {},
  methods: {
    async open() {
      //获取二维码内容串
      const codeRes = await generateCodeMark()
      this.code = codeRes.split(',')[0]
      //轮询扫描结果
      this.getCanning()
      this.dialogVisible = true
    },
    handleClose(done) {
      done()
      clearInterval(this.timer)
    },
    //轮询
    getCanning() {
      this.timer = setInterval(async () => {
        try {
          const res = await pollingMonitor()
          if (res === true) {
            clearInterval(this.timer)
            this.$message.success('扫描成功')
            this.dialogVisible = false
          }
        } catch (error) {
          clearInterval(this.timer)
          this.dialogVisible = false
        }
      }, 2000)
    },
  },
}
</script>

<style lang="scss" scoped>
.msg {
  color: #ccc;
  text-align: center;
}
.code {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
::v-deep .c__chat .el-dialog__body {
  overflow-y: initial;
}
</style>
