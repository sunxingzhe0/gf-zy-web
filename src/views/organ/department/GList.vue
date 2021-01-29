<template>
  <div class="view__card">
    <List
      v-model="faList.query"
      :filter="filter"
      :columns="faList.columns"
      :tableData="faList.tableData"
      :treeSet="{ key: 'id', props: 'sonDeptList' }"
      @expandChange="expandChange"
    >
      <!-- <template v-slot:slot_title="{ row }">
        <el-button v-if="row.sonDeptList" type="text" size="mini">{{
          row.address
        }}</el-button>
        <span v-else>{{ row.address }}</span>
      </template> -->

      <template v-slot:slot_doctorNum="{ row }">
        <router-link
          v-if="row.doctorNum != 0"
          class="el-button el-button--text el-button--mini"
          :to="{
            path: '/jurisdiction/account/list',
            query: {
              deptId: row.id,
            },
          }"
        >
          {{ row.doctorNum }}
        </router-link>
        <p v-else>{{ row.doctorNum }}</p>
      </template>

      <!-- 子科室 -->
      <template v-slot:slot_sonDeptNum="{ row }">
        <el-button
          type="text"
          @click="isShowSon(row)"
          v-if="row.sonDeptNum != 0"
        >
          {{ row.sonDeptNum }}</el-button
        >
        <span v-else> {{ row.sonDeptNum }}</span>
      </template>

      <template v-slot:slot_seq="{ row }">
        <!-- v-if="!row.pid" -->
        <EditableText
          icon="el-icon-edit"
          v-model="row.seq"
          @confirm="confirm($event, row.id)"
          @cancel="cancel"
        ></EditableText>
        <!-- <div v-else>
          <i
            class="el-icon-top"
            v-if="row.canUp"
            @click="handleSort(true, row.id)"
          ></i>
          <i
            class="el-icon-bottom"
            v-if="row.canDown"
            @click="handleSort(false, row.id)"
          ></i>
        </div> -->
      </template>
      <template v-slot:slot_level="{ row }">
        <p v-show="row.level == 1">一级</p>
        <p v-show="row.level == 2">二级</p>
      </template>

      <template v-slot:slot_state="{ row }">
        <el-switch
          v-model="row.state"
          @change="setEnable(row)"
          active-text="启用"
          inactive-text="禁用"
          :width="50"
          class="textSwitch"
        >
        </el-switch>
      </template>
      <template v-slot:slot_recommend="{ row }">
        <el-switch v-model="row.recommend" @change="setRecommend(row)">
        </el-switch>
      </template>
      <template v-slot:footertool>
        <!-- <el-button size="mini" type="primary" @click="add()">
          新增科室
        </el-button>
        <el-button
          size="mini"
          plain
          type="primary"
          @click="importDialog.visible = true"
        >
          批量导入
        </el-button> -->
      </template>
      <template v-slot:fixed="{ row }">
        <el-button size="mini" type="text" @click="add(row)"> 修改 </el-button>
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
          <el-col :span="16">
            <el-form-item label="上级科室">
              <el-select v-model="form.name">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <!-- <div>{{ form.name || '-' }}</div> -->
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="所属院区" required>
              <el-select v-model="form.orgName">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.orgName"
                  :value="item.id"
                ></el-option>
              </el-select>
              <!-- <div>{{ form.orgName }}</div> -->
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item v-if="form.id" label="科室编码">
              <div>{{ form.id }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="科室名称" required>
              <el-input v-model="form.name"></el-input>
              <!-- <div>{{ form.name }}</div> -->
            </el-form-item>
          </el-col>

          <el-col :span="16">
            <el-form-item label="分类图片" prop="pics">
              <el-upload
                class="avatar-uploader"
                action
                :show-file-list="false"
                accept="image/png, image/jpeg, image/gif, image/webp"
                :on-success="handleImageSuccess"
                :before-upload="beforeImageUpload"
                :http-request="httpRequestImg"
              >
                <img
                  v-if="form.photo"
                  :src="FILE_URL(form.photo)"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              建议尺寸：640 x 640 像素
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="科室预约须知">
              <el-input
                type="textarea"
                placeholder="请输入"
                v-model="form.notice"
                maxlength="200"
                show-word-limit
                :autosize="{ minRows: 2, maxRows: 2 }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="科室简介">
              <el-input
                v-model="form.intro"
                type="textarea"
                placeholder="请输入"
                maxlength="200"
                show-word-limit
                :autosize="{ minRows: 2, maxRows: 2 }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="是否推荐" required>
              <el-radio v-model="form.recommend" :label="true">是</el-radio>
              <el-radio v-model="form.recommend" :label="false">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="16">
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

    <!--批量导入  -->
    <el-dialog
      title="批量导入"
      :visible="importDialog.visible"
      append-to-body
      custom-class="component__dialog"
      :before-close="handleClose"
    >
      <el-form
        ref="importForm"
        :v-model="importDialog.model"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item prop="upload">
          <el-button size="small" type="primary" @click="download"
            >下载导入模块</el-button
          >
          <el-upload
            class="upload-demo"
            action
            accept=".xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :before-remove="beforeRemove"
            :file-list="importDialog.sonListS"
            :http-request="httpRequest"
            :before-upload="beforeUpload"
            :limit="1"
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
          <el-button size="small" @click="importDialog.visible = false"
            >取消</el-button
          >
          <el-button size="small" type="primary" @click="preservation">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 子科室弹框 -->
    <!-- <el-dialog title="内科-子科室" :visible.sync="isShow" width="80%">
      <List
        v-model="sonList.query"
        :columns="sonList.columns"
        :tableData="sonList.tableData"
      >
        <template v-slot:slot_recommend="{ row }">
          <el-switch v-model="row.recommend" @change="setRecommend(row)">
          </el-switch>
        </template>
        <template v-slot:slot_state="{ row }">
          <el-switch v-model="row.state" @change="setEnable(row)"> </el-switch>
        </template>
        <template v-slot:slot_seq="{ row }">
          <EditableText
            icon="el-icon-edit"
            v-model="row.seq"
            @confirm="confirm($event, row.id)"
            @cancel="cancel"
          ></EditableText>
        </template>
      </List>
    </el-dialog> -->

    <sonList
      ref="sonList"
      @update="$_fetchTableData()"
      :faDept="faDept"
    ></sonList>
  </div>
</template>
<script>
import { List, mixin, EditableText } from '@/components'
import {
  getDepList,
  getDepData,
  addDept,
  editDept,
  setRecommendState,
  setEnableState,
  sortDept,
  batchImport, //机构批量导入
} from '@/api/organization'
import {
  modularLexcel, //导入下载
} from '@/api/dictionary'
import sonList from './components/sonList'
import { uploadFile } from '@/api/index'
export default {
  components: {
    List,
    EditableText,
    sonList,
  },
  mixins: [mixin([{ fetchListFunction: getDepList, prop: 'faList' }])],
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
            { label: '所属院区', value: 4 },
            { label: '科室简介', value: 2 },
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
              { label: '启用', value: true },
              { label: '禁用', value: false },
            ],
          },
          keys: 'state',
        },
      ],
    }
    return {
      fileData: '',
      faList: {
        query: {
          timeType: 0,
          searchType: 0,
          pageSize: 10,
          currentNum: 1,
          deptLevel: '',
        },
        columns: {
          index: {
            hidden: true,
          },
          sonDeptNum: {
            minWidth: 120,
            prop: 'slot_sonDeptNum',
          },
          doctorNum: {
            label: '科室医生',
            prop: 'slot_doctorNum',
            minWidth: 120,
          },
          createTime: {
            minWidth: 180,
          },
          fixed: {
            minWidth: 60,
          },
          level: {
            prop: 'slot_level',
            minWidth: 120,
          },
          address: {
            prop: 'slot_title',
            minWidth: 150,
          },
          seq: {
            label: '排序',
            prop: 'slot_seq',
            minWidth: 140,
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
          id: {
            minWidth: 150,
          },
          orgName: {
            hidden: true,
          },
          faDeptName: {
            hidden: true,
          },
        },
      },
      importDialog: {
        visible: false,
        sonListS: [],
      },
      submitLoading: false, //创建按钮loading状态
      isAdd: false,
      isShow: false,
      form: {
        name: '',
        intro: '',
        pid: '',
        photo: '',
        notice: '',
        orgName: '',
        recommend: false,
        state: true,
      },
      rules: {
        name: [{ required: true, message: '请输入科室名称' }],
        relatedDept: [{ required: true, message: '请选择关联科室' }],
      },
      options: [],
      // 父科室名字
      faDept: {},
      addLoading: false, // 加载父级科室
    }
  },
  created() {
    this.getDeptList()
    // this.preservation()
  },
  methods: {
    async download() {
      modularLexcel('科室导入模板.xlsx')
    },
    expandChange(row, expanded) {
      console.log(row, expanded)
    },
    // 科室列表获取
    async getDeptList() {
      const res = await getDepData({
        tree: false,
        type: 'WEB', //区分web和h5返回方式有更改
      })
      console.log(res, '*****111')
      this.options = res
      let obj_ = {
        id: '',
        name: '暂无',
        state: true,
      }
      this.options.unshift(obj_)
    },
    // 排序 - 父科室
    async confirm(e, id) {
      await sortDept({
        id: id,
        seq: parseInt(e),
      })
      this.$message.success('操作成功！')
      this.$_fetchTableData(getDepList)
    },
    // 排序 - 子科室
    async handleSort(bool, id) {
      await sortDept({
        direct: bool,
        id: id,
      })
      this.$message.success('操作成功！')
      this.$_fetchTableData(getDepList)
    },
    handleImageSuccess(res) {
      this.form.photo = res
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
    httpRequestImg({ file, onProgress, onSuccess, onError }) {
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData, onProgress).then(onSuccess).catch(onError)
    },
    // 子科室弹框显示
    isShowSon(row) {
      // console.log(row)
      // this.$set(this.sonList.query, 'pid', id)
      // console.log(this.sonList.query.pid)
      // this.getSonLists(id)
      this.$refs.sonList.open(row)
      this.faDept = row
      // this.isShow = true
    },
    // async getSonLists(id) {
    //   const res = await getSonList({
    //     pageSize: 10,
    //     currentNum: 1,
    //     pid: id,
    //   })
    //   this.sonList.tableData = res
    // },
    cancel() {},
    // 编辑 、 新增弹框
    async add(row) {
      this.isAdd = true
      this.addLoading = true
      await this.getDeptList()
      this.addLoading = false
      if (row) {
        this.form.id = row.id
        this.form.name = row.name
        this.form.intro = row.intro
        this.form.pid = row.pid
        this.form.photo = row.photo
        this.form.notice = row.notice
        this.form.orgName = row.orgName
        this.form.recommend = row.recommend
        this.form.state = row.state
      } else {
        this.form.id = ''
        this.form.name = ''
        this.form.intro = ''
        this.form.pid = ''
        this.form.photo = ''
        this.form.notice = ''
        this.form.orgName = ''
        this.form.recommend = false
        this.form.state = true
      }
    },
    batch() {},
    // 编辑，新增提交
    submit() {
      this.$refs.deptForm.validate(async valid => {
        if (valid) {
          this.submitLoading = true
          if (this.form.id) {
            await editDept({
              ...this.form,
            })
            this.$_fetchTableData(getDepList)
            this.isAdd = false
            this.$message.success('操作成功!')
            this.submitLoading = false
          } else {
            await addDept({
              ...this.form,
            })
            this.$_fetchTableData(getDepList)
            this.isAdd = false
            this.$message.success('操作成功!')
            this.submitLoading = false
          }
          this.isAdd = false
          this.$message.success('操作成功!')
        } else {
          return false
        }
      })
    },
    //变更推荐状态
    async setRecommend(row) {
      await setRecommendState({
        id: row.id,
        state: row.recommend,
      })
      this.$_fetchTableData(getDepList)
      this.$message.success(row.recommend ? '科室推荐成功!' : '已取消科室推荐')
    },
    // 变更启用状态
    async setEnable(row) {
      await setEnableState({
        id: row.id,
        state: row.state,
      })
      this.$_fetchTableData(getDepList)
      this.$message.success(row.state ? '科室启用成功!' : '科室禁用成功')
      //变更后重新获取可选父级列表(变更父级状态)
      if (row.level == 1) {
        this.getDeptList()
      }
    },
    //关闭批量导入弹窗
    handleClose(done) {
      done()
      this.importDialog.visible = false
    },
    //文件上传
    beforeUpload(file) {
      let ExcalBar = ['xlsx', 'xlsm', 'xltx']
      const isExcal =
        ExcalBar.indexOf(file.name.substring(file.name.lastIndexOf('.') + 1)) >
        -1
          ? true
          : false
      // const isLt2M = file.size / 1024 / 1024 < 2
      if (!isExcal) {
        this.$message.error('上传excal只能是 excal 格式 !')
      }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2 MB !')
      // }
      return isExcal
    },
    //上传的文件是否删除
    beforeRemove(file) {
      return this.$confirm(`确定删除 ${file.name}？`)
    },
    httpRequest({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      this.fileData = formData
      // Promise.resove(formData, onProgress)
      //   .then(onSuccess)
      //   .catch(onError)
      //   .finally(() => {
      //     this.importDialog.loading = false
      //   })
    },
    //机构批量导入
    preservation() {
      batchImport(this.fileData).then(() => {
        this.$message.success('操作成功!')
      })
      this.importDialog.visible = false
      this.importDialog.sonListS = []
    },
  },
}
</script>

<style lang="scss" scope>
.avatar-uploader {
  height: 86px;
  width: 86px;
  border: 1px dashed #cacaca;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.el-icon-top {
  margin-right: 10px;
  font-size: 20px;
  cursor: pointer;
}
.el-icon-bottom {
  font-size: 20px;
  cursor: pointer;
}
.el-select > .el-input {
  width: 450px;
}
.el-form-item {
  margin-bottom: 16px;
}
</style>
