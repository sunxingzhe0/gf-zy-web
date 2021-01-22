<template>
  <div>
    <div
      v-for="(item, index) in datas"
      :key="'data-' + index"
      class="parts-select-item"
    >
      <el-select v-model="item.partId" @change="changeHandler('part', index)">
        <el-option
          v-for="(_item, _index) in parts"
          :key="'part-' + _index"
          :label="_item.partName"
          :value="_item.partId"
        ></el-option>
      </el-select>
      <el-select
        v-model="item.sonPartIds"
        multiple
        @change="changeHandler('sonPart', index)"
      >
        <el-option
          v-for="(_item, _index) in sonParts[item.partId]"
          :key="'sonPart-' + _index"
          :label="_item.partName"
          :value="_item.partId"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
/*
@author         qiang
@name           PartsSelect
@desc           选择部位（子部位
@props
                dictDisposeId   项目id
@emit
                change
*/
import { cloneDeep } from 'lodash'
import * as business from '@/api/business'

const BasePart = { partId: '', sonPartIds: [] }
export default {
  name: 'PartsSelect',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    propsParts: {
      type: Array,
      default: () => [],
    },
    dictDisposeId: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      parts: [],
      sonParts: {},
      datas: [cloneDeep(BasePart)],
    }
  },
  // 只有一个处置单，所以在created里面执行初始化
  created() {
    const datas = []
    const sonParts = {}
    this.parts = this.propsParts.map(item => {
      const children = item.next || []
      sonParts[item.partId] = children
      datas.push({
        partId: item.partId,
        sonPartIds: children.map(it => it.partId),
      })
      return { partId: item.partId, partName: item.partName }
    })
    if (!this.disabled) datas.push(cloneDeep(BasePart))
    this.sonParts = sonParts
    this.datas = datas
  },
  methods: {
    // 由于组件为检查部位的选择，所以该接口只处理检查部位与子部位
    async loadProjectPart() {
      if (!this.dictDisposeId) return false
      const res = await business.choosePart({
        id: this.dictDisposeId,
        type: 'EXAMINE',
        currentNum: 1,
        pageSize: 99,
      })
      const sonParts = {}
      res.forEach(item => {
        sonParts[item.partId] = item.next || []
      })
      this.datas = [cloneDeep(BasePart)]
      this.sonParts = sonParts
      this.parts = res
      this.emit()
    },
    // changeHandler
    changeHandler(type, index) {
      // 如果没有下一项则添加下一项
      if (!this.datas[index + 1]) {
        this.datas.push(cloneDeep(BasePart))
      }
      // 如果改变的是部位，则重置字部位
      if (type === 'part') {
        this.$set(this.datas[index], 'sonPartIds', [])
      }
      this.emit()
    },
    emit() {
      let partIds = []
      let sonPartIds = []
      this.datas.forEach(item => {
        partIds.push(item.partId)
        sonPartIds = sonPartIds.concat(item.sonPartIds)
      })
      partIds = partIds.filter(item => item)
      this.$emit('change', { partIds, sonPartIds })
    },
  },
  watch: {
    dictDisposeId() {
      this.loadProjectPart()
    },
  },
}
</script>
<style lang="scss" scoped>
.parts-select-item {
  display: flex;
  padding: 10px 0;
  position: relative;
  border-bottom: 1px solid #e6ebf5;
  &::before {
    top: 0;
    left: 50%;
    width: 1px;
    content: '';
    height: 100%;
    position: absolute;
    background: #e6ebf5;
  }
  &:last-child {
    border-bottom: none;
  }
  &::v-deep {
    .el-select {
      padding: 3px;
    }
  }
}
</style>
