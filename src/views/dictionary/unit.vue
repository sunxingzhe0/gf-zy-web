<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:footertool>
        <el-button size="mini" type="primary" @click="add()">
          新增单位
        </el-button>
        <el-button
          size="mini"
          plain
          type="primary"
          @click="
            importDialog.visible = true
            importDialog.sonListS = []
          "
        >
          批量导入
        </el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button size="mini" type="text" @click="add(row)"> 修改 </el-button>
      </template>
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
      <template v-slot:slot_seq="{ row }">
        <EditableText
          icon="el-icon-edit"
          v-model="row.seq"
          @confirm="confirm($event, row.id)"
          @cancel="cancel"
        ></EditableText>
      </template>
      <template v-slot:slot_number="{ row }">
        <el-button type="text" @click="drugs(row)">{{ row.number }}</el-button>
      </template>
    </List>
    <el-dialog
      :title="form.id ? '修改单位' : '新增单位'"
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="单位名称" prop="unitName">
          <el-input
            type="text"
            placeholder="请输入"
            v-model="form.unitName"
            maxlength="5"
            show-word-limit
          ></el-input>
        </el-form-item>

        <!--类型-->
        <el-form-item label="类型" prop="typeList">
          <el-checkbox-group v-model="form.typeList">
            <el-checkbox label="CONVENTIONAL_PACKAGING_UNIT"
              >基本包装单位</el-checkbox
            >
            <el-checkbox label="BASIC_PACKAGING_UNIT">常规包装单位</el-checkbox>
            <el-checkbox label="DOSAGE_UNIT">剂量单位</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="排序" prop="seq">
          <el-input
            type="input"
            placeholder="请输入"
            v-model="form.seq"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="false">启用</el-radio>
            <el-radio :label="true">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer is-center">
        <el-button size="mini" @click="isAdd = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
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
        <el-form-item prop="upload"
          ><el-button size="small" type="primary" @click="download"
            >下载导入模块</el-button
          ><el-upload
            class="upload-demo"
            action
            accept=".xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :file-list="importDialog.sonListS"
            :http-request="httpRequest"
            :before-upload="beforeUpload"
            :on-change="hanleChange"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传<code>excel</code> 文件,且不能超过2MB
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
    <!-- 药品列表 -->
    <ApplicableDrugs ref="drug"></ApplicableDrugs>
  </div>
</template>
<script>
import { List, mixin, EditableText } from '@/components'
import {
  getUnitList,
  addUnit,
  sortUnit,
  setStatetUnit,
  editUnit,
  importUnitExcel,
  modularLexcel, //导入下载
} from '@/api/dictionary'
import ApplicableDrugs from './components/ApplicableDrugs'
// import { functions } from 'lodash'
export default {
  components: {
    List,
    EditableText,
    ApplicableDrugs,
  },
  mixins: [mixin([{ fetchListFunction: getUnitList }])],
  data() {
    this.filter = {
      popover: [
        {
          props: {
            label: '使用药品',
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
              { label: '禁用', value: true },
            ],
          },
          keys: 'status',
        },
        {
          props: {
            label: '单位名称',
            options: [
              { label: '不限', value: '' },
              { label: '基本包装单位', value: 1 },
              { label: '常规包装单位', value: 2 },
              { label: '剂量单位', value: 3 },
            ],
          },
          keys: [
            'CONVENTIONAL_PACKAGING_UNIT',
            'BASIC_PACKAGING_UNIT',
            'DOSAGE_UNIT',
          ],
        },
      ],
      search: {
        props: {
          options: [{ label: '单位名称', value: 0 }],
        },
        keys: ['searchType', 'unitName'],
      },
    }
    return {
      loading: false,
      fileData: '',
      importDialog: {
        visible: false,
        sonListS: [],
      },
      isAdd: false,
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
        createDate: {
          minWidth: 180,
        },

        fixed: {
          minWidth: 100,
        },
        status: {
          prop: 'slot_status',
        },
        seq: {
          prop: 'slot_seq',
        },
        number: {
          prop: 'slot_number',
        },
      },
      options: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
        },
        {
          value: '选项3',
          label: '蚵仔煎',
        },
        {
          value: '选项4',
          label: '龙须面',
        },
        {
          value: '选项5',
          label: '北京烤鸭',
        },
      ],
      form: {
        unitName: '',
        seq: '',
        status: '',
        typeList: [],
      },
      rules: {
        unitName: [
          { required: true, message: '请输入单位名称', trigger: 'blur' },
        ],
        seq: [{ required: true, message: '请为单位排序', trigger: 'blur' }],
        typeList: [
          { required: true, message: '请选择单位类型', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    //下载导入模块
    async download() {
      modularLexcel('药品单位字典模板.xls')
    },
    add(row) {
      this.isAdd = true
      if (row) {
        this.form.id = row.id
        this.form.unitName = row.unitName
        this.form.seq = row.seq
        this.form.status = row.status
        this.form.typeList = row.typeList
      } else {
        this.form.id = ''
        this.form.unitName = ''
        this.form.seq = ''
        this.form.status = false
        this.form.typeList = []
      }
    },
    // change_(row) {
    //   console.log(row, '123asd')
    // },
    // 提交
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // 有 id 编辑
          if (this.form.id) {
            await editUnit({
              ...this.form,
            })
          } else {
            // 无 id 新增
            let res = await addUnit({
              ...this.form,
            })
            console.log(res)
          }
          this.$_fetchTableData(getUnitList)
          this.isAdd = false
          this.$message.success('操作成功!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 排序
    async confirm(e, id) {
      await sortUnit({
        id: id,
        seq: e,
      })
      this.$_fetchTableData(getUnitList)
      this.$message.success('操作成功!')
    },
    cancel() {},
    // 修改状态
    async stateChange(bool, id, number) {
      // console.log(bool, number, '药房')
      if (number != 0 && bool == true) {
        this.$message({
          message: '只有使用药品为0时可以禁用',
          type: 'warning',
        })
        setTimeout(() => {
          this.$_fetchTableData(getUnitList)
        }, 100)
      } else {
        await setStatetUnit({
          id: id,
          status: bool,
        })
        this.$_fetchTableData(getUnitList)
        this.$message.success(!bool ? '单位启用成功' : '单位禁用成功')
      }
    },
    //启用药品
    drugs(row) {
      this.$refs.drug.open(row)
    },
    handleClose(done) {
      done()
      this.importDialog.visible = false
    },
    beforeUpload(file) {
      let ExcalBar = ['xlsx', 'xlsm', 'xltx', 'xls']
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
      this.importDialog.sonListS = [fileList[fileList.length - 1]]
    },
    //机构批量导入
    preservation() {
      if (this.fileData) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        importUnitExcel(this.fileData).then(() => {
          loading.close()
          this.$message.success('操作成功!')
        })
        // .catch(e => loading && loading.close())
        this.importDialog.visible = false
        this.importDialog.sonListS = []
      } else {
        this.$message.success('请上传文件!')
      }
    },
  },
}
</script>
