<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :table-data="tableData"
    >
      <template v-slot:slot_seq="{ row }">
        <EditableText
          v-model="row.seq"
          icon="el-icon-edit"
          @confirm="val => confirm(val, row)"
          @cancel="cancel"
        />
        <!-- <el-button v-if="row.pid" type="primary" size="mini" icon="el-icon-caret-top" circle @click="changeDirection('UP', row)" />
        <el-button v-if="row.pid" type="primary" size="mini" icon="el-icon-caret-bottom" circle @click="changeDirection('DOWN', row)" /> -->
      </template>
      <template v-slot:slot_state="{ row }">
        <el-switch
          :value="row.state"
          @change="val => onChangeState(val, row)"
        />
      </template>
      <template v-slot:slot_recommend="{ row }">
        <el-switch
          :value="row.recommend"
          @change="val => onChangeRecommen(val, row)"
        />
      </template>
      <template v-if="!ishc2v1 == 'hc2v1'" v-slot:footertool>
        <el-button size="mini" type="primary" @click="add()">
          新增科室
        </el-button>
        <el-button size="mini" plain type="primary" @click="batch">
          批量导入
        </el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button size="mini" type="text" @click="add(row)"> 编辑 </el-button>
      </template>
      <template v-slot:slot_sonDeptNum="{ row }">
        <el-button
          v-if="row.sonDeptNum != 0"
          type="text"
          @click="showSonDept(row.id)"
          >{{ row.sonDeptNum }}</el-button
        >
        <span v-else>{{ row.sonDeptNum }}</span>
      </template>
      <template v-slot:slot_doctorNum="{ row }">
        <el-button
          v-if="row.doctorNum != 0"
          type="text"
          @click="show(row.id)"
          >{{ row.doctorNum }}</el-button
        >
        <span v-else>{{ row.doctorNum }}</span>
      </template>
    </List>
    <el-dialog
      :title="form.id ? '编辑科室' : '新增科室'"
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      width="640px"
    >
      <el-form ref="deptForm" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="上级科室">
              <div>{{ form.id || '-' }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属院区" required>
              <div>{{ form.orgCode }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.id" label="科室编码">
              <div>{{ form.id }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="科室名称" required>
              <div>{{ form.name }}</div>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="分类图片" prop="pics">
              <el-upload
                class="avatar-uploader"
                action
                :show-file-list="false"
                accept="image/png, image/jpeg, image/gif, image/webp"
                :on-success="handleImageSuccess"
                :before-upload="beforeImageUpload"
                :http-request="httpRequest"
              >
                <img
                  v-if="form.pics && form.pics[0]"
                  :src="FILE_URL(form.pics[0])"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              建议尺寸：640 x 640 像素
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="科室预约须知">
              <el-input
                type="textarea"
                placeholder="请输入"
                v-model="form.inappoNoticetro"
                :autosize="{ minRows: 2, maxRows: 2 }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="科室简介">
              <el-input
                v-model="form.intro"
                type="textarea"
                placeholder="请输入"
                :autosize="{ minRows: 2, maxRows: 2 }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否推荐" required>
              <el-radio v-model="form.recommend" :label="true">是</el-radio>
              <el-radio v-model="form.recommend" :label="false">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" required>
              <el-radio v-model="form.state" :label="true">启用</el-radio>
              <el-radio v-model="form.state" :label="false">停用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer is-center">
        <el-button size="mini" @click="isAdd = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 子科室 -->
    <el-dialog
      title="子科室"
      :visible.sync="isSonDept"
      :close-on-click-modal="false"
      width="85%"
    >
      <SonDeptList :dept-id="deptId" v-if="isSonDept" />
    </el-dialog>
  </div>
</template>
<script>
import { List, mixin, EditableText } from '@/components'
import SonDeptList from './SonDeptList.vue'
import {
  changeOrder,
  getDepList,
  insertDept,
  editDept,
  changeState,
  changeRecommned,
} from '@/api/zyapi/organization'
import { uploadFile } from '@/api/index'
export default {
  components: {
    List,
    EditableText,
    SonDeptList,
  },
  mixins: [mixin([{ fetchListFunction: getDepList }])],
  data() {
    this.filter = {
      date: {
        props: {
          options: [{ label: '创建时间', value: 0 }],
        },
        keys: ['timeType', 'startTime', 'endTime'],
      },
      search: {
        props: {
          options: [
            { label: '科室名称', value: 0 },
            { label: '科室编码', value: 1 },
            { label: '科室简介', value: 2 },
            { label: '科室简介', value: 3 },
          ],
        },
        keys: ['searchType', 'searchKeywords'],
      },
      popover: [
        {
          props: {
            label: '科室等级',
            options: [
              { label: '不限', value: '' },
              { label: '一级', value: 1 },
              { label: '二级', value: 2 },
            ],
          },
          keys: 'deptLevel',
        },
        {
          props: {
            label: '子科室',
            is: 'InputRange',
          },
          keys: ['sonDeptNumStart', 'sonDeptNumEnd'],
        },
        {
          props: {
            label: '是否推荐',
            options: [
              { label: '不限', value: '' },
              { label: '是', value: true },
              { label: '否', value: false },
            ],
          },
          keys: 'recommend',
        },
        {
          props: {
            label: '科室医生',
            is: 'InputRange',
          },
          keys: ['doctorNumStart', 'doctorNumEnd'],
        },

        {
          props: {
            label: '状态',
            options: [
              { label: '不限', value: '' },
              { label: '启用', value: 1 },
              { label: '停用', value: 2 },
            ],
          },
          keys: 'state',
        },
      ],
    }
    return {
      ishc2v1: process.env.VUE_APP_APIV,
      isAdd: false,
      form: {
        name: '',
        intro: '',
        appoNotice: '',
        pid: '',
        pics: [''],
        recommend: true,
        state: true,
      },
      rules: {
        required: [{ required: true, message: '请上传科室图片' }],
      },
      options: [
        {
          value: '1',
          label: '内科',
        },
        {
          value: '2',
          label: '外科',
        },
      ],
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        createTime: {
          minWidth: 160,
        },
        fixed: {
          minWidth: 60,
        },
        sonDeptNum: {
          minWidth: 90,
          prop: 'slot_sonDeptNum',
        },
        doctorNum: {
          minWidth: 100,
          prop: 'slot_doctorNum',
        },
        seq: {
          label: '排序',
          prop: 'slot_seq',
          minWidth: 160,
        },
        state: {
          label: '状态',
          prop: 'slot_state',
          minWidth: 100,
        },
        recommend: {
          prop: 'slot_recommend',
          minWidth: 100,
        },
      },
      isSonDept: false,
      deptId: '',
    }
  },
  // created() {
  //   getParentDept().then(res => (this.options = res))
  // },
  methods: {
    confirm(val, row) {
      changeOrder({
        id: row.id,
        seq: val,
      }).then(() => {
        this.$_fetchTableData()
      })
    },
    changeDirection(type, row) {
      changeOrder({
        id: row.id,
        direct: type === 'UP',
      }).then(() => {
        this.$_fetchTableData()
      })
    },
    cancel() {},
    add(row) {
      this.isAdd = true
      if (row) {
        row.pics = row.picList
        this.form = { ...row }
      }
    },
    handleImageSuccess(res) {
      this.form.pics = [res]
    },
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isWEBP = file.type === 'image/webp'

      const isLt2M = file.size / 1024 / 720 < 2
      if (!isJPG && !isPNG && !isGIF && !isWEBP) {
        this.$message.error('上传头像图片只能是 JPG PNG GIF WEBP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 720KB!')
      }
      return (isJPG || isPNG || isGIF || isWEBP) && isLt2M
    },
    httpRequest({ file, onProgress, onSuccess, onError }) {
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData, onProgress).then(onSuccess).catch(onError)
    },
    batch() {},
    onChangeState(val, row) {
      changeState({
        id: row.id,
        state: val,
      }).then(() => (row.state = val))
    },
    onChangeRecommen(val, row) {
      changeRecommned({
        id: row.id,
        state: val,
      }).then(() => (row.recommend = val))
    },
    submit() {
      this.$refs.deptForm.validate(valid => {
        if (valid) {
          const func = this.form.id ? editDept : insertDept
          func(this.form).then(() => {
            this.isAdd = false
            this.$message.success('操作成功!')
            this.$_fetchTableData()
            this.$refs.form.resetFields()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 科室医生
    show(id) {
      this.$router.push({
        path: '/jurisdiction/account/list',
        query: {
          deptId: id,
        },
      })
    },
    // 子科室
    showSonDept(id) {
      this.deptId = id
      this.isSonDept = true
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-upload {
  height: 86px;
  width: 86px;
  border: 1px dashed #cacaca;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.el-form-item {
  margin-bottom: 15px;
}
</style>
