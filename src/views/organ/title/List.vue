<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_seq="{ row }">
        <EditableText
          icon="el-icon-edit"
          v-model="row.seq"
          @confirm="confirm($event, row.id)"
          @cancel="cancel"
        ></EditableText>
      </template>

      <template v-slot:slot_doctorNum="{ row }">
        <router-link
          v-if="row.doctorNum != 0"
          class="el-button el-button--text"
          :to="{
            path: '/jurisdiction/account/list',
            query: {
              titleId: row.id,
            },
          }"
        >
          {{ row.doctorNum }}
        </router-link>
        <span v-else>{{ row.doctorNum }}</span>
      </template>
      <template v-slot:slot_state="{ row }">
        <el-switch
          v-model="row.state"
          @change="stateChange(row.id, row.state)"
          active-text="启用"
          inactive-text="禁用"
          :width="50"
          class="textSwitch"
        ></el-switch>
      </template>
      <!-- <template v-slot:slot_age="{ row }">
        <el-button type="text" @click="tokeshi(row)">{{
          row.age + 2
        }}</el-button>
      </template> -->
      <template v-slot:footertool>
        <el-button type="primary" @click="add(false)">新增职称</el-button>
        <el-button
          plain
          type="primary"
          @click="
            importDialog.visible = true
            importDialog.sonListS = []
          "
          >批量导入</el-button
        >
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="add(row)">修改</el-button>
      </template>
    </List>
    <el-dialog
      :title="form.id ? '修改职称' : '新增职称'"
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="职称编码" v-if="form.id">
          <!-- <div>00125</div> -->
          <div>{{ form.id }}</div>
        </el-form-item>
        <el-form-item label="职称名称" prop="name">
          <el-input
            type="text"
            placeholder="请输入"
            v-model="form.name"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.state">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer is-center">
        <el-button @click="isAdd = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 批量导入 -->
    <el-dialog
      title="批量导入"
      :visible="importDialog.visible"
      append-to-body
      custom-class="component__dialog"
      :before-close="handleClose"
    >
      <el-form
        ref="importForm"
        :v-model="importDialog.model"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item prop="upload">
          <el-button size="small" type="primary" @click="download"
            >下载导入模板</el-button
          >
          <el-upload
            class="upload-demo"
            action
            accept=".xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :file-list="importDialog.sonListS"
            :before-upload="beforeUpload"
            :before-remove="beforeRemove"
            :http-request="httpRequest"
            :on-change="hanleChange"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传<code>excel</code> 文件,且不超过2MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="is-center">
          <el-button size="small" @click="importDialog.visible = false"
            >取消</el-button
          >
          <el-button size="small" type="primary" @click="submitTitle"
            >保存</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { List, mixin, EditableText } from '@/components'
import {
  getTitleList,
  addTitle,
  editTitle,
  setTitleState,
  sortTitle,
  titleManagement, //职称管理
} from '@/api/organization'
import {
  roleChooseList,
  deptChooseList,
  drugStoreChooseList,
  titleChooseList,
} from '@/api'
import {
  modularLexcel, //导入下载
} from '@/api/dictionary'
const pre = {
  role: [],
  dept: [],
  store: [],
  title: [],
}
export default {
  components: {
    List,
    EditableText,
  },
  mixins: [mixin([{ fetchListFunction: getTitleList }])],
  data() {
    this.filter = {
      date: {
        props: {
          options: [{ label: '创建时间', value: 0 }],
        },
        keys: ['timeType', 'startTime', 'endTime'],
      },
      search: {
        props: {
          options: [
            { label: '职称名称', value: 0 },
            { label: '职称编码', value: 1 },
          ],
        },
        keys: ['searchType', 'searchKeywords'],
      },
      popover: [
        {
          props: {
            label: '使用医生',
            is: 'InputRange',
          },
          keys: ['doctorNumStart', 'doctorNumEnd'],
        },
        {
          props: {
            label: '状态',
            options: [
              { label: '不限', value: '' },
              { label: '启用', value: true },
              { label: '禁用', value: false },
            ],
          },
          keys: 'state',
        },
      ],
    }
    return {
      loading: false,
      fileData: '',
      isAdd: false,
      value: '',
      form: {
        name: '',
        state: '',
      },
      rules: {
        name: [{ required: true, message: '请输入职称名称' }],
      },
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
      },
      importDialog: {
        visible: false,
        sonListS: [],
      },
      columns: {
        index: {
          hidden: true,
        },
        createDate: {
          minWidth: 180,
        },
        fixed: {
          minWidth: 60,
        },
        doctorNum: {
          label: '使用医生',
          prop: 'slot_doctorNum',
          minWidth: 120,
        },
        // age: {
        //   label: '使用医生',
        //   prop: 'slot_age',
        // },
        nurseId: {
          label: '排序',
          prop: 'slot_sort',
          minWidth: 160,
        },
        state: {
          label: '状态',
          prop: 'slot_state',
          minWidth: 100,
        },
        seq: {
          prop: 'slot_seq',
        },
      },
    }
  },
  async beforeRouteEnter(to, from, next) {
    ;[pre.role, pre.dept, pre.store, pre.title] = await Promise.all([
      roleChooseList({ showUser: true }),
      deptChooseList({ tree: false }),
      drugStoreChooseList(),
      titleChooseList(),
    ])
    next()
  },
  methods: {
    //下载导入模板
    async download() {
      modularLexcel('职称导入模板.xlsx')
    },
    // 排序文本保存
    async confirm(e, id) {
      let seq = parseInt(e)
      await sortTitle({
        id: id,
        seq: seq,
      })
      this.$_fetchTableData(getTitleList)
      this.$message.success('操作成功!')
    },
    cancel() {},
    // 新增职称
    add(row) {
      this.isAdd = true
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
      if (row) {
        this.form.name = row.name
        this.form.state = row.state
        this.form.id = row.id
      } else {
        this.form.name = ''
        this.form.state = true
        this.form.id = ''
      }
    },
    addkeshi(e) {
      console.log(e)
      this.form.keshi.push(e)
    },
    tokeshi(row) {
      this.$router.push(`/organ/department?id=${row.id}`)
    },
    tagclose(i) {
      this.form.keshi.splice(i, 1)
    },
    batch() {},
    // 保存提交
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          if (this.form.id) {
            await editTitle({
              ...this.form,
            })
            this.$_fetchTableData(getTitleList)
          } else {
            await addTitle({
              ...this.form,
            })
            this.$_fetchTableData(getTitleList)
          }
          this.isAdd = false
          this.$message.success('操作成功!')
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    // 修改状态
    async stateChange(id, bool) {
      await setTitleState({
        id: id,
        state: bool,
      })
      this.$_fetchTableData(getTitleList)
      this.$message.success(bool ? '职称启用成功！' : '职称禁用成功！')
    },
    //关闭弹窗
    handleClose(done) {
      done()
      this.importDialog.visible = false
    },
    beforeRemove(file) {
      return this.$confirm(`确定删除 ${file.name} ?`)
    },
    //上传文件
    beforeUpload(file) {
      let ExcalBar = ['xlsx']
      const isExcal =
        ExcalBar.indexOf(file.name.substring(file.name.lastIndexOf('.') + 1)) >
        -1
          ? true
          : false
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isExcal) {
        this.$message.error('上传excal只能是 excal 格式 !')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2 MB !')
      }
      return isExcal && isLt2M
    },
    httpRequest({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      this.fileData = formData
    },
    //批量导入替换上次的文件
    hanleChange(file, fileList) {
      this.importDialog.sonListS = [fileList[fileList.length - 1]]
    },
    //机构端职称批量导入
    submitTitle() {
      if (this.fileData) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        titleManagement(this.fileData)
          .then(() => {
            this.$message.success('操作成功!')
            this.$_fetchTableData()
          })
          .finally(() => {
            setTimeout(() => {
              loading.close()
            }, 1000)
          })
        this.importDialog.visible = false
        this.importDialog.sonListS = []
      } else {
        this.$message.success('请上传文件')
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.keshi {
  ::v-deep.c__editable-text {
    > span {
      display: none;
    }
  }
}

::v-deep .table-wrap .cell {
  font-size: 16px;
}
::v-deep .el-table .cell.el-tooltip {
  font-size: 14px;
  padding-left: 6px;
}
</style>
