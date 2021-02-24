<template>
  <section class="wrap">
    <template v-if="!saveTemplate.visible">
      <el-scrollbar>
        <el-tabs
          ref="tabs"
          v-model="activeName"
          tab-position="left"
          @tab-click="handleTabClick"
        >
          <el-tab-pane
            v-for="{ name, label } in tabs"
            :key="name"
            :label="label"
            :name="name"
            lazy
          ></el-tab-pane>
          <el-form
            label-position="top"
            label-width="80px"
            style="height: 100%;"
            ref="form"
            :model="form"
            v-if="clearValid"
          >
            <template v-for="(t, m) in tabs">
              <template v-for="(item, index) in Object.keys(form)">
                <el-form-item
                  v-if="t.name === item"
                  :key="index + '_' + m"
                  :label="t.label"
                  :id="item"
                  :prop="item"
                  :rules="[
                    {
                      required: true,
                      message: '内容不能为空',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <div v-if="t.name === 'dtoList'">
                    <el-button
                      size="mini"
                      type="primary"
                      plain
                      style="margin-left: 80px; float: left; margin-top: -40px;"
                      @click="editList"
                      >修改</el-button
                    >
                    <div class="dtoList">
                      <div
                        v-for="(dtoItem, index) in form.dtoList"
                        :key="dtoItem.id"
                      >
                        <span
                          >{{ index + 1 }}. {{ dtoItem.prefixName }}
                          {{ dtoItem.diagnosisName }}
                          {{ dtoItem.suffixName }} ({{
                            dtoItem.mainDiagnosis === 1 ? '主诊断' : '诊断'
                          }})
                          {{
                            !dtoItem.childDtos || !dtoItem.childDtos.length
                              ? '；'
                              : '，'
                          }}
                        </span>
                        <span
                          v-for="child in dtoItem.childDtos"
                          :key="child.indexCode"
                        >
                          {{ child.prefixName }} {{ child.diagnosisName }}
                          {{ child.suffixName }} (子诊断)；
                        </span>
                      </div>
                    </div>
                    <!-- <el-table :data="form.dtoList">
                    <el-table-column
                      prop="diagnosisType"
                      label="类别"
                      width="100"
                    >
                      <template slot-scope="{ row }">
                        {{
                          row.diagnosisType == 'WEST_MEDICINE'
                            ? '西医'
                            : row.diagnosisType == 'CH_MEDICINE_CARD'
                            ? '中医证型'
                            : row.diagnosisType == 'CH_MEDICINE_NAME'
                            ? '中医病名'
                            : ''
                        }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="diagName" label="诊断/病名">
                      <template slot-scope="{ row }">
                        {{ row.diagnosisName }}({{ row.suffixName }})
                      </template>
                    </el-table-column>
                  </el-table> -->
                  </div>
                  <el-input
                    type="textarea"
                    v-else
                    :rows="4"
                    v-model="form[item]"
                    :maxlength="formRules[item] && formRules[item].maxLength"
                    show-word-limit
                    placeholder="请输入内容"
                    style="width: 80%;"
                  ></el-input>

                  <div v-if="t.name != 'dtoList'" class="form-button">
                    <el-button
                      size="small"
                      @click="
                        () => {
                          importTemplate.visible = true
                          importTemplate.active = [
                            templateTabs.map(_ => _.name).indexOf(t.name) + '',
                          ]
                        }
                      "
                      >导入模板</el-button
                    >
                  </div>
                </el-form-item>
              </template>
            </template>
          </el-form>
        </el-tabs>
      </el-scrollbar>
      <footer class="flex-between">
        <el-button
          size="small"
          @click="
            () => {
              importTemplate.visible = true
              importTemplate.active = ['0']
            }
          "
          >导入模板</el-button
        >
        <div>
          <el-button size="small" @click="saveTemplate.visible = true"
            >设为模板</el-button
          >
          <el-button type="primary" plain size="small" @click="save">
            保存
          </el-button>
          <el-button type="primary" size="small" @click="submit"
            >签名</el-button
          >
        </div>
      </footer>
    </template>
    <template v-else>
      <el-scrollbar>
        <el-tabs tab-position="left">
          <el-tab-pane
            v-for="{ name, label } in saveTemplateTabs"
            :key="name"
            :label="label"
            :name="name"
            lazy
          >
          </el-tab-pane>
          <div>
            <el-form
              :model="saveTemplateForm"
              label-width="100px"
              ref="saveTemplateForm"
            >
              <el-form-item
                label="模板名称"
                prop="tempName"
                :rules="[{ required: true, message: '模板名称不能为空' }]"
              >
                <el-input
                  v-model="saveTemplateForm.tempName"
                  show-word-limit
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input
                  type="textarea"
                  :rows="3"
                  v-model="saveTemplateForm.tempDesc"
                  show-word-limit
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-form>
            <div v-for="(item, index) in saveTemplateTabs" :key="item.name">
              <el-checkbox
                v-model="saveTemplateForm.checked[index]"
                :true-label="item.name"
              >
                {{ item.label }}
              </el-checkbox>
              <p
                :style="{ marginLeft: '26px', color: '#333', fontSize: '14px' }"
              >
                {{ form[item.name] }}
              </p>
            </div>
          </div>
        </el-tabs>
      </el-scrollbar>
      <footer class="is-right">
        <el-button size="medium" @click="saveTemplate.visible = false"
          >取消</el-button
        >
        <el-button
          size="medium"
          type="primary"
          :loading="saveTemplate.btnLoading"
          @click="saveTemplateFunc"
          >保存</el-button
        >
      </footer>
    </template>

    <el-dialog
      title="选择导入模板"
      class="importTemplateDialog"
      :style="{ padding: 0, margin: 0 }"
      :visible.sync="importTemplate.visible"
      width="68%"
      @open="openDialog"
    >
      <el-container style="border: 1px solid #eee;">
        <el-scrollbar>
          <el-menu :default-openeds="importTemplate.active">
            <el-submenu
              v-for="({ name, label }, index) in templateTabs"
              :key="name"
              :index="'' + index"
            >
              <template slot="title">{{ label }}</template>
              <template v-if="importTemplate.list">
                <el-menu-item
                  v-for="({ tempName, tempId }, idx) in importTemplate.list[
                    name
                  ]"
                  :key="tempId"
                  :index="'' + idx"
                >
                  <el-radio-group v-model="importTemplate.selected[name]">
                    <el-radio :label="idx">
                      {{ tempName }}
                    </el-radio>
                  </el-radio-group>
                </el-menu-item>
              </template>
            </el-submenu>
          </el-menu>
        </el-scrollbar>
        <el-main v-if="importTemplate.list">
          <template v-if="importTemplate.selected.dtoList > 0">
            <template v-for="item in tabs">
              <div :key="item.name" v-if="item.name != 'dtoList'">
                <p
                  :style="{
                    fontSize: '16px',
                    color: '#666',
                    marginTop: '26px',
                  }"
                >
                  {{ item.label }}
                </p>
                <div
                  :style="{
                    fontSize: '16px',
                    color: '#333',
                    lineHeight: '24px',
                  }"
                >
                  {{
                    importTemplate.list.dtoList[
                      importTemplate.selected.dtoList
                    ][item.name]
                  }}
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <template v-for="(value, name) in importTemplate.selected">
              <div :key="name" v-if="name != 'dtoList'">
                <p :style="{ fontSize: '16px', color: '#666' }">
                  {{ templateTabs.find(_ => _.name == name).label }}
                </p>
                <div :style="{ fontSize: '16px', color: '#333' }">
                  {{ importTemplate.list[name][value].content }}
                </div>
              </div>
            </template>
          </template>
        </el-main>
      </el-container>
      <template #footer>
        <div class="is-center">
          <el-button size="small" @click="importTemplate.visible = false">
            取消
          </el-button>
          <el-button size="small" type="primary" @click="handleMedicalImport">
            导入
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 诊断 -->
    <el-dialog
      title="修改诊断"
      destroy-on-close
      :visible.sync="diagnosis.visible"
    >
      <Diagnosis
        :orderId="orderId"
        isMedical
        :draftList="form.dtoList"
        v-bind="$attrs"
        @cancel="diagnosisCancel"
        @saveBtn="diagnosisSave"
      ></Diagnosis>
    </el-dialog>
  </section>
</template>

<script>
import {
  findDiseaseInClinic,
  saveDiseaseTemp,
  submitDisease,
  importDiseaseTemp,
  findDiagnosisInClinic,
} from '@/api/business'
import { addEtcDiseaseTemp } from '@/api/template'
import Diagnosis from './Diagnosis'
export default {
  name: 'Medical',
  props: {
    orderId: String,
    clearValid: Boolean,
  },
  components: { Diagnosis },
  data() {
    return {
      activeName: '',
      tabs: [
        {
          name: 'mainSuit',
          label: '主诉',
        },
        {
          name: 'nowDisease',
          label: '现病史',
        },
        {
          name: 'hisDisease',
          label: '既往史',
        },
        {
          name: 'phyCheck',
          label: '体格检查',
        },
        {
          name: 'supCheck',
          label: '辅助检查',
        },
        {
          name: 'dtoList',
          label: '诊断',
        },
        {
          name: 'dealIdea',
          label: '处理意见',
        },
      ],
      formRules: {
        mainSuit: {
          maxLength: 20,
        },
      },
      form: {
        mainSuit: '',
        nowDisease: '',
        hisDisease: '',
        phyCheck: '',
        supCheck: '',
        dtoList: [],
        dealIdea: '',
        list: [],
      },
      importTemplate: {
        visible: false,
        list: null,
        active: [],
        selected: {
          dtoList: 0,
          mainSuit: 0,
          nowDisease: 0,
          hisDisease: 0,
          phyCheck: 0,
          supCheck: 0,
          dealIdea: 0,
        },
      },
      saveTemplateForm: {
        tempName: '',
        tempDesc: '',
        checked: new Array(6),
      },
      saveTemplate: {
        visible: false,
        btnLoading: false,
      },
      diagnosis: {
        visible: false,
      },
    }
  },
  computed: {
    templateTabs() {
      const tabs = Array.from([
        {
          name: 'dtoList',
          label: '整体模板',
        },
        ...this.tabs,
      ])
      tabs.splice(6, 1)
      return tabs
    },
    saveTemplateTabs() {
      const tabs = Array.from(this.tabs)
      tabs.splice(5, 1)
      return tabs
    },
  },
  watch: {
    orderId() {
      if (this.orderId) {
        this.getDiseaseInClinic()
      }
    },
    'importTemplate.selected.dtoList': {
      handler(value, oldValue) {
        if (value > 0 && value != oldValue) {
          for (const key in this.importTemplate.selected) {
            this.importTemplate.selected[key] = value
          }
        }
      },
    },
    'importTemplate.selected': {
      handler(value) {
        const {
          dealIdea,
          mainSuit,
          nowDisease,
          hisDisease,
          phyCheck,
          supCheck,
        } = value
        if (
          [mainSuit, nowDisease, hisDisease, phyCheck, supCheck].every(
            _ => _ === dealIdea,
          )
        ) {
          this.importTemplate.selected.dtoList = dealIdea
        } else {
          this.importTemplate.selected.dtoList = 0
        }
      },
      deep: true,
    },
  },
  created() {
    console.log(123, '===1111111===')
    if (this.orderId) {
      this.getDiseaseInClinic()
    }
  },
  methods: {
    handleTabClick({ name }) {
      this.$refs.tabs.$el
        .querySelector(`#${name}`)
        ?.scrollIntoView({ behavior: 'smooth' })
      this.activeName = name
    },
    async getDiseaseInClinic() {
      const data = await findDiseaseInClinic({ orderId: this.orderId })
      data
        ? Object.keys(this.form).forEach(item => {
            this.$set(this.form, item, data?.[item])
            // this.form[item] = data?.[item]
          })
        : this.$refs.form.resetFields()
      this.getfindDiagnosisInClinic()
    },
    // 诊断
    async getfindDiagnosisInClinic() {
      this.form.dtoList = await findDiagnosisInClinic({ orderId: this.orderId })
    },
    async save() {
      this.$refs.form.validate(async valid => {
        console.log(valid)
        if (!valid) {
          return false
        }
        const data = Object.assign({}, this.form, {
          orderId: this.orderId,
        })

        await saveDiseaseTemp(data)
        this.$message({
          message: '保存成功',
          type: 'success',
        })
      })
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) {
          return
        }

        const { createTime, memberId } = this.$attrs
        const medicalId = await submitDisease(
          Object.assign({}, this.form, {
            orderId: this.orderId,
            medicalTime: createTime,
            userId: memberId,
          }),
        )

        this.$emit('send', { medicalId })
      })
    },
    async openDialog() {
      this.importTemplate.visible = true
      const list = await importDiseaseTemp()

      for (const key in list) {
        if (key == 'dtoList') {
          list[key].unshift({
            content: '',
            tempName: '自定义',
            tempId: 'none',
          })
        } else {
          list[key].unshift({
            content: '',
            tempName: '不选',
            tempId: 'none',
          })
        }
      }

      this.importTemplate.list = list
    },
    diagnosisCancel() {
      this.diagnosis.visible = false
    },
    diagnosisSave(data) {
      this.diagnosis.visible = false
      console.log(data)
      this.form.dtoList = data
        .filter(item => item.diagnosisType)
        .map(item => {
          return Object.assign(item, {
            mainDiagnosis: item.indexCode === this.mainDiagnosis ? 1 : 0,
            childDtos: data.filter(ite => ite.parent === item.indexCode),
          })
        })
    },
    handleMedicalImport() {
      const { list, selected } = this.importTemplate
      const select = Object.values(selected).filter(_ => _ > 0)

      if (!select.length) {
        return
      }

      if (selected.dtoList > 0) {
        for (const item in this.form) {
          if (item == 'dtoList') continue
          this.form[item] = list.dtoList[selected.dtoList][item]
        }
        this.form.list = [list.dtoList[selected.dtoList].tempId]
      } else {
        this.form.list = []
        Object.keys(selected).forEach(_ => {
          if (selected[_] > 0) {
            const content = list[_][selected[_]].content
            if (content) {
              this.form[_] = content
              this.form.list.push(list[_][selected[_]].tempId)
            }
          }
        })
      }
      this.importTemplate.visible = false
    },
    saveTemplateFunc() {
      this.$refs.saveTemplateForm.validate(valid => {
        if (!valid) return

        const { tempName, tempDesc, checked } = this.saveTemplateForm

        if (checked.filter(_ => _).length == 0) {
          this.$message.error('至少选择一项才能保存')
          return
        }

        const form = {
          tempName,
          tempDesc,
        }
        checked.forEach(_ => Object.assign(form, { [_]: this.form[_] }))

        this.saveTemplate.btnLoading = true
        addEtcDiseaseTemp(form)
          .then(() => {
            this.$message.success('保存模板成功')
            this.saveTemplate.visible = false
            this.saveTemplateForm = {
              tempName: '',
              tempDesc: '',
              checked: new Array(6),
            }
          })
          .finally(() => (this.saveTemplate.btnLoading = false))
      })
    },
    editList() {
      this.getfindDiagnosisInClinic()
      this.diagnosis.visible = true
    },
  },
  /*   destroyed() {
    this.$refs.from.resetFields()
  }, */
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-tabs__header {
    position: sticky;
    top: 0;
  }
  .el-tabs--left {
    overflow: visible;
  }
}
.wrap {
  height: 96%;
  padding-top: 20px;
}
.el-scrollbar {
  margin: 10px 0;
  height: calc(100% - 50px);
}
.el-container {
  .el-scrollbar {
    height: 450px;
    margin: 0;
  }
  .el-menu {
    border: none;
  }
  .el-main {
    width: 700px;
    max-height: 500px;
    border-left: 10px solid #f2f2f2;
  }
}
::v-deep.importTemplateDialog {
  .el-dialog__body {
    padding: 0;
  }
  .el-radio {
    max-width: 168px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-submenu__title {
    width: 235px;
  }
  .el-submenu__title,
  .el-radio__label {
    font-size: 16px;
  }
}
.form-button {
  display: inline-block;
  vertical-align: top;
  width: 20%;
  text-align: right;
}
</style>
