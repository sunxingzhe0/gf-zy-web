<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      @handleCommand="handleCommand"
      :bats="[{ label: '批量推送', command: 'push' }]"
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

      <template v-slot:slot_nurseId="{ row }">
        <el-popover placement="bottom">
          <el-table :data="gridData">
            <el-table-column
              width="150"
              property="date"
              label="日期"
            ></el-table-column>
            <el-table-column
              width="100"
              property="name"
              label="姓名"
            ></el-table-column>
            <el-table-column
              width="300"
              property="address"
              label="地址"
            ></el-table-column>
          </el-table>
          <el-button slot="reference" type="text">{{ row.nurseId }}</el-button>
        </el-popover>
      </template>

      <template v-slot:fixed="{ row }">
        <router-link
          class="el-button el-button--text el-button--mini"
          :to="`detail/${row.memberId}&${row.patientId}`"
        >
          查看
        </router-link>

        <el-button type="text" @click="handlePushBtnClick(row)">推送</el-button>
      </template>
    </List>

    <el-dialog
      :title="dialog.isBat ? '批量推送' : `推送对象 - ${dialog.user}`"
      :visible.sync="dialog.visible"
      append-to-body
      custom-class="component__dialog"
      @closed="handleClosed"
    >
      <p v-if="dialog.isBat">
        推送对象：
        {{ tableData.multipleSelection.map(({ name }) => name).join(', ') }}
      </p>
      <el-scrollbar>
        <el-form ref="form" :model="dialog.model" :rules="rules">
          <el-form-item prop="content">
            <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 10 }"
              placeholder="请输入内容"
              v-model="dialog.model.content"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <template v-slot:footer>
        <div class="is-center">
          <el-button size="mini" @click="dialog.visible = false">
            取消
          </el-button>
          <el-button
            size="mini"
            type="primary"
            :loading="dialog.loading"
            @click="submit('form')"
          >
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script>
import { List, mixin /* EditableText */ } from '@/components'
import { fetchList, pushMsg } from '@/api/list'
import { invalidFieldSetFocus /* param */ } from '@/utils'
// import { createOrUpdate } from 'echarts/lib/util/throttle'

export default {
  name: 'TableList',
  components: {
    List,
    // EditableText,
  },
  mixins: [
    mixin({
      fetchListFunction: fetchList,
    }),
  ],
  data() {
    return {
      //请求参数
      query: {
        pageSize: 10,
        dateType: 0,
        searchType: 0,
        sourceType: 0,
      },

      dialog: {
        loading: false,
        visible: false,
        isBat: false,
        model: {
          content: '',
        },
        user: '',
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
        nurseId: {
          prop: 'slot_nurseId',
        },
        index: {
          hidden: true,
          /* prop: 'slot_index',
          minWidth: 160, */
        },
        fixed: {
          minWidth: 100,
        },
      }
    },
    gridData() {
      return [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
      ]
    },
    rules() {
      return {
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
      }
    },
  },
  methods: {
    handleCommand(command) {
      if (command !== 'query' && this.tableData.multipleSelection.length < 1) {
        this.$message({
          type: 'warning',
          message: '请先勾选需要处理的数据',
          showClose: true,
        })
        return
      }

      switch (command) {
        case 'push':
          {
            this.dialog.isBat = true
            this.dialog.visible = true
          }
          break
      }
    },
    /*     async resolveSortChange(index, { id }) {
      console.log(index, id)
      this.$message({
        type: 'success',
        message: '完成',
        showClose: true,
      })

      this.$_fetchTableData()
    }, */

    handlePushBtnClick(row) {
      this.dialog.user = row.name
      this.dialog.visible = true
      this.tableData.multipleSelection = [row]
    },

    submit(formName) {
      this.$refs[formName].validate(async (valid, invalidFields) => {
        if (!valid) {
          invalidFieldSetFocus(this.$refs[formName], invalidFields)
          return
        }
        // this.dialog.loading = true
        //推送信息
        const params = {
          memberIds: this.tableData.multipleSelection.map(
            item => item.memberId,
          ),
          memberNames: this.tableData.multipleSelection.map(item => item.name),
          content: this.dialog.model.content,
        }
        await pushMsg(params)
        this.dialog.visible = false
        this.$message({
          type: 'success',
          message: '完成',
          showClose: true,
        })
      })
    },

    handleClosed() {
      this.dialog.isBat = false
      this.$refs.form.resetFields()
      this.$refs.table.clearSelection()
    },
  },
}
</script>
