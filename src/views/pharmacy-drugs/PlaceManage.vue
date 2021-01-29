<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <!-- 切换开关 -->
      <template v-slot:slot_status="{ row }">
        <el-switch
          v-model="row.status"
          :active-value="false"
          :inactive-value="true"
          active-color="#0AB2C1"
          inactive-color="#CCCCCC"
          @change="setState(row.id, row.status)"
          active-text="启用"
          inactive-text="禁用"
          :width="50"
          class="textSwitch"
        >
        </el-switch>
      </template>
      <!-- 操作 -->
      <template v-slot:fixed="{ row }">
        <div class="operation">
          <div class="edit" @click="addNew(row)">修改</div>
        </div>
      </template>

      <!-- 批量操作 -->
      <template v-slot:footertool>
        <el-button type="primary" @click="addNew(false)">新增产地 </el-button>
        <el-button
          type="primary"
          plain
          @click="
            importDialog.visible = true
            importDialog.sonListS = []
          "
        >
          批量导入
        </el-button>
      </template>
      <!-- 使用药品 -->
      <template v-slot:slot_number="{ row }">
        <el-button type="text" @click="drugs(row)">{{ row.number }}</el-button>
      </template>
    </List>
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
          <el-button size="small" @click="importDialog.visible = false"
            >取消</el-button
          >
          <el-button size="small" type="primary" @click="preservation">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 编辑/新增弹框 -->
    <el-dialog
      :title="form.id ? '编辑产地' : '新增产地'"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="产地名称" prop="originName">
          <el-input
            v-model="form.originName"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            type="textarea"
            v-model="form.remark"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="false">启用</el-radio>
            <el-radio :label="true">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submit" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <ApplicableDrugs ref="drug"></ApplicableDrugs>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import {
  getOriginList,
  addOrigin,
  editOrigin,
  setStateOrigin,
  importOriginExcel, // 批量导入
  // Unitdetails, //
} from '@/api/drugs'
import {
  modularLexcel, //导入下载
} from '@/api/dictionary'
// import { getDrugsList } from '@/api/organization'
import ApplicableDrugs from './originCom/ApplicableDrugs'

export default {
  name: 'TableList',
  components: {
    List,
    ApplicableDrugs,
  },
  mixins: [mixin({ fetchListFunction: getOriginList })],
  data() {
    return {
      loading: false,
      fileData: '',
      fileList: [],
      query: {
        pageSize: 10,
        dateType: 0,
        searchType: 0,
        mechanismId: this.$store.state.user.store.id,
      },
      // 查看弹框是否显示
      dialogVisible: false,
      switchValue: false,
      importDialog: {
        visible: false,
        sonListS: [],
      },
      // 产地表单
      form: {
        originName: '',
        remark: '',
        status: '',
      },
      // 表单验证规则
      rules: {
        originName: [
          { required: true, message: '请输入产地名称', trigger: 'blur' },
          { max: 20, message: '长度在 20 之内', trigger: 'blur' },
        ],
        remark: [
          { required: true, message: '请输入描述', trigger: 'blur' },
          { max: 100, message: '长度在 100 之内', trigger: 'blur' },
        ],
      },
    }
  },

  methods: {
    async download() {
      modularLexcel('药品产地模板.xls')
    },
    // 删除操作
    del() {
      this.$message.success('删除成功')
    },
    // 打开弹窗
    addNew(row) {
      this.dialogVisible = true
      if (row) {
        // 如果存在，赋值显示
        this.form.id = row.id
        this.form.originName = row.originName
        this.form.remark = row.remark
        this.form.status = row.status
      } else {
        // 如果不存在，则为新增，并清空数据
        this.form.originName = ''
        this.form.id = ''
        this.form.remark = ''
        this.form.status = false
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    // 新增/编辑提交
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        // 表单是否有填写
        if (valid) {
          // 有 id 编辑
          if (this.form.id) {
            await editOrigin({
              ...this.form,
              mechanismId: this.$store.state.user.store.id,
            })
            this.dialogVisible = false
            this.$message.success('操作成功!')
            this.$_fetchTableData(getOriginList)
          } else {
            // 无 id 新增
            let res = await addOrigin({
              ...this.form,
              mechanismId: this.$store.state.user.store.id,
            })
            console.log(res)
            this.dialogVisible = false
            this.$message.success('操作成功!')
            // 重新拉取数据
            this.$_fetchTableData(getOriginList)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改状态
    async setState(id, state) {
      await setStateOrigin({
        id: id,
        status: state,
      })
      this.$message.success(!state ? '产地启用成功！' : '产地禁用成功！')
      // 重新拉取数据
      this.$_fetchTableData(getOriginList)
    },
    //使用药品
    drugs(row) {
      // this.$refs.drug.title = row.address
      this.$refs.drug.open(row)
    },
    //关闭批量导入弹窗
    handleClose(done) {
      done()
      this.importDialog.visible = false
    },
    //文件上传
    beforeUpload(file) {
      let ExcalBar = ['xls', 'xlsm', 'xltx']
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
    //上传的文件是否删除
    beforeRemove(file) {
      return this.$confirm(`确定删除 ${file.name}？`)
    },
    httpRequest({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      this.fileData = formData
    },
    hanleChange(file, fileList) {
      this.importDialog.sonListS = [fileList[fileList.length - 1]]
    },

    //药房端批量导入
    preservation() {
      if (this.fileData) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        // debugger
        importOriginExcel(this.fileData, {
          mechanismId: this.query.mechanismId,
        })
          .then(() => {
            this.$message.success('操作成功!')
            this.$_fetchTableData()
          })
          .finally(() => {
            setTimeout(() => {
              loading.close()
            }, 1000)
          })
        // .catch(e => loading && loading.close())
        this.importDialog.visible = false
        this.importDialog.sonListS = []
      } else {
        this.$message.success('请上传文件')
      }
    },
  },
  computed: {
    filter() {
      return {
        search: {
          props: {
            options: [
              { label: '产地名称', value: 0 },
              { label: '描述', value: 1 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },

        popover: [
          {
            props: {
              label: '药品',
              is: 'InputRange',
            },
            keys: ['numberMin', 'numberMax'],
          },
          {
            props: {
              label: '状态',
              options: [
                { label: '不限', value: '' },
                { label: '启用', value: false },
                { label: '停用', value: true },
              ],
            },
            keys: 'status',
          },
        ],
      }
    },
    columns() {
      return {
        index: {
          hidden: true,
        },
        status: {
          prop: 'slot_status',
        },
        number: {
          prop: 'slot_number',
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/_variables.scss';

::v-deep .el-dialog {
  padding-right: 50px;
}

::v-deep .el-dialog__title {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(26, 26, 26, 1);
}
::v-deep .el-dialog__footer {
  display: flex;
  justify-content: center;
  padding-left: 70px;
}

::v-deep .el-textarea__inner {
  height: 80px;
  resize: none !important;
}

.operation {
  display: flex;
  align-items: center;
  white-space: nowrap;
  .edit {
    color: $--color-primary;
    margin-right: 20px;
    cursor: pointer;
  }
  .delete {
    color: #f74a4a;
    cursor: pointer;
  }
}
</style>
