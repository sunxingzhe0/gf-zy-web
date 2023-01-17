<template>
  <div class="c__tool">
    <el-row>
      <el-col :span="9" class="left-btns" v-if="showLeft">
        <template v-if="tableRef">
          <el-checkbox
            :value="checked"
            :indeterminate="indeterminate"
            @change="handleToggleSelection"
          ></el-checkbox>

          <el-dropdown v-if="bats.length" @command="handleCommand">
            <el-button size="mini"
              >批量操作<i class="el-icon-arrow-up el-icon--right"></i
            ></el-button>
            <template v-slot:dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="{ label, command } in bats"
                  :key="command"
                  :command="command"
                  >{{ label }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-dropdown v-if="hasExport" @command="handleCommand">
            <el-button size="mini"
              >导出<i class="el-icon-arrow-up el-icon--right"></i
            ></el-button>
            <template v-slot:dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="query"
                  >导出查询结果</el-dropdown-item
                >
                <el-dropdown-item command="selection"
                  >导出所选记录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <slot />
      </el-col>
      <el-col
        :span="showLeft ? 15 : 24"
        class="is-right"
        v-if="isList ? done : true"
      >
        <el-scrollbar>
          <el-pagination
            small
            background
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total >>> 0"
            @size-change="
              $emit('change', { ...value, [pageProps.pageSize]: $event })
            "
            @current-change="
              $emit('change', { ...value, [pageProps.currentPage]: $event })
            "
          >
          </el-pagination>
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import request from '@/utils/request'
import { isEmpty } from 'lodash'

export default {
  name: 'FooterTool',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      required: true,
    },
    tableRef: {},
    hasExport: {
      type: Boolean,
    },
    bats: {
      type: Array,
      default: () => [],
    },
    total: {
      type: [Number, String],
    },
    pageProps: {
      type: Object,
      default: () => ({ currentPage: 'currentNum', pageSize: 'pageSize' }),
    },
    done: Boolean,
    isList: Boolean,
  },
  data() {
    return {
      currentPage: this.value[this.pageProps.currentPage],
      pageSize: this.value[this.pageProps.pageSize],
    }
  },
  watch: {
    value: {
      handler: function (value) {
        this.currentPage = value[this.pageProps.currentPage]
      },
      deep: true,
    },
  },
  computed: {
    showLeft() {
      return this.bats.length !== 0 || this.hasExport || !isEmpty(this.$slots)
    },
    checked() {
      const table = this.tableRef
      return (
        table.selection?.length === table.tableData?.length &&
        table.selection?.length !== 0
      )
    },
    indeterminate() {
      return !this.checked && this.tableRef.selection?.length > 0
    },
  },
  mounted() {
    this.$EventBus.$on('currentNumChange', data => {
      console.log('收到', data)
      this.currentPage = data
    })
  },
  methods: {
    handleToggleSelection(checked) {
      this.tableRef.clearSelection()
      checked && this.tableRef.toggleAllSelection()
    },
    clearSelection() {
      this.checked = false
      this.tableRef.clearSelection()
    },
    handleCommand(command) {
      const id = request.interceptors.response.use(
        response => {
          this.handleToggleSelection(false)
          request.interceptors.response.eject(id)
          return response
        },
        error => {
          request.interceptors.response.eject(id)
          return Promise.reject(error)
        },
      )
      this.$emit('command', command)
    },
  },
  //新增
  addMechanism() {
    this.$emit('addMechanism', true)
  },
}
</script>

<style lang="scss">
@import '~@/styles/_variables.scss';

.c__tool {
  position: sticky;
  z-index: 10;
  bottom: 0;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.98);
  transition: width 0.28s;

  .left-btns {
    > * + * {
      margin-left: 10px;
    }
    .el-button {
      padding: 10px 12px;
    }
  }

  .el-pagination--small span:not([class*='suffix']),
  .el-pagination--small button,
  .el-pagination--small .btn-prev,
  .el-pagination--small .btn-next,
  .el-pagination--small .el-pager li,
  .el-pagination--small .el-pager li.btn-quicknext,
  .el-pagination--small .el-pager li.btn-quickprev,
  .el-pagination--small .el-pager li:last-child {
    height: 28px;
    line-height: 28px;
  }

  .el-pagination.is-background.el-pagination--small .btn-prev,
  .el-pagination.is-background.el-pagination--small .btn-next,
  .el-pagination.is-background.el-pagination--small .el-pager li {
    min-width: 30px;
  }
}

@supports (
  (-webkit-backdrop-filter: saturate(180%) blur(20px)) or
    (backdrop-filter: saturate(180%) blur(20px))
) {
  .c__tool {
    backdrop-filter: saturate(180%) blur(20px);
    background: rgba(255, 255, 255, 0.8);
  }
}

.mobile {
  .c__tool {
    .left-btns,
    .is-right {
      text-align: center;
    }
  }
}

.page-component__scroll
  > .el-scrollbar__wrap
  > .el-scrollbar__view
  > *.add-padding-bottom {
  padding-bottom: 100px;
}
</style>
