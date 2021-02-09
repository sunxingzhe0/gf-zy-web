<template>
  <section class="view__template-prescription">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      showSelection
      :bottomOffset="125"
      :toolData="{ props: { tableRef: null } }"
      :tableData="{
        props: {
          tableData,
          'row-style': () => ({ cursor: 'pointer' }),
          'highlight-current-row': true,
        },
        on: {
          'row-click': handleRowClick,
          'current-change': handleCurrentChange,
        },
      }"
    >
      <template v-if="mode === 'EDIT'" v-slot:footertool>
        <el-button size="mini" type="primary" @click="dialog.visible = true">
          新增处方
        </el-button>

        <el-button
          slot="reference"
          size="mini"
          @click="delTemps"
          :disabled="!tableData.multipleSelection.length"
          style="color: #666;"
        >
          批量删除
        </el-button>
      </template>
    </List>

    <aside class="edit" :class="{ editable: editable }" v-loading="pending">
      <h3 v-if="model.id">
        {{ mode === 'EDIT' ? '编辑' : mode === 'IMPORT' ? '查看' : '' }}处方模板
      </h3>

      <el-form
        v-if="model.id"
        ref="editForm"
        :model="model"
        size="mini"
        :rules="rules"
        label-width="auto"
        :disabled="mode == 'IMPORT'"
      >
        <el-form-item label="模板名称" prop="name">
          <el-input
            v-model="model.name"
            maxlength="20"
            style="width: 360px;"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item label="病种" prop="icdId">
          <!-- <el-select v-model="model.icdId"></el-select> -->
          <el-select
            v-model="model.icdId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入"
            style="min-width: 360px;"
            :remote-method="searchDiagnosis"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.diagnosisName"
              :label="item.diagnosisName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="描述" prop="desc">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            placeholder="请输入内容"
            v-model="model.remark"
            maxlength="100"
            show-word-limit
            class="min_height_72"
          ></el-input>
        </el-form-item>

        <el-form-item label="药品清单" prop="rpDrugList" class="drug-list">
          <PrescriptionItem
            scene="template"
            :operate="operate"
            ref="editPrescription"
            @operate="applyOperate"
            :prescription="{
              rpDrugList: model.rpDrugList,
              status: mode !== 'IMPORT' ? 'DRAFT' : '',
            }"
          ></PrescriptionItem>
        </el-form-item>
      </el-form>
      <div class="no_template" v-if="!model.id">
        <img src="@/assets/noDetail.png" alt="" />
      </div>

      <div class="is-center" v-if="model.id && mode == 'EDIT'">
        <el-button size="mini" @click="cancel"> 取消 </el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="pending"
          @click="submit('editForm')"
        >
          确认
        </el-button>
      </div>
    </aside>

    <el-dialog
      title="新增处方模板"
      :visible.sync="dialog.visible"
      append-to-body
      custom-class="component__dialog"
      @opened="openDialog"
      :close-on-click-modal="false"
    >
      <el-scrollbar>
        <el-form
          ref="form"
          :model="dialog.model"
          :rules="rules"
          size="mini"
          label-width="auto"
        >
          <el-form-item label="模板名称" prop="name">
            <el-input
              v-model="dialog.model.name"
              maxlength="20"
              show-word-limit
              style="width: 360px;"
            ></el-input>
          </el-form-item>

          <el-form-item label="病种" prop="icdId">
            <el-select
              v-model="dialog.model.icdId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入"
              style="min-width: 360px;"
              :remote-method="searchDiagnosis"
              :loading="loading"
            >
              <el-option
                v-for="item in options"
                :key="item.diagnosisName"
                :label="item.diagnosisName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="描述" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 5 }"
              placeholder="请输入内容"
              v-model="dialog.model.remark"
              maxlength="100"
              show-word-limit
              class="min_height_72"
            ></el-input>
          </el-form-item>

          <el-form-item label="药品清单" prop="rpDrugList">
            <PrescriptionItem
              scene="template"
              :operate="operate"
              ref="prescription"
              v-if="dialog.visible"
              @operate="applyOperate"
              :prescription="{
                status: 'DRAFT',
                rpDrugList: [],
              }"
            ></PrescriptionItem>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <template v-slot:footer>
        <div class="is-center">
          <el-button size="mini" @click="cancel(dialog)"> 取消 </el-button>
          <el-button
            type="primary"
            size="mini"
            :loading="dialog.pending"
            @click="submit('form')"
          >
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { invalidFieldSetFocus } from '@/utils'

import { diagnosisKeywordSearch } from '@/api/business'
import PrescriptionItem from '@/components/Prescription/PrescriptionItem'
import {
  saveRpTemplate,
  editRpTemplate,
  webPageRpTemplateList,
  delRpTemplate,
  singleRpTemplate,
} from '@/api/template'

import { debounce } from 'lodash'
export default {
  name: 'ViewPrescription',
  components: {
    List,
    PrescriptionItem,
  },
  props: {
    mode: {
      type: String,
      default: 'EDIT',
    },
  },
  mixins: [mixin({ fetchListFunction: webPageRpTemplateList })],
  data() {
    return {
      operate: '', // 处方操作
      loading: false,
      options: [],
      query: {
        pageSize: 10,
        searchType: 0,
      },
      currentRow: null,
      pending: false,
      model: {
        name: '',
        type: '',
        desc: '',
      },

      dialog: {
        visible: false,
        pending: false,
        model: {
          name: '',
          icdId: '',
          remark: '',
        },
      },
    }
  },
  computed: {
    filter() {
      return {
        search: {
          props: {
            options: [{ label: '模板名称', value: 0 }],
          },
          keys: ['searchType', 'searchKeywords'],
        },
      }
    },
    columns() {
      return {
        index: {
          hidden: true,
        },
      }
    },

    rules() {
      return {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
      }
    },

    editable() {
      return this.tableData.list.length > 0 && this.model.id
    },
  },
  methods: {
    // 申请操作处方
    applyOperate(type) {
      this.operate = type
    },
    searchDiagnosis: debounce(function (query) {
      this.loading = true
      diagnosisKeywordSearch({
        searchKeywords: query,
        currentNum: 1,
        pageSize: 99,
      })
        .then(res => {
          this.options = res.list
        })
        .finally(() => (this.loading = false))
    }, 100),
    openDialog() {
      this.dialog.model = {
        name: '',
        icdId: '',
        remark: '',
      }
    },
    fetchTableDataHook() {
      if (this.tableData.list.length)
        this.handleRowClick(this.tableData.list[0])
    },

    handleCurrentChange(val) {
      this.currentRow = val
    },
    async cancel(dialog) {
      const refsKey = this.dialog.visible ? 'prescription' : 'editPrescription'
      if (this.operate) {
        this.operate = ''
        this.$refs[refsKey].checkedAll(false)
        return
      }
      if (dialog) {
        this.dialog.visible = false
        return
      }
      this.model = await singleRpTemplate({ id: this.model.id })
      this.$message.success('已撤销编辑')
    },
    async handleRowClick(row, force = false) {
      if (!force && this.model.id === row.id) return
      this.$refs.table.setCurrentRow(row)
      this.pending = true
      this.model = await singleRpTemplate({ id: row.id })
      await this.searchDiagnosis(this.model.icdName)
      setTimeout(() => (this.pending = false), 200)
    },
    async delTemps() {
      try {
        const confirm = await this.$confirm('您确定要删除选中的模板吗？')
        if (confirm === 'confirm') {
          this.handleDel()
        }
      } catch {
        // nothing
      }
    },
    async handleDel() {
      await Promise.all(
        this.tableData.multipleSelection.map(({ id }) => delRpTemplate({ id })),
      )
      this.$message.success('删除成功')
      await this.$_fetchTableData()
      this.fetchTableDataHook()
    },

    submit(formName) {
      const isEdit = 'editForm' === formName
      const refsKey = isEdit ? 'editPrescription' : 'prescription'
      if (this.operate) {
        switch (this.operate) {
          case 'del':
            this.delHandler(refsKey)
            break
          case 'group':
          case 'unGroup':
            this.groupHandler(refsKey)
            break
        }
        return
      }
      this.$refs[formName].validate(async (valid, invalidFields) => {
        if (valid) {
          try {
            let params = {}
            let icdName = ''
            const rpDrugList = this.$refs[refsKey].tableData.filter(
              item => !item.unsaved,
            )
            if (isEdit) {
              this.pending = true
              const option = this.options.find(
                item => item.id === this.model.icdId,
              )
              if (option) icdName = option.diagnosisName
              params = { ...this.model, icdName, rpDrugList }
            } else {
              this.dialog.pending = true
              const option = this.options.find(
                item => item.id === this.dialog.model.icdId,
              )
              if (option) icdName = option.diagnosisName
              params = { ...this.dialog.model, icdName, rpDrugList }
            }
            if (!rpDrugList.length) {
              return this.$message.warning('请先添加或保存处方药品！')
            }
            if (isEdit) {
              await editRpTemplate(params)
            } else {
              await saveRpTemplate(params)
            }
          } finally {
            setTimeout(() => {
              if (isEdit) this.pending = false
              else this.dialog.pending = false
            }, 200)
          }
          this.$message.success(isEdit ? '修改成功' : '新增成功')
          this.dialog.visible = false
          await this.$_fetchTableData()
          if (!isEdit)
            this.handleRowClick(
              this.currentRow || this.tableData.list?.[0],
              true,
            )
        } else {
          invalidFieldSetFocus(this.$refs[formName], invalidFields)
        }
      })
    },
    delHandler(refsKey) {
      const _self = this
      this.$confirm('勾选的药品将被删除，是否确认操作？', '提示', {
        type: 'warning',
        callback(action) {
          if (action === 'confirm') {
            _self.$refs[refsKey].delHandler(() => {
              _self.cancel()
            })
          }
        },
      })
    },
    groupHandler(refsKey) {
      const _self = this
      const text = this.operate === 'group' ? '成组' : '取消成组'
      this.$confirm(`勾选的药品将${text}，是否确认操作？`, '提示', {
        type: 'warning',
        callback(action) {
          if (action === 'confirm') {
            console.log(_self.$refs[refsKey], '--------')
            _self.$refs[refsKey].groupHandler(() => {
              _self.cancel()
            })
          }
        },
      })
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_variables.scss';
.min_height_72 {
  textarea {
    min-height: 72px !important;
    height: 72px !important;
  }
}
.view__template-prescription {
  display: flex;
  .no_template {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 200px;
    }
  }
  > * {
    padding: 10px 30px;
    background: $--color-white;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

    & + * {
      margin-left: 10px;
    }
  }

  > .c__list {
    padding-bottom: 0;
    width: 40%;
    max-height: 600px;
    overflow: scroll;
    .c__filter > .el-col > .el-row > .el-col {
      margin: 0;
      width: 100%;
    }

    > .c__tool {
      padding-left: 0;

      .el-col {
        width: 100%;
      }
    }
  }

  > .edit {
    position: relative;
    flex: 1 1 auto;
    // max-width: min(calc(70% - 10px), calc(100% - 460px - 10px));
    min-width: 600px;
    pointer-events: none;
    opacity: 0.6;
    transition: opacity 0.2s;
    padding-bottom: 0;
    &.editable {
      pointer-events: auto;
      opacity: 1;
      max-height: 600px;
      overflow: scroll;
    }

    > h3 {
      margin: 0 0 10px 0;
    }
  }
}
</style>

<style lang="scss" scoped>
.el-dialog__wrapper ::v-deep {
  .component__dialog {
    max-width: 1400px;
    min-width: 1200px;
  }
}

.drug-list {
  &::v-deep {
    .prescription-item {
      .prescription-item-body {
        overflow: auto;
      }
      .singleDose,
      .treatment,
      .total {
        height: 28px;
        line-height: 28px;
        .el-input .el-input__inner {
          height: 26px;
        }
        .el-select::before {
          top: 3px;
        }
      }
    }
  }
}
</style>
