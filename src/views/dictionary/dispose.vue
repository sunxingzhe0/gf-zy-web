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
      <template v-slot:slotType="{ row }">
        {{ types[row.type] }}
      </template>
      <template v-slot:slotStatus="{ row }">
        <el-switch
          active-text="启用"
          class="textSwitch"
          :width="50"
          inactive-text="禁用"
          v-model="row.status"
          @change="toogleStatus(row)"
        ></el-switch>
      </template>
    </List>
  </div>
</template>
<script>
import * as business from '@/api/business'
import { List, mixin } from '@/components'
import { dispose } from '@/api/dictionary'

export default {
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: params => {
          const { searchType, searchKeywords } = params
          const _params = Object.assign({}, params)
          _params.deptName = _params.deptName || []
          _params.partName = _params.partName || []
          _params.deptIds = _params.deptName.join()
          _params.partNames = _params.partName.join()
          _params[searchType] = searchKeywords
          delete _params.searchKeywords
          delete _params.searchType
          delete _params.deptName
          delete _params.partName
          return dispose.webList(_params)
        },
      },
    ]),
  ],
  data() {
    return {
      types: {
        LAB: '检验',
        CURE: '治疗',
        EXAMINE: '检查',
      },
      query: {
        id: '', // 处置单id
        code: '', // 处置单code
        name: '', // 处置单名称
        type: '', // 类型 EXAMINE("检查"), LAB("检验"), CURE("治疗")
        partName: [], // 部位/标本名称
        deptName: [], // 执行科室名称
        pageSize: 10, // 每页数量
        currentNum: 1, // 当前页码
        sorted: 'DESC', // 排序方向
        // 提交前删除
        searchType: 'name', // 关键字类型
        searchKeywords: '', // 关键字类型
      },
      filter: {
        search: {
          props: {
            options: [
              { label: 'ID', value: 'id' },
              { label: 'code', value: 'code' },
              { label: '名称', value: 'name' },
            ],
            hideBtn: true,
          },
          keys: ['searchType', 'searchKeywords'],
        },
        inline: [
          {
            props: {
              label: '类型',
              noColon: true,
              is: 'el-select',
              options: [
                { label: '全部', value: '' },
                { label: '检验', value: 'LAB' },
                { label: '检查', value: 'EXAMINE' },
                { label: '治疗', value: 'CURE' },
              ],
            },
            keys: ['type'],
          },
          {
            props: {
              noColon: true,
              is: 'el-select',
              label: '标本/部位',
              options: [],
              remote: true,
              multiple: true,
              filterable: true,
              'reserve-keyword': true,
              'remote-method': this.remotePart,
            },
            keys: ['partName'],
          },
          {
            props: {
              noColon: true,
              is: 'el-select',
              label: '执行科室',
              options: [],
              remote: true,
              multiple: true,
              filterable: true,
              'reserve-keyword': true,
              'remote-method': this.remoteDept,
            },
            keys: ['deptName'],
          },
        ],
      },
      columns: {
        index: {
          hidden: true,
        },
        type: {
          prop: 'slotType',
        },
        status: {
          prop: 'slotStatus',
        },
      },
    }
  },
  mounted() {
    this.remotePart()
    this.remoteDept()
  },
  methods: {
    async remotePart(keyword) {
      const res = await business.choosePart({
        currentNum: 1,
        pageSize: 9999,
        partName: keyword,
      })
      const options = res.map(item => ({
        ...item,
        value: item.partName,
        label: item.partName,
      }))
      this.$set(this.filter.inline[1].props, 'options', options)
    },
    async remoteDept(keyword) {
      const res = await business.chooseDisDept({
        currentNum: 1,
        pageSize: 9999,
        deptName: keyword,
      })
      const options = res.map(item => ({
        ...item,
        value: item.deptId,
        label: item.deptName,
      }))
      this.$set(this.filter.inline[2].props, 'options', options)
    },
    async toogleStatus(row) {
      await dispose.updateStatus({
        id: row.id,
        status: row.status,
      })
      this.$message.success('操作成功！')
    },
  },
}
</script>
<style lang="scss" scoped>
.view__card ::v-deep {
  .c__filter.el-row .el-row {
    display: flex;
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
  .item-label.is-right + .el-input,
  .item-label.is-right + .el-select {
    .el-input__inner {
      border-left: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  .el-select__tags {
    & > span {
      max-width: calc(100% - 16px);
      display: flex;
    }
    .el-tag--info:first-child {
      flex: 1;
      overflow: hidden;
    }
    .el-select__tags-text {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }
  }
}
</style>
