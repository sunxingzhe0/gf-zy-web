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
      <template v-slot:slot_deptNum="{ row }">
        <span :class="row.deptNum == 0 ? 'text' : ''" v-if="row.deptNum == 0">
          {{ row.deptNum }}
        </span>
        <router-link
          v-else
          :to="{
            path: '/organ/department',
            query: { id: row.id, active: '1' },
          }"
          :class="row.deptNum == 0 ? 'text' : 'active'"
        >
          <span>
            {{ row.deptNum }}
          </span>
        </router-link>
      </template>
      <template v-slot:slot_drugStoreState="{ row, $index }">
        <el-switch
          :value="row.drugStoreState"
          @change="stateChange(row.id, $event, $index)"
          active-text="启用"
          :inactive-text="row.drugStoreState == 2 ? '停用' : '禁用'"
          :active-value="1"
          :width="50"
          class="textSwitch"
        ></el-switch>
      </template>
      <template v-slot:slot_drugNum="{ row }">
        <el-button type="text" @click="drugs(row)">{{ row.drugNum }}</el-button>
      </template>
      <template v-slot:footertool>
        <el-button type="primary" @click="add()">新增药房</el-button>
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
      :title="form.id ? '修改药房' : '新增药房'"
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      width="600px"
      @opened="opened"
      @close="closeDialog"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="药房编号" prop="id" v-if="form.id">
          <span>{{ form.id }}</span>
        </el-form-item>
        <el-form-item label="药房名称" prop="name">
          <el-input
            type="text"
            placeholder="请输入"
            v-model="form.name"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="药房地址" prop="address">
          <el-input
            type="text"
            placeholder="请输入"
            v-model="form.address"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input
            type="input"
            placeholder="请输入联系电话"
            v-model="form.telephone"
          ></el-input>
        </el-form-item>
        <el-form-item label="院内编码" prop="syncCode">
          <el-input
            type="input"
            placeholder="请输入院内编码"
            v-model="form.syncCode"
          ></el-input>
        </el-form-item>
        <el-form-item label="适用科室" prop="deptListName">
          <div class="keshi">
            <el-button type="text" v-if="!addkeshi" @click="addkeshi = true"
              >+添加</el-button
            >
            <el-select
              v-model="form.deptListName"
              multiple
              filterable
              :filter-method="handleFilter"
              placeholder="请选择"
              v-show="addkeshi"
              @remove-tag="removeTag"
              style="width: 100%"
            >
              <el-option :value="1" style="height: auto; padding: 0">
                <el-tree
                  :data="deptListAll"
                  :props="defaultProps"
                  show-checkbox
                  ref="tree"
                  node-key="id"
                  default-expand-all
                  @node-click="handleNodeClick"
                  highlight-current
                  current-node-key="node"
                  :default-checked-keys="form.deptList"
                  :filter-node-method="filterNode"
                  @check="handleChcek"
                >
                  <!--  <span slot-scope="{ node, data }" class="custom-tree-node">
                    <span>{{ data.name }}</span>
                    <span>{{ data.resourceNum }}</span>
                  </span> -->
                </el-tree>
              </el-option>
            </el-select>
          </div>
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
            :http-request="httpRequest"
            :file-list="importDialog.sonListS"
            :before-upload="beforeUpload"
            :on-change="hanleChange"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传 <code>excel</code> 文件,且不超过2MB
            </div>
          </el-upload></el-form-item
        >
      </el-form>
      <template v-slot:footer>
        <div class="is-center">
          <el-button @click="importDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="handleSumit">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <ApplicableDrugs ref="drug"></ApplicableDrugs>
  </div>
</template>
<script>
import { List, mixin, EditableText } from '@/components'
// import { deptOuterChooseList } from '@/api'
import {
  getPharmacyList,
  addPharmacy,
  editPharmacy,
  setPharmacyState,
  sortPharmacy,
  pharmacyManagement, //药房管理批量导入
} from '@/api/organization'
import ApplicableDrugs from './components/ApplicableDrugs'
import {
  roleChooseList,
  deptChooseList,
  drugStoreChooseList,
  titleChooseList,
} from '@/api'
import {
  modularLexcel, //导入下载
} from '@/api/dictionary'
import { cloneDeep } from 'lodash'
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
    ApplicableDrugs,
  },
  mixins: [mixin([{ fetchListFunction: getPharmacyList }])],
  data() {
    return {
      defaultProps: {
        children: 'next',
        label: 'name',
        disabled: 'state',
      },
      loading: false,
      fileData: '',
      // importDialog: {
      //   visible: false,
      //   sonListS: [],
      // },
      isAdd: false,
      value: '',
      addkeshi: false,
      form: {
        id: '',
        name: '',
        state: '',
        telephone: '',
        syncCode: '',
        address: '',
        deptListName: [],
        deptList: [],
      },
      rules: {
        name: [
          { required: true, message: '请输入药房名称，长度在 20 个字符以内' },
          {
            max: 20,
            trigger: 'blur',
          },
        ],
        address: [
          { required: true, message: '请输入药房地址，长度在 100 个字符以内' },
          {
            max: 100,
          },
        ],
        deptList: [{ required: true, message: '请添加适用科室' }],
        telephone: [{ required: true, message: '请填写联系电话' }],
      },
      deptListAll: [],
      deptList: [],
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
        createTime: {
          minWidth: 180,
        },
        fixed: {
          minWidth: 60,
        },
        age: {
          hidden: true,
        },
        deptNum: {
          label: '适用科室',
          prop: 'slot_deptNum',
          minWidth: 120,
        },
        seq: {
          prop: 'slot_seq',
          minWidth: 140,
        },
        drugStoreState: {
          label: '状态',
          prop: 'slot_drugStoreState',
          minWidth: 100,
        },
        drugNum: {
          prop: 'slot_drugNum',
          minWidth: 120,
        },
        // deptNum: {
        //   minWidth: 120,
        // },
        sale: {
          minWidth: 120,
        },
        name: {
          minWidth: 100,
        },
        address: {
          minWidth: 100,
        },
        id: {
          minWidth: 100,
        },
      },
    }
  },
  async beforeRouteEnter(to, from, next) {
    ;[pre.role, pre.store, pre.title] = await Promise.all([
      roleChooseList({ showUser: true }),
      drugStoreChooseList(),
      titleChooseList(),
    ])
    next()
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [{ label: '创建时间', value: 0 }],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '药房名称', value: 0 },
              { label: '药房编码', value: 1 },
              { label: '药房地址', value: 2 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '启用药品',
              is: 'InputRange',
            },
            keys: ['drugNumStart', 'drugNumEnd'],
          },
          {
            props: {
              label: '适用科室',
              // isTree: true,
              treeProps: {
                children: 'next',
                label: 'name',
                value: 'id',
              },
              options: [
                { label: '不限', value: '' },
                ...this.deptList.map(_ => ({ label: _.name, value: _.id })),
              ],
            },
            keys: 'deptId',
            showName: 'deptName',
          },
          {
            props: {
              label: '状态',
              options: [
                { label: '不限', value: '' },
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
                { label: '停用', value: 2 },
              ],
            },
            keys: 'drugStoreState',
          },
        ],
      }
    },
  },
  created() {
    //获取科室列表
    this.getDeptList()
  },
  methods: {
    //获取科室列表
    async getDeptList() {
      this.deptList = await deptChooseList({ tree: false, type: 'WEB' })
      let res = await deptChooseList({ tree: true, type: 'WEB' }) //WEB是为了显示已禁用的科室 tree: true是为了获取所有层级的科室
      // let res = await deptOuterChooseList({ tree: true, type: 'WEB' }) //WEB是为了显示已禁用的科室 tree: true是为了获取所有层级的科室
      let deptlist = cloneDeep(res)
      //禁用一级选项
      deptlist.forEach(item => {
        item.next && (item.disabled = true)
      })
      //筛选出只有deptInner子级的科室(院内)
      // res = res.filter(item => item.next)
      this.deptListAll = res.map(val => {
        return Object.assign(val, { state: val.state ? false : true })
      })
    },
    //触发筛选函数
    handleFilter(data) {
      this.$refs.tree.filter(data)
    },
    //筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    //点击树节点
    handleNodeClick() {},
    //树节点选中时
    handleChcek() {
      //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
      const res = this.$refs.tree.getCheckedNodes(true, true)
      this.form.deptList = res.map(item => item.id)
      this.form.deptListName = res.map(item => item.name)
    },
    //移除tag
    removeTag(data) {
      let res = this.$refs.tree.getCheckedNodes(true, true)
      //删除tag移除项
      res.forEach((item, index) => {
        item.name === data && res.splice(index, 1)
      })
      this.form.deptList = res.map(item => item.id)
      //重新设置选中
      this.$refs.tree.setCheckedNodes(this.form.deptList)
    },
    //下载导入模板
    async download() {
      modularLexcel('药房导入模板.xlsx')
    },
    //排序编辑
    async confirm(e, id) {
      await sortPharmacy({
        seq: e,
        id: id,
      })
      this.$_fetchTableData(getPharmacyList)
      this.$message.success('操作成功!')
    },
    cancel() {},
    // 添加药房
    add(row) {
      this.isAdd = true
      if (row) {
        console.log('行', row)
        this.addkeshi = true
        this.form.id = row.id
        this.form.name = row.name
        this.form.state = row.drugStoreState == 1 ? true : false
        this.form.address = row.address
        this.form.deptList = row.deptList
        this.form.deptListName = row.deptInfo.map(item => item.name)
        this.form.telephone = row.telephone
      } else {
        this.addkeshi = ''
        this.form.id = ''
        this.form.name = ''
        this.form.syncCode = ''
        this.form.state = true
        this.form.address = ''
        this.form.deptList = []
        this.form.telephone = ''
      }
    },
    //清除验证
    opened() {
      this.$refs.ruleForm.clearValidate()
    },
    //关闭dialog清空数据
    closeDialog() {
      this.$refs.ruleForm.clearValidate()
      this.form.deptListName = []
      this.$refs.tree.setCheckedNodes([])
    },
    //启用药品
    drugs(row) {
      // this.$refs.drug.title = row.address
      this.$refs.drug.open(row)
    },
    tokeshi(row) {
      this.$router.push(`/organ/department?id=${row.id}`)
    },
    batch() {},
    // 保存提交
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // 有 id 编辑
          if (this.form.id) {
            await editPharmacy({
              ...this.form,
            })
          } else {
            // 无 id 添加
            await addPharmacy({
              ...this.form,
            })
          }
          this.$_fetchTableData(getPharmacyList)
          this.isAdd = false
          this.$message.success('操作成功!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改状态
    async stateChange(id, state, index) {
      this.tableData.list[index].drugStoreState = state ? 1 : false
      await setPharmacyState({
        id: id,
        state: state == 1 ? true : false,
      }).catch(err => {
        console.log(err)
        this.tableData.list[index].drugStoreState = state ? false : 1
        throw Error(err)
      })
      this.$message.success(state == 1 ? '药房启用成功!' : '药房禁用成功')
      this.$_fetchTableData(getPharmacyList)
    },
    //关闭弹窗
    handleClose(done) {
      done()
      this.importDialog.visible = false
    },
    // beforeRemove(file) {
    //   return this.$confirm(`确定删除 ${file.name}?`)
    // },
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
    httpRequest({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      this.fileData = formData
    },
    //批量导入替换上次的文件
    hanleChange(file, fileList) {
      this.importDialog.sonListS = [fileList[fileList.length - 1]]
    },
    handleSumit() {
      // pharmacyManagement(this.fileData).then(() => {
      //   this.$message.success('操作成功!')
      // })
      // this.importDialog.visible = false
      // this.importDialog.sonListS = []
      if (this.fileData) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        pharmacyManagement(this.fileData)
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
.text {
  color: #646464;
}
.active {
  color: #0ab2c1;
}
::v-deep .el-tree-node__content {
  height: 36px !important;
  font-size: 14px;
}
</style>
