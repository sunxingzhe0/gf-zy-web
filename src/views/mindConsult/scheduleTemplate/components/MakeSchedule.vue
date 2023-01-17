<template>
  <el-dialog
    title="生成排班"
    :visible.sync="innerVisible"
    :close-on-click-modal="false"
    width="960px"
  >
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="90px">
      <el-row>
        <el-col :span="8"
          ><el-form-item label="模板名称" prop="scheduleId">
            <el-select
              v-model="form.scheduleId"
              @change="doctorScheduleList"
              style="width: 100%"
            >
              <el-option
                v-for="item in templateList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="8"
          ><el-form-item label="开始日期" prop="startDate">
            <el-date-picker
              style="width: 100%"
              v-model="form.startDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="结束日期" prop="endDate">
            <el-date-picker
              v-model="form.endDate"
              style="width: 100%"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="{
                disabledDate: disabledDate,
              }"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="" prop="deptUserList" label-width="20px">
            <div class="tree-wrap">
              <el-tree
                :data="treeData"
                show-checkbox
                default-expand-all
                node-key="key"
                ref="tree"
                icon-class="el-icon-arrow-right"
                highlight-current
                :props="defaultProps"
              >
              </el-tree>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer is-center">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="submit">预 览</el-button>
    </div>
  </el-dialog>
</template>
<script>
import apiScheduleTemplate from '@/api/mindConsult/scheduleTemplate'
import dayjs from 'dayjs'
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
    },
  },
  data() {
    return {
      treeData: [],
      templateList: [],
      defaultProps: {
        children: 'userList',
        label: 'label',
      },
      form: {
        shiftName: '',
        endDate: '',
        startDate: '',
        scheduleId: '',
        type: 1,
        deptUserList: [],
      },
      rules: {
        endDate: [{ required: true, message: '结束日期', trigger: 'blur' }],
        shiftName: [{ required: true, message: '选择模板', trigger: 'blur' }],
        startDate: [{ required: true, message: '开始日期', trigger: 'blur' }],
        deptUserList: [
          { required: true, message: '选择科室医生', trigger: 'blur' },
        ],
      },
    }
  },
  watch: {
    show() {
      if (this.show) {
        this.getTemplate()
        this.doctorScheduleList()
      }
    },
    data() {
      if (this.data) {
        this.form.scheduleId = this.data.scheduleId
      }
    },
  },
  computed: {
    innerVisible: {
      get: function () {
        return this.show
      },
      set: function (val) {
        console.log(val)
        this.$emit('onClose')
      },
    },
  },
  methods: {
    close(data) {
      this.$emit('onClose', data)
    },
    disabledDate(e) {
      return dayjs(e) < dayjs(this.form.startDate)
    },
    disabledStartDate(e) {
      return dayjs(e) < dayjs() || dayjs(e) > dayjs(this.form.endDate)
    },
    async getTemplate() {
      let res = await apiScheduleTemplate.chooseScheduleTemplate()
      console.log(res)
      this.templateList = res
    },
    async doctorScheduleList() {
      let list = await apiScheduleTemplate.doctorScheduleList({
        id: this.form.scheduleId,
      })
      console.log(list)
      this.treeData = list.deptList.map(item => {
        return {
          ...item,
          label: item.deptName,
          key: item.deptId,
          userList: item.userList.map(t => {
            return {
              ...t,
              label: t.userName + (t.titleName ? ' | ' + t.titleName : ''),
              key: t.userId,
              deptId: item.deptId,
            }
          }),
        }
      })
    },
    listToTree(data) {
      let dataInfo = {}
      data.forEach(item => {
        let { deptId } = item
        if (!dataInfo[deptId]) {
          dataInfo[deptId] = {
            deptId,
            userList: [],
          }
        }
        dataInfo[deptId].userList.push(item.userId)
      })
      return Object.values(dataInfo)
    },
    submit() {
      console.log(this.$refs.tree.getCheckedNodes())
      let list = this.listToTree(
        this.$refs.tree.getCheckedNodes().filter(item => item.userId),
      )
      console.log(list)
      this.form.deptUserList = list
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.form.shiftName = this.templateList.find(
            item => item.id === this.form.scheduleId,
          ).name
          this.$store.dispatch('xzSchedule/setPreviewQery', this.form)
          this.$router.push('/mindConsult/scheduleTemplate/preview')
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
.tree-wrap {
  background: #f7f7f7;
  padding: 10px;
  height: 40vh;
  overflow: auto;
  overflow-x: hidden;
  .el-tree {
    background: transparent;
  }
}
</style>
