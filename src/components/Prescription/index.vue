<template>
  <div class="prescription-view" :class="{ 'in-clinic': inClinic }">
    <div class="prescription-header">
      <div class="prescription-operate">
        <el-button size="mini" type="primary" @click="addPrescription()">
          新增处方
        </el-button>
        <el-button size="mini" @click="commonDrugsShow = true">
          常用药品
        </el-button>
        <el-button size="mini" @click="historyPrescriptionShow = true">
          历史处方
        </el-button>
        <el-button size="mini" @click="prescriptionTempShow = true">
          处方模板
        </el-button>
      </div>
      <div class="prescription-prices">
        <span
          v-for="(item, index) in prices"
          :class="{ total: index === prices.length - 1 }"
          :key="index"
        >
          {{ item.label }}：¥{{ item.value }}
        </span>
      </div>
    </div>
    <div class="prescription-body" v-loading="loading">
      <div class="prescription-nav">
        <template v-for="(item, index) in prescriptions">
          <template v-if="operate === 'temp' || !operate">
            <div
              :class="{ active: activeNavIndex === index }"
              class="prescription-nav-item"
              @click="scrollTo(item.id)"
              :key="'nav-' + index"
            >
              <span>RP{{ index + 1 }}</span>
            </div>
          </template>
          <template v-else>
            <div
              :class="{ active: activeNavIndex === index }"
              v-if="item.status === 'DRAFT'"
              class="prescription-nav-item"
              @click="scrollTo(item.id)"
              :key="'nav-' + index"
            >
              <span>RP{{ index + 1 }}</span>
            </div>
          </template>
        </template>
        <div
          class="indicator"
          :style="{ top: 36 * activeNavIndex + 'px' }"
        ></div>
      </div>
      <div
        ref="prescription-content"
        class="prescription-content"
        :class="{ 'on-scroll': onScroll }"
      >
        <SaveAsTemp v-if="operate === 'temp'" v-model="tempParams"></SaveAsTemp>
        <template v-for="(item, index) in prescriptions">
          <template v-if="operate === 'temp' || !operate">
            <PrescriptionItem
              :key="'prescription-' + index"
              ref="prescription-item"
              @update="updateHandler"
              :prescription="item"
              :operate="operate"
              :targets="targets"
              :index="index"
            ></PrescriptionItem>
          </template>
          <template v-else>
            <PrescriptionItem
              v-if="item.status === 'DRAFT'"
              :key="'prescription-' + index"
              ref="prescription-item"
              @update="updateHandler"
              :prescription="item"
              :operate="operate"
              :targets="targets"
              :index="index"
            ></PrescriptionItem>
          </template>
        </template>
      </div>
    </div>
    <div class="prescription-footer">
      <template v-if="operate">
        <el-button @click="cancel"> 取消 </el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </template>
      <template v-else>
        <el-button
          v-for="(item, index) in operates"
          @click="clickHandler(item.type)"
          :disabled="item.disabled"
          :key="'operate-' + index"
        >
          {{ item.text }}
        </el-button>
      </template>
    </div>
    <DrugsList
      v-if="drugsList.length"
      :drugs="drugsList"
      @close="importDrugs"
    ></DrugsList>
    <CommonDrugs @confirmDrugs="showDrugsList" :visible.sync="commonDrugsShow">
    </CommonDrugs>
    <PrescriptionTemp
      @confirmDrugs="showDrugsList"
      :visible.sync="prescriptionTempShow"
    >
    </PrescriptionTemp>
    <HistoryPrescription
      @confirmDrugs="showDrugsList"
      :visible.sync="historyPrescriptionShow"
    >
    </HistoryPrescription>
  </div>
</template>
<script>
/*
@author         qiang
@name           Prescription
@desc           完整处方组件
@props
                orderId       订单id
                inClinic      是否处于诊室
                createParams  创建处方参数
@emit
*/
import { mapState } from 'vuex'
import { cloneDeep } from 'lodash'

import DrugsList from './DrugsList'
import CommonDrugs from './CommonDrugs'
import { saveRpTemplate } from '@/api/template'
import PrescriptionItem from './PrescriptionItem'
import PrescriptionTemp from './PrescriptionTemp'
import { DrugItem, ValidateKeys } from './constant'
import SaveAsTemp, { TempParams } from './SaveAsTemp'
import HistoryPrescription from './HistoryPrescription'
import { rpList, saveRp, submitRp } from '@/api/prescription'

export default {
  components: {
    DrugsList,
    SaveAsTemp,
    CommonDrugs,
    PrescriptionItem,
    PrescriptionTemp,
    HistoryPrescription,
  },
  props: {
    inClinic: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: String,
      default: '',
    },
    createParams: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      prices: [], // 所有价格
      targets: [], // 调方选项
      operate: '', // 当前操作
      drugsList: [], // 药品清单
      loading: false, // 是否加载中
      onScroll: false, // body是否滚动
      adjustDatas: [], // 将要调方的数据
      prescriptions: [], // 处方列表
      activeNavIndex: 0, // 当前处方
      commonDrugsShow: false, // 常用药品
      prescriptionTempShow: false, // 处方模板
      tempParams: { ...TempParams }, // 设为模板参数
      historyPrescriptionShow: false, // 历史处方
      operates: [
        { text: '设为模板', type: 'temp', disabled: false },
        { text: '调方', type: 'adjust', disabled: false },
        { text: '成组', type: 'group', disabled: false },
        { text: '取消成组', type: 'unGroup', disabled: false },
        { text: '删除', type: 'del', disabled: false },
        { text: '保存', type: 'save', disabled: false },
        { text: '提交', type: 'submit', disabled: false },
      ],
    }
  },
  computed: {
    ...mapState('user', ['dept']),
  },
  methods: {
    //总量单位处理
    computedTotalUnit(item) {
      const options = [
        {
          value: item.regularUnit,
          label: item.regularUnitText,
        },
      ]
      if (item.split) {
        options.unshift({
          value: item.basicUnit,
          label: item.basicUnitText,
        })
      }
      return options
    },
    scrollTo(id) {
      let index = this.prescriptions.findIndex(item => {
        if (this.operate === 'temp' || !this.operate) {
          return item.id === id
        } else {
          return item.status === 'DRAFT' && item.id === id
        }
      })
      this.activeNavIndex = index
      const scroll = this.$refs['prescription-item'][index].$el.offsetTop
      this.$refs['prescription-content'].scrollTo({
        top: scroll,
        behavior: 'smooth',
      })
    },
    // 是否渲染处方
    shouldRender(status) {
      if (this.operate) {
        return status === 'DRAFT'
      } else {
        return true
      }
    },
    // updateOperates
    updateOperates() {
      // 顺便更新下滚动样式
      const { scrollHeight, offsetHeight } = this.$refs['prescription-content']
      // const refs = this.$refs['prescription-item'] || []
      // 如果没有草稿处方，除设为模板外所有按钮禁用
      const draft = this.prescriptions.find(item => item.status === 'DRAFT')
      if (draft) {
        this.operates = this.operates.map(item => ({
          ...item,
          disabled: false,
        }))
      } else {
        this.operates = this.operates.map((item, index) => ({
          ...item,
          disabled: index !== 0,
        }))
      }
      this.onScroll = scrollHeight >= offsetHeight
    },
    // computedPrice
    computedPrice() {
      let prices = []
      let totalPrice = 0
      const pricesMap = new Map()
      const draft = ['del', 'group', 'unGroup', 'adjust', 'submit']
      const refItems = this.$refs['prescription-item']
      for (let i = 0; i < refItems.length; i++) {
        const item = refItems[i]
        if (
          draft.includes(this.operate) &&
          item.prescription.status !== 'DRAFT'
        ) {
          continue
        }
        item.prices.forEach(_item => {
          if (_item.label === '合计') {
            totalPrice = totalPrice + Number(_item.value)
          } else {
            if (pricesMap.has(_item.label)) {
              const price = pricesMap.get(_item.label)
              pricesMap.set(_item.label, price + Number(_item.value))
            } else {
              pricesMap.set(_item.label, Number(_item.value))
            }
          }
        })
      }
      pricesMap.forEach((value, label) => prices.push({ label, value }))
      prices = prices.sort((a, b) => a.label.localeCompare(b.label, 'zh'))
      prices.push({ label: '合计', value: totalPrice })
      this.prices = prices.map(item => ({
        ...item,
        value: item.value.toFixed(2),
      }))
    },
    // 获取处方信息
    async getPrescriptions(loading = false) {
      this.loading = true
      try {
        const res = await rpList({ orderId: this.orderId })
        this.prescriptions = res || []
        setTimeout(() => {
          this.updateOperates()
          this.computedPrice()
        })
        if (!loading) {
          this.loading = false
        }
      } catch (e) {
        this.loading = false
      }
    },
    // 点击新增处方,判断一下是否有空白处方
    addPrescription() {
      const refItems = this.$refs['prescription-item'] || []
      const index = refItems.findIndex(item => {
        const tableData = item.tableData.filter(_item => !_item.unsaved)
        return !tableData.length
      })
      if (index !== -1) return this.$message.warning('已经有一个空白处方了！')
      this.newPrescription()
    },
    // 新增处方
    async newPrescription(num = 1) {
      for (let i = 0; i < num; i++) {
        await saveRp(this.createParams)
      }
      await this.getPrescriptions()
    },
    // 显示药品清单
    showDrugsList(drugs) {
      this.drugsList = drugs
      this.commonDrugsShow = false
      this.prescriptionTempShow = false
      this.historyPrescriptionShow = false
    },
    // 导入处方：先分方=>再导入
    async importDrugs(drugs) {
      this.drugsList = []
      if (!drugs.length) return
      try {
        let groups = {}
        let refItems = []
        this.loading = true
        let prescriptions = []
        let pharmacyDrugs = {}
        let groupIds = new Set()
        drugs.forEach(item => {
          item.edit = false
          item.unsaved = false
          if (item.groupId) {
            groupIds.add(item.groupId)
            if (groups[item.groupId]) {
              groups[item.groupId].push(item)
            } else {
              groups[item.groupId] = [item]
            }
          }
        })
        // 先将药品转换为二维数组【因为药品列表可能存在分组药品】
        drugs = drugs
          .filter(item => !groupIds.has(item.groupId))
          .map(item => {
            return [item]
          })
        Object.keys(groups).forEach(key => drugs.unshift(groups[key]))
        // 将药品拆分到单个处方单: a、将药品以药房分组 b、在将分组后的药品以5个为单位进行拆分
        drugs.forEach(item => {
          const receivePharmacyId = item[0].receivePharmacyId
          if (pharmacyDrugs[receivePharmacyId]) {
            pharmacyDrugs[receivePharmacyId].push(item)
          } else {
            pharmacyDrugs[receivePharmacyId] = [item]
          }
        })
        for (let p in pharmacyDrugs) {
          const _prescriptions = [[]]
          pharmacyDrugs[p].forEach(item => {
            let index = _prescriptions.findIndex(_item => {
              return _item.length + item.length <= 5
            })
            if (index === -1) {
              _prescriptions.push([])
              index = _prescriptions.length - 1
            }
            _prescriptions[index] = _prescriptions[index].concat(item)
          })
          prescriptions = prescriptions.concat(_prescriptions)
        }
        // 先删除之前的空白处方
        refItems = this.$refs['prescription-item']
        for (let i = 0; i < refItems.length; i++) {
          const tableData = refItems[i].tableData.filter(it => !it.unsaved)
          if (!tableData.length) {
            await refItems[i].delPrescription(() => {})
          }
        }
        // 创建处方单
        await this.newPrescription(prescriptions.length)
        refItems = this.$refs['prescription-item']
        for (let i = 0; i < refItems.length; i++) {
          const tableData = refItems[i].tableData.filter(it => !it.unsaved)
          if (!tableData.length) {
            if (prescriptions.length) {
              refItems[i].tableData = prescriptions.shift()
              await refItems[i].savePrescription(false, function () {})
            }
          }
        }
        this.loading = false
        this.$message.success('导入成功！')
      } catch (e) {
        console.log(e)
        this.loading = false
      }
    },
    // 单处方组件内部事件
    async updateHandler(event) {
      switch (event.type) {
        // 复制处方时先判断是否有空白处方单
        case 'copy': {
          this.loading = true
          const { rpDrugList } = this.prescriptions[event.index]
          const drugs = rpDrugList.map(item => {
            item.totalUnits = this.computedTotalUnit(item)
            //复制出来默认非编辑状态
            item.edit = false
            return Object.assign({}, DrugItem, item)
          })
          //添加空白药品
          const len = drugs.length
          if (len < 5) {
            drugs.push(Object.assign({}, DrugItem))
          }

          //
          let index = this.$refs['prescription-item'].findIndex(item => {
            const tableData = item.tableData.filter(_item => !_item.unsaved)
            return !tableData.length
          })
          if (index === -1) {
            await this.newPrescription()
            index = 0
          }
          setTimeout(() => {
            this.$refs['prescription-item'][index].tableData = drugs
            this.loading = false
            this.clickHandler('save')
          })

          break
        }
        case 'delete':
          this.getPrescriptions()
          break
        case 'withdraw':
          this.$set(this.prescriptions[event.index], 'status', 'DRAFT')
          break
        case 'applyAdjust':
          this.applyAdjust(event.data)
          break
        case 'updatePrice': {
          this.computedPrice()
          break
        }
      }
      this.updateOperates()
    },
    // clickHandler
    async clickHandler(type) {
      if (type === 'save') {
        this.savaHandler()
      } else {
        try {
          // 判断是否有未保存的药品 // 判断是否有未填写的项目
          let confirm = ''
          let refItem = this.$refs['prescription-item']
          let refItems = Array.isArray(refItem) ? refItem : [refItem]
          for (let i = 0; i < refItems.length; i++) {
            if (refItems[i].validate(undefined, true)) {
              confirm = await this.$confirm(
                '当前还有未保存的药品信息即将丢失，是否继续操作？',
                '提示',
                {
                  type: 'warning',
                },
              )
              break
            }
          }
          if (!confirm || confirm === 'confirm') {
            this.operate = type
            if (type === 'adjust') {
              const targets = []
              this.prescriptions.forEach((item, index) => {
                if (item.status === 'DRAFT') {
                  const tableData = refItems[index].tableData.filter(
                    item => !item.unsaved,
                  )
                  targets.push({
                    value: index,
                    label: 'RP' + (index + 1),
                    cap: 5 - tableData.length,
                    receivePharmacyId: tableData[0]?.receivePharmacyId,
                  })
                }
              })
              this.targets = targets
              this.adjustDatas = []
            }
          }
        } catch (e) {
          console.log(e)
          // nothing
        }
      }
      this.computedPrice()
    },
    /*
      @name     findAdjustIndex
      @desc     找到满足调方对处方所在索引
      @rules    草稿处方并且有多余容量且是同一药房或者该处方没有一个药品
      @params
                Array<refPrescription>
                Array<Drug>
      @return   number
    */
    findAdjustIndex(refItems, drugs) {
      const index = refItems.findIndex(item => {
        // 处方没有一个药品
        if (
          item.tableData.length === 1 &&
          ValidateKeys.every(key => !item.tableData[0][key])
        )
          return true
        if (item.prescription.status !== 'DRAFT') return false
        const thisReceivePharmacyId = drugs[0].receivePharmacyId
        if (5 - item.tableData.length < drugs.length) return false
        const targetReceivePharmacyId = item.tableData[0].receivePharmacyId
        if (thisReceivePharmacyId !== targetReceivePharmacyId) return false
        return true
      })
      return index
    },
    /*
      @name     insertDrugs
      @desc     插入药品到处方
      @reules   插入的是成组药品：成组药品的后面
                插入的是单个药品：保存药品的最后一个
      @params
                Ref<refPrescription>
                Array<Drug>
      @return
    */
    insertDrugs(refItem, drugs) {
      drugs.forEach(item => delete item.unsaved)
      let insertIndex = refItem.tableData.findIndex(item => item.unsaved)
      if (drugs[0].groupId) {
        // 放到成组后面
        insertIndex = refItem.tableData.findIndex(item => !item.groupId)
        insertIndex = insertIndex === -1 ? 0 : insertIndex
        refItem.tableData.splice(insertIndex, 0, ...drugs)
      } else {
        if (insertIndex === -1) {
          refItem.tableData = refItem.tableData.concat(drugs)
        } else {
          refItem.tableData.splice(insertIndex, 0, ...drugs)
        }
      }
    },
    /*
      @name     deletePrescriptionDrugs
      @desc     删除处方列表的药品
      params    Set<id>
    */
    async deletePrescriptionDrugs(drugIds) {
      return new Promise(resolve => {
        setTimeout(() => {
          // 此处确认有多个 refItem
          const refItems = this.$refs['prescription-item']
          refItems.forEach(item => {
            item.tableData = item.tableData.filter(_item => {
              return !drugIds.has(_item.id) && !_item.unsaved
            })
          })
          resolve()
        })
      })
    },
    /*
      @name     adjustDrugs
      @desc     对调方的药品进行移动
      @params   Array<Drug>
      @return   Promise<void>
    */
    async adjustDrugs(drugs) {
      return new Promise(resolve => {
        setTimeout(() => {
          // 这里确认有多个处方，所以不在进行数组转换
          const refItems = this.$refs['prescription-item']
          const index = this.findAdjustIndex(refItems, drugs)
          console.log(refItems, drugs, index)
          if (index === -1)
            throw new Error('药品自动调方出错，请联系冠方智慧医疗技术支持。')
          this.insertDrugs(refItems[index], drugs)
          resolve()
        })
      })
    },
    // 申请处方调方 自动/药品s/目标/原处方
    async applyAdjust({ auto, drugs, target, origin }) {
      if (auto) {
        let index = -1
        this.loading = true
        let refItem = this.$refs['prescription-item']
        let refItems = Array.isArray(refItem) ? refItem : [refItem]
        // 找到符合条件的第一个药房
        for (let i = 0; i < refItems.length; i++) {
          const tableData = refItems[i].tableData
          const receivePharmacyId = drugs[0].receivePharmacyId
          if (refItems[i].prescription.status !== 'DRAFT') continue
          const matched = receivePharmacyId === tableData[0].receivePharmacyId
          if (
            tableData[0].unsaved ||
            (matched && (tableData.length < 5 || tableData[4].unsaved))
          ) {
            index = i
            break
          }
        }
        // 如果没有同药房的处方则自动新增
        const target = index === -1 ? 0 : index
        if (index === -1) await this.newPrescription()
        setTimeout(() => {
          const _origin = index === -1 ? refItems[1] : origin
          this.adjustDatas.push({ drugs, target, origin: _origin })
          this.adjustHandler()
        })
      } else {
        const targets = cloneDeep(this.targets)
        this.adjustDatas.push({ drugs, target, origin })
        // targetIndex
        const targetIndex = targets.findIndex(item => item.value === target)
        // originIndex
        const originIndex = targets.findIndex(
          item => item.value === origin.index,
        )
        targets[targetIndex].cap = targets[targetIndex].cap - drugs.length
        targets[originIndex].cap = targets[originIndex].cap + drugs.length
        this.targets = targets
      }
    },
    // 处方调方：调方完成后删除空白处方
    async adjustHandler() {
      let count = 0
      let _self = this
      const callback = async function () {
        count++
        if (count === refItems.length) {
          _self.adjustDatas = []
          await _self.getPrescriptions(true)
          setTimeout(() => _self.cancel())
          // 删除空白处方
          for (let i = 0; i < refItems.length; i++) {
            if (!refItems[i].prescription.rpDrugList.length) {
              await refItems[i].delPrescription(function () {})
            }
          }
          await _self.getPrescriptions(true)
          _self.$message.success('操作成功！')
          _self.loading = false
        }
      }
      _self.loading = true
      // 这里确认有多个处方，所以不在进行数组转换
      const refItems = this.$refs['prescription-item']
      this.adjustDatas.map(item => {
        this.insertDrugs(refItems[item.target], item.drugs)
        const drugsIds = item.drugs.map(item => item.id)
        item.origin.tableData = item.origin.tableData.filter(
          item => !drugsIds.includes(item.id),
        )
      })
      refItems.forEach(item => item.savePrescription(false, callback))
    },
    // 处方成组/取消成组：遍历处方=>调用处方项的成组/取消成组方法=>回调检查是否完成
    groupHandler() {
      let count = 0
      let _self = this
      let msg = (
        <div>
          选中的药品将按照
          <el-tooltip
            effect="dark"
            placement="top"
            content="同处方单选中的多个药品（≥2）可成组，不符合条件的默认操作无效"
          >
            <span class="el-button el-tooltip el-button--text el-button--medium">
              成组规则
            </span>
          </el-tooltip>
          进行成组，是否确认操作？
        </div>
      )
      const refItem = this.$refs['prescription-item']
      const refItems = Array.isArray(refItem) ? refItem : [refItem]
      const callback = async function () {
        count++
        if (count === refItems.length) {
          await _self.getPrescriptions(true)
          setTimeout(() => {
            _self.cancel()
            _self.loading = false
            _self.$message.success('操作成功！')
          })
        }
      }
      if (this.operate !== 'group') {
        msg = '同一处方单勾选的药品将取消成组，是否确认操作？'
      }
      this.$confirm(msg, '提示', {
        type: 'warning',
        callback(action) {
          if (action === 'confirm') {
            _self.loading = true
            refItems.forEach(item => item.groupHandler(callback))
          }
        },
      })
    },
    // 删除选择的药品
    delHandler() {
      let count = 0
      let _self = this
      const refItem = this.$refs['prescription-item']
      const refItems = Array.isArray(refItem) ? refItem : [refItem]
      const callback = async function () {
        count++
        if (count === refItems.length) {
          await _self.getPrescriptions()
          setTimeout(() => {
            _self.cancel()
            _self.loading = false
            _self.$message.success('操作成功！')
          })
        }
      }
      this.$confirm('勾选的药品将被删除，是否确认操作？', '提示', {
        type: 'warning',
        callback(action) {
          if (action === 'confirm') {
            _self.loading = true
            refItems.forEach(item => item.delHandler(callback))
          }
        },
      })
    },
    // 重置子处方药品选择状态
    resetSelect() {
      const refItem = this.$refs['prescription-item']
      const refItems = Array.isArray(refItem) ? refItem : [refItem]
      refItems.forEach(item => {
        item.checkedAll(false)
      })
    },
    // 设为模板
    async saveAsTemp() {
      if (!this.tempParams.name) {
        return this.$message.warning('模板名称不能为空！')
      }
      // if (!this.tempParams.icdId) {
      //   return this.$message.warning('病种不能为空！')
      // }
      const drugs = []
      const refItem = this.$refs['prescription-item']
      const refItems = Array.isArray(refItem) ? refItem : [refItem]
      refItems.forEach(item =>
        item.tableData.forEach(_item => {
          if (_item.checked) drugs.push(_item)
        }),
      )
      if (!drugs.length) return this.$message.warning('您还没选择药品！')
      await saveRpTemplate({
        ...this.tempParams,
        rpDrugList: drugs,
      })
      this.tempParams = { ...TempParams }
      this.$message.success('操作成功！')
      this.cancel()
    },
    // 保存所有草稿药品:先依次检查草稿处方是否都本地验证通过
    async savaHandler() {
      let count = 0
      let _self = this
      const callback = async function () {
        count++
        if (count === refItems.length) {
          await _self.getPrescriptions(true)
          setTimeout(() => {
            _self.cancel()
            _self.loading = false
            _self.$message.success('操作成功！')
          })
        }
      }
      const refItem = this.$refs['prescription-item']
      const refItems = Array.isArray(refItem) ? refItem : [refItem]
      // 判断是否有未填写的项目
      for (let i = 0; i < refItems.length; i++) {
        if (refItems[i].validate()) {
          return this.$message.error('处方未填写完整，请检查处方信息！')
        }
      }
      // 判断是否存在调方
      const merge = refItems.some(item => item.shouldMerge())
      try {
        if (merge) {
          const confirm = await this.$confirm(
            '处方药品接收方不一致，保存后将自动调方，是否确认？',
            { type: 'warning' },
            '提示',
          )
          if (confirm !== 'confirm') return
          let drugs = []
          const groups = {}
          const groupIds = new Set()
          this.loading = true
          /* 保存调方规则：将与第一个药品不同药房的药品（组）抽出，放到符合条件的处方内 */
          refItems.forEach(item => {
            if (item.shouldMerge()) {
              const base = item.tableData[0].receivePharmacyId
              const tableData = item.tableData.filter(
                it => it.receivePharmacyId === base,
              )
              const shouldMerge = item.tableData.filter(
                it => it.receivePharmacyId !== base,
              )
              drugs = drugs.concat(shouldMerge)
              item.tableData = tableData
            }
          })
          drugs = drugs.filter(item => !ValidateKeys.every(key => !item[key]))
          drugs.forEach(item => {
            if (item.groupId) groupIds.add(item.groupId)
            if (groupIds.has(item.groupId)) {
              if (groups[item.groupId]) {
                groups[item.groupId].push(item)
              } else {
                groups[item.groupId] = [item]
              }
            }
          })
          drugs = drugs
            .filter(item => !groupIds.has(item.groupId))
            .map(item => {
              return [item]
            })
          Object.keys(groups).forEach(key => drugs.unshift(groups[key]))
          for (let i = 0; i < drugs.length; i++) {
            const index = this.findAdjustIndex(refItems, drugs[i])
            if (index === -1) await this.newPrescription()
            await this.adjustDrugs(drugs[i])
          }
        }
        this.$refs['prescription-item'].forEach(item => {
          item.tableData.forEach(_item => {
            if (ValidateKeys.every(key => _item[key])) {
              _item.unsaved = false
            }
          })
          item.savePrescription(false, callback)
        })
      } catch (e) {
        this.loading = false
      }
    },
    /*
      提交所选药品：将所有药品取出到一个合集按照自动并方原则进行并方
      并方规则：
        5个同一药房的药品为一个处方单，成组药品不能分开。
        如果提交的药品包含一个处方单，即一个处方药品全部选中，则优先将并方后的药品放入该处方单
        如果并方时没有多余处方单，则自动新建一个处方单，如果并方后有空白处方单，则删除该空白处方单
    */
    async submitHandler() {
      try {
        let refItem = this.$refs['prescription-item']
        let refItems = Array.isArray(refItem) ? refItem : [refItem]
        // 1、  取出所有勾选药品
        let drugs = [] // 所有药品
        let delIds = [] // 删除处方的id
        let subIds = [] // 提交处方的id
        let groups = {} // 成组药品对象
        let pharmacyDrugs = {} // 按药房分组的药品
        let prescriptions = [] // 符合提交规则的处方药品
        let groupIds = new Set() // 成组药品的groupId集合
        let prescriptionIds = new Set() // 可使用的处方id集合
        refItems.forEach(item => {
          item.tableData.forEach(_item => {
            if (_item.checked) {
              drugs.push(_item)
              if (_item.groupId) groupIds.add(_item.groupId)
              if (groupIds.has(_item.groupId)) {
                if (groups[_item.groupId]) {
                  groups[_item.groupId].push(_item)
                } else {
                  groups[_item.groupId] = [_item]
                }
              }
            }
          })
        })
        if (!drugs.length) {
          return this.$message.error('请先选择提交的处方或药品！')
        }
        const confirm = await this.$confirm(
          '勾选的药品将按照分方规则提交审核，是否确认操作？',
          '提示',
          {
            type: 'warning',
          },
        )
        if (confirm !== 'confirm') return
        refItems.forEach(item => {
          item.tableData = item.tableData.filter(_item => {
            if (_item.groupId) {
              return !groupIds.has(_item.groupId)
            } else {
              return !_item.checked && !_item.unsaved
            }
          })
        })
        this.loading = true
        // 2、 将所有药品转为二维数组（因为有成组药品）
        drugs = drugs
          .filter(item => !groupIds.has(item.groupId))
          .map(item => {
            return [item]
          })
        Object.keys(groups).forEach(key => drugs.unshift(groups[key]))
        /*
        3、 将药品拆分到单个处方单:
          a、将药品以药房分组
          b、在将分组后的药品以5个为单位进行拆分
      */
        drugs.forEach(item => {
          const receivePharmacyId = item[0].receivePharmacyId
          if (pharmacyDrugs[receivePharmacyId]) {
            pharmacyDrugs[receivePharmacyId].push(item)
          } else {
            pharmacyDrugs[receivePharmacyId] = [item]
          }
        })
        for (let p in pharmacyDrugs) {
          const _prescriptions = [[]]
          pharmacyDrugs[p].forEach(item => {
            let index = _prescriptions.findIndex(_item => {
              return _item.length + item.length <= 5
            })
            if (index === -1) {
              _prescriptions.push([])
              index = _prescriptions.length - 1
            }
            _prescriptions[index] = _prescriptions[index].concat(item)
          })
          prescriptions = prescriptions.concat(_prescriptions)
        }
        // 3、检查有几个处方单可提交
        refItems.forEach(item => {
          if (!item.tableData.length) {
            prescriptionIds.add(item.prescription.id)
          }
        })
        let short = prescriptions.length - prescriptionIds.size
        if (short > 0) {
          const drugIds = new Set()
          await this.newPrescription(short)
          // 3.1、因为新增处方后会重新拉去所有处方列表，所以删除处方中需要提交的药品
          drugs.forEach(item => item.forEach(_item => drugIds.add(_item.id)))
          await this.deletePrescriptionDrugs(drugIds)
        }
        // 4、依此将需要提交的药品插入到可提交处方单中，并且删除多余的空白处方单
        refItems = this.$refs['prescription-item']
        refItems.forEach(item => {
          if (!item.tableData.length) {
            if (prescriptions.length) {
              item.tableData = prescriptions.shift()
              subIds.push(item.prescription.id)
            } else {
              delIds.push(item.prescription.id)
            }
          }
        })
        // 此处异步，需修改
        // 5、提交时分三类：提交、删除、保存，但是提交接口的问题，所有分为保存和删除
        for (let i = 0; i < refItems.length; i++) {
          const item = refItems[i]
          if (delIds.includes(item.prescription.id)) {
            await item.delPrescription(function () {})
          } else {
            await item.savePrescription(false, function () {})
          }
        }
        await this.getPrescriptions(true)
        // 6、提交
        await this.submitToServe(subIds)
        await this.getPrescriptions(true)
        setTimeout(() => {
          this.cancel()
          this.loading = false
        })
      } catch (e) {
        await this.getPrescriptions(true)
        this.loading = false
        console.log(e)
      }
    },
    /* 由于提交的时候有个异步操作
       提交要等待调方完成后，所以要返回一个Promise
       @parasm  subIds  Array<string> 提交处方的id
    */
    submitToServe(subIds) {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const submit = []
            this.$refs['prescription-item'].forEach(item => {
              if (subIds.includes(item.prescription.id)) {
                submit.push({ id: item.prescription.id })
              }
            })
            await submitRp({ submit })
            this.$message.success('提交成功！')
            resolve()
          } catch (e) {
            reject(e)
          }
        })
      })
    },
    // 取消设为模板、调方、成组、取消成组、删除、提交
    cancel() {
      if (this.operate !== 'adjust') {
        this.resetSelect()
      }
      this.operate = ''
      this.computedPrice()
    },
    // 确认设为模板、调方、成组、取消成组、删除、提交
    confirm() {
      if (this.operate !== 'adjust' && this.operate !== 'temp') {
        let checked = 0
        const refItem = this.$refs['prescription-item']
        const refItems = Array.isArray(refItem) ? refItem : [refItem]
        for (let i = 0; i < refItems.length; i++) {
          refItems[i].tableData.forEach(_item => {
            if (_item.checked) checked++
          })
          if (checked) break
        }
        if (!checked) return this.$message.warning('请先选择药品！')
      }
      switch (this.operate) {
        case 'del':
          this.delHandler()
          break
        case 'temp':
          this.saveAsTemp()
          break
        case 'group':
        case 'unGroup':
          this.groupHandler()
          break
        case 'adjust':
          this.adjustHandler()
          break
        case 'submit':
          this.submitHandler()
          break
      }
    },
  },
  watch: {
    orderId: {
      async handler() {
        const copyId = this.$route.query.copyId
        if (this.orderId) {
          this.loading = true
          await this.getPrescriptions(true)
          if (copyId) {
            setTimeout(() => {
              const index = this.prescriptions.findIndex(
                item => item.id === copyId,
              )
              if (index === -1) return
              this.updateHandler({
                type: 'copy',
                index: index,
              })
              this.loading = false
            })
          } else {
            if (!this.prescriptions.length) {
              await this.addPrescription()
            }
            this.loading = false
          }
        }
      },
      immediate: true,
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';
.prescription-view {
  position: relative;
  margin-top: 10px;
}
.in-clinic {
  height: 100%;
  display: flex;
  flex-direction: column;
  .prescription-header {
    margin-top: 10px;
    padding-left: 50px;
    padding-right: 10px;
  }
  .prescription-body {
    flex: 1;
    display: flex;
    overflow: hidden;
    .prescription-nav {
      width: 50px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .prescription-content {
      flex: 1;
      overflow: auto;
      margin-right: 5px;
    }
    .on-scroll {
      margin-right: 0;
    }
  }
}
.prescription-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .prescription-prices {
    display: flex;
    span {
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #666666;
      margin-left: 30px;
    }
    .total {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #0ab2c1;
    }
  }
}
.prescription-body {
  display: flex;
  margin: 10px 0;
  .prescription-nav {
    width: 50px;
    position: relative;
    // border-right: 2px solid #ccc;
    box-shadow: inset -2px 0px 0px 0px #ccc;
    .indicator {
      position: absolute;
      width: 2px;
      height: 36px;
      background: $--color-primary;
      top: 0;
      right: 0px;
      transition: all ease 0.3s;
    }
  }
  .prescription-nav-item {
    text-align: right;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
    line-height: 36px;
    padding-right: 14px;
    cursor: pointer;
    &.active {
      color: $--color-primary;
    }
  }
  .prescription-content {
    flex: 1;
    overflow: auto;
    padding-left: 20px;
  }
  & ::v-deep {
    .prescription-item {
      min-width: 1200px;
      padding-right: 5px;
    }
  }
}
.prescription-footer {
  display: flex;
  justify-content: center;
  padding-left: 148px;
}
</style>
