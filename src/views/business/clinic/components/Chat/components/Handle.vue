<template>
  <div class="Handle">
    <section class="wrap">
      <header class="flex-between">
        <span>检验单/检查单</span>
        <el-button
          plain
          size="mini"
          type="primary"
          @click="addItem()"
          :disabled="disabled"
          style="margin-right: 5px"
          :title="disabled ? '最多只能有一个草稿' : ''"
        >
          新建
        </el-button>
      </header>
      <el-scrollbar class="wrap-overflow-x-auto el-scrollbar">
        <el-tabs
          ref="tabs"
          tab-position="left"
          v-model="activeName"
          @tab-click="handleTabClick"
          class="mini prescription_tabs"
        >
          <el-tab-pane
            v-for="(_, index) in list"
            :name="`id-${list.length - index}`"
            :label="`No${list.length - index}`"
            :key="'no-' + (list.length - index)"
            lazy
          ></el-tab-pane>
          <template v-for="(item, index) in list">
            <div
              class="handle_item"
              :key="`label_${index}`"
              :id="`id-${list.length - index}`"
            >
              <Handle
                @customEvent="customEventHandler"
                :labelIndex="list.length - index"
                :bizInfo="bizInfo"
                :index="index"
                :item="item"
                ref="Handle"
                remark
              ></Handle>
            </div>
          </template>
        </el-tabs>
      </el-scrollbar>
    </section>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import * as business from '@/api/business'
import Handle, { Item } from '@/components/Handle/Handle'

export default {
  name: 'ChatHandle',
  props: {
    bizInfo: {
      type: Object,
      default: () => {},
    },
  },
  components: { Handle },
  data() {
    return {
      list: [],
      activeName: '',
      disabled: false,
    }
  },
  methods: {
    // get Draft
    async getDraft() {
      const res = await business.disposeWebList({
        pageSize: 999,
        sorted: 'DESC',
        field: 'create_time',
        orderId: this.bizInfo.orderId,
      })
      const list = res.list.map(item => ({
        ...item,
        anxious: item.anxious || 'false',
      }))
      if (!list.length) list.push(cloneDeep(Item))
      this.list = list
      this.$nextTick(() => this.computeDisabled())
    },
    addItem(item) {
      if (item) {
        this.list.unshift(item)
      } else {
        this.list.unshift(cloneDeep(Item))
      }
      this.$nextTick(() => {
        this.computeDisabled()
        const ele = this.$refs.Handle[0].$el
        ele.querySelectorAll('input')[4].value = ''
      })
    },
    delItem(index, compute = true) {
      this.list.splice(index, 1)
      if (!compute) return false
      this.$nextTick(() => this.computeDisabled())
    },
    delDraft(_id) {
      console.log(_id)
      let refs = this.$refs.Handle
      refs = Array.isArray(refs) ? refs : [refs]
      const index = refs.findIndex(item => {
        const { id, status, payStatus } = item.tableData[0]
        if (payStatus) return false
        if (id === _id) return false
        return Boolean(!status || status === 'DRAFT')
      })
      if (index !== -1) this.delItem(index, false)
    },
    computeDisabled() {
      let refs = this.$refs.Handle
      refs = Array.isArray(refs) ? refs : [refs]
      refs = refs.filter(item => {
        const { status, payStatus } = item.tableData[0]
        if (payStatus) return false
        return Boolean(!status || status === 'DRAFT')
      })
      this.disabled = refs.length >= 1
    },
    customEventHandler({ type, index, datas }) {
      switch (type) {
        case 'del':
          this.delItem(index)
          break
        case 'update':
          this.list.splice(index, 1, datas)
          break
      }
      this.computeDisabled()
    },
    handleTabClick({ name }) {
      const el = this.$refs.tabs.$el.querySelector(`#${name}`)
      el && el.scrollIntoView({ behavior: 'smooth' })
      this.activeName = name
    },
  },
  watch: {
    bizInfo: {
      handler(newVal, oldVal) {
        const newId = newVal && newVal.orderId
        const oldId = oldVal && oldVal.orderId
        if (newId && newId !== oldId) {
          this.list = []
          this.getDraft()
        }
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scope>
@import '@/styles/_variables.scss';
.Handle {
  padding: 0 10px;
  height: 100%;
}
.handle_item {
  width: 100%;
  padding-left: 10px;
  box-sizing: border-box;
  margin-bottom: 10px;
  border-bottom: 1px dashed #e6e6e6;
}
.btn_list {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}
.wrap {
  height: 100%;
}
</style>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';
.Handle {
  .wrap {
    height: 100%;
  }

  .el-dialog__body {
    padding-top: 0;
  }

  .el-scrollbar {
    margin: 10px 0;
    height: calc(100% - 16px - 20px);

    .el-tabs--left,
    .el-tabs--right {
      overflow: visible;
    }
    .el-tabs__header {
      position: sticky;
      top: 0;
      margin-right: 3px;
    }

    .prescription-head {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      > span {
        color: $--color-info;
      }
    }
  }

  .total {
    position: sticky;
    right: 0;
    color: $--color-primary;
    background: $--color-white;
  }
}
</style>
