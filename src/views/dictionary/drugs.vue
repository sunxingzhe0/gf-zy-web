<template>
  <div class="view__card">
    <List
      alwaysShowBtn
      v-model="query"
      :filter="filter"
      :columns="columns"
      resetBtnText="重置"
      :tableData="tableData"
    >
      <template v-slot:footertool>
        <el-button type="primary" @click="edit()"> 新增 </el-button>
        <el-button
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
      <template v-slot:slot_healthAttr="{ row }">
        {{ medicare[row.healthAttr] }}
      </template>
      <template v-slot:slot_drugPharmacyList="{ row }">
        <el-switch
          :width="50"
          active-text="上架"
          class="textSwitch"
          inactive-text="下架"
          :value="computedSatus(row)"
          @change="toogleStatus(row)"
          v-if="row.drugPharmacyList.length"
        ></el-switch>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="edit(row)"> 修改 </el-button>
      </template>
    </List>

    <el-dialog
      :title="form.id ? '编辑药品字典' : '新增药品字典'"
      :close-on-click-modal="false"
      :visible.sync="editShow"
      width="70%"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="110px">
        <el-row :gutter="30">
          <template v-for="(item, index) in formItems">
            <!-- v-if="form.id" -->
            <el-col :key="index" :span="12">
              <el-form-item
                :label="item.label"
                :data-text="item.desc"
                :prop="item.key"
              >
                <component
                  filterable
                  class="input"
                  style="width: 100%"
                  :is="item.component"
                  :type="item.type || ''"
                  v-model="form[item.key]"
                  :multiple="item.multiple"
                  :disabled="item.key === 'id'"
                  :allow-create="item.allowCreate"
                  :placeholder="
                    item.component === 'el-input' ? '请输入' : '请选择'
                  "
                >
                  <template v-if="item.component === 'el-select'">
                    <el-option
                      v-for="(it, i) in options[item.key]"
                      :disabled="it.disabled"
                      :label="it.label"
                      :value="it.value"
                      :key="i"
                    >
                    </el-option>
                  </template>
                </component>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer is-center">
        <el-button @click="editShow = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="'上下架-' + changeStatusItem.name"
      :visible.sync="changeStatusView"
    >
      <p>药房适用范围:</p>
      <el-form
        :model="changeStatusItem"
        label-width="160px"
        label-position="left"
      >
        <el-form-item
          :label="item.pharmacyName"
          style="padding-left: 50px; margin-bottom: 10px"
          v-for="(item, index) in changeStatusItem.drugPharmacyList"
          :key="index"
        >
          <!-- status是反的 ，true为下架false为上架 -->
          <el-switch
            :width="50"
            active-text="上架"
            class="textSwitch"
            inactive-text="下架"
            :value="item.status"
            :active-value="false"
            :inactive-value="true"
            @change="confirmChange(item.pharmacyId, item.status, index)"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer"></div>
    </el-dialog>
    <!-- 批量导入 -->
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
            :file-list="importDialog.sonListS"
            :before-remove="beforeRemove"
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
  </div>
</template>
<script>
import {
  addDrug,
  addUnit,
  editDrug,
  getUnitList,
  getDrugsList,
  updateStatus,
  getPharmacyList,
  importDrugExcel, //单位诊断批量导入
  modularLexcel, //下载导入格式
} from '@/api/dictionary'
import { cloneDeep } from 'lodash'
import { typeLists } from '@/api/drugs'
import { List, mixin } from '@/components'
import { selDepartment } from '@/api/setup'

const Drug = {
  id: '', // 药品ID
  name: '', // 药品名称
  commonName: '', // 药品通用名
  chemicalName: '', // 药品化学名
  manageCode: '', // 药品类别
  healthAttr: '', // 报销标志
  drugSpec: '', // 药品规格
  regularPackVolume: '', // 常规包装量
  dosageUnit: '', // 剂量单位
  basicUnit: '', //  基本包装单位
  regularUnit: '', // 常规包装单位
  basicDose: '', // 基本剂量
  split: false, // 是否拆零
  divided: false, // 是否分次
  price: '', // 建议零售价
  deptIds: [], // 科室适用范围
  pharmacyIds: [], // 药房适用范围
}

export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: getDrugsList }])],
  data() {
    this.filter = {
      inline: [
        {
          props: {
            label: '药品代码',
            is: 'el-input',
            noColon: true,
          },
          keys: 'code',
        },
        {
          props: {
            label: '药品名称',
            is: 'el-input',
            noColon: true,
          },
          keys: 'name',
        },
      ],
    }
    return {
      fileData: '',
      importDialog: {
        visible: false,
        sonListS: [],
      },
      rules: {
        name: [{ required: true, message: '请输入药品名称' }],
        price: [{ required: true, message: '请输入药品金额' }],
        split: [{ required: true, message: '请输入能否拆零' }],
        divided: [{ required: true, message: '请选择可否分次' }],
        drugSpec: [{ required: true, message: '请输入规格' }],
        commonName: [{ required: true, message: '请输入通用名' }],
        basicDose: [{ required: true, message: '请输入基本剂量' }],
        dosageUnit: [{ required: true, message: '请选择剂量单位' }],
        healthAttr: [{ required: true, message: '请输入医保属性' }],
        chemicalName: [{ required: true, message: '请输入化学名' }],
        regularUnit: [{ required: true, message: '请输入包装单位' }],
        manageCode: [{ required: true, message: '请输入管理科目码' }],
        basicUnit: [{ required: true, message: '请输入医保最小单位' }],
        deptIds: [
          { required: true, message: '请选择适用科室', trigger: 'blur' },
        ],
        pharmacyIds: [
          { required: true, message: '请选择适用药房', trigger: 'blur' },
        ],
        regularPackVolume: [{ required: true, message: '请输入常规包装量' }],
      },
      query: {
        timeType: 0,
        pageSize: 10,
        searchType: 0,
        currentNum: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        createDate: {
          minWidth: 180,
        },
        regularUnitText: {
          minWidth: 120,
        },
        //是否拆零
        split: {
          formatter(row) {
            return row.split ? '是' : '否'
          },
          minWidth: 100,
        },
        regularPackVolume: {
          minWidth: 120,
        },
        chemicalName: {
          minWidth: 100,
        },
        healthAttrText: { minWidth: 100 },
        price: {
          formatter(row) {
            return '￥' + row.price
          },
        },
        manageCodeText: {
          minWidth: 120,
        },
        name: {
          minWidth: 100,
        },
        commonName: {
          minWidth: 120,
        },
        fixed: {
          minWidth: 60,
        },
        manageCode: {
          minWidth: 120,
        },
        deptNames: {
          minWidth: 120,
          formatter(row) {
            return row.deptNames.join('、')
          },
        },
        pharmacyNames: {
          minWidth: 120,
          formatter(row) {
            return row.pharmacyNames.join('、')
          },
        },
        healthAttr: {
          prop: 'slot_healthAttr',
        },
        drugPharmacyList: {
          prop: 'slot_drugPharmacyList',
          minWidth: 100,
        },
      },
      options: {
        manageCode: [], // 药品类型【管理科目码】
        healthAttr: [
          { label: '甲', value: 'A' },
          { label: '乙', value: 'B' },
          { label: '丙', value: 'C' },
          { label: '自费', value: 'ME_FEE' },
        ], // 医保类型【报销属性】
        dosageUnit: [], // 剂量单位
        basicUnit: [], // 基本包装单位
        regularUnit: [], // 常规包装单位
        split: [
          { label: '是', value: true },
          { label: '否', value: false },
        ], // 可否拆零
        divided: [
          { label: '是', value: true },
          { label: '否', value: false },
        ], // 可否分次
        deptIds: [], // 适用科室
        pharmacyIds: [], // 适用药房
      },
      medicare: {
        A: '甲',
        B: '乙',
        C: '丙',
        ME_FEE: '自费',
      },
      formItems: [
        {
          key: 'id',
          desc: '药品ID',
          label: '药品ID',
          disabled: true,
          component: 'el-input',
        },
        {
          key: 'name',
          desc: '药品名称',
          label: '药品名称',
          component: 'el-input',
        },
        {
          desc: '药品通用名',
          key: 'commonName',
          label: '药品通用名',
          component: 'el-input',
        },
        {
          desc: '药品化学名',
          label: '药品化学名',
          key: 'chemicalName',
          component: 'el-input',
        },
        {
          desc: '药品类别',
          label: '药品类别',
          key: 'manageCode',
          component: 'el-select',
        },
        {
          desc: '医保属性',
          label: '报销标志',
          key: 'healthAttr',
          component: 'el-select',
        },
        {
          desc: '规格',
          key: 'drugSpec',
          label: '规格',
          component: 'el-input',
        },
        {
          key: 'price',
          desc: '零售价',
          label: '零售价',
          type: 'number',
          component: 'el-input',
        },
        {
          type: 'number',
          desc: '剂量系数',
          label: '基本剂量',
          key: 'basicDose',
          component: 'el-input',
        },
        {
          key: 'basicUnit',
          allowCreate: true,
          desc: '基本包装单位',
          label: '基本包装单位',
          component: 'el-select',
        },
        {
          desc: '剂量单位',
          label: '剂量单位',
          key: 'dosageUnit',
          allowCreate: true,
          component: 'el-select',
        },
        {
          type: 'number',
          desc: '换算系数',
          label: '常规包装量',
          component: 'el-input',
          key: 'regularPackVolume',
        },
        {
          allowCreate: true,
          key: 'regularUnit',
          desc: '常规包装单位',
          label: '常规包装单位',
          component: 'el-select',
        },
        {
          key: 'divided',
          desc: '可否分次',
          label: '可否分次',
          component: 'el-select',
        },
        {
          key: 'split',
          desc: '能否拆零',
          label: '能否拆零',
          component: 'el-select',
        },

        {
          key: 'deptIds',
          multiple: true,
          desc: '科室适用范围',
          label: '科室适用范围',
          component: 'el-select',
        },
        {
          multiple: true,
          key: 'pharmacyIds',
          desc: '药房适用范围',
          label: '药房适用范围',
          component: 'el-select',
        },
      ],
      editShow: false,
      loading: false,
      changeStatusItem: {}, //正在修改上架状态的药品
      form: cloneDeep(Drug),
      changeStatusView: false,
      // 添加包装单位空对象
      obj: {
        unitName: '',
      },
    }
  },
  async created() {
    this.getUnits()
    this.getDeptList()
    this.getManageCode()
    this.getPharmacyList()
  },
  methods: {
    async download() {
      modularLexcel('药品字典模板.xls')
    },
    // 计算上下架状态
    computedSatus(item) {
      return item.drugPharmacyList.some(_item => !_item.status)
    },
    // 修改上下架状态
    toogleStatus(item) {
      if (item.drugPharmacyList.length > 1) {
        this.changeStatusItem = item
        this.changeStatusView = true
      } else {
        const pharmacy = item.drugPharmacyList[0]
        this.changeStatus(item.id, !pharmacy.status, pharmacy.pharmacyId)
      }
    },
    // 弹窗修改上下架状态
    async confirmChange(pharmacyId, status, index) {
      const id = this.changeStatusItem.id
      await this.changeStatus(id, !status, pharmacyId)
      this.$set(
        this.changeStatusItem.drugPharmacyList[index],
        'status',
        !status,
      )
    },
    // 上下架状态修改请求
    async changeStatus(id, status, pharmacyId) {
      await updateStatus({ id, status, pharmacyIds: [pharmacyId] })
      this.$message.success(status ? '下架成功' : '上架成功')
      this.$_fetchTableData()
    },
    // 以下为新增修改药品所需条件
    // 获取药品类型【管理科目码】
    async getManageCode() {
      const res = await typeLists({
        type: 3,
      })
      const options = res.map(item => ({
        ...item,
        label: item.name,
        value: String(item.id),
      }))
      this.$set(this.options, 'manageCode', options)
    },
    // 剂量单位、基本包装单位、常规包装单位获取
    async getUnits() {
      const res = await getUnitList({
        pageSize: 200,
        status: false,
      })
      const basicUnit = []
      const dosageUnit = []
      const regularUnit = []
      res.list.forEach(item => {
        item.value = item.id
        item.label = item.unitName
        const types = item.typeList
        if (types.includes('DOSAGE_UNIT')) {
          dosageUnit.push(item)
        }
        if (types.includes('BASIC_PACKAGING_UNIT')) {
          basicUnit.push(item)
        }
        if (types.includes('CONVENTIONAL_PACKAGING_UNIT')) {
          regularUnit.push(item)
        }
      })
      this.$set(this.options, 'basicUnit', basicUnit)
      this.$set(this.options, 'dosageUnit', dosageUnit)
      this.$set(this.options, 'regularUnit', regularUnit)
    },
    // 获取药房适用范围
    async getPharmacyList() {
      const res = await getPharmacyList({ filter: false })
      const pharmacyIds = res.map(item => ({
        ...item,
        value: item.id,
        label: item.name,
      }))
      this.$set(this.options, 'pharmacyIds', pharmacyIds)
    },
    // 获取科室适用范围
    async getDeptList() {
      let res = await selDepartment({})
      const deptIds = res.map(item => ({
        ...item,
        value: item.id,
        label: item.name,
      }))
      this.$set(this.options, 'deptIds', deptIds)
    },
    // 剂量单位、基本包装单位、常规包装单位快捷添加
    // 先校验是否有此单位
    async genIfNoUnit() {
      const _self = this
      const hasUnit = function (key) {
        const index = _self.options[key].findIndex(
          item => item.value === _self.form[key],
        )
        return index !== -1
      }
      const units = ['dosageUnit', 'basicUnit', 'regularUnit']
      for (let i = 0; i < units.length; i++) {
        if (!hasUnit(units[i])) {
          await this.addUnit(units[i])
        }
      }
    },
    // 添加单位
    async addUnit(key) {
      const types = {
        dosageUnit: 'DOSAGE_UNIT',
        basicUnit: 'BASIC_PACKAGING_UNIT',
        regularUnit: 'CONVENTIONAL_PACKAGING_UNIT',
      }
      const options = this.options[key]
      const res = await addUnit({
        seq: 0,
        status: false,
        typeList: [types[key]],
        unitName: this.form[key],
      })
      options.push({ label: this.form[key], value: res })
      this.$set(this.options, key, options)
      this.$set(this.form, key, res)
    },
    // 新增/编辑药品
    edit(item) {
      const form = cloneDeep(Drug)
      if (item) {
        for (const p in Drug) {
          form[p] = item[p]
        }
      }
      this.form = form
      this.editShow = true
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    // 提交
    async submit() {
      const pass = await this.$refs.ruleForm.validate()
      if (!pass) return
      const loading = this.$loading()
      try {
        // 检查单位
        await this.genIfNoUnit()
        if (this.form.id) {
          await editDrug(this.form)
        } else {
          await addDrug(this.form)
        }
        loading.close()
        this.editShow = false
        this.$message.success('操作成功!')
        this.$_fetchTableData(getDrugsList)
      } catch (e) {
        // console.log(e)
        loading.close()
      }
    },
    handleClose(done) {
      done()
      this.importDialog.visible = false
    },
    //上传的文件是否删除
    beforeRemove(file) {
      return this.$confirm(`确定删除 ${file.name}？`)
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
        importDrugExcel(this.fileData)
          .then(() => {
            this.$message.success('操作成功!')
            this.$_fetchTableData()
          })
          .finally(() => {
            setTimeout(() => {
              loading.close()
            }, 1000)
          })
        this.importDialog.visible = false
        this.importDialog.sonListS = []
      } else {
        this.$message.success('请上传文件')
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.view__card ::v-deep {
  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .item-label.is-right {
    height: 32px;
    padding: 0 15px;
    margin-right: 0;
    color: #8c8c8c;
    line-height: 30px;
    border-radius: 4px;
    border-right: none;
    width: unset !important;
    border: 1px solid #dcdfe6;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .item-label.is-right + .el-input {
    .el-input__inner {
      border-left: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
