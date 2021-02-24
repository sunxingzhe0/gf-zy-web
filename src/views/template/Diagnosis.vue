<template>
  <section class="view__template-diagnosis">
    <aside class="diagnosis-table">
      <div class="diagnosis-table-input">
        <el-input
          placeholder="请输入内容"
          v-model="templateValue"
          clearable
          class="input-with-select"
        >
          <el-select
            v-model="templateSelect"
            slot="prepend"
            placeholder="请选择"
          >
            <el-option label="模板名称" value="1"></el-option>
          </el-select>
          <el-button
            slot="append"
            @click="onSearch"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </div>
      <div class="diagnosis-table-table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          @select="tableListSelect"
          @select-all="tableListSelectAll"
          @row-click="rowClickItem"
          tooltip-effect="dark"
          style="width: 100%;"
        >
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column
            prop="tempName"
            label="模板名称"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="tempDesc" label="描述" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="diagNum"
            label="诊断数量"
            width="80"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="diagnosis-table-handle">
        <div class="handle-left">
          <el-button size="mini" type="primary" @click="dialogVisible = true">
            新增模板
          </el-button>

          <!-- <el-popconfirm
            style="margin-left: 10px;"
            @confirm="onConfirmRemoveItem"
            title="确定删除吗？"
          > -->
          <el-button
            slot="reference"
            @click="onConfirmRemoveItem()"
            size="mini"
            type="info"
            >删除</el-button
          >
          <!-- </el-popconfirm> -->
        </div>
        <div class="handle-right">
          <el-pagination
            small
            background
            :pager-count="5"
            layout="prev, pager, next"
            :total="page.total"
            :page-size="page.pageSize"
            @current-change="currentChange"
            :current-page.sync="page.pageNum"
          >
          </el-pagination>
        </div>
      </div>
    </aside>
    <aside class="diagnosis-edit" v-if="!noData">
      <h3 class="edit-title">
        {{ mode === 'EDIT' ? '修改' : mode === 'IMPORT' ? '查看' : '' }}诊断模板
      </h3>

      <div class="diagnosis-edit-form">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="模板名称" prop="tempName">
            <el-input
              v-model="ruleForm.tempName"
              maxlength="20"
              show-word-limit
              class="el-form-item-360"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="描述" prop="tempDesc">
            <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 10 }"
              placeholder="请输入"
              v-model="ruleForm.tempDesc"
              maxlength="100"
              show-word-limit
              clearable
              class="min_height_72 el-form-item-360"
            ></el-input>
          </el-form-item>

          <el-form-item label="诊断内容" prop="contentList">
            <div class="edit-content">
              <Diagnosis
                template
                ref="refDiagnosis"
                :draftList="ruleForm.contentList"
              ></Diagnosis>
            </div>
            <el-button
              type="primary"
              @click="addNewTemplate('refDiagnosis')"
              plain
              class="add-template"
              size="mini"
              >新增模板</el-button
            >
          </el-form-item>
        </el-form>

        <div class="edit-btns">
          <el-button size="mini" @click="editTableCancel"> 取消 </el-button>
          <el-button
            type="primary"
            @click="editTableConfirm"
            size="mini"
            :loading="false"
          >
            确认
          </el-button>
        </div>
      </div>
    </aside>
    <aside class="no_template" v-else>
      <img src="@/assets/noDetail.png" alt="" />
    </aside>

    <el-dialog title="新增诊断模板" :visible.sync="dialogVisible" width="70%">
      <div class="diagnosis-edit-form">
        <el-form
          :model="newRuleForm"
          :rules="rules"
          ref="newRuleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="模板名称" prop="tempName">
            <el-input
              v-model="newRuleForm.tempName"
              maxlength="20"
              show-word-limit
              class="el-form-item-360"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="描述" prop="tempDesc">
            <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 10 }"
              placeholder="请输入"
              v-model="newRuleForm.tempDesc"
              maxlength="100"
              show-word-limit
              clearable
              class="min_height_72 el-form-item-360"
            ></el-input>
          </el-form-item>

          <el-form-item label="诊断内容" prop="content">
            <div class="edit-content">
              <Diagnosis
                template
                ref="refDialogDiagnosis"
                :draftList="newRuleForm.draftList"
              ></Diagnosis>
            </div>
            <el-button
              type="primary"
              @click="addNewTemplate('refDialogDiagnosis')"
              plain
              class="add-template"
              size="mini"
              >新增诊断</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onNewConfirm">取 消</el-button>
        <el-button type="primary" @click="addTemplateDialog('newRuleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { cloneDeep } from 'lodash'
import Diagnosis from '@/views/business/clinic/components/Chat/components/Diagnosis.vue'
import {
  addDiagTemp,
  deleteDiagTemp,
  updateDiagTemp,
  findDiagTempInfo,
  findDiagTempList,
} from '@/api/template'

const TempValue = {
  tempName: '',
  tempDesc: '',
  draftList: [
    {
      indexCode: 1,
      diagnosisType: 'WEST_MEDICINE',
      suffixName: '',
      diagnosisName: '',
      diagCode: '',
      diagTypeCode: '',
      prefixName: '',
      mainDiagnosis: 1,
      childDtos: [],
    },
  ],
}

export default {
  name: 'view-template-diagnosis',
  components: {
    Diagnosis,
  },
  data() {
    return {
      // 左侧的搜索栏
      templateValue: '',
      templateSelect: '1',

      loading: false,
      dialogVisible: false,
      // 分页
      page: {
        total: 30,
        pageNum: 1,
        pageSize: 10,
      },
      selectItem: [],
      radioCheck: 1,
      newRadioCheck: 1,
      value: '',
      // 新增表格数据
      ruleForm: cloneDeep(TempValue),
      newRuleForm: cloneDeep(TempValue),
      rules: {
        tempName: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
        ],
        editTableData: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
      mode: 'EDIT',
      noData: true,
      tableData: [],
    }
  },
  created() {
    this.getTableDataList()
  },
  methods: {
    // 获取左侧表格列表
    getTableDataList(query) {
      const params = {
        pageSize: this.page.pageSize,
        currentNum: this.page.pageNum,
        ...query,
      }
      findDiagTempList(params).then(res => {
        this.page.total = res.total
        this.tableData = res.list
      })
    },
    // 表格选中时
    tableListSelect(selection) {
      const arr = []
      if (selection) {
        selection.map(item => {
          arr.push(item.tempId)
        })
        this.selectItem = arr
      }
    },
    // 格选全选
    tableListSelectAll(selection) {
      const arr = []
      if (selection) {
        selection.map(item => {
          arr.push(item.tempId)
        })
        this.selectItem = arr
      }
    },
    // 删除表格选中
    onConfirmRemoveItem() {
      if (!this.selectItem || this.selectItem.length === 0) {
        return
      }
      const data = this.selectItem
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await deleteDiagTemp(data)
          this.tableData.length === 1 &&
            this.page.pageNum > 1 &&
            this.query.pageNum--
          this.getTableDataList()
          this.$message({
            type: 'success',
            message: '完成',
            showClose: true,
          })
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 点击表格一行
    rowClickItem(row) {
      findDiagTempInfo({ tempId: row.tempId }).then(res => {
        this.snapshot = cloneDeep(res)
        this.ruleForm = res
        this.noData = false
      })
    },
    // 添加数据
    addTemplateDialog(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const obj = {}
          for (let key in this.newRuleForm) {
            if (key == 'draftList') {
              obj.contentList = this.$refs.refDialogDiagnosis.tableData
              continue
            }
            obj[key] = this.newRuleForm[key]
          }
          addDiagTemp(obj).then(() => {
            this.$message.success('操作成功')
            this.getTableDataList()
            this.dialogVisible = false
            this.newRuleForm = cloneDeep(TempValue)
          })
        } else {
          return false
        }
      })
    },
    // 新增模板取消
    onNewConfirm() {
      this.dialogVisible = false
      this.newRuleForm = cloneDeep(TempValue)
    },
    // 编辑表格取消
    editTableCancel() {
      this.$refs.ruleForm.resetFields()
      this.ruleForm = cloneDeep(this.snapshot)
    },
    // 编辑表格确认
    editTableConfirm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          updateDiagTemp(this.ruleForm).then(() => {
            this.getTableDataList()
            this.$message.success('修改成功')
          })
        } else {
          return false
        }
      })
    },
    // 搜索
    onSearch() {
      this.getTableDataList({
        searchKeywords: this.templateValue,
      })
    },
    // 分页;
    currentChange(page) {
      this.page.pageNum = page
      this.getTableDataList({
        searchKeywords: this.templateValue,
      })
    },
    // 新增模板
    addNewTemplate(refName) {
      this.$refs[refName].add()
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_variables.scss';
.view__template-diagnosis {
  display: flex;
  justify-content: space-between;

  .diagnosis-table {
    width: 30%;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 15px;

    .el-table__row {
      cursor: pointer;
    }

    .el-input-group {
      width: 100%;
    }

    .el-input-group__prepend {
      width: 120px;
      background-color: #fff;
      // border: 1px;
    }

    .el-table__body-wrapper {
      min-height: 420px;
      overflow: auto;
      .el-table__empty-text {
        line-height: 420px;
        user-select: none;
      }
    }

    .el-icon-search {
      cursor: pointer;
      color: #55c7d4;
    }

    .diagnosis-table-input {
      margin-bottom: 15px;
    }

    .diagnosis-table-table {
      width: 100%;
      border: 1px solid #eee;
    }

    .diagnosis-table-handle {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;

      .el-button--info {
        background: #f2f2f2;
        color: #333;
        border: none;
      }

      .handle-left {
        width: 150px;
        min-width: 150px;
      }

      .handle-right {
        flex: 1;
        overflow: auto;

        .el-pagination--small {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }

  .min_height_72 {
    textarea {
      min-height: 120px;
      height: 120px;
    }
  }

  .diagnosis-edit {
    flex: 1;
    min-width: 800px;
    margin-left: 10px;
    padding: 15px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;

    .el-form-item__label {
      font-size: 16px;
      color: #666666;
    }

    .edit-title {
      font-size: 18px;
      font-weight: bold;
      color: #1a1a1a;
      line-height: 22px;
    }

    .diagnosis-edit-form {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: calc(100% - 39px);
      padding: 30px 10px 0 30px;

      .edit-btns {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 96px;
        border-top: 1px solid #e6e6e6;
      }

      .edit-content {
        border: 1px solid #e6e6e6;
      }

      .el-button {
        margin-left: 7px;
      }

      .icon-img {
        width: 16px;
        height: 16px;
      }
    }

    .el-form-item-360 {
      width: 360px;
    }
  }

  .inline-item {
    display: inline-block;
  }

  .add-template {
    margin-left: 0 !important;
    margin-top: 15px;
  }

  .btn-drag {
    cursor: move;
  }

  .el-table__expand-icon {
    display: none !important;
  }

  .no_template {
    flex: 1;
    min-width: 600px;
    margin-left: 10px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 200px;
    }
  }
  .inputL {
    margin-right: 10px;
  }
  .inputS {
    margin-left: 10px;
  }
}
</style>
