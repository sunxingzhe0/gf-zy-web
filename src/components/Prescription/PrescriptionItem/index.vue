<template>
  <div class="prescription-item">
    <div class="prescription-item-header" v-if="!scene">
      <div class="prescription-no">
        <span>处方号：Rp{{ index + 1 }}（{{ prescription.id }}）</span>
        <span :class="prescription.status">
          {{ status[prescription.status] }}
        </span>
      </div>
      <div class="prescription-date">
        <span
          v-if="
            prescription.status === 'PASSED' ||
            prescription.status === 'REJECTED'
          "
        >
          审方时间：{{ prescription.auditTime }}
        </span>
        <span v-else> 创建时间：{{ prescription.createTime }} </span>
        <span style="margin-left: 40px">数量：{{ drugCount }}</span>
      </div>
      <div class="prescription-option">
        <el-button
          plain
          size="mini"
          type="danger"
          @click="delPrescription()"
          v-if="prescription.status === 'DRAFT' && !operate"
        >
          删除处方
        </el-button>
        <el-button
          plain
          size="mini"
          type="primary"
          @click="copyPrescription"
          v-if="prescription.status === 'REJECTED' && !operate"
        >
          复制
        </el-button>
        <el-button
          plain
          size="mini"
          type="primary"
          @click="openNewWeb(prescription)"
          v-if="
            (prescription.status === 'PENDING_REVIEW' ||
              prescription.status === 'PASSED') &&
            !operate
          "
        >
          预览
        </el-button>
        <el-button
          plain
          size="mini"
          type="primary"
          @click="withdrawPrescription"
          v-if="prescription.status === 'PENDING_REVIEW' && !operate"
        >
          撤回
        </el-button>
      </div>
    </div>
    <div
      class="prescription-rejection"
      v-if="prescription.status === 'REJECTED'"
    >
      <span>驳回原因：</span>
      <span class="prescription-rejection-text">{{ prescription.reason }}</span>
    </div>
    <div class="prescription-item-body" :class="{ scroll: scene }">
      <div class="prescription-table">
        <div class="prescription-table-header">
          <template v-for="(item, index) in tableHeader">
            <div
              v-if="
                (item.key !== 'operate' || prescription.status === 'DRAFT') &&
                item.key !== 'type'
              "
              :key="'table-header-' + index"
              :style="columnStyle(item.key)"
              class="column-item"
              :class="item.key"
            >
              <el-checkbox
                v-if="item.key === 'checkbox' && operate !== 'adjust'"
                :disabled="Boolean(!operate) && istemplatePage"
                v-model="allChecked"
                @change="checkedAll"
              ></el-checkbox>
              <span v-else>{{ item.text }}</span>
            </div>
          </template>
        </div>
        <div class="class-prescription-table-body" :style="computedHeight">
          <template v-for="(item, index) in tableData">
            <div
              class="row-item"
              :key="'table-data-' + index"
              :class="{
                groups: item.rowClass,
                checkbox: tableHeader[0].key === 'checkbox',
              }"
            >
              <template v-for="(it, i) in tableHeader">
                <div
                  class="column-item"
                  :style="columnStyle(it.key)"
                  :key="'table-item-' + index + i"
                  :class="{ error: item[it.key + 'Error'] }"
                  v-if="
                    (it.key !== 'operate' || prescription.status === 'DRAFT') &&
                    it.key !== 'type'
                  "
                >
                  <el-tooltip
                    effect="dark"
                    placement="top-start"
                    :content="toolTipContent(item, it.key)"
                    :disabled="toolTipDisabled(item, it.key)"
                  >
                    <div :class="columnClass(item, it)">
                      <!-- 调方/成组 -->
                      <template v-if="it.key === 'checkbox'">
                        <!-- 调方 -->
                        <template v-if="operate === 'adjust'">
                          <el-select
                            v-model="item.target"
                            v-show="!item.rowClass && !item.unsaved"
                            @change="target => adjustHandler(index, target)"
                          >
                            <template v-for="(_it, _i) in targets">
                              <el-option
                                :disabled="computedDisabled(item, _it)"
                                :title="computedTitle(item, _it)"
                                :key="index + '-' + _i"
                                :label="_it.label"
                                :value="_it.value"
                              >
                              </el-option>
                            </template>
                          </el-select>
                        </template>
                        <!-- 模板和删除要显示所有药品 -->
                        <template
                          v-else-if="operate === 'temp' || operate === 'del'"
                        >
                          <el-checkbox
                            :disabled="Boolean(!operate) && istemplatePage"
                            v-show="!item.unsaved"
                            v-model="item.checked"
                            @change="checkItem"
                          ></el-checkbox>
                        </template>
                        <!-- 取消成组 -->
                        <template v-else-if="operate === 'unGroup'">
                          <el-checkbox
                            v-show="item.groupDrugCount > 1"
                            v-model="item.checked"
                            @change="checkItem"
                          ></el-checkbox>
                        </template>
                        <!-- 成组、提交 -->
                        <template v-else>
                          <el-checkbox
                            :disabled="Boolean(!operate) && istemplatePage"
                            v-show="!item.rowClass && !item.unsaved"
                            v-model="item.checked"
                            @change="checkItem"
                          ></el-checkbox>
                        </template>
                      </template>
                      <!-- 序号 -->
                      <template v-else-if="it.key === 'index'">
                        <span>{{ index + 1 }}</span>
                      </template>
                      <!-- component -->
                      <template v-else-if="it.component">
                        <component
                          value-format="yyyy-MM-dd HH:mm:ss"
                          :type="it.type"
                          :is="it.component"
                          :remote="it.remote"
                          v-model="item[it.key]"
                          :disabled="!item.edit"
                          @blur="blurHandler(index)"
                          :filterable="it.filterable"
                          :loading="item[it.key + 'Loading']"
                          :placeholder="computedPlaceHolder(item, it)"
                          @change="changeHandler($event, index, it.key)"
                          :remote-method="
                            event => {
                              it.remoteMethod && it.remoteMethod(event, index)
                            }
                          "
                        >
                          <!-- 可远程搜索select -->
                          <template v-if="it.remote">
                            <el-option
                              v-for="(_it, _i) in item[it.key + 'Options']"
                              :value="_it.value"
                              :label="_it.label"
                              :key="_i"
                            >
                              <template v-if="it.key === 'name'">
                                <span>{{ _it.id }}</span>
                                <i class="name-split">|</i>
                                <span>{{ _it.label }}</span>
                                <i class="name-split">|</i>
                                <span>{{ _it.drugSpec }}</span>
                              </template>
                            </el-option>
                          </template>
                          <!-- 数组select -->
                          <template v-else>
                            <el-option
                              v-for="(_it, _i) in it.options"
                              :label="_it.label || _it"
                              :value="_it.value || _it"
                              :key="_i"
                            ></el-option>
                          </template>
                        </component>
                      </template>
                      <!-- 操作 -->
                      <template v-else-if="it.key === 'operate'">
                        <!-- 药品清单 -->
                        <template v-if="scene === 'drugList'">
                          <span class="danger" @click="delHandler(index)">
                            删除
                          </span>
                        </template>
                        <template v-else-if="item.edit">
                          <span @click="savaHandler(index)">保存</span>
                          <span @click="resetHandler(index)">重置</span>
                        </template>
                        <template v-else>
                          <span
                            :class="{ disabled: index === 0 }"
                            @click="moveItem(index, index - 1)"
                            >上移</span
                          >
                          <span
                            :class="{
                              disabled:
                                index === 4 ||
                                (tableData[index + 1] &&
                                  tableData[index + 1].unsaved),
                            }"
                            @click="moveItem(index, index + 1)"
                            >下移</span
                          >
                          <span @click="editItem(index)">修改</span>
                          <span class="danger" @click="delHandler(index)"
                            >删除</span
                          >
                        </template>
                      </template>
                      <template v-else>
                        <span>{{ item[it.key] | filter(it.filter) }}</span>
                      </template>
                      <!-- 单量单位 -->
                      <!-- <template v-if="it.key === 'singleDose'">
                        {{ item.singleDoseUnitText }}
                      </template> -->
                      <template v-if="it.key === 'singleDose'">
                        {{ item.dosageUnitText }}
                      </template>
                      <!-- 疗程单位 -->
                      <template v-if="it.key === 'treatment' && item.treatment">
                        <el-select
                          v-model="item.treatmentUnit"
                          :disabled="!item.edit"
                        >
                          <el-option
                            v-for="_it in treatmentUnits"
                            :label="_it.label"
                            :value="_it.value"
                            :key="_it.value"
                          ></el-option>
                        </el-select>
                      </template>
                      <!-- 总量单位 -->
                      <template v-if="it.key === 'total' && item.totalUnit">
                        <template v-if="scene === 'detail'">
                          {{ item.totalUnitText }}
                        </template>
                        <template v-else>
                          <el-select
                            :disabled="!item.edit"
                            v-model="item.totalUnit"
                            @change="changeHandler($event, index, 'totalUnit')"
                          >
                            <el-option
                              v-for="_it in item.totalUnits"
                              :label="_it.label"
                              :value="_it.value"
                              :key="_it.value"
                            ></el-option>
                          </el-select>
                        </template>
                      </template>
                    </div>
                  </el-tooltip>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div
      class="prescription-item-footer"
      v-if="footerShow && scene !== 'drugList'"
    >
      <div>
        <template
          v-if="scene === 'template' && prescription.status === 'DRAFT'"
        >
          <el-button
            plain
            type="primary"
            :disabled="Boolean(operate) && istemplatePage"
            @click="$emit('operate', 'group')"
            >成组</el-button
          >
          <el-button
            plain
            type="primary"
            :disabled="Boolean(operate) && istemplatePage"
            @click="$emit('operate', 'unGroup')"
            >取消成组</el-button
          >
          <el-button
            plain
            type="danger"
            :disabled="Boolean(operate) && istemplatePage"
            @click="$emit('operate', 'del')"
            >{{ scene === 'template' ? '批量删除' : '删除' }}</el-button
          >
        </template>
      </div>
      <div>
        <template v-if="scene !== 'template'">
          <span
            v-for="(item, index) in prices"
            :class="{ total: index === prices.length - 1 }"
            :key="index"
          >
            {{ item.label }}：¥{{ item.value }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
/*
@author         qiang
@name           PrescriptionItem
@desc           处方项
@props
                index         当前处方索引
                scene         场景['', 'template', 'drugList', 'detail']
                operate       当前操作['','temp', 'adjust', 'group', 'unGroup', 'delete', 'submit']
                template      是否处方模板
                prescription  处方信息
                footerShow    是否显示footer信息
@emit
                update
                  {type: update} 更新
                  {type: copy, index: index} 复制
                  {type: delete, index: index} 删除
                  {type: updatePrice, index: index} 撤回
                  {type: applyAdjust, data: {auto: 是否自动, drugs: 调方药品, target: 调方目标}} 调方
                  {type: withdraw, data: {westPrice: 西药价格, chPatentPrice: 中成药价格, prescriptionPrice: 总价}} 更新价格
*/
import shortid from 'shortid'
import { mapState } from 'vuex'
import { cloneDeep } from 'lodash'
import { arr as array } from '@qietuzi/utils'
import { access_url } from '@/utils/wss-http'
import { Medicares } from '../enums'
import * as apiPrescription from '@/api/prescription'
import { TableHeader, ColumnWidth, DrugItem, ValidateKeys } from '../constant'
import dayjs from 'dayjs'

export default {
  props: {
    iscancel: {
      type: Boolean,
    },
    // 场景
    scene: {
      type: String,
      default: '',
    },
    // 当前项索引
    index: {
      type: Number,
      require: true,
    },
    // 当前操作
    operate: {
      type: String,
      default: '',
    },
    // 调方选项
    targets: {
      type: Array,
      default: () => [],
    },
    // 处方信息
    prescription: {
      type: Object,
      require: true,
    },
    // 是否显示底部信息
    footerShow: {
      type: Boolean,
      default: true,
    },
    istemplatePage: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      access_url,
      oldTableData: [],
      status: {
        DRAFT: '草稿',
        PASSED: '已通过',
        REJECTED: '已驳回',
        PENDING_REVIEW: '待审核',
      },
      tableData: [],
      tableHeader: [],
      allChecked: false,
      columnWidth: ColumnWidth,
      validateKeys: [...ValidateKeys],
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      dept: state => state.user.dept,
      drugWays: state => state.drug.drugWays,
      drugTypes: state => state.drug.drugTypes,
      orgDrugUnits: state => state.drug.orgDrugUnits,
      treatmentUnits: state => state.drug.drugTreatments,
      drugFrequencys: state => state.drug.drugFrequencys,
    }),
    prices() {
      let prices = []
      let totalPrice = 0
      const _self = this
      const pricesMap = new Map()
      const findTypeText = function (typeId) {
        const type = _self.drugTypes.find(item => item.value === typeId)
        return type ? type.label : '未知'
      }
      this.tableData.forEach(item => {
        if (pricesMap.has(item.type)) {
          const price = pricesMap.get(item.type)
          pricesMap.set(item.type, price + Number(item.totalPrice))
        } else {
          pricesMap.set(item.type, Number(item.totalPrice))
        }
        totalPrice = totalPrice + Number(item.totalPrice)
      })
      pricesMap.forEach((value, key) => {
        if (key) {
          const label = findTypeText(key)
          prices.push({ label, value })
        }
      })
      prices = prices.sort((a, b) => a.label.localeCompare(b.label, 'zh'))
      prices.push({ label: '合计', value: totalPrice })
      prices = prices.map(item => ({ ...item, value: item.value.toFixed(2) }))
      return prices
    },
    drugCount() {
      const drugs = this.tableData.filter(item => !item.unsaved)
      return drugs.length
    },
    computedHeight() {
      const count = this.tableData.filter(item => !item.unsaved)
      const height = count.length * 48 + 'px'
      return this.operate ? { height } : {}
    },
  },
  created() {
    const tableHeader = cloneDeep(TableHeader)
    tableHeader[5].options = this.drugWays
    tableHeader[2].options = this.drugTypes
    tableHeader[7].options = this.drugFrequencys
    tableHeader[3].remoteMethod = this.searchDrugs
    if (this.scene === 'drugList') tableHeader.shift()
    if (this.scene === 'template') {
      this.validateKeys.pop()
      tableHeader.splice(tableHeader.length - 5, 4)
    }
    if (this.scene === 'detail') {
      tableHeader.shift()
      tableHeader.pop()
    }
    this.tableHeader = tableHeader
  },
  methods: {
    //处方签
    openNewWeb(item) {
      console.log(item.id, '处方单id')
      // window.open(
      //   'https://miapp.chuntaoyisheng.com/mi/api/v1/rx/downloadRx?rxId=W0246461',
      // )
      console.log(access_url, '地址------')
      window.open(`${access_url}/mi/api/v1/rx/downloadRx?rxId=${item.id}`)
    },
    watchHandler(newVal) {
      console.log('更新', newVal)
      let rpDrugList = newVal.rpDrugList || []
      rpDrugList = rpDrugList.map(item => ({
        ...item,
        checked: false,
        nameOptions: [],
        target: this.index,
        nameLoading: false,
        receivePharmacyOptions: [],
        edit: this.scene === 'drugList',
        totalUnits: this.computedTotalUnit(item),
      }))
      this.oldTableData = JSON.parse(JSON.stringify(rpDrugList))
      if (
        newVal.status === 'DRAFT' &&
        this.scene !== 'detail' &&
        this.scene !== 'drugList'
      ) {
        const len = rpDrugList.length
        if (!len || (len !== 5 && !rpDrugList[len - 1].unsaved)) {
          rpDrugList.push(Object.assign({}, DrugItem, { seq: len }))
        }
      }
      this.tableData = rpDrugList
      this.computedGroupClass()
      this.loadReceivePharmacyOptions()
    },
    // 在有药品的清空下，加载默认药房
    loadReceivePharmacyOptions() {
      this.tableData.forEach((item, index) => {
        if (
          item.edit &&
          item.orgDrugId &&
          !item.receivePharmacyOptions.length
        ) {
          this.searchPharmacys(index)
        }
      })
    },
    // columnStyle
    columnStyle(key) {
      return key === 'checkbox' || key === 'operate'
        ? { width: ColumnWidth[key] }
        : { flex: ColumnWidth[key] }
    },
    // 计算组class
    computedGroupClass() {
      console.log('计算class')
      this.tableData = this.tableData.map((item, index, arr) => {
        const prevGroupId = this.tableData[index - 1]?.groupId
        const rowClass = item.groupId && item.groupId === prevGroupId
        const groupDrugs = arr.filter(
          it => it.groupId && it.groupId === item.groupId,
        )
        return {
          ...item,
          rowClass: rowClass,
          groupDrugCount: groupDrugs.length || 1,
        }
      })
    },
    // columnClass
    columnClass(item, it) {
      let grouped = ''
      if (item.rowClass && (it.key === 'index' || it.key === 'checkbox')) {
        grouped = 'grouped'
      }
      return [
        it.key,
        grouped,
        item.edit ? '' : 'disabled',
        it.key === 'operate' && this.operate ? 'operate-disabled' : '',
      ]
    },
    /*
      @desc   保存验证
      @params
              index         number|undefined    单项|全部
              checkSave     boolean             检查是否保存
    */
    validate(index, checkSave) {
      let err = false
      let indexs = new Set()
      if (index === undefined) {
        this.tableData.forEach((item, index) => {
          if (this.validateKeys.some(key => item[key])) {
            if (checkSave) {
              if (item.unsaved || item.edit) {
                indexs.add(index)
              }
            } else {
              this.validateKeys.forEach(key => {
                if (!this.tableData[index][key]) {
                  err = true
                  indexs.add(index)
                  this.$set(this.tableData[index], key + 'Error', true)
                }
              })
            }
          }
        })
        return Boolean(indexs.size)
      }
      this.validateKeys.forEach(key => {
        if (!this.tableData[index][key]) {
          err = true
          this.$set(this.tableData[index], key + 'Error', true)
        }
      })
      return err
    },
    // 调方title
    computedTitle(item, _it) {
      if (item.groupDrugCount > _it.cap) {
        return '一个处方单最多有5个药品'
      }
      if (
        _it.receivePharmacyId &&
        item.receivePharmacyId !== _it.receivePharmacyId
      ) {
        return '不同药房的药品不可调方'
      }
      return ''
    },
    // computedPlaceHolder
    computedPlaceHolder(item, it) {
      if (this.scene === 'detail') {
        return '--'
      } else if (this.prescription.status === 'DRAFT') {
        return it.component === 'el-select' ? '请选择' : '请输入'
      } else {
        return '--'
      }
    },
    // 提示
    toolTipContent(item, key) {
      switch (key) {
        // case 'type':
        case 'useWays': {
          return item.useWaysText
        }
        case 'useFrequency': {
          let _key = 'drugTypes'
          if (key === 'useWays') {
            _key = 'drugWays'
          } else if (key === 'useFrequency') {
            _key = 'drugFrequencys'
          }
          const _item = array.findItem(this[_key], 'value', item[key])
          if (_item) return _item.label
          return item.useFrequencyText
        }
        case 'medicare': {
          return Medicares[item[key]]
        }
        // case 'singleDose': {
        //   return String(
        //     item.singleDoseUnitText
        //       ? item[key] + item.singleDoseUnitText
        //       : item[key],
        //   )
        // }
        case 'singleDose': {
          return String(
            item.singleDoseUnitText
              ? item[key] + item.singleDoseUnitText
              : item[key],
          )
        }
        case 'total': {
          const _item = array.findItem(item.totalUnits, 'value', item.totalUnit)
          if (_item) {
            return item.total + _item.label
          } else {
            return item.totalUnit ? item.total + item.totalUnitText : item.total
          }
          // break
        }
        case 'treatment': {
          const _item = array.findItem(
            this.treatmentUnits,
            'value',
            item.treatmentUnit,
          )
          if (_item) return String(item[key] + _item.label)
          break
        }
        case 'price':
        case 'totalPrice': {
          return '¥' + item[key]
        }
        default:
          return String(item[key])
      }
    },
    toolTipDisabled(item, key) {
      const keys = ['checkbox', 'index', 'operate']
      if (keys.includes(key)) {
        return true
      } else {
        return !item[key]
      }
    },
    // 调方禁用
    computedDisabled(item, _it) {
      return (
        item.groupDrugCount > _it.cap ||
        (_it.receivePharmacyId &&
          item.receivePharmacyId !== _it.receivePharmacyId)
      )
    },
    // totalUnit
    computedTotalUnit(item) {
      const options = [
        {
          value: item.regularUnit,
          label: item.regularUnitText,
        },
      ]
      //拆不拆零都用常规包装单位
      // if (item.split) {
      //   options.unshift({
      //     value: item.basicUnit,
      //     label: item.basicUnitText,
      //   })
      // }
      return options
    },
    computedDrugPrice(drug) {
      let total = '',
        totalPrice = ''
      const {
        price,
        totalUnit,
        treatment,
        singleDose,
        // basicDose,
        regularUnit,
        useFrequency,
        regularPackVolume,
      } = drug
      let frequency = this.drugFrequencys.find(
        item => item.value === useFrequency,
      )
      if (frequency?.val) {
        //频率时间执行方案保存
        const execPlan = JSON.parse(frequency?.val)['时间方案']
        console.log(
          execPlan,
          '频率时间执行方案---------------------------------',
        )
        drug.execPlan = execPlan
      }

      frequency = frequency?.code
      console.log(frequency, '-------------')
      if (treatment && singleDose && frequency) {
        total = Number(treatment) * Number(singleDose) * Number(frequency)
        // 不可拆零
        if (!drug.split) {
          total = Math.ceil(total / regularPackVolume)
          totalPrice = (Number(total) * Number(price)).toFixed(2)
        } else {
          // 常规包装单位
          if (totalUnit === regularUnit) {
            totalPrice = (
              Number(total) *
              regularPackVolume *
              Number(price)
            ).toFixed(2)
          }
          // 基本包装单位
          else {
            totalPrice = (Number(total) * Number(price)).toFixed(2)
          }
        }
      }
      return { total, totalPrice }
    },
    // 搜素药品
    async searchDrugs(event, index) {
      if (event === '') {
        this.$set(this.tableData[index], 'nameOptions', [])
        this.$set(this.tableData[index], 'nameLoading', false)
      } else {
        try {
          this.$set(this.tableData[index], 'nameLoading', true)
          const res = await apiPrescription.searchDrugByKeyword({
            deptId: this.dept.id,
            name: event,
          })
          const options = res.map(item => ({
            ...item,
            value: item.id,
            label: item.name,
          }))
          this.$set(this.tableData[index], 'nameLoading', false)
          this.$set(this.tableData[index], 'nameOptions', options)
        } catch (e) {
          this.$set(this.tableData[index], 'nameOptions', [])
          this.$set(this.tableData[index], 'nameLoading', false)
        }
      }
    },
    // 搜索药房
    async searchPharmacys(index) {
      try {
        if (!this.tableData[index]) return
        this.$set(this.tableData[index], 'receivePharmacyLoading', true)
        const res = await apiPrescription.searchPharmacyByOrgDrugId({
          orgDrugId: this.tableData[index].orgDrugId,
          deptId: this.dept.id,
        })
        const options = res.map(item => ({
          ...item,
          label: item.pharmacyName,
          value: item.mechanismId,
        }))
        if (!this.tableData[index]) return
        this.$set(this.tableData[index], 'receivePharmacyLoading', false)
        this.$set(this.tableData[index], 'receivePharmacyOptions', options)
        // 如果当前药品没有药房，则默认第一个药房
        if (!this.tableData[index].receivePharmacy) {
          if (options[0]) {
            this.$nextTick(() => {
              this.changeHandler(options[0].value, index, 'receivePharmacy')
            })
          }
        }
      } catch (e) {
        console.log(e)
        this.$set(this.tableData[index], 'receivePharmacyOptions', [])
        this.$set(this.tableData[index], 'receivePharmacyLoading', false)
      }
    },
    // 保存处方
    async savePrescription(tips = true, callback, isCloseLoading = false) {
      console.log('111')
      let data = cloneDeep(this.tableData)
      data = data.filter(item => !item.unsaved)
      const delKeys = [
        'edit',
        'target',
        'unsaved',
        'checked',
        'nameOptions',
        'nameLoading',
      ]
      data.forEach(item => {
        for (let p in item) {
          if (/Error/.test(p)) delete item[p]
          if (delKeys.includes(p)) delete item[p]
        }
      })
      if (
        this.prescription.status === 'DRAFT' &&
        this.prescription.template !== 'template'
      ) {
        //时间格式转换(暂时不转了)
        // data.forEach(v => {
        //   v.executeTime = dayjs(v.executeTime).format('YYYYMMDDHHmmss')
        // })
        await apiPrescription.editRp({
          rpDrugList: data,
          id: this.prescription.id,
        })
        console.log(tips, '--------------------------')
        if (tips) this.$message.success('操作成功！')
        if (callback) callback()
        this.$emit('update', { type: 'update', isCloseLoading })
      }
    },
    // 删除处方
    async delPrescription(callback) {
      try {
        if (!callback) {
          const confirm = await this.$confirm('您确定删除该处方？', '提示', {
            type: 'warning',
          })
          if (confirm !== 'confirm') return
        }
        await apiPrescription.delRp({ id: this.prescription.id })
        if (callback) return callback()
        this.$message.success('删除成功')
        this.$emit('update', {
          index: this.index,
          type: 'delete',
        })
      } catch (e) {
        console.log(e)
        // nothing
      }
    },
    // 复制处方
    copyPrescription() {
      this.$emit('update', {
        type: 'copy',
        index: this.index,
      })
    },
    // 撤回处方
    async withdrawPrescription() {
      await apiPrescription.withdrawRp({ id: this.prescription.id })
      this.$message.success('操作成功')
      this.$emit('update', {
        type: 'withdraw',
        index: this.index,
      })
    },
    // 组件 blur 事件
    blurHandler(index) {
      setTimeout(() => {
        this.validateKeys.forEach(key => {
          if (this.tableData[index][key]) {
            this.$set(this.tableData[index], key + 'Error', false)
          }
        })
      }, 200)
    },
    // 组件 change 事件
    changeHandler(event, index, key) {
      console.log(event, index, key)
      let drug = this.tableData[index]
      switch (key) {
        case 'type': {
          const drug = Object.assign({}, drug, DrugItem, { type: event })
          break
        }
        case 'name': {
          const _drug = this.tableData[index].nameOptions.find(
            item => item.value === event,
          )
          console.log('——drug', _drug)
          if (!_drug) return
          drug = Object.assign({}, drug, {
            spec: _drug.drugSpec, // 药品规格
            name: _drug.label, // 药品名称
            split: _drug.split, // 是否拆零
            divided: _drug.divided, // 是否分次
            type: _drug.manageCode, // 药品类型
            orgDrugId: _drug.value, // 机构药品id
            medicare: _drug.healthAttr, // 医保类型
            singleDoseUnit: _drug.dosageUnit, // 基本剂量
            dosageUnit: _drug.dosageUnit, // 基本剂量
            singleDoseUnitText: _drug.dosageUnitText, // 基本剂量单位
            dosageUnitText: _drug.dosageUnitText, // 基本剂量单位
            totalUnits: this.computedTotalUnit(_drug), // 总量单位
            regularPackVolume: _drug.regularPackVolume, // 常规包装规格
            treatmentUnit: this.treatmentUnits[0].label, // 疗程单位
            // totalUnit: _drug.split ? _drug.basicUnit : _drug.regularUnit, // 总量单位
            totalUnit: _drug.regularUnit, // 拆不拆零都用常规包装单位
            basicUnit: _drug.basicUnit,
            // 修改药品后=>清除单量、频次、疗程、总量、总价、药房、备注
            total: '',
            price: '',
            remark: '',
            useWays: '',
            treatment: '1',
            totalPrice: '',
            singleDose: '',
            basicDose: '',
            useFrequency: '',
            receivePharmacy: '',
            receivePharmacyId: '',
            receivePharmacyOptions: [],
          })
          break
        }
        case 'receivePharmacy': {
          const { receivePharmacyOptions } = this.tableData[index]
          const receivePharmacy = receivePharmacyOptions.find(
            item => item.value === event,
          )
          if (!receivePharmacy) return
          drug = Object.assign({}, drug, {
            price: receivePharmacy.retailPrice,
            remark: receivePharmacy.remark || drug.remark,
            useWays: drug.useWays || receivePharmacy.ways,
            availableInventory: receivePharmacy.availableInventory,
            singleDose: drug.singleDose || receivePharmacy.defaultUsage,
            basicDose: drug.basicDose || receivePharmacy.basicDose,
            useFrequency: drug.useFrequency || receivePharmacy.frequency,
            receivePharmacy: receivePharmacy.label,
            receivePharmacyId: receivePharmacy.value,
          })
          const { total, totalPrice } = this.computedDrugPrice(drug)
          console.log(totalPrice, 'totalPrice-------------1')
          drug.totalPrice = totalPrice
          drug.total = total
          //如果当前药品在该药房无库存，需要提示并清空输入框
          //可输入总量
          const canInpTotal = Math.floor(
            Number(receivePharmacy.availableInventory) /
              Number(receivePharmacy.regularPackVolume),
          )
          drug.canInpTotal = canInpTotal
          if (canInpTotal < 1) {
            drug.total = ''
            drug.totalPrice = '0.00'
            this.$message.error('该药品库存不足，请选择其他药品！')
            setTimeout(() => {
              this.resetHandler(index)
            }, 1000)
          }
          break
        }
        case 'singleDose': {
          // drug.singleDose = parseInt(event)
          drug.singleDose = Number(event)
          const { total, totalPrice } = this.computedDrugPrice(drug)
          drug.totalPrice = totalPrice
          drug.total = total

          break
        }
        case 'total':
          if (drug.total > drug.canInpTotal) {
            drug.total = drug.canInpTotal
            this.$message.error('库存不足，最大可输入' + drug.canInpTotal)
          }
        //改变总量穿透下来自动计算总价
        case 'totalUnit': {
          let totalPrice
          const {
            total,
            price,
            split,
            totalUnit,
            basicUnit,
            // singleDoseUnit,
            regularPackVolume,
          } = drug
          if (split) {
            if (totalUnit === basicUnit) {
              totalPrice = Number(total) * Number(price)
            } else {
              totalPrice = Number(total) * Number(price) * regularPackVolume
            }
            totalPrice = totalPrice.toFixed(2)
          } else {
            totalPrice = Number(total) * Number(price) * regularPackVolume
          }
          console.log(totalPrice, drug, 'totalPrice-------------1')
          drug.totalPrice = totalPrice
          break
        }
        case 'treatment':
        case 'useFrequency': {
          const { total, totalPrice } = this.computedDrugPrice(drug)
          drug.totalPrice = totalPrice
          drug.total = total
          break
        }
      }
      this.$set(this.tableData, index, drug)
      if (key === 'name') this.searchPharmacys(index)
    },
    // 编辑药品 => 获取病房列表
    editItem(index) {
      this.$emit('editUpdate', 'edit')
      const { receivePharmacyOptions } = this.tableData[index]
      if (!receivePharmacyOptions.length) {
        this.searchPharmacys(index)
      }
      const drug = this.tableData[index]
      drug.totalUnits = this.computedTotalUnit(drug)
      this.$set(this.tableData, index, { ...drug, edit: true })
    },
    // 移动药品：判断上下移动是否在组内不在组内则移动整个组
    moveItem(index, target) {
      let drugsNow = []
      let drugsNew = []
      let tableData = []
      let newIndex = target
      const groupNew = this.tableData[target].groupId
      const groupNow = this.tableData[index].groupId
      if (groupNew === groupNow) {
        drugsNow = [this.tableData[index]]
        tableData = this.tableData.filter((_, _index) => _index !== index)
      } else {
        // 当前与目标均为药品组
        if (groupNew && groupNow) {
          drugsNow = this.tableData.filter(item => item.groupId === groupNow)
          drugsNew = this.tableData.filter(item => item.groupId === groupNew)
          tableData = this.tableData.filter(item => item.groupId !== groupNow)
          newIndex = this.tableData.findIndex(item => item.groupId === groupNew)
          newIndex = index > target ? newIndex : newIndex + drugsNew.length
        }
        // 目标为药品组
        else if (groupNew) {
          drugsNow = [this.tableData[index]]
          tableData = this.tableData.filter((_, _index) => _index !== index)
          drugsNew = this.tableData.filter(item => item.groupId === groupNew)
          newIndex = this.tableData.findIndex(item => item.groupId === groupNew)
          newIndex = index > target ? newIndex : newIndex + drugsNew.length
        }
        // 当前为药品组
        else {
          newIndex = index > target ? newIndex : newIndex - 1
          drugsNow = this.tableData.filter(item => item.groupId === groupNow)
          tableData = this.tableData.filter(item => item.groupId !== groupNow)
        }
      }
      tableData.splice(newIndex, 0, ...drugsNow)
      if (groupNew === groupNow) {
        tableData = tableData.map((item, index) => {
          const prevGroupId = tableData[index - 1]?.groupId
          const rowClass = item.groupId && item.groupId === prevGroupId
          return {
            ...item,
            rowClass: rowClass,
          }
        })
      }
      this.tableData = tableData
      this.savePrescription()
      //移动后告诉父组件
      this.$emit('editUpdate', 'edit')
    },
    // 全选药品
    checkedAll(val) {
      if (val) {
        this.tableData.forEach((item, index) => {
          if (!item.unsaved) {
            this.$set(this.tableData[index], 'checked', true)
          }
        })
      } else {
        this.allChecked = false
        this.tableData.forEach((item, index) => {
          if (!item.unsaved) {
            this.$set(this.tableData[index], 'checked', false)
          }
        })
      }
    },
    // 选择单个药品
    checkItem() {
      this.allChecked = this.tableData.every(item => {
        if (!item.unsaved) {
          return item.checked
        }
        return true
      })
    },
    // 删除药品 callback || index
    async delHandler(input) {
      // 删除单个
      if (typeof input === 'number') {
        const confirm = await this.$confirm('您确定要删除该药品？', '提示', {
          type: 'warning',
        })
        if (confirm === 'confirm') {
          this.$emit('editUpdate', 'edit')
          this.tableData.splice(input, 1)
          if (this.scene === 'drugList') return
          if (this.scene === 'template') return
          await this.savePrescription()
          if (this.tableData.length === 4) {
            this.tableData.push(Object.assign({}, DrugItem, { seq: 4 }))
          }
          this.$emit('update', { type: 'updatePrice' })
        }
      } else {
        // 删除勾选[仅针对药品，不针对组]
        let ids = new Set()
        this.tableData.forEach(item => {
          if (item.checked) {
            ids.add(item.id)
          }
        })
        this.tableData = this.tableData.filter(item => !ids.has(item.id))
        console.log('删除操作----------')
        this.$emit('updateTemplate')
        try {
          if (this.scene !== 'template') {
            await this.savePrescription(false)
          } else {
            this.computedGroupClass()
          }
        } finally {
          input()
        }
      }
    },
    // 判断是否需要并方
    shouldMerge() {
      let receivePharmacys = new Set()
      this.tableData.forEach(item => {
        if (item.receivePharmacy) {
          receivePharmacys.add(item.receivePharmacy)
        }
      })
      return receivePharmacys.size > 1
    },
    // 保存药品 index
    async savaHandler(index) {
      console.log(this)
      if (this.validate(index)) return
      this.$emit('editUpdate', 'edit')
      if (this.shouldMerge()) {
        const confirm = await this.$confirm(
          '该药品接收方不一致，保存后将自动调方，是否确认？',
          { type: 'warning' },
          '提示',
        )
        if (confirm === 'confirm') this.adjustHandler(index)
        return
      }
      // 无需并方
      delete this.tableData[index].unsaved
      try {
        if (this.scene !== 'template') {
          await this.savePrescription()
        }
        const len = this.tableData.length
        this.$set(this.tableData[index], 'edit', false)
        this.$set(this.tableData[index], 'target', this.index)
        const { type, totalPrice } = this.tableData[index]
        if (this.scene === 'template') {
          if (!this.tableData[len - 1].unsaved) {
            this.tableData.push(Object.assign({}, DrugItem, { seq: len }))
          }
        } else if (len !== 5 && !this.tableData[len - 1].unsaved) {
          this.tableData.push(Object.assign({}, DrugItem, { seq: len }))
        }
        this.$emit('update', {
          type: 'updatePrice',
          data: {
            prescriptionPrice: totalPrice,
            westPrice: type === 'WESTERN_MEDICINE' ? totalPrice : 0,
            chPatentPrice: type === 'WESTERN_MEDICINE' ? 0 : totalPrice,
          },
        })
      } catch (e) {
        this.$set(this.tableData[index], 'unsaved', true)
      }
      // this.$emit('updateTemplate')
    },
    // 重置药品 index
    resetHandler(index) {
      const drug = Object.assign({}, DrugItem)
      this.tableData.splice(index, 1, drug)
    },
    // 药品成组
    async groupHandler(callback) {
      let groups = [] // 本次成组的药品
      let tableData = [] // 新的tableData
      let insertIndex = 0 // 插入成组药品的索引
      let _insertIndex = 0 // 默认插入药品索引
      let indexs = new Set() // 成组药品的索引
      let groupIds = new Set() // 成组药品的组id
      // 先获取选中的索引
      this.tableData.forEach((item, index) => {
        if (item.checked) {
          indexs.add(index)
          if (item.groupId) groupIds.add(item.groupId)
        }
      })
      if (!indexs.size) return callback()
      // 再将已成组的药品索引添加到 Indexs
      this.tableData.forEach((item, index) => {
        if (groupIds.has(item.groupId)) {
          if (this.operate === 'group') {
            indexs.add(index)
          }
        }
      })
      const groupId = this.operate === 'group' ? shortid.generate() : ''
      // 成组：将成组的药品提取成为单独数组再插入分组后面
      // 因为5个药品最多只有一个分组，所以取的是第一个分组后
      groups = this.tableData
        .filter((_, index) => indexs.has(index))
        .map(item => ({ ...item, groupId: groupId }))
      tableData = this.tableData.filter((_, index) => !indexs.has(index))
      if (tableData.length > 1) _insertIndex = tableData.length
      if (this.scene === 'template') {
        insertIndex = tableData.findIndex(item => !item.groupId)
      } else {
        insertIndex = tableData.findIndex(
          item => !item.unsaved && !item.groupId,
        )
      }
      insertIndex = insertIndex === -1 ? _insertIndex : insertIndex
      tableData.splice(insertIndex, 0, ...groups)
      this.tableData = cloneDeep(tableData)
      try {
        if (this.scene !== 'template') {
          await this.savePrescription(false)
        } else {
          this.computedGroupClass()
        }
      } finally {
        callback()
      }
      console.log('处理完成--------')
      this.$emit('updateTemplate')
    },
    // 药品调方
    async adjustHandler(index, target) {
      const origin = this
      if (target !== undefined) {
        let groupId = this.tableData[index].groupId
        let drugs = [cloneDeep(this.tableData[index])]
        if (this.tableData[index].groupId) {
          drugs = this.tableData.filter(item => item.groupId === groupId)
        }
        this.$emit('update', {
          type: 'applyAdjust',
          data: { drugs, auto: false, target, origin },
        })
      } else {
        const drugs = [cloneDeep(this.tableData[index])]
        this.$emit('update', {
          type: 'applyAdjust',
          data: { drugs, auto: true, origin },
        })
      }
    },
  },
  filters: {
    filter(val, type) {
      switch (type) {
        case 'money':
          return '¥' + val
        case 'target':
        case 'checkbox':
          return '-'
        case 'medicare':
          return Medicares[val] || '--'
        default:
          return val || '--'
      }
    },
  },
  watch: {
    prescription: {
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.watchHandler(newVal)
        }
      },
      deep: true,
      immediate: true,
    },
    operate(val) {
      if (val) {
        this.tableData = this.tableData.map(item => {
          if (item.unsaved) {
            item = Object.assign({}, DrugItem)
          }
          if (val === 'adjust') {
            item.target = this.index
          }
          return item
        })
      }
    },
    iscancel(val) {
      if (val) {
        const len = JSON.parse(JSON.stringify(this.oldTableData)).length
        this.tableData = JSON.parse(JSON.stringify(this.oldTableData))
        this.tableData.push(Object.assign({}, DrugItem, { seq: len }))
        console.log(this.tableData, '更新后的数据')
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import './index';
::v-deep .el-input__prefix {
  display: none;
}
::v-deep .el-date-editor.el-input {
  width: 150px;
}
</style>
