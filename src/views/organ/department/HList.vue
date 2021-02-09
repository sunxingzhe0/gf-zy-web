<template>
  <div class="view__card" v-loading.lock="faList.loading">
    <List
      v-model="faList.query"
      :filter="filter"
      :columns="faList.columns"
      :tableData="faList.tableData"
      @expandChange="expandChange"
    >
      <!-- <template v-slot:slot_title="{ row }">
        <el-button v-if="row.sonDeptList" type="text">{{
          row.address
        }}</el-button>
        <span v-else>{{ row.address }}</span>
      </template> -->

      <template v-slot:slot_doctorNum="{ row }">
        <router-link
          v-if="row.doctorNum != 0"
          class="el-button el-button--text el-button--mini"
          :to="{
            path: '/jurisdiction/account/list',
            query: {
              deptOuterId: row.id,
            },
          }"
        >
          {{ row.doctorNum }}
        </router-link>
        <span v-else>{{ row.doctorNum }}</span>
      </template>

      <!-- 子科室 -->
      <template v-slot:slot_sonDeptNum="{ row }">
        <el-button
          type="text"
          @click="isShowSon(row)"
          v-if="row.sonDeptNum != 0"
        >
          {{ row.sonDeptNum }}</el-button
        >
        <span v-else> {{ row.sonDeptNum }}</span>
      </template>

      <template v-slot:slot_seq="{ row }">
        <!-- v-if="!row.pid" -->
        <EditableText
          icon="el-icon-edit"
          v-model="row.seq"
          @confirm="confirm($event, row.id)"
          @cancel="cancel"
        ></EditableText>
        <!-- <div v-else>
          <i
            class="el-icon-top"
            v-if="row.canUp"
            @click="handleSort(true, row.id)"
          ></i>
          <i
            class="el-icon-bottom"
            v-if="row.canDown"
            @click="handleSort(false, row.id)"
          ></i>
        </div> -->
      </template>
      <template v-slot:slot_level="{ row }">
        <span v-show="row.level == 1">一级</span>
        <span v-show="row.level == 2">二级</span>
      </template>

      <template v-slot:slot_state="{ row }">
        <el-switch
          v-model="row.state"
          @change="setEnable(row)"
          active-text="启用"
          inactive-text="禁用"
          :width="50"
          class="textSwitch"
        >
        </el-switch>
      </template>
      <template v-slot:slot_recommend="{ row }">
        <el-switch v-model="row.recommend" @change="setRecommend(row)">
        </el-switch>
      </template>
      <template v-slot:footertool>
        <el-button type="primary" @click="add()">
          新增科室
        </el-button>
        <el-button
          plain
          type="primary"
          @click="
            importDialog.visible = true
            importDialog.sonListS = []
          "
        >
          批量导入
        </el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="add(row)"> 修改 </el-button>
      </template>
    </List>
    <el-dialog
      :title="form.id ? '修改科室' : '新增科室'"
      :close-on-click-modal="false"
      :visible.sync="isAdd"
      width="600px"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        v-if="isAdd"
        label-width="80px"
        v-loading="addLoading"
      >
        <el-form-item label="上级科室">
          <el-select
            v-model="form.pid"
            filterable
            style="width: 100%;"
            placeholder="暂无"
            @change="PdeptChange"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <span style="float: left;" v-if="!item.state">{{
                item.name
              }}</span>
              <span
                style="float: right; color: #8492a6; font-size: 13px;"
                v-if="!item.state"
                >已禁用</span
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室编码" v-if="form.id">
          <div>{{ form.id }}</div>
        </el-form-item>
        <el-form-item label="科室名称" prop="name">
          <el-input
            type="text"
            placeholder="请输入"
            maxlength="20"
            show-word-limit
            v-model="form.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="关联科室" prop="deptInners" v-if="isInner">
          <el-select
            v-model="form.deptInners"
            filterable
            multiple
            style="width: 100%;"
            placeholder="请选择"
          >
            <el-option
              v-for="item in innerDept"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室简介">
          <el-input
            type="textarea"
            placeholder="请输入"
            v-model="form.intro"
            :autosize="{ minRows: 6, maxRows: 6 }"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer is-center">
        <el-button @click="isAdd = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="submitLoading"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--批量导入  -->
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
            >下载导入模块</el-button
          >
          <el-upload
            class="upload-demo"
            action
            accept=".xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :file-list="importDialog.sonListS"
            :http-request="httpRequest"
            :before-upload="beforeUpload"
            :on-change="progress"
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
          <el-button size="small" type="primary" @click="preservation">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!--子科室-->
    <guanlianDept
      ref="sonList"
      @update="$_fetchTableData()"
      :faDept="faDept"
    ></guanlianDept>
  </div>
</template>
<script>
import { List, mixin, EditableText } from '@/components'
import {
  deptOuterList,
  deptOuterPdeptList,
  deptOuterAdd,
  deptOuterEdit,
  getDeptInner,
  deptOuterChangeRecommend,
  deptOuterChangeState,
  deptOuterChangeOrder,
  deptOuterImportExcel, //机构批量导入
  deptOuterInfo,
} from '@/api/organization'
import {
  modularLexcel, //导入下载
} from '@/api/dictionary'
import guanlianDept from './components/guanlianDept'
export default {
  components: {
    List,
    EditableText,
    guanlianDept,
  },
  props: {
    dept: Array,
  },
  mixins: [mixin([{ fetchListFunction: deptOuterList, prop: 'faList' }])],
  data() {
    return {
      filter: {
        date: {
          props: {
            options: [{ label: '创建时间', value: 0 }],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '科室名称', value: 0 },
              { label: '科室编码', value: 1 },
              { label: '科室简介', value: 2 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '科室等级',
              options: [
                { label: '不限', value: '' },
                { label: '一级', value: 1 },
                { label: '二级', value: 2 },
              ],
            },
            keys: 'deptLevel',
          },
          {
            props: {
              label: '所属科室',
              options: [
                { label: '不限', value: '' },
                ...this.dept.map(_ => ({ label: _.name, value: _.id })),
              ],
            },
            keys: 'faDeptId',
          },
          {
            props: {
              label: '子科室',
              is: 'InputRange',
            },
            keys: ['sonDeptNumStart', 'sonDeptNumEnd'],
          },
          {
            props: {
              label: '是否推荐',
              options: [
                { label: '不限', value: '' },
                { label: '是', value: true },
                { label: '否', value: false },
              ],
            },
            keys: 'recommend',
          },
          {
            props: {
              label: '科室医生',
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
      },
      fileData: '',
      faList: {
        query: {
          timeType: 0,
          searchType: 0,
          pageSize: 10,
          currentNum: 1,
          deptLevel: '',
          storeId: this.$route.query.id || '',
        },
        columns: {
          index: {
            hidden: true,
          },
          sonDeptNum: {
            minWidth: 120,
            prop: 'slot_sonDeptNum',
          },
          doctorNum: {
            label: '科室医生',
            prop: 'slot_doctorNum',
            minWidth: 120,
          },
          createTime: {
            minWidth: 180,
          },
          fixed: {
            minWidth: 60,
          },
          level: {
            prop: 'slot_level',
            minWidth: 120,
          },
          address: {
            prop: 'slot_title',
            minWidth: 150,
          },
          seq: {
            label: '排序',
            prop: 'slot_seq',
            minWidth: 140,
          },
          state: {
            label: '状态',
            prop: 'slot_state',
            minWidth: 100,
          },
          recommend: {
            prop: 'slot_recommend',
            minWidth: 100,
          },
          id: {
            minWidth: 150,
          },
          name: {
            minWidth: 90,
          },
          faDeptName: {
            minWidth: 90,
          },
          intro: {
            minWidth: 90,
          },
        },
      },
      loading: false,
      importDialog: {
        visible: false,
        sonListS: [],
      },
      submitLoading: false, //创建按钮loading状态
      isAdd: false,
      isShow: false,
      form: {
        name: '',
        intro: '',
        pid: '',
        deptInners: [],
      },
      rules: {
        name: [{ required: true, message: '请输入科室名称' }],
        deptInners: [{ required: true, message: '请选择关联科室' }],
      },
      options: [
        {
          id: '',
          name: '暂无',
          state: true,
        },
        ...this.dept,
      ],
      // 父科室名字
      faDept: {},
      addLoading: false, // 加载父级科室
      innerDept: [],
      isInner: true, //是否可关联科室
    }
  },
  watch: {
    dept() {
      this.filter.popover[1].props.options = [
        { label: '不限', value: '' },
        ...this.dept.map(_ => ({ label: _.name, value: _.id })),
      ]
    },
  },
  created() {},
  methods: {
    async download() {
      modularLexcel('互联网科室导入模板.xlsx')
    },
    expandChange(row, expanded) {
      console.log(row, expanded)
    },
    // 科室列表获取
    // async getDeptList() {
    //   const res = await deptOuterPdeptList({
    //     tree: false,
    //     type: 'WEB', //区分web和h5返回方式有更改
    //   })

    //   this.options = res
    //   let obj_ = {
    //     id: '',
    //     name: '暂无',
    //     state: true,
    //   }
    //   this.options.unshift(obj_)
    // },
    PdeptChange(e) {
      console.log(e)
      this.options.forEach(item => {
        if (item.id == e && item.deptInner && item.deptInner.length > 0) {
          this.form.deptInners = item.deptInner.map(t => {
            return t.id
          })
        } else {
          this.form.deptInners = []
        }
      })
    },
    async getDept() {
      let list = await deptOuterPdeptList({ tree: false, type: 'WEB' })
      this.options = [
        {
          id: '',
          name: '暂无',
          state: true,
        },
        ...list,
      ]
      this.$emit('deptChange', list)
    },
    // 获取挂号科室
    async getInnerDept() {
      const res = await getDeptInner({
        tree: false,
      })
      console.log(res, '*****')
      this.innerDept = res.filter(item => item.state)
    },
    // 排序 - 父科室
    async confirm(e, id) {
      await deptOuterChangeOrder({
        id: id,
        seq: parseInt(e),
      })
      this.$message.success('操作成功！')
      this.$_fetchTableData(deptOuterList)
    },
    // 排序 - 子科室
    async handleSort(bool, id) {
      await deptOuterChangeOrder({
        direct: bool,
        id: id,
      })
      this.$message.success('操作成功！')
      this.$_fetchTableData(deptOuterList)
    },
    // 子科室弹框显示
    isShowSon(row) {
      this.$refs.sonList.open(row)
      this.faDept = row
    },
    cancel() {},
    // 编辑 、 新增弹框
    async add(row) {
      this.isAdd = true
      this.addLoading = true
      await this.getDept()
      await this.getInnerDept()
      this.addLoading = false
      if (row) {
        let info = await deptOuterInfo({ id: row.id, tree: false })
        this.form.id = row.id
        this.form.name = row.name
        this.form.intro = row.intro
        this.form.pid = row.pid
        this.form.deptInners = info.deptInners
          ? info.deptInners.map(item => {
              return item.id
            })
          : []
        this.isInner = info.deptInners ? true : false
      } else {
        this.form.id = null
        this.isInner = true
        this.form.name = ''
        this.form.intro = ''
        this.form.pid = ''
        this.form.deptInners = []
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate()
        })
      }
    },
    batch() {},
    // 编辑，新增提交
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.submitLoading = true
          if (this.form.id) {
            await deptOuterEdit({
              ...this.form,
            })
            await this.getDept()
            this.$_fetchTableData(deptOuterList)
            this.isAdd = false
            this.$message.success('操作成功!')
            this.submitLoading = false
          } else {
            await deptOuterAdd({
              ...this.form,
              level: this.form.pid ? 2 : 1,
            })
            await this.getDept()
            this.$_fetchTableData(deptOuterList)
            this.isAdd = false
            this.$message.success('操作成功!')
            this.submitLoading = false
          }
          this.isAdd = false
          this.$message.success('操作成功!')
        } else {
          return false
        }
      })
    },
    //变更推荐状态
    async setRecommend(row) {
      await deptOuterChangeRecommend({
        id: row.id,
        state: row.recommend,
      })
      this.$_fetchTableData(deptOuterList)
      this.$message.success(row.recommend ? '科室推荐成功!' : '已取消科室推荐')
    },
    // 变更启用状态
    async setEnable(row) {
      await deptOuterChangeState({
        id: row.id,
        state: row.state,
      })
      this.$_fetchTableData(deptOuterList)
      this.$message.success(row.state ? '科室启用成功!' : '科室禁用成功')
      //变更后重新获取可选父级列表(变更父级状态)
      if (row.level == 1) {
        this.getDeptList()
      }
    },
    //关闭批量导入弹窗
    handleClose(done) {
      done()
      this.importDialog.visible = false
    },
    //文件上传
    beforeUpload(file) {
      let ExcalBar = ['xlsx', 'xlsm', 'xltx', 'xls']
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
    //上传的文件是否删除
    beforeRemove(file) {
      return this.$confirm(`确定删除 ${file.name}？`)
    },
    progress(file, fileList) {
      this.importDialog.sonListS = [fileList[fileList.length - 1]]
    },
    httpRequest({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      this.fileData = formData
      // Promise.resove(formData, onProgress)
      //   .then(onSuccess)
      //   .catch(onError)
      //   .finally(() => {
      //     this.importDialog.loading = false
      //   })
    },
    //机构批量导入
    async preservation() {
      if (this.fileData) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        deptOuterImportExcel(this.fileData)
          .then(() => {
            this.$message.success('操作成功!')
            this.$_fetchTableData()
          })
          .finally(() => {
            setTimeout(() => {
              loading.close()
            }, 500)
          })
        this.importDialog.visible = false
        this.importDialog.sonListS = []
      } else {
        this.$message.success('请上传文件!')
      }
    },
  },
}
</script>

<style lang="scss" scope>
.el-table {
  .el-button--text {
    padding: 0;
  }
}
.el-icon-top {
  margin-right: 10px;
  font-size: 20px;
  cursor: pointer;
}
.el-icon-bottom {
  font-size: 20px;
  cursor: pointer;
}
.el-table .cell {
  font-size: 14px;
}
// ::v-deep .table-wrap .cell{
//   font-size: 16px;
// }
// ::v-deep .el-table .cell.el-tooltip {
//   font-size: 14px;
//   padding-left: 6px;
// }
</style>
