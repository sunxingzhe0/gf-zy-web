<template>
  <div class="view__card">
    <List v-model="query" :columns="columns" :tableData="tableData" :bats="[]">
      <template v-slot:slot_title>
        <el-image
          style="width: 280px; height: 120px;"
          :src="url"
          :preview-src-list="srcList"
        >
        </el-image>
      </template>
      <template v-slot:slot_seq="{ row }">
        <EditableText
          icon="el-icon-edit"
          v-model="row.seq"
          @confirm="confirm($event, row.id)"
          @cancel="cancel"
        ></EditableText>
      </template>
      <template v-slot:slot_state="{ row }">
        <el-switch
          v-model="row.state"
          @change="stateChange([row.id], row.state)"
          active-text="显示"
          inactive-text="隐藏"
          :width="50"
          class="textSwitch"
        ></el-switch>
      </template>
      <template v-slot:slot_picId="{ row }">
        <el-image
          style="height: 100px;"
          :fit="'cover'"
          :src="FILE_URL(row.picId)"
          :preview-src-list="[FILE_URL(row.picId)]"
        ></el-image>
      </template>
      <template v-slot:footertool>
        <el-button type="primary" plain @click="del()">
          批量删除
        </el-button>
        <el-button type="primary" plain @click="stateChange('', false)">
          批量隐藏
        </el-button>
        <el-button type="primary" plain @click="stateChange('', true)">
          批量显示
        </el-button>
        <el-button type="primary" @click="add(false)">
          新增轮播图
        </el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="add(row)">
          修改
        </el-button>
        <el-button style="color: #f74949;" type="text" @click="del([row.id])">
          删除
        </el-button>
      </template>
    </List>
    <el-dialog
      :title="form.id ? '编辑轮播图' : '新增轮播图'"
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="轮播图" prop="picId">
          <el-upload
            action=""
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :http-request="httpRequest"
            accept="image/png, image/jpeg, image/gif, image/webp"
          >
            <el-image
              style="width: 280px; height: 120px;"
              v-if="form.picId"
              :src="FILE_URL(form.picId)"
            >
            </el-image>

            <div class="uploader" v-else>
              <i class="el-icon-picture-outline"></i>
              <div>添加照片</div>
            </div>
            <el-button class="changeImg" v-if="form.picId" type="primary"
              >更改</el-button
            >
          </el-upload>
          <div style="font-size: 12px; color: #999;">
            尺寸建议750x220像素以上，大小2M以下，最多1张
          </div>
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-radio-group v-model="form.linksType">
            <el-radio :label="0">内部链接</el-radio>
            <el-radio :label="1">外部链接</el-radio>
          </el-radio-group>
          <el-input
            v-show="form.linksType == 1"
            type="input"
            placeholder="请输入"
            clearable
            v-model="form.skipLinks"
          ></el-input>
          <el-select
            style="width: 100%;"
            v-show="form.linksType == 0"
            v-model="form.skipLinks"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input
            type="input"
            placeholder="请输入"
            v-model="form.seq"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.state">
            <el-radio :label="true">显示</el-radio>
            <el-radio :label="false">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer is-center">
        <el-button @click="isAdd = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { formatDate } from '@/utils'
import { List, mixin, EditableText } from '@/components'
import urlList from '@/utils/appLink'
import {
  getAdList,
  addNewad,
  delAds,
  editAd,
  setAdState,
  sortAd,
} from '@/api/setup'
import { uploadFile } from '@/api' //上传

export default {
  components: {
    List,
    EditableText,
  },
  mixins: [mixin([{ fetchListFunction: getAdList }])],
  data() {
    return {
      url:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
      ],
      isAdd: false,
      options: urlList,
      form: {
        picId: '64F46B174BDA4DB98836838C3B41392C',
        linksType: '',
        skipLinks: '',
        seq: '',
        state: true,
      },
      rules: {
        picId: [{ required: true, message: '请选择图片' }],
      },
      query: {
        pageSize: 10,
        currentNum: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        state: {
          prop: 'slot_state',
        },
        opt: {
          hidden: true,
        },
        fixed: {
          minWidth: 160,
        },
        seq: {
          prop: 'slot_seq',
        },
        picId: {
          prop: 'slot_picId',
        },
      },
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.tableData)
    })
  },
  methods: {
    // 自定义上传行为
    httpRequest({ file, onProgress, onSuccess, onError }) {
      console.log(11)
      const formData = new FormData()
      formData.append('file', file)
      console.log(file)

      uploadFile(formData, onProgress).then(onSuccess).catch(onError)
    },
    handleAvatarSuccess(res) {
      console.log(1111)
      console.log(res)

      // this.form.imageUrl = URL.createObjectURL(file.raw)
      this.form.picId = res
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isBMP = file.type === 'image/bmp'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG && !isGIF && !isBMP) {
        this.$message.error('上传头像图片只能是 JPG PNG GIF BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG || isGIF || isBMP) && isLt2M
    },
    // 弹出框显示
    add(row) {
      this.isAdd = true
      if (row) {
        // 如果存在，赋值显示
        this.form.id = row.id
        this.form.picId = row.picId
        this.form.linksType = row.linksType
        this.form.skipLinks = row.links
        this.form.seq = row.seq
        this.form.state = row.state
      } else {
        // 如果不存在，则为新增，并清空数据
        this.form.picId = 'E68111167F4340F0B55ED195637F95E5'
        this.form.linksType = 1
        this.form.skipLinks = ''
        this.form.seq = 0
        this.form.state = true
      }
    },
    // 新增点击确定
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        // 表单是否有填写
        if (valid) {
          // 判断是新增还是编辑
          if (this.form.id) {
            await editAd({
              ...this.form,
            })
            this.isAdd = false
            this.$message.success('操作成功!')
            this.$_fetchTableData(getAdList)
          } else {
            await addNewad({
              ...this.form,
            })
            this.isAdd = false
            this.$message.success('操作成功!')
            // 重新拉取数据
            this.$_fetchTableData(getAdList)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async confirm(e, id) {
      await sortAd({
        id: id,
        seq: e,
      })
      this.$_fetchTableData(getAdList)
      this.$message.success('操作成功!')
    },
    cancel() {
      this.$message('已取消')
    },

    // 删除操作
    del(id) {
      console.log(this.tableData)
      let ids = []
      let list = this.tableData.multipleSelection
      // 批量删除
      if (!id) {
        if (list.length == 0) {
          this.$message.warning('请选择要删除的数据')
          return false
        }
        for (let j in list) {
          ids.push(list[j].id)
        }
      } else {
        // 单个删除
        ids = id
      }
      this.$confirm('确定删除选中的轮播图吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        // 删除接口
        await delAds({
          ids: ids,
        })
        // 重新拉取数据
        this.$_fetchTableData(getAdList)
        // console.log(id)
        this.$message.success('操作成功!')
      })
    },

    // 开关状态改变
    async stateChange(id, bool) {
      // console.log(this.tableData)
      let ids = []
      let list = this.tableData.multipleSelection
      if (!id) {
        if (list.length == 0) {
          this.$message.warning('请选择要更改的数据')
          return false
        }
        for (let i in list) {
          ids.push(list[i].id)
        }
      } else {
        // 单个修改状态
        ids = id
      }
      await setAdState({
        ids: ids,
        state: bool,
        // 重新拉取数据
      })
      this.$_fetchTableData(getAdList)
      this.$message.success(bool ? '轮播图已显示!' : '轮播图已隐藏')
    },
  },
}
</script>
<style lang="scss" scoped>
.uploader {
  width: 280px;
  height: 120px;
  border: 1px dashed #ccc;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
  i {
    font-size: 28px;
  }
}

.changeImg {
  margin-left: 20px;
  margin-bottom: 20px;
}
</style>
