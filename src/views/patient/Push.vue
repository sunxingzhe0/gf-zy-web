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
            {{ dialog.dialogDatas.name }}
          </el-col>

          <el-col>
            <span>推送内容</span>
            {{ dialog.dialogDatas.content }}
          </el-col>

          <el-col>
            <span>推送时间</span>
            {{ dialog.dialogDatas.pushTime }}
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
      tableData: {},
      isLoading: true,
      query: {
        searchType: 0,
        dateType: 0,
        timeType: 3,
        currentNum: 1,
        pageSize: 10,
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
            options: [{ label: '推送时间', value: 0 }],
          },
          keys: ['dateType', 'start', 'end'],
        },
        search: {
          props: {
            options: [{ label: '推送内容', value: 0 }],
          },
          keys: ['searchType', 'content'],
        },
        /* inline: [
          {
            props: {
              label: 'test',
              is: 'el-input',
            },
            data: {
              attrs: {
                type: 'password',
              },
            },
          },
        ], */
        popover: [
          {
            props: {
              label: '测试',
              options: [{ label: '不限', value: '' }],
            },
            keys: 'a',
          },
          {
            props: {
              label: '测试',
              is: 'el-input',
            },
            data: {
              attrs: {
                placeholder: '请输入内容',
              },
              on: {
                change: console.log,
              },
            },
            keys: 'b',
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

<style lang="scss">
@import '@/styles/_modules-detail.scss';
</style>
