<template>
  <section class="view__card">
    <div v-loading="isLoading">
      <List
        v-model="query"
        :filter="filter"
        :columns="columns"
        :tableData="tableData"
      >
        <template v-slot:slot_index="{ row }">
          <EditableText
            icon="el-icon-edit"
            v-model="row.index"
            @confirm="resolveSortChange($event, row)"
          />
        </template>

        <template v-slot:slot_gender="{ row }">
          <span style="color: red;">{{ row.gender }}</span>
        </template>

        <template v-slot:fixed="{ row }">
          <el-button type="text" @click="seeInfo(row)">查看</el-button>
        </template>
      </List>
    </div>

    <el-dialog
      title="推送详情"
      :visible.sync="dialog.visible"
      append-to-body
      custom-class="component__dialog"
    >
      <el-scrollbar>
        <el-row class="view__content">
          <el-col>
            <span>推送对象</span>
            <span>{{ dialog.dialogDatas.name }}</span>
          </el-col>

          <el-col class="content-text">
            <span>推送内容</span>
            <span class="texts">
              {{ dialog.dialogDatas.content }}
            </span>
          </el-col>

          <el-col>
            <span>推送时间</span>
            <span>{{ dialog.dialogDatas.pushTime }}</span>
          </el-col>
        </el-row>
      </el-scrollbar>

      <template v-slot:footer>
        <div class="is-center">
          <el-button size="mini" @click="dialog.visible = false">
            取消
          </el-button>
          <el-button size="mini" type="primary" @click="dialog.visible = false">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script>
import { List, mixin, EditableText } from '@/components'
import { pushList } from '@/api/list'

export default {
  name: 'TableList',
  components: {
    List,
    EditableText,
  },
  mixins: [
    mixin({
      fetchListFunction: pushList,
    }),
  ],

  data() {
    return {
      //跳转过来的参数
      name: '',
      tableData: {},
      isLoading: true,
      query: {
        searchType: 0,
        timeType: 3,
        currentNum: 1,
        pageSize: 10,
        numType: 3,
      },

      dialog: {
        visible: false,
        dialogDatas: {},
      },
    }
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [{ label: '推送时间', value: 3 }],
          },
          keys: ['timeType', 'start', 'end'],
        },
        search: {
          props: {
            options: [
              { label: '患者姓名', value: 0 },
              { label: '推送内容', value: 1 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '已读人数',
              is: 'InputRange',
            },
            keys: ['readStartNum', 'readEndNum'],
          },
          {
            props: {
              label: '推送人数',
              is: 'InputRange',
            },
            keys: ['pushStartNum', 'pushEndNum'],
          },
        ],
      }
    },
    columns() {
      return {
        lastOrderType: {
          minWidth: 140,
        },
        acceptsTime: {
          minWidth: 140,
        },
        createTime: {
          minWidth: 160,
        },
        gender: {
          prop: 'slot_gender',
        },
        index: {
          hidden: true,
          /* prop: 'slot_index',
          minWidth: 160, */
        },
      }
    },
  },
  created() {
    this.$route.params?.name && (this.name = this.$route.params?.name)
    console.log(this.name, '得到的筛选参数')
    if (!this.name) {
      this.pushList()
      return
    }
    //筛选
    this.query.searchKeywords = this.name
    this.pushList()
  },
  methods: {
    //列表数据
    async pushList() {
      this.tableData = await pushList(this.query)
    },
    async resolveSortChange(index, { id }) {
      console.log(index, id)
      this.$message({
        type: 'success',
        message: '完成',
        showClose: true,
      })

      this.$_fetchTableData()
    },
    seeInfo(row) {
      console.log(row)
      this.dialog.visible = true
      this.dialog.dialogDatas = row
    },
  },
  watch: {
    tableData(val) {
      if (val) this.isLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_modules-detail.scss';
.el-dialog__header {
  padding-bottom: 0;
}
::v-deep .el-dialog__body {
  padding: 0 20px !important;
  color: #666;
  .view__content {
    .el-col {
      min-height: 36px;
    }
    .content-text {
      display: flex;
      .texts {
        margin-top: 2px;
        flex: 1;
        letter-spacing: 0.1em;
        line-height: 24px;
      }
    }
    span {
      color: #6d6d6d;
    }
  }
}
</style>
