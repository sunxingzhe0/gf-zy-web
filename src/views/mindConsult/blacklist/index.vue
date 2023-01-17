<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      showSelection
    >
      <template v-slot:footertool>
        <el-button type="primary" @click="add()"> 添加 </el-button>
        <el-button plain type="danger" @click="dels()"> 移除 </el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="remove(row.patientId)">移除</el-button>
        <el-button type="text" @click="getInfo(row.patientId)">详情</el-button>
      </template>
    </List>
    <el-dialog
      title="添加黑名单"
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form :model="form" ref="ruleForm" label-width="90px">
        <el-form-item label="关键字" prop="title">
          <el-select
            v-model="selectPatient"
            filterable
            remote
            reserve-keyword
            placeholder="患者ID/就诊卡号/名称/身份证号/联系电话/家庭地址"
            style="width: 100%"
            :remote-method="remoteMethod"
            :loading="selectLoading"
          >
            <el-option
              v-for="item in patientList"
              :key="item.idCard"
              :label="item.name"
              :value="item.patientId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer is-center">
        <el-button @click="isAdd = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import apiBlackList from '@/api/mindConsult/blackList'
export default {
  name: 'patient_blacklist_xz',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: apiBlackList.blackList })],
  data() {
    return {
      selectPatient: '',
      selectLoading: false,
      isAdd: false,
      query: {
        pageSize: 10,
        dateType: 0,
        searchType: 0,
      },
      form: {
        userId: '',
      },
      patientList: [],
      options: [],
    }
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [{ label: '加入黑名单时间', value: 0 }],
          },
          keys: ['dateType', 'beginTime', 'endTime'],
        },
        popover: [
          {
            props: {
              label: '关键字',
              is: 'el-input',
            },
            data: {
              attrs: {
                placeholder: '患者ID/就诊卡号/名称/身份证号/联系电话/家庭地址',
              },
            },
            keys: 'keywords',
          },
          {
            props: {
              label: '性别',
              options: [
                { label: '不限', value: '' },
                { label: '女', value: 0 },
                { label: '男', value: 1 },
              ],
            },
            keys: 'sex',
          },
          // {
          //   props: {
          //     label: '加入黑名单时间',
          //     is: 'el-date-picker',
          //   },
          //   data: {
          //     attrs: {
          //       type: 'datetimerange',
          //       startPlaceholder: '开始日期',
          //       endPlaceholder: '结束日期',
          //       defaultTime: ['00:00:00', '23:59:59'],
          //     },
          //     on: {
          //       change: e => {
          //         this.query.beginTime = e[0]
          //         this.query.endTime = e[1]
          //       },
          //     },
          //   },
          //   keys: ['beginTime', 'endTime'],
          // },
          // {
          //   props: {
          //     label: '最近登录时间',
          //     is: 'el-date-picker',
          //   },
          //   data: {
          //     attrs: {
          //       type: 'datetimerange',
          //       startPlaceholder: '开始日期',
          //       endPlaceholder: '结束日期',
          //     },
          //   },
          //   keys: ['creatTimes', 'endTimes'],
          // },
        ],
      }
    },
    columns() {
      return {
        blackTime: {
          minWidth: 160,
        },
        index: {
          hidden: true,
        },
        sex: {
          formatter(row) {
            return row.sex ? '男' : '女'
          },
        },
      }
    },
  },
  methods: {
    //关键字输入变化
    remoteMethod(keywords) {
      console.log(keywords)
      if (!keywords) return
      this.getPatientList(keywords)
    },
    //关键字查患者列表
    async getPatientList(keywords) {
      this.selectLoading = true
      this.patientList = await apiBlackList.getPatientListByKeywords({
        keywords,
      })
      this.selectLoading = false
    },
    add() {
      this.isAdd = true
    },
    //详情
    getInfo(id) {
      this.$router.push('/patient/patientTube/mindDetail?patientId=' + id)
    },
    //批量移除
    async dels() {
      const patientIds = this.tableData.multipleSelection.map(i => i.patientId)
      console.log(patientIds, 'patientIds')
      if (!patientIds.length) return this.$message.warning('请选择移除项！')
      await apiBlackList.removeBlacklistBatch({ patientIds })
      this.$message.success('操作成功！')
      this.$_fetchTableData()
    },
    //移除黑名单
    remove(patientId) {
      this.$confirm('确定将该用户移除黑名单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await apiBlackList.removeBlacklist({ patientId })
          this.$message.success('操作成功！')
          this.$_fetchTableData()
        })
        .catch(() => {})
    },
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.isAdd = false
          console.log(this.selectPatient, '选中==')
          await apiBlackList.addBlacklist({ patientId: this.selectPatient })
          this.$message.success('操作成功!')
          this.$_fetchTableData()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_modules-detail.scss';
</style>
