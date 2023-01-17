<template>
  <div class="codeWrap">
    <!-- <el-button type="primary" @click="addContent">+添加</el-button> -->
    <el-timeline class="timeLine">
      <!-- 固定栏 默认空 -->
      <el-timeline-item hide-timestamp placement="top" v-if="!isHistory">
        <div>
          <div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 8 }"
              style="max-width: 600px"
              v-model="inputData.content"
            ></el-input>
          </div>
          <div class="imgList">
            <div class="imgItem" v-for="t in inputData.imgIds" :key="t">
              <el-image style="width: 100px; height: 100px" :src="FILE_URL(t)">
              </el-image>
              <i class="el-icon-error" @click="imgDel(t)"></i>
            </div>

            <el-upload
              action=""
              :show-file-list="false"
              :on-success="res => imgSuccess(res)"
              v-if="inputData.imgIds.length < 6"
              :before-upload="beforeUpdate"
              :http-request="httpRequest"
              accept="image/png, image/jpeg, image/gif, image/webp"
            >
              <div class="uploader">
                <i class="el-icon-plus"></i>
                <div>添加</div>
              </div>
            </el-upload>
          </div>
          <div class="btns">
            <el-button size="small" @click="addSubmit(true)">暂存</el-button>
            <el-button size="small" @click="addSubmit(false)" type="primary"
              >提交</el-button
            >
          </div>
        </div>
      </el-timeline-item>
      <el-timeline-item
        v-for="(item, index) in listData"
        :key="index"
        hide-timestamp
        placement="top"
      >
        <div class="content-wrap">
          <div class="creatInfo">
            <div>{{ item.createTime || '-' }}</div>
            <div>{{ item.name }} {{ item.deptName }}</div>
            <div v-if="item.draft">
              <i
                class="el-icon-edit"
                @click="editItem(item)"
                style="color: #0ab2c1"
              ></i>
              <i
                class="el-icon-delete"
                @click="delItem(item)"
                style="color: #f74a4a"
              ></i>
            </div>
          </div>
          <template v-if="editRow && editRow.id === item.id">
            <div>
              <div>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 6, maxRows: 8 }"
                  style="max-width: 600px"
                  v-model="editRow.text"
                ></el-input>
              </div>
              <div class="imgList">
                <div class="imgItem" v-for="t in editRow.imgIds" :key="t">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="FILE_URL(t)"
                  >
                  </el-image>
                  <i class="el-icon-error" @click="imgDel(t, true)"></i>
                </div>

                <el-upload
                  action=""
                  v-if="editRow.imgIds.length < 6"
                  :show-file-list="false"
                  :on-success="res => imgSuccess(res, true)"
                  :before-upload="beforeUpdate"
                  :http-request="httpRequest"
                  accept="image/png, image/jpeg, image/gif, image/webp"
                >
                  <div class="uploader">
                    <i class="el-icon-plus"></i>
                    <div>添加</div>
                  </div>
                </el-upload>
              </div>
              <div class="btns">
                <el-button size="small" @click="editRow = null">取消</el-button>
                <el-button size="small" @click="editSubmit(true)"
                  >暂存</el-button
                >
                <el-button
                  size="small"
                  @click="editSubmit(false)"
                  type="primary"
                  >提交</el-button
                >
              </div>
            </div>
          </template>
          <template v-else>
            <div>{{ item.text }}</div>

            <div v-if="item.images" class="imgList">
              <div class="imgItem" v-for="t in item.images.split(',')" :key="t">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="FILE_URL(t)"
                >
                </el-image>
              </div>
            </div>
          </template>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { uploadFile } from '@/api'
import apiXzPatient from '@/api/mindConsult/appointmentPatient'

export default {
  props: {
    reservationId: String,
    isHistory: Boolean,
  },
  data() {
    return {
      inputData: { content: '', imgIds: [] }, //固定录入项
      listData: [], //录入项合集
      editRow: {},
    }
  },
  mounted() {
    this.getRisks()
  },
  methods: {
    //编辑-暂存提交
    async editSubmit(type) {
      if (!this.editRow.text) {
        return this.$message.warning('请输入内容')
      }
      //true草稿 false 提交
      await apiXzPatient.riskReportEdit({
        draft: type,
        images: this.editRow.imgIds.join(','),
        id: this.editRow.id,
        reservationId: this.reservationId,
        text: this.editRow.text,
      })
      this.$message.success('提交成功！')
      this.editRow = null
      this.getRisks()
    },
    //新增-暂存提交
    async addSubmit(type) {
      if (!this.inputData.content) {
        return this.$message.warning('请输入内容')
      }
      //true草稿 false 提交
      await apiXzPatient.riskReportAdd({
        draft: type,
        images: this.inputData.imgIds.join(','),
        reservationId: this.reservationId,
        text: this.inputData.content,
      })
      this.inputData.content = ''
      this.inputData.imgIds = []
      this.$message.success('提交成功！')
      this.getRisks()
    },
    //获取风险报告列表
    async getRisks() {
      const res = await apiXzPatient.listByReservationId({
        reservationId: this.reservationId,
      })
      this.listData = res
    },
    //添加录入项
    addContent() {
      this.listData = [{ content: '', imgIds: [] }, ...this.listData]
    },
    //删除图
    imgDel(id, isEdit) {
      let list = isEdit ? this.editRow.imgIds : this.inputData.imgIds
      if (list.indexOf(id) > -1) {
        list.splice(list.indexOf(id), 1)
      }
    },
    editItem(row) {
      this.editRow = { ...row, imgIds: row.images ? row.images.split(',') : [] }
    },
    delItem(row) {
      this.$confirm('确认要删除该记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await apiXzPatient.riskReportDel({ id: row.id })
        this.$message.success('操作成功！')
        this.getRisks()
      })
    },
    //上传验证
    beforeUpdate(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isBMP = file.type === 'image/bmp'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG && !isGIF && !isBMP) {
        this.$message.error('上传图片只能是 JPG PNG GIF BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG || isGIF || isBMP) && isLt2M
    },
    // 上传图片
    httpRequest({ file, onProgress, onSuccess, onError }) {
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData, onProgress).then(onSuccess).catch(onError)
    },
    //上传成功
    imgSuccess(res, isEdit) {
      if (isEdit) {
        this.editRow.imgIds = [...this.editRow.imgIds, res]
      } else {
        this.inputData.imgIds = [...this.inputData.imgIds, res]
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.imgList {
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  > div {
    margin-right: 15px;
  }
  .imgItem {
    width: 100px;
    height: 100px;
    position: relative;
    > i {
      color: red;
      position: absolute;
      right: -10px;
      top: -10px;
      font-size: 20px;
    }
  }
}
.uploader {
  width: 100px;
  height: 100px;
  border: 1px dashed #ccc;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
  i {
    font-size: 28px;
    margin-bottom: 10px;
  }
}
.codeWrap {
  padding-left: 10px;
  .timeLine {
    margin-top: 20px;
    padding-left: 140px;
    .content-wrap {
      min-height: 90px;
      position: relative;
      .creatInfo {
        position: absolute;
        width: 140px;
        text-align: right;
        top: 0;
        left: -180px;
        color: #666;
        margin-bottom: 15px;
        > div {
          margin-bottom: 10px;
        }
        i {
          font-size: 18px;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
