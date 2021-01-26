<template>
  <section class="view__card">
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

      <template v-slot:fixed>
        <el-button type="text" @click="dialog.visible = true">查看</el-button>
      </template>
    </List>

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
            陶美玲
          </el-col>

          <el-col>
            <span>推送内容</span>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero
            nesciunt laborum eius laboriosam dolor assumenda vero voluptatibus
            mollitia facilis repellendus at molestias quia officia fuga,
            corrupti, sapiente tempore quaerat? Voluptas!
          </el-col>

          <el-col>
            <span>推送时间</span>
            陶美玲
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
import { fetchList } from '@/api/list'

export default {
  name: 'TableList',
  components: {
    List,
    EditableText,
  },
  mixins: [mixin({ fetchListFunction: fetchList })],
  data() {
    return {
      query: {
        pageSize: 10,
        dateType: 0,
        searchType: 0,
        sourceType: 0,
      },

      dialog: {
        visible: false,
      },
    }
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [{ label: '创建时间', value: 0 }],
          },
          keys: ['dateType', 'start', 'end'],
        },
        search: {
          props: {
            options: [{ label: '订单号', value: 0 }],
          },
          keys: ['searchType', 'searchKeywords'],
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
  },
}
</script>

<style lang="scss">
@import '@/styles/_modules-detail.scss';
</style>
