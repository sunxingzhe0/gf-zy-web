<template>
  <div class="bigbox">
    <el-scrollbar :class="!isMedical ? 'wrap-overflow-x-auto scroll-bar' : ''">
      <div class="wrapper">
        <el-form :model="dynamicValidateForm" ref="addForm">
          <el-table
            :data="dynamicValidateForm.tableData"
            :tree-props="{ children: 'childDtos' }"
            default-expand-all
          >
            <el-table-column width="80">
              <template slot-scope="scoped">
                <el-radio
                  v-model="mainDiagnosis"
                  :label="scoped.row.indexCode"
                  MainDiagnosis
                  @change="changeMainDiagnosis(scoped.row, scoped.$index)"
                  >{{
                    mainDiagnosis == scoped.row.indexCode ? '主' : ''
                  }}</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column width="120" label="类别">
              <template slot-scope="scoped">
                <el-select
                  v-if="scoped.row.diagnosisType"
                  v-model="tableData[scoped.$index].diagnosisType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in types"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="诊断/病名" :width="template ? '' : '480px'">
              <template slot-scope="scoped">
                <div
                  class="flex-start-start"
                  :style="{ width: template ? '' : '450px' }"
                >
                  <el-input
                    placeholder="前缀"
                    style="max-width: 110px;"
                    v-model="tableData[scoped.$index].prefixName"
                  ></el-input>
                  <el-form-item
                    :prop="'tableData.' + scoped.$index + '.diagnosisName'"
                    :rules="[
                      {
                        required: true,
                        message: '诊断病名不能为空',
                        trigger: ['blur', 'change'],
                      },
                    ]"
                  >
                    <el-select
                      remote
                      :style="{
                        minWidth: '220px',
                        marginLeft: '10px',
                        width: template ? 'calc(100% - 240px)' : '',
                      }"
                      filterable
                      reserve-keyword
                      :loading="loading"
                      placeholder="请输入"
                      value-key="diagnosisCode"
                      :remote-method="searchDiagnosis"
                      v-model="tableData[scoped.$index].diagnosisName"
                      @change="e => onDiagnosisChange(e, scoped.$index)"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.diagnosisCode"
                        :label="item.diagnosisName"
                        :value="item"
                      >
                        <div class="flex-start-start">
                          <div>{{ item.diagnosisName }}</div>
                          <div :style="{ marginLeft: '20px' }">
                            {{ item.diagnosisCode || '' }}
                          </div>
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-input
                    placeholder="后缀"
                    style="margin-left: 10px; max-width: 110px;"
                    v-model="tableData[scoped.$index].suffixName"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="150" label="操作">
              <template slot-scope="scoped">
                <el-tooltip content="上移" placement="top" effect="light">
                  <!-- <el-button
                    type="text"
                    icon="icon el-icon-sort-up"
                    @click="changeSort(scoped.row, scoped.$index, 'up')"
                    :disabled="
                      !tableData[scoped.$index - 1]
                        ? true
                        : !scoped.row.diagnosisType &&
                          tableData[scoped.$index - 1].diagnosisType
                        ? true
                        : false
                    "
                  ></el-button> -->
                  <svg-icon
                    icon-class="Moveup"
                    @click="changeSort(scoped.row, scoped.$index, 'up')"
                    :disabled="
                      !tableData[scoped.$index - 1]
                        ? true
                        : !scoped.row.diagnosisType &&
                          tableData[scoped.$index - 1].diagnosisType
                        ? true
                        : false
                    "
                  />
                </el-tooltip>
                <el-tooltip
                  content="下移"
                  placement="top"
                  effect="light"
                  v-if="scoped.row.diagnosisType"
                >
                  <!-- <el-button
                    type="text"
                    icon="icon el-icon-sort-down"
                    :disabled="
                      scoped.$index + 1 - tableData.length == 0 ||
                      !tableData
                        .slice(scoped.$index + 1 - tableData.length)
                        .some(res => res.diagnosisType)
                    "
                    @click="changeSort(scoped.row, scoped.$index, 'down')"
                  >
                  </el-button> -->
                  <svg-icon
                    icon-class="Movedown"
                    :disabled="
                      scoped.$index + 1 - tableData.length == 0 ||
                      !tableData
                        .slice(scoped.$index + 1 - tableData.length)
                        .some(res => res.diagnosisType)
                    "
                    @click="changeSort(scoped.row, scoped.$index, 'down')"
                  />
                </el-tooltip>

                <el-tooltip
                  content="下移"
                  placement="top"
                  effect="light"
                  v-else
                >
                  <!-- <el-button
                    type="text"
                    icon="icon el-icon-sort-down"
                    :disabled="
                      !tableData[scoped.$index + 1]
                        ? true
                        : tableData[scoped.$index + 1].diagnosisType
                        ? true
                        : false
                    "
                    @click="changeSort(scoped.row, scoped.$index, 'down')"
                  ></el-button> -->
                  <svg-icon
                    icon-class="Movedown"
                    :disabled="
                      !tableData[scoped.$index + 1]
                        ? true
                        : tableData[scoped.$index + 1].diagnosisType
                        ? true
                        : false
                    "
                    @click="changeSort(scoped.row, scoped.$index, 'down')"
                  />
                </el-tooltip>
                <el-tooltip
                  content="子诊断升级"
                  placement="top"
                  effect="light"
                  v-if="!scoped.row.diagnosisType"
                >
                  <!-- <el-button
                    type="text"
                    icon="icon el-icon-top"
                    @click="uplevel(scoped.row, scoped.$index)"
                  ></el-button> -->
                  <svg-icon
                    icon-class="shenji"
                    @click="uplevel(scoped.row, scoped.$index)"
                  />
                </el-tooltip>

                <!-- 添加子诊断 -->
                <el-tooltip content="添加子诊断" placement="top" effect="light">
                  <el-button
                    v-if="scoped.row.diagnosisType"
                    type="text"
                    icon="icon el-icon-circle-plus-outline"
                    @click="addChild(scoped)"
                  ></el-button>
                </el-tooltip>
                <!-- 移动诊断 -->
                <div
                  style="position: relative; display: inline-block;"
                  v-if="
                    mainDiagnosis != scoped.row.indexCode &&
                    scoped.row.diagnosisType &&
                    isChild(scoped.row.indexCode)
                  "
                >
                  <el-tooltip content="移动诊断" placement="top" effect="light">
                    <el-button type="text" icon="icon el-icon-rank"></el-button>
                  </el-tooltip>
                  <div
                    style="
                      opacity: 0;
                      position: absolute;
                      top: 0;
                      right: 0;
                      width: 20px;
                      overflow: hidden;
                    "
                  >
                    <el-cascader
                      @visible-change="moveFocus($event, scoped.row.indexCode)"
                      v-model="scoped.row.move"
                      size="mini"
                      style="position: relative; left: -30px;"
                      :props="{ value: 'indexCode', children: 'childDtos' }"
                      :options="moveData"
                      @change="
                        moveChange($event, scoped.row.indexCode, scoped.row)
                      "
                    ></el-cascader>
                  </div>
                </div>
                <!-- 删除诊断 -->
                <el-tooltip content="删除诊断" placement="top" effect="light">
                  <el-button
                    type="text"
                    icon="icon el-icon-delete"
                    @click="del(scoped.$index)"
                    style="color: red;"
                  ></el-button>
                </el-tooltip>
                <!-- <el-button
                v-if="
                  scoped.row.diagnosisType &&
                  scoped.row.childDtos.length == 0 &&
                  tableData.filter(item => {
                    return item.diagnosisType && childDtos.length == 0
                  }).length > 1
                "
                type="text"
                icon="icon el-icon-rank"
                @click="uplevel(scoped.row, scoped.$index)"
              ></el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </el-scrollbar>
    <div slot="footer" class="btn-group" v-if="!template">
      <el-button size="small" @click="add">新增诊断</el-button>
      <el-button size="small" @click="cancel">取消</el-button>
      <el-button size="small" @click="handleImport">导入模板</el-button>
      <el-button size="small" @click="save">保存</el-button>
      <el-button size="small" v-if="!isMedical" type="primary" @click="submit">
        提交
      </el-button>
    </div>

    <DiagnosisDialog
      ref="diagnosisDialog"
      :memberId="$attrs.memberId"
      :selectedData="tableData"
      @submit="diagnosisDialogSubmit"
    />
  </div>
</template>

<script>
import DiagnosisDialog from './DiagnosisDialog'
import {
  saveTemporaryDiag,
  submitDiagnosis,
  diagnosisKeywordSearch,
  findDiagnosisInClinic,
} from '@/api/business'
import { getVideoStatus, sessionUserSpeak } from '@/api'
import store from '@/store'
import { debounce } from 'lodash'
import { deepClone } from '@/utils/index'
export default {
  name: 'Diagnosis',
  props: {
    orderId: String,
    draftList: {
      type: Array,
      default: () => [],
    },
    isMedical: {
      type: Boolean,
      default: false,
    },
    template: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    DiagnosisDialog,
  },
  data() {
    this.userId = store.state.user.userId
    return {
      dynamicValidateForm: {
        diagnosisName: '',
      },
      types: [
        {
          label: '西医',
          value: 'WEST_MEDICINE',
        },
        {
          label: '中医证型',
          value: 'CH_MEDICINE_CARD',
        },
        {
          label: '中医病名',
          value: 'CH_MEDICINE_NAME',
        },
      ],
      selectValue: '',
      tableData: [],
      mainDiagnosis: '',
      loading: false,
      options: [],
      moveData: [],
      hasSubmit: false,
      value: [],
    }
  },
  created() {
    if (this.orderId) {
      this.loadDiagnosis()
    }
  },
  watch: {
    orderId() {
      if (this.orderId) {
        this.loadDiagnosis()
      }
    },
    draftList: {
      handler(val) {
        if (this.template) {
          this.tableData = val
          this.dynamicValidateForm.tableData = val
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 获取数据源并分出一级二级
    getAllClassify() {
      console.log(this.tableData)
      let data = deepClone(this.tableData)
        .filter(item => item.diagnosisType)
        .map((item, index) => {
          return Object.assign(item, {
            label: '诊断' + (index + 1),
            mainDiagnosis: item.indexCode === this.mainDiagnosis ? 1 : 0,
            childDtos: deepClone(this.tableData).filter(
              ite => ite.parent === item.indexCode,
            ),
          })
        })
      setTimeout(() => {
        data.forEach((item, index) => {
          item.childDtos.forEach((it, t) => {
            it.label = '诊断' + (index + 1) + '-' + (t + 1)
          })
          item.childDtos.push({
            label: '诊断' + (index + 1) + '-' + (item.childDtos.length + 1),
          })
        })
      }, 30)

      this.moveData = data
    },
    // 判断元素是否有子元素
    isChild(indexCode) {
      let data = deepClone(this.tableData)
      let chilnum = 0
      data.forEach(item => {
        if (item.parent == indexCode) {
          chilnum = chilnum + 1
        }
      })
      return chilnum > 0 ? false : true
    },
    moveFocus(e, indexCode) {
      if (e) {
        this.getAllClassify()
        console.log(indexCode)
        console.log(this.moveData)
        this.moveData.forEach(item => {
          if (indexCode == item.indexCode) {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      }
    },
    // 选中改变
    changeRadio(row, index) {
      console.log(row, index)
    },
    moveChange(e, indexCode, row) {
      console.log(e, indexCode)
      let thisindex = null
      let moveIndex = null
      let parent = null
      this.tableData.forEach((item, index) => {
        if (indexCode == item.indexCode) {
          thisindex = index
        }
        if (item.indexCode == e[0]) {
          parent = item.indexCode
        }
        if (e[1]) {
          if (item.indexCode == e[1]) {
            moveIndex = index
          }
        } else {
          if (item.indexCode == e[0]) {
            console.log(item)
            if (item.childDtos) {
              moveIndex = index + item.childDtos.length + 1
            } else {
              moveIndex = index + 1
            }
          }
        }
      })
      let thisData = this.tableData[thisindex]
      if (moveIndex == thisindex) {
        this.tableData.splice(thisindex, 1, {
          parent: parent,
          indexCode: thisData.indexCode,
          prefixName: thisData.prefixName,
          diagnosisName: thisData.diagnosisName,
          suffixName: thisData.suffixName,
        })
      } else {
        this.tableData.splice(moveIndex, 0, {
          parent: parent,
          indexCode: thisData.indexCode,
          prefixName: thisData.prefixName,
          diagnosisName: thisData.diagnosisName,
          suffixName: thisData.suffixName,
        })
        this.tableData.splice(thisindex, 1)
      }

      row.move = []
      this.getAllClassify()
    },

    async loadDiagnosis() {
      const clinicList = this.isMedical
        ? this.draftList
        : await findDiagnosisInClinic({ orderId: this.orderId })
      this.tableData = clinicList
        .map((item, index) => {
          for (let i = 0; i < item.childDtos.length; i++) {
            item.childDtos[i].parent = item.indexCode
          }
          return [Object.assign(item, { indexCode: index }), ...item.childDtos]
        })
        .flat()
      this.dynamicValidateForm.tableData = this.tableData
      this.mainDiagnosis = 0
      this.tableData.forEach(element => {
        if (element.mainDiagnosis == 1) {
          this.mainDiagnosis = element.indexCode
        }
      })
      if (this.tableData.length == 0) {
        this.add()
      } else {
        this.hasSubmit = true
      }
      this.getAllClassify()
    },
    searchDiagnosis: debounce(function (query) {
      this.loading = true
      diagnosisKeywordSearch({
        searchKeywords: query,
        currentNum: 1,
        pageSize: 999,
      })
        .then(res => {
          this.options = res.list
        })
        .finally(() => (this.loading = false))
    }, 100),
    //二级设置主诊断
    becomeMain(scoped, index) {
      console.log(scoped, index)
    },
    //排序更改
    changeSort(scoped, index, type) {
      if (scoped.diagnosisType) {
        //主
        let data = this.tableData
          .filter(item => item.diagnosisType)
          .map(item => {
            return Object.assign(item, {
              mainDiagnosis: item.indexCode === this.mainDiagnosis ? 1 : 0,
              childDtos: this.tableData.filter(
                ite => ite.parent === item.indexCode,
              ),
            })
          })
        let fIndex = false
        for (let i = 0; i < data.length; i++) {
          if (data[i].indexCode == scoped.indexCode) {
            fIndex = i
          }
        }
        data[fIndex] = data.splice(
          type == 'up' ? fIndex - 1 : fIndex + 1,
          1,
          data[fIndex],
        )[0]
        this.tableData = data
          .map(item => {
            for (let i = 0; i < item.childDtos.length; i++) {
              item.childDtos[i].parent = item.indexCode
            }
            return [item, ...item.childDtos]
          })
          .flat()
        this.dynamicValidateForm.tableData = this.tableData
      } else {
        //子
        this.tableData[index] = this.tableData.splice(
          type == 'up' ? index - 1 : index + 1,
          1,
          this.tableData[index],
        )[0]
      }
      this.getAllClassify()
    },
    //修改主诊断判断
    changeMainDiagnosis(row, index) {
      console.log(row, index)
      if (!row.diagnosisType) {
        this.uplevel(row, index)
      }
      this.getAllClassify()
    },
    //子诊断升级
    uplevel(scoped, index) {
      // console.log(scoped, index)
      let item = this.tableData[index]
      Object.assign(item, {
        diagnosisType: this.types[0].value,
        childDtos: [],
        parent: false,
        mainDiagnosis: 0,
      })
      this.tableData.splice(index, 1, item)
      this.getAllClassify()
    },
    add() {
      const data = {
        diagnosisType: this.types[0].value,
        prefixName: '',
        diagnosisName: '',
        suffixName: '',
        indexCode:
          this.tableData.length == 0
            ? 0
            : this.tableData
                .map(item => item.indexCode)
                .sort((a, b) => {
                  return b - a
                })[0] + 1,
        // this.tableData.length > 0
        //   ? this.tableData[this.tableData.length - 1].indexCode + 1
        //   : 1,
        mainDiagnosis: 0,
        childDtos: [],
      }

      this.tableData.push(data)
      if (this.tableData.length == 1) {
        this.mainDiagnosis = this.tableData[0].indexCode
      }
      this.getAllClassify()
    },
    addChild({ row, $index }) {
      const childDtos = {
        parent: row.indexCode,
        indexCode:
          this.tableData.length == 0
            ? 1
            : this.tableData
                .map(item => item.indexCode)
                .sort((a, b) => {
                  return b - a
                })[0] + 1,
        prefixName: '',
        diagnosisName: '',
        suffixName: '',
      }

      const index =
        ++$index +
        this.tableData.filter(item => item.parent === row.indexCode).length

      this.tableData.splice(index, 0, childDtos)
      this.getAllClassify()
    },
    onDiagnosisChange(e, index) {
      Object.assign(this.tableData[index], {
        diagCode: e.diagnosisCode,
        diagnosisCode: e.diagnosisCode,
        diagnosisName: e.diagnosisName,
        diagTypeCode: e.diagnosisType,
      })
    },
    cancel() {
      this.$emit('cancel')
    },
    del(index) {
      const { diagnosisType, indexCode } = this.tableData[index]
      if (diagnosisType) {
        this.tableData.splice(
          index,
          this.tableData.filter(item => item.parent === indexCode).length + 1,
        )
        if (indexCode == this.mainDiagnosis) {
          this.mainDiagnosis = this.tableData.filter(
            item => item.diagnosisType,
          )[0]
            ? this.tableData.filter(item => item.diagnosisType)[0].indexCode
            : 0
        }
      } else {
        this.tableData.splice(index, 1)
      }
      this.getAllClassify()
    },
    confirm() {
      const params = {
        orderId: this.orderId,
        memberId: this.$attrs.memberId,
      }

      const data = this.tableData
        .filter(item => item.diagnosisType)
        .map(item => {
          return Object.assign(item, {
            mainDiagnosis: item.indexCode === this.mainDiagnosis ? 1 : 0,
            childDtos: this.tableData.filter(
              ite => ite.parent === item.indexCode,
            ),
          })
        })

      return { params, data }
    },
    async save() {
      // this.$emit('saveBtn', this.tableData)
      // this.getAllClassify()
      const { params, data } = this.confirm()
      if (!data.some(item => item.diagnosisName)) {
        this.$message.info('请填写至少一条诊断')
        return
      }
      await saveTemporaryDiag(params, data)
      this.$message.success('已保存诊断内容')
      this.$emit('saveBtn', this.tableData)

      /*    if (!this.isMedical) {
        const { params, data } = this.confirm()
        if (!data.some(item => item.diagnosisName)) {
          this.$message.info('请填写至少一条诊断')
          return
        }
        await saveTemporaryDiag(params, data)
        this.$message.success('已保存诊断内容')
      } else {
        this.$emit('saveBtn', this.tableData)
      } */
    },
    async submit() {
      const { wayType } = this.$attrs
      const has = await (wayType === 'VIDEO'
        ? getVideoStatus
        : sessionUserSpeak)({
        orderId: this.orderId,
        sessionId: this.$attrs.sessionId,
        userId: this.userId,
      })
      if (!has) {
        this.$message.warning(
          wayType === 'VIDEO' ? '请先与患者视频沟通' : '请先与患者沟通',
        )
        return
      }

      this.$confirm(
        '该诊断将会覆盖已被应用的病历、处方，是否确认操作?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).then(async () => {
        this.$refs.addForm.validate(valid => {
          console.log(valid)
        })
        const { params, data } = this.confirm()
        await submitDiagnosis(params, data)

        this.$emit('send')
      })
    },
    handleImport() {
      this.$refs.diagnosisDialog.visibleToggle()
    },
    diagnosisDialogSubmit(payload) {
      const tableData = this.tableData.map(({ id }) => id)
      console.log(payload)
      const selection = payload.filter(({ id }) => !tableData.includes(id))

      let indexCode = this.tableData.length
      this.tableData = [
        ...this.tableData,
        ...selection.map(item =>
          // item.diagnosisType
          //   ? Object.assign(item, { indexCode: indexCode++ })
          //   : item,
          Object.assign(item, { indexCode: indexCode++ }),
        ),
      ]
      this.dynamicValidateForm.tableData = this.tableData
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.scroll-bar {
  height: 100%;
}
.icon {
  color: $--color-primary;
}
.bigbox {
  height: 100%;
  overflow: auto;
  padding-bottom: 52px;
  box-sizing: border-box;
  position: relative;
}
.btn-group {
  margin-top: 20px;
  text-align: right;
  position: absolute;
  bottom: 0;
  width: 100%;
  .el-button {
    margin-right: 7px;
  }
}
.svg-icon {
  color: #0ab2c1;
  font-size: 16px;
  margin: 0 5px;
}
.el-button--text {
  padding-left: 4px;
}
.el-button + .el-button {
  padding-left: 10px;
  margin-left: 0px;
}
.el-table td div {
  padding-left: 6px;
}
</style>
