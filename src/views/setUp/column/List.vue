<template>
  <div class="view__card">
    <div class="flex-start-center title">
      <span>栏目标题</span>
      <EditableText
        icon="el-icon-edit"
        v-model="title"
        @confirm="editTitle"
        @cancel="cancel"
      ></EditableText>
    </div>
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
        <el-button size="mini" type="primary" plain @click="del()">
          批量删除
        </el-button>
        <el-button
          size="mini"
          type="primary"
          plain
          @click="stateChange('', false)"
        >
          批量隐藏
        </el-button>
        <el-button
          size="mini"
          type="primary"
          plain
          @click="stateChange('', true)"
        >
          批量显示
        </el-button>
        <el-button size="mini" type="primary" @click="add(false)">
          新增栏目
        </el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button size="mini" type="text" @click="add(row)"> 修改 </el-button>
        <!-- <el-button
          v-if="!row.state"
          size="mini"
          type="text"
          @click="stateChange_(true, [row.id])"
        >
          显示
        </el-button>
        <el-button
          v-if="row.state"
          size="mini"
          type="text"
          @click="stateChange_(false, [row.id])"
        >
          隐藏
        </el-button> -->
        <el-button
          size="mini"
          style="color: #f74949;"
          type="text"
          @click="del([row.id])"
        >
          删除
        </el-button>
      </template>
    </List>
    <el-dialog
      :title="form.id ? '编辑图片' : '新增图片'"
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="轮播图" prop="picId">
          <el-upload
            action=""
            :show-file-list="false"
            accept="image/png, image/jpeg, image/gif, image/webp"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :http-request="httpRequest"
          >
            <el-image
              style="width: 280px; height: 120px;"
              v-if="form.picId"
              :src="FILE_URL(form.picId)"
            >
            </el-image>

            <div class="uploader" v-else>
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <div>添加照片</div>
            </div>
            <el-button
              class="changeImg"
              v-if="form.picId"
              size="mini"
              type="primary"
              >更改</el-button
            >
          </el-upload>
          <div style="font-size: 12px; color: #999;">
            尺寸建议750x220像素以上，大小2M以下，最多1张
          </div>
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-radio-group v-model="form.linksType" @change="handleRadio">
            <el-radio :label="0">内部链接</el-radio>
            <el-radio :label="1">外部链接</el-radio>
          </el-radio-group>
          <el-input
            v-show="form.linksType == 1"
            type="input"
            placeholder="请输入"
            clearable
            v-model="form.inlinks"
          ></el-input>
          <el-select
            style="width: 100%;"
            v-show="form.linksType == 0"
            v-model="form.Defaultvalue"
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
        <el-button size="mini" @click="isAdd = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { formatDate } from '@/utils'
import { List, mixin, EditableText } from '@/components'
import urlList from '@/utils/appLink'
import {
  getColumnList,
  delCol,
  addNewCol,
  setColState,
  sortCol,
  editCol,
  titleCol,
  editTitleCol,
} from '@/api/setup'
import { uploadFile } from '@/api' //上传

export default {
  components: {
    List,
    EditableText,
  },
  mixins: [mixin([{ fetchListFunction: getColumnList }])],
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
      title: '-',
      form: {
        picId: '64F46B174BDA4DB98836838C3B41392C',
        linksType: '',
        skipLinks: '',
        inlinks: '',
        seq: '',
        state: '',
        Defaultvalue: '',
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
        age: {
          hidden: true,
        },
        createTime: {
          hidden: true,
        },
        address: {
          label: '标题',
          prop: 'slot_title',
          minWidth: 340,
        },
        nurseId: {
          hidden: true,
        },
        state: {
          prop: 'slot_state',
        },
        opt: {
          hidden: true,
        },
        seq: {
          prop: 'slot_seq',
        },
        fixed: {
          minWidth: 90,
        },
        picId: {
          prop: 'slot_picId',
        },
      },
    }
  },
  created() {
    this.getTitle()
  },
  methods: {
    //切换状态 在切换保存默认
    handleRadio(val) {
      // if (val === 1) {
      //   this.form.skipLinks = ''
      // } else if (val === 0) {
      //   this.form.skipLinks = ''
      // }
    },
    // 自定义上传行为
    httpRequest({ file, onProgress, onSuccess, onError }) {
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData, onProgress).then(onSuccess).catch(onError)
    },
    // 上传成功的回调函数
    handleAvatarSuccess(res) {
      // this.form.imageUrl = URL.createObjectURL(file.raw)
      this.form.picId = res
      console.log(res)
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
    // 排序文本编辑
    async confirm(e, id) {
      await sortCol({
        id: id,
        seq: e,
      })
      this.$_fetchTableData(getColumnList)
      this.$message.success('操作成功!')
    },

    cancel() {},

    // 删除操作
    del(id) {
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
      this.$confirm('确定删除选中的图片吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        // 删除接口
        await delCol({
          ids: ids,
        })
        // 重新拉取数据
        this.$_fetchTableData(getColumnList)
        // console.log(id)
        this.$message.success('操作成功!')
      })
    },
    add(row) {
      this.isAdd = true
      if (row) {
        this.form.id = row.id
        this.form.picId = row.picId
        this.form.linksType = row.linksType
        if (row.linksType == 0) {
          this.form.Defaultvalue = row.links
          this.form.inlinks = ''
        } else {
          this.form.inlinks = row.links
          this.form.Defaultvalue = ''
        }
        this.form.seq = row.seq
        this.form.state = row.state
      } else {
        this.form.id = ''
        this.form.picId = 'E68111167F4340F0B55ED195637F95E5'
        this.form.linksType = 1
        this.form.skipLinks = ''
        this.form.inlinks = ''
        this.form.seq = 0
        this.form.Defaultvalue = ''
        this.form.state = true
      }
      console.log(this.form)
    },
    // 新增点击确定
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          if (this.form.linksType == 0) {
            this.form.skipLinks = this.form.Defaultvalue
          } else {
            this.form.skipLinks = this.form.inlinks
          }
          if (this.form.id) {
            await editCol({
              ...this.form,
            })
            this.isAdd = false
            this.$message.success('操作成功!')
            // 重新拉取数据
            this.$_fetchTableData(getColumnList)
          } else {
            await addNewCol({
              ...this.form,
            })
            this.isAdd = false
            this.$message.success('操作成功!')
            // 重新拉取数据
            this.$_fetchTableData(getColumnList)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 开关状态改变
    async stateChange(id, bool) {
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
      await setColState({
        ids: ids,
        state: bool,
        // 重新拉取数据
      })
      this.$_fetchTableData(getColumnList)
      this.$message.success(bool ? '栏目已显示!' : '栏目已隐藏')
    },
    // 点击显示隐藏
    async stateChange_(bool, id) {
      let ids = id
      await setColState({
        ids: ids,
        state: bool,
        // 重新拉取数据
      })
      this.$_fetchTableData(getColumnList)
      this.$message.success('操作成功!')
    },
    // 获取栏目标题
    async getTitle() {
      let res = await titleCol({
        id: 'EB8EE5EEC0F34652A05E930BFB158D51',
      })
      this.title = res.title
    },
    // 编辑栏目标题
    async editTitle(e) {
      await editTitleCol({
        title: e,
        id: 'EB8EE5EEC0F34652A05E930BFB158D51',
      })
      this.getTitle()
      this.$message.success('操作成功!')
    },
  },
}
</script>
<style lang="scss" scoped>
.title {
  padding: 0 15px;
  margin-bottom: 20px;
  span {
    color: #666;
    margin-right: 15px;
  }
}
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
