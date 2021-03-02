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
          @change="stateChange(row.status, row.id, row.number)"
          active-text="启用"
          inactive-text="禁用"
          :width="50"
          class="textSwitch"
        ></el-switch>
      </template>
      <!-- 排序 -->
      <template v-slot:slot_seq="{ row }">
        <EditableText
          icon="el-icon-edit"
          v-model="row.seq"
          @confirm="sort($event, row.id)"
          @cancel="cancel"
        />
      </template>
      <!-- 操作 -->
      <template v-slot:fixed="{ row }">
        <div class="operation">
          <div class="edit" @click="addNew(row)">修改</div>
        </div>
      </template>

      <!-- 批量操作 -->
      <template v-slot:footertool>
        <el-button type="primary" @click="addNew(false)">新增单位</el-button>
        <el-button type="primary" plain @click="importDialog.visible = true">
          批量导入
        </el-button>
      </template>
      <!-- 使用药品 -->
      <template v-slot:slot_number="{ row }">
        <el-button type="text" @click="drugs(row)">{{ row.number }}</el-button>
      </template>
    </List>
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
            >下载导入模板</el-button
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
    <!-- 编辑弹框 -->
    <el-dialog
      :title="this.form.id ? '编辑单位' : '新增单位'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="50%"
    >
      <el-form
        v-if="dialogVisible"
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="单位名称" prop="unitName">
          <el-input
            v-model="form.unitName"
            maxlength="5"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="typeList">
          <el-select
            v-model="form.typeList"
            placeholder="请选择"
            filterable
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="排序" prop="seq">
          <el-input
            type="sort"
            v-model.number="form.seq"
            autocomplete="off"
          ></el-input>
          <div class="tips">请输入标签排序，数字越大排序越靠前</div>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="false">启用</el-radio>
            <el-radio :label="true">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <ApplicableDrugs ref="drug"></ApplicableDrugs>
  </section>
</template>

<script>
import { List, mixin, EditableText } from '@/components'
import {
  getComList,
  addCom,
  setState,
  editCom,
  orgDrugImportUnitExcel,
} from '@/api/drugs' //批量导入
import { mapState } from 'vuex'
import ApplicableDrugs from './unitCom/ApplicableDrugs'
import {
  modularLexcel, //导入下载
} from '@/api/dictionary'
export default {
  name: 'TableList',
  components: {
    List,
    EditableText,
    ApplicableDrugs,
  },
  mixins: [mixin({ fetchListFunction: getComList })],
  data() {
    return {
      loading: false,
      fileData: '',
      query: {
        pageSize: 10,
        dateType: 0,
        searchType: 0,
        mechanismId: this.$store.state.user.store.id,
        // mechanismId: this.$store.state.user.userId,
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
        unitName: '',
        typeList: [],
        seq: '',
        status,
      },
      options: [
        {
          value: 'BASIC_PACKAGING_UNIT',
          label: '基本包装单位',
        },
        {
          value: 'CONVENTIONAL_PACKAGING_UNIT',
          label: '常规包装单位',
        },
        {
          value: 'DOSAGE_UNIT',
          label: '剂量包装单位',
        },
      ],
      // 表单验证规则
      rules: {
        unitName: [
          { required: true, message: '请输入单位名称', trigger: 'blur' },
          { max: 5, message: '长度在 3 到 5 个字', trigger: 'blur' },
        ],
        typeList: [{ required: true, message: '内容不能为空' }],
        seq: [
          { required: true, message: '排序不能为空' },
          { type: 'number', message: '排序必须为数字值' },
        ],
      },
      // 文本呢编辑
      edittableText: '12',
    }
  },
  methods: {
    async download() {
      modularLexcel('药品单位字典模板.xls')
      // this.$_fetchTableData(getDrugList)
    },
    del() {
      this.$message.success('删除成功')
    },
    // 新增单位
    addNew(row) {
      this.dialogVisible = true
      // console.log(this.dialogVisible)
      // console.log(row)
      if (row.id) {
        // 如果存在，赋值显示
        this.form.id = row.id
        this.form.unitName = row.unitName
        this.form.typeList = row.typeList
        this.form.seq = row.seq
        this.form.status = row.status
      } else {
        // 如果不存在，则为新增，并清空数据
        this.form.id = ''
        this.form.unitName = ''
        this.form.typeList = []
        this.form.seq = 0
        this.form.status = false
      }
    },
    // 新增点击确定
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        // 表单是否有填写
        if (valid) {
          // 有 id 编辑
          if (this.form.id) {
            await editCom({
              ...this.form,
              mechanismId: this.$store.state.user.store.id,
            })
            this.dialogVisible = false
            this.$message.success('操作成功!')
            this.$_fetchTableData(getComList)
          } else {
            // 无 id 新增
            let res = await addCom({
              ...this.form,
              mechanismId: this.$store.state.user.store.id,
            })
            console.log(res)

            this.dialogVisible = false
            this.$message.success('操作成功!')
            // 重新拉取数据
            this.$_fetchTableData(getComList)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
    //批量导入替换上次添加的文件
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
        orgDrugImportUnitExcel(this.fileData)
          .then(() => {
            this.$message.success('操作成功!')
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
    // 修改状态
    // async stateChange(id, bool) {
    //   await setState({
    //     id: id,
    //     status: bool,
    //     mechanismId: this.userId,
    //   })
    //   this.$_fetchTableData(getComList)
    //   this.$message.success('操作成功!')
    // },
    async stateChange(bool, id, number) {
      console.log(bool, number, '药房')
      if (number != 0 && bool == true) {
        this.$message({
          message: '只有使用药品为0时可以禁用',
          type: 'warning',
        })
        setTimeout(() => {
          this.$_fetchTableData(getComList)
        }, 100)
      } else {
        await setState({
          id: id,
          status: bool,
          mechanismId: this.$store.state.user.store.id,
        })
        this.$_fetchTableData(getComList)
        this.$message.success(!bool ? '单位启用成功！' : '单位禁用成功！')
      }
    },
    // 修改排序
    async sort(event, id) {
      await setState({
        id: id,
        seq: event,
        mechanismId: this.$store.state.user.store.id,
      })
      this.$_fetchTableData(getComList)
      this.$message.success('操作成功!')
    },
    cancel() {},
    //使用药品
    drugs(row) {
      // this.$refs.drug.title = row.address
      this.$refs.drug.open(row)
    },
  },
  computed: {
    filter() {
      return {
        search: {
          props: {
            options: [{ label: '单位名称', value: 0 }],
          },
          keys: ['searchType', 'unitName'],
        },

        popover: [
          {
            props: {
              label: '药品',
              is: 'InputRange',
            },
            keys: ['numberMin', 'numberMax'],
          },

          // {
          //   value: 'BASIC_PACKAGING_UNIT',
          //   label: '基本包装单位',
          // },
          // {
          //   value: 'CONVENTIONAL_PACKAGING_UNIT',
          //   label: '常规包装单位',
          // },
          // {
          //   value: 'DOSAGE_UNIT',
          //   label: '剂量包装单位',
          // },
          // {
          //   value: 'DEFAULT_UNIT',
          //   label: '默认包装单位',
          // },
          {
            props: {
              label: '单位类型',
              options: [
                { label: '不限', value: '' },
                { label: '基本包装单位', value: 'BASIC_PACKAGING_UNIT' },
                { label: '常规包装单位', value: 'CONVENTIONAL_PACKAGING_UNIT' },
                {
                  label: '剂量包装单位',
                  value: 'DOSAGE_UNIT',
                },
              ],
            },
            keys: 'unitType',
          },
          {
            props: {
              label: '状态',
              options: [
                { label: '不限', value: '' },
                { label: '启用', value: false },
                { label: '禁用', value: true },
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
        seq: {
          prop: 'slot_seq',
          minWidth: 80,
        },
        number: {
          prop: 'slot_number',
        },
      }
    },
    ...mapState('user', ['userId']),
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
.tips {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
</style>
