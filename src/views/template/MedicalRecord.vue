<template>
  <section class="view__card" v-loading="loading">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      showSelection
    >
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="hadnleEdit(row)">修改</el-button>

        <el-popconfirm
          style="margin-left: 10px;"
          title="确定删除吗？"
          @confirm="handleDel([row.tempId])"
        >
          <el-button slot="reference" style="color: #fe5578;" type="text"
            >删除</el-button
          >
        </el-popconfirm>
      </template>

      <template v-slot:footertool>
        <el-button
          type="primary"
          @click="
            dialog.visible = true
            dialog.activeName = 'mainSuit'
          "
        >
          新增病历
        </el-button>

        <el-popconfirm
          style="margin-left: 10px;"
          title="确定删除吗？"
          @confirm="
            handleDel(tableData.multipleSelection.map(({ tempId }) => tempId))
          "
        >
          <el-button
            slot="reference"
            :disabled="!tableData.multipleSelection.length"
          >
            批量删除
          </el-button>
        </el-popconfirm>
      </template>
    </List>

    <el-dialog
      :title="dialog.model.tempId ? '修改病历模板' : '新增病历模板'"
      :visible.sync="dialog.visible"
      append-to-body
      custom-class="component__dialog mr-template__dialog"
      @closed="handleClosed"
      :close-on-click-modal="false"
    >
      <el-scrollbar>
        <el-form
          ref="form"
          :model="dialog.model"
          :rules="rules"
          label-width="auto"
          class="formWrap"
        >
          <el-form-item label="模板名称" prop="tempName">
            <el-input
              v-model="dialog.model.tempName"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="tempDesc">
            <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 10 }"
              placeholder="请输入内容"
              v-model="dialog.model.tempDesc"
              maxlength="100"
              show-word-limit
            >
            </el-input>
          </el-form-item>

          <el-tabs
            v-model="dialog.activeName"
            tab-position="left"
            @tab-click="handleTabClick"
          >
            <el-tab-pane
              v-for="{ label, prop } in textarea"
              :key="prop"
              :label="label"
              :name="prop"
            ></el-tab-pane>

            <template v-for="{ label, prop } in textarea">
              <label :key="`label_${prop}`" :id="label">
                {{ label }}
              </label>
              <el-form-item
                :key="`form-item_${prop}`"
                style="margin: 20px 0 30px 0;"
                class="el-form-item_no-margin-left"
                :prop="prop"
              >
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 10 }"
                  placeholder="请输入内容"
                  v-model="dialog.model[prop]"
                  :maxlength="'主诉' === label ? '20' : 3000"
                  show-word-limit
                  :ref="prop"
                  @focus="inputFocus(prop)"
                >
                </el-input>
              </el-form-item>
            </template>
          </el-tabs>
        </el-form>
      </el-scrollbar>

      <template v-slot:footer>
        <div class="is-center">
          <el-button @click="dialog.visible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            :loading="dialog.loading"
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
/* import { ObserveVisibility } from 'vue-observe-visibility' */
import { List, mixin } from '@/components'
import { invalidFieldSetFocus } from '@/utils'

import {
  findDiseaseTemplateList,
  addEtcDiseaseTemp,
  updateEtcDiseaseTemp,
  backDiseaseTempInfo,
  deleteEtcDiseaseTemp,
} from '@/api/template'

export default {
  name: 'TableList',
  components: {
    List,
  },
  /* directives: {
    'observe-visibility': ObserveVisibility,
  }, */
  mixins: [mixin({ fetchListFunction: findDiseaseTemplateList })],
  data() {
    this.textarea = [
      { label: '主诉', prop: 'mainSuit' },
      { label: '现病史', prop: 'nowDisease' },
      { label: '既往史', prop: 'hisDisease' },
      { label: '体格检查', prop: 'phyCheck' },
      { label: '辅助检查', prop: 'supCheck' },
      { label: '处理意见', prop: 'dealIdea' },
    ]

    return {
      query: {
        pageSize: 10,
        timeType: 0,
        searchType: 0,
      },

      dialog: {
        loading: false,
        visible: false,
        activeName: 'mainSuit',
        disabling: true,
        model: {
          tempName: '',
          tempDesc: '',
          mainSuit: '',
          nowDisease: '',
          hisDisease: '',
          phyCheck: '',
          supCheck: '',
          dealIdea: '',
        },
      },

      /* intersection: {}, */
    }
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [{ label: '创建时间', value: 0 }],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '模板名称', value: 0 },
              { label: '模板描述', value: 1 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '使用次数',
              is: 'InputRange',
            },
            keys: ['startUse', 'endUse'],
          },
        ],
      }
    },
    columns() {
      return {
        index: {
          hidden: true,
        },
        createTime: {
          minWidth: 160,
        },
        gender: {
          prop: 'slot_gender',
        },
        fixed: {
          width: 140,
        },
      }
    },
    rules() {
      return {
        tempName: [{ required: true, message: '请输入', trigger: 'blur' }],
      }
    },
  },
  methods: {
    async resolveSortChange(index, { id }) {
      console.log(index, id)
      this.$message({
        type: 'success',
        message: '完成',
        showClose: true,
      })

      this.$_fetchTableData()
    },

    async hadnleEdit({ tempId: templateId }) {
      this.dialog.activeName = 'mainSuit'
      this.dialog.visible = true
      this.dialog.loading = true

      this.dialog.model = {
        ...(await backDiseaseTempInfo({ templateId })),
      }

      this.dialog.loading = false
    },

    async handleDel(ids) {
      await deleteEtcDiseaseTemp({ templateId: ids.join(',') })

      this.$message({
        type: 'success',
        message: '完成',
        showClose: true,
      })

      this.$_fetchTableData()
    },

    /* handleOpened() {
      this.intersection = {
        root: document.querySelector(
          '.mr-template__dialog > .el-dialog__body > .el-scrollbar',
        ),
        // rootMargin: 0px 0px 0px 0px,
        // threshold: 0.3,
      }

      this.$nextTick(() => {
        this.dialog.disabling = false
      })
    }, */
    inputFocus(prop) {
      console.log(prop)
      this.dialog.activeName = prop
    },

    handleTabClick({ name }) {
      // this.dialogNode =
      //   this.dialogNode || document.querySelector('.mr-template__dialog')

      // this.dialogNode
      //   .querySelector(`#${name}`)
      //   ?.scrollIntoView({ behavior: 'smooth' })
      // this.dialog.activeName = name
      // console.log(this.$refs[name])
      this.$nextTick(() => {
        this.$refs[name][0].focus()
      })
    },

    /* visibilityChanged(isVisible, entry, key) {
      console.log(key)
      if (!isVisible) return
      //this.dialog.activeName = key
    }, */

    submit(formName) {
      this.$refs[formName].validate(async (valid, invalidFields) => {
        if (valid) {
          this.dialog.loading = true
          await (this.dialog.model.tempId
            ? updateEtcDiseaseTemp
            : addEtcDiseaseTemp)(this.dialog.model).finally(() =>
            setTimeout(() => (this.dialog.loading = false), 200),
          )

          this.$message({
            type: 'success',
            message: '完成',
            showClose: true,
          })

          this.dialog.visible = false
          this.$_fetchTableData()
        } else {
          invalidFieldSetFocus(this.$refs[formName], invalidFields)
        }
      })
    },

    handleClosed() {
      this.dialog.disabling = true
      this.$refs.form.resetFields()
      this.dialog.activeName = '主诉'
      this.dialog.model.tempId = ''
    },
    //滚动事件
    handelScroll() {
      console.log(123)
    },
  },
}
</script>

<style lang="scss" scoped>
.formWrap {
  ::v-deep .el-tabs__header.is-left {
    position: sticky;
    top: 8vh;
    z-index: 9999;
  }
}
.mr-template__dialog {
  .el-tabs--left,
  .el-tabs--right {
    overflow: visible;
  }
  .el-tabs__header {
    position: sticky;
    top: 0;
  }
}
::v-deep .table-wrap .cell {
  font-size: 16px;
}
::v-deep .el-table .cell.el-tooltip {
  font-size: 14px;
  padding-left: 6px;
}
</style>
