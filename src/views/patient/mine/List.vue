<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      :bats="[{}]"
    >
      <!-- 批量推送按钮 -->
      <template v-slot:footertool>
        <el-button
          size="mini"
          plain
          type="primary"
          @click="handleCommand('push')"
        >
          批量推送
        </el-button>
      </template>
      <!-- 就诊记录弹出层 -->
      <template v-slot:slot_visitCount="{ row }">
        <el-popover placement="bottom">
          <el-table
            :data="row.visitList"
            max-height="250"
            size="small"
            fit
            lazy
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
            ></el-table-column>
            <el-table-column property="name" label="就诊人"></el-table-column>
            <el-table-column property="orderType" label="类型">
              <template v-slot="{ row }">
                <span>{{ orderType[row.orderType] }}</span>
              </template>
            </el-table-column>
            <el-table-column property="wayType" label="形式">
              <template v-slot="{ row }">
                <span>{{ wayType[row.wayType] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              property="diagnosisInfo"
              label="诊断"
              width="120"
            ></el-table-column>
            <el-table-column
              property="doctorName"
              label="接诊人"
            ></el-table-column>
            <el-table-column
              property="acceptsTime"
              label="就诊时间"
              width="100"
            ></el-table-column>
            <el-table-column label="患者记录">
              <template v-slot="{ row }">
                <span
                  style="color: #0ab2c1; cursor: pointer;"
                  @click="seeInfo(row)"
                  >查看</span
                >
              </template>
            </el-table-column>
          </el-table>
          <el-button slot="reference" type="text">{{
            row.visitCount
          }}</el-button>
        </el-popover>
      </template>
      <!-- 推送次数跳转 -->
      <template v-slot:slot_pushCount="{ row }">
        <span
          style="color: #0ab2c1; cursor: pointer;"
          @click="goPushList(row)"
          >{{ row.pushCount }}</span
        >
      </template>
      <!-- 查看详情 -->
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

    <!-- 推送内容弹出层 -->
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
import enumsList from '../enumsList'
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
        timeType: 0,
        searchType: 2,
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
      //枚举类型
      orderType: enumsList.orderType,
      wayType: enumsList.wayType,
      status: enumsList.status,
      type: enumsList.type,
    }
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [
              { label: '创建时间', value: 0 },
              { label: '最后一次就诊时间', value: 1 },
            ],
          },
          keys: ['timeType', 'start', 'end'],
        },
        search: {
          props: {
            options: [
              { label: '患者ID', value: 0 },
              { label: '电子健康卡号', value: 1 },
              { label: '患者姓名', value: 2 },
              { label: '身份证号', value: 3 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '性别',
              options: [
                { label: '不限', value: '' },
                { label: '男', value: 1 },
                { label: '女', value: 0 },
              ],
            },
            keys: 'sex',
          },
          {
            props: {
              label: '是否儿童',
              options: [
                { label: '不限', value: '' },
                { label: '不是', value: 0 },
                { label: '是', value: 1 },
              ],
            },
            keys: 'childState',
          },
          {
            props: {
              label: '就诊记录',
              is: 'InputRange',
            },
            keys: ['visitStartNum', 'visitEndNum'],
          },
          {
            props: {
              label: '推送次数',
              is: 'InputRange',
            },
            keys: ['pushStartNum', 'pushEndNum'],
          },
          {
            props: {
              label: '最近一次就诊类型',
              options: [
                { label: '不限', value: '' },
                { label: '在线咨询', value: 'CONSULT' },
                { label: '在线复诊', value: 'REPEAT_CLINIC' },
                { label: '慢病续方', value: 'CARRYON_PRESC' },
              ],
            },
            keys: 'orderType',
          },
          /* {
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
          }, */
        ],
      }
    },
    columns() {
      return {
        etCardNo: {
          minWidth: 140,
        },
        lastOrderType: {
          minWidth: 120,
          formatter(row) {
            return row.lastOrderType === 'CONSULT'
              ? '在线咨询'
              : row.lastOrderType === 'REPEAT_CLINIC'
              ? '在线复诊'
              : row.lastOrderType === 'CARRYON_PRESC'
              ? '慢病续方'
              : ''
          },
        },
        acceptsTime: {
          minWidth: 140,
        },
        createTime: {
          minWidth: 160,
        },
        idCard: {
          minWidth: 140,
        },
        visitCount: {
          prop: 'slot_visitCount',
        },
        pushCount: {
          prop: 'slot_pushCount',
        },
        index: {
          hidden: true,
        },
        fixed: {
          minWidth: 100,
        },
        sex: {
          formatter(row) {
            return row.sex == 0 ? '女' : row.sex == 1 ? '男' : ''
          },
        },
        childState: {
          formatter(row) {
            return row.childState == 0 ? '否' : row.childState == 1 ? '是' : ''
          },
        },
      }
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
          patientIds: this.tableData.multipleSelection.map(
            item => item.patientId,
          ),
          patientNames: this.tableData.multipleSelection.map(item => item.name),
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
    //查看就诊记录详情
    seeInfo(row) {
      this.$router.push({
        name: 'recordInfo',
        params: {
          medicalId: row.medicalId,
        },
      })
    },
    //推送次数跳转
    goPushList(row) {
      this.$router.push({
        name: 'pushList',
        params: row,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.el-button--medium {
  font-size: 12px;
}
::v-deep .el-dropdown {
  display: none !important;
}
</style>
