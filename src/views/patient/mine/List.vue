<template>
  <section class="view__card" :class="{ isShowcheck: !isShowBtn }">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      :showSelection="isShowBtn"
    >
      <!-- 批量推送按钮 -->
      <template v-slot:footertool v-if="isShowBtn">
        <el-button plain type="primary" @click="handleCommand('push')">
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
            <el-table-column property="diagnosisInfo" label="诊断" width="120">
              <template v-slot="{ row }">
                <span>{{ row.diagnosisInfo || '-' }}</span>
              </template></el-table-column
            >
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
                  style="color: #0ab2c1; cursor: pointer"
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
          style="color: #0ab2c1; cursor: pointer"
          @click="goPushList(row)"
          >{{ row.pushCount }}</span
        >
      </template>
      <!-- 查看详情 -->
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="gotoInfo(row)">查看</el-button>
        <el-button type="text" @click="handlePushBtnClick(row)" v-if="isShowBtn"
          >推送</el-button
        >
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
          <el-button @click="dialog.visible = false"> 取消 </el-button>
          <el-button
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
      isShowcheck: [],
      //是否显示机构端按钮
      isShowBtn: true,
      //端类型
      clientType: '',
      //请求参数
      query: {
        pageSize: 10,
        timeType: 1,
        searchType: 0,
        sourceType: this.$route.path === '/patient/patientTube/list' ? 1 : 0,
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
  created() {
    this.clientType = this.$store.state.user.platform
    this.$route.path === '/patient/patientTube/list' && (this.isShowBtn = false)
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [
              { label: '创建时间', value: 1 },
              { label: '最后一次就诊时间', value: 2 },
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
                { label: '否', value: 0 },
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
          /*    {
            props: {
              label: '推送次数',
              is: 'InputRange',
            },
            keys: ['pushStartNum', 'pushEndNum'],
          }, */
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
          minWidth: 150,
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
          minWidth: 180,
        },
        createTime: {
          minWidth: 160,
        },
        idCard: {
          minWidth: 140,
        },
        visitCount: {
          prop: 'slot_visitCount',
          minWidth: 90,
        },
        pushCount: {
          prop: 'slot_pushCount',
          minWidth: 90,
        },
        index: {
          hidden: true,
        },
        fixed: {
          minWidth: 140,
        },
        name: {
          minWidth: 90,
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
          minWidth: 90,
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
    //请求数据
    async fetchList() {
      this.tableData = await fetchList(this.query)
    },
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
    //查看详情
    gotoInfo(row) {
      this.$router.push({
        path:
          this.$route.path === '/patient/patientTube/list'
            ? '/patient/patientTube/detail'
            : '/patient/mine/detail',
        query: {
          id: row.memberId,
          patientId: row.patientId,
        },
      })
    },
    //删除推送次数
    delPush() {
      this.tableData.headers.forEach((item, index) => {
        if (item.dataField === 'pushCount') {
          this.tableData.headers.splice(index, 1)
        }
      })
    },
  },
  watch: {
    tableData() {
      if (
        this.clientType === 'ORG_WEB' ||
        this.$route.path === '/patient/patientTube/list'
      ) {
        this.delPush()
      }
    },
    $route(to) {
      console.log(to.path, '---跳转的路由')
      if (to.path === '/patient/patientTube/list') {
        this.isShowBtn = false
        this.query.sourceType = 1
        // this.fetchList()
        this.delPush()
      } else if (to.path === '/patient/mine/list') {
        this.query.sourceType = 0
        // this.fetchList()
        this.isShowBtn = true
      }
    },
  },

  /* beforeRouteLeave(to, from, next) {
    // 设置下一个路由的 meta
    to.meta.keepAlive = false // 详情不缓存，刷新
    next()
  }, */
}
</script>
<style lang="scss" scoped>
.isShowcheck {
  ::v-deep .left-btns {
    .el-checkbox {
      .el-checkbox__inner {
        display: none;
      }
    }
  }
}

.el-button--medium {
  font-size: 12px;
}
::v-deep .el-dropdown {
  display: none !important;
}
// ::v-deep .table-wrap .cell{
//   font-size: 16px;
// }
// ::v-deep .el-table .cell.el-tooltip {
//   font-size: 14px;
//   // padding-left: 6px;
// }
.el-button--medium {
  font-size: 14px;
}
</style>
