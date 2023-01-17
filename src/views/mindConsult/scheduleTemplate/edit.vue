<template>
  <div class="view__card edit_schedule">
    <div class="dept-list">
      <div class="template-name">模板名称：{{ $route.query.scheduleName }}</div>

      <div class="flex-between">
        <el-input
          placeholder="请输入内容"
          v-model="keyWords"
          @change="changeSearch"
          class="input-with-select"
        >
        </el-input>
        <el-button
          type="primary"
          style="margin-left: 10px"
          @click="importDialog.visible = true"
          >导入</el-button
        >
      </div>
      <div class="tree-wrap">
        <el-tree
          :data="treeData"
          highlight-current
          node-key="key"
          ref="treeData"
          :filter-node-method="filterNode"
          icon-class="el-icon-arrow-right"
          :current-node-key="currentKey"
          :default-expanded-keys="[defaultExpand]"
          :props="{ children: 'userList', label: 'label' }"
          @current-change="handleNodeClick"
        ></el-tree>
      </div>
    </div>
    <div class="table-right">
      <div class="tabs-top">
        <el-radio-group
          v-model="currentWeek"
          @change="doctorWeekDayScheduleList()"
        >
          <template v-for="item in week">
            <el-radio-button :key="item.value" :label="item.value">{{
              item.label
            }}</el-radio-button>
          </template>
        </el-radio-group>
        <div>
          <el-button
            type="primary"
            @click="
              () => {
                ;(isAdd = true), (modelType = 'add')
              }
            "
            >新增排班</el-button
          >
          <el-button @click="backPage">退出编辑</el-button>
        </div>
      </div>
      <div style="flex: 1; width: 100%">
        <el-table
          :data="tableData"
          class=""
          style="border: 1px solid #dfe6ec; width: 100%; border-bottom: 0"
        >
          <el-table-column type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column prop="roomName" label="咨询室名称" width="90">
          </el-table-column>
          <el-table-column prop="periodName" label="午别"> </el-table-column>
          <el-table-column prop="startTime" label="开始时间"> </el-table-column>
          <el-table-column prop="endTime" label="结束时间"> </el-table-column>
          <el-table-column
            prop="itemName"
            label="项目名称"
            min-width="140"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="price" label="价格"> </el-table-column>
          <el-table-column prop="sourceNumber" label="号源类型">
            <template slot-scope="{ row }">
              <div class="flex-center">
                <img
                  class="aloneAdd"
                  style="margin-right: 2px; width: 18px"
                  v-if="row.video"
                  src="@/assets/video.png"
                />
                <span v-if="row.ageGroup">
                  {{ ageGroupText(row.ageGroup) }}</span
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sex" label="适用性别" width="90">
            <template slot-scope="{ row }">
              <span>{{
                row.sex == 9
                  ? '通用'
                  : row.sex == 1
                  ? '男'
                  : row.sex == 2
                  ? '女'
                  : ''
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sourceNumber" label="号源"> </el-table-column>
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                style="color: #0ab2c1"
                @click="editRow(row)"
                >编辑</el-button
              >
              <el-button type="text" style="color: #f74a4a" @click="del(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--添加排班-->
    <AddSchedule
      :show="isAdd"
      :modelType="modelType"
      :rowData="rowData"
      :data="{
        userId: currentKey,
        weekDay: currentWeek,
        scheduleId: templateId,
        deptId: currentDept,
        userName: userName,
      }"
      :list="tableData"
      @onClose="closeAdd"
    ></AddSchedule>
    <!-- 导入模板 -->
    <el-dialog
      title="导入"
      :visible="importDialog.visible"
      append-to-body
      custom-class="component__dialog"
      :before-close="handleClose"
    >
      <div class="import-content">
        <div class="step-msg">1.下载模板文件，根据模板中的批注，填写信息。</div>
        <el-button size="small" type="primary" plain @click="download"
          >下载模板</el-button
        >
        <div class="step-msg">2.上传填写后的数据文件：</div>
        <el-upload
          class="upload-demo"
          action
          :show-file-list="true"
          accept=".xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :file-list="importDialog.sonListS"
          :http-request="httpRequest"
          :before-upload="beforeUpload"
          :on-change="hanleChange"
          :before-remove="delFile"
        >
          <el-button size="small" type="primary">选择文件</el-button>
        </el-upload>
        <div class="step-msg">
          <p class="import-msg">
            【导入说明】<br />
            1.表格首行为字段名，请勿删除，否则将无法导入。<br />
            2.表头字段标了“*”的为必填字段，请务必填写。<br />
            3.一次最多提交1000条数据，且文件大小不能超过10M.<br />
            4.仅支持.xls、.xlsx格式。<br />
          </p>
        </div>
      </div>
      <template v-slot:footer>
        <div class="is-center">
          <el-button type="primary" @click="confirmImport">开始导入</el-button>
          <el-button @click="importDialog.visible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  modularLexcel, //下载导入格式
} from '@/api/dictionary'
import AddSchedule from './components/AddSchedule'
import apiScheduleTemplate from '@/api/mindConsult/scheduleTemplate'
export default {
  components: { AddSchedule },
  data() {
    return {
      fileData: '',
      importDialog: {
        visible: false,
        sonListS: [],
        model: '',
      },
      templateId: this.$route.query.id || '',
      isAdd: false,
      keyWords: '',
      week: [
        { label: '周一', value: 'MONDAY' },
        { label: '周二', value: 'TUESDAY' },
        { label: '周三', value: 'WEDNESDAY' },
        { label: '周四', value: 'THURSDAY' },
        { label: '周五', value: 'FRIDAY' },
        { label: '周六', value: 'SATURDAY' },
        { label: '周日', value: 'SUNDAY' },
      ],
      currentWeek: 'MONDAY',
      currentKey: '',
      currentDept: '',
      defaultExpand: '',
      treeData: [],
      tableData: [],
      modelType: 'add',
      rowData: {},
    }
  },
  computed: {
    userName() {
      let dept = this.treeData.find(item => item.key === this.currentDept)
      let user = dept?.userList?.find(res => res.key === this.currentKey)
      return `${user?.userName} | ${user?.titleName} | ${dept?.deptName}`
    },
  },
  created() {
    this.doctorScheduleList()
  },
  methods: {
    async confirmImport() {
      if (!this.fileData) {
        return this.$message.warning('请选择需要上传的文件')
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      await apiScheduleTemplate.importScheduleTempDoctorDetail(this.fileData, {
        scheduleTempId: this.$route.query.id,
      })
      this.doctorWeekDayScheduleList()
      setTimeout(() => {
        loading.close()
        this.$message.success('操作成功!')
      }, 1000)
      this.importDialog.visible = false
      this.importDialog.sonListS = []
      this.fileData = ''
    },
    //删除
    delFile() {
      this.fileData = ''
    },
    //替换上次文件
    hanleChange(file, fileList) {
      console.log(fileList, 'list')
      this.importDialog.sonListS = [fileList[fileList.length - 1]]
    },
    //导入验证
    beforeUpload(file) {
      let ExcalBar = ['xlsx', 'xlsm', 'xltx', 'xls']
      const isExcal =
        ExcalBar.indexOf(file.name.substring(file.name.lastIndexOf('.') + 1)) >
        -1
          ? true
          : false
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isExcal) {
        this.$message.error('上传excal只能是 excal 格式 !')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 10 MB !')
      }
      return isExcal && isLt2M
    },
    httpRequest({ file }) {
      console.log(file, 'file')
      const formData = new FormData()
      formData.append('file', file)
      this.fileData = formData
      console.log(this.fileData, '---')
    },

    handleClose(done) {
      done()
      this.importDialog.visible = false
    },
    //下载模板
    download() {
      modularLexcel('心咨医生排班模板.xlsx')
    },
    backPage() {
      // this.$router.back()
      // this.$EventBus.$emit('backScheduleId', this.$route.query.id)
      this.$router.push(
        '/mindConsult/scheduleTemplate/index?id=' + this.$route.query.id,
      )
    },
    //打开编辑排班内容弹窗
    editRow(row) {
      this.isAdd = true
      this.modelType = 'edit'
      this.rowData = row
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    changeSearch(e) {
      this.$refs.treeData.filter(e)
    },
    ageGroupText(ageGroup) {
      if (ageGroup.split(',').length === 3) return '通用'
      const types = {
        1: '儿童',
        2: '青少年',
        3: '成人',
      }
      return ageGroup
        .split(',')
        .map(v => types[v])
        .join('、')
    },
    handleNodeClick(data) {
      console.log(data)
      console.log(this.currentKey)
      if (data.userId) {
        this.currentKey = data.key
        this.currentDept = data.deptId
        this.doctorWeekDayScheduleList()
      }
    },
    closeAdd(data) {
      console.log(data)
      if (data) {
        this.doctorWeekDayScheduleList()
      }
      this.isAdd = false
    },
    del(row) {
      this.$confirm('确定要删除该排班?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await apiScheduleTemplate.delDoctorSchedule(row.id)
        this.doctorWeekDayScheduleList()
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
      })
    },
    async doctorScheduleList() {
      let list = await apiScheduleTemplate.doctorScheduleList({
        id: this.templateId,
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
              key: item.deptId + '_' + t.userId,
              deptId: item.deptId,
            }
          }),
        }
      })
      let key = this.treeData.filter(
        item => item.userList && item.userList.length > 0,
      )[0]
      this.defaultExpand = key.key
      this.currentKey = key.userList[0].key
      this.currentDept = key.key
      this.$nextTick(() => {
        this.$refs['treeData']?.setCurrentKey(key.userList[0].key)
        this.doctorWeekDayScheduleList()
      })
    },
    async doctorWeekDayScheduleList() {
      let res = await apiScheduleTemplate.doctorWeekDayScheduleList({
        deptId: this.currentDept,
        scheduleId: this.$route.query.id,
        userId: this.currentKey.split('_')[1],
        weekDay: this.currentWeek,
      })
      this.tableData = res
    },
  },
}
</script>

<style lang="scss" scoped>
.edit_schedule {
  display: flex;
  height: 100%;
  .dept-list {
    width: 30%;
    min-width: 200px;
    max-width: 330px;
    margin: -20px 20px -20px 0;
    padding: 20px;
    padding-left: 0;
    border-right: 1px solid #e6e6e6;
    display: flex;
    flex-direction: column;
    .tree-wrap {
      margin-top: 20px;
      flex: 1;
      overflow-y: auto;
    }
  }
  .table-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    .tabs-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
  }
}
.flex-center {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.aloneAdd {
  width: 18px;
}
.template-name {
  margin-bottom: 20px;
  color: #666;
}
.step-msg {
  margin: 10px 0;
}
.import-msg {
  line-height: 20px;
}
</style>
