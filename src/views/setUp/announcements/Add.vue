<template>
  <div class="view__card" style="padding-top: 60px">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="110px">
      <el-row>
        <el-col>
          <el-form-item label="标题" prop="title">
            <el-input
              class="input"
              placeholder="请输入"
              v-model="form.title"
              maxlength="25"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="发布对象" prop="type">
            <div style="display: flex">
              <el-select v-model="form.type" @change="typeChange">
                <el-option label="角色" :value="0"></el-option>
                <el-option label="机构" :value="1"></el-option>
                <!-- <el-option label="药房" :value="2"></el-option> -->
              </el-select>
              <!--角色-->
              <div v-if="form.type == 0">
                <el-select
                  v-model="form.roles"
                  multiple
                  filterable
                  collapse-tags
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in rolesList"
                    :label="item.name"
                    :value="item.id"
                    :key="item.id"
                  ></el-option>
                </el-select>
              </div>

              <!--科室-->
              <div v-if="form.type == 0">
                <el-select
                  v-model="form.deptNames"
                  style="width: 240px"
                  multiple
                  filterable
                  :filter-method="handleFilter"
                  @remove-tag="removeTag"
                  placeholder="请选择"
                >
                  <el-option style="height: auto; padding: 0">
                    <el-tree
                      :data="options"
                      :props="defaultProps"
                      show-checkbox
                      ref="tree"
                      node-key="id"
                      default-expand-all
                      @node-click="handleNodeClick"
                      highlight-current
                      current-node-key="node"
                      :default-checked-keys="form.depts"
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

              <!--机构-->
              <div v-if="form.type == 1">
                <el-select
                  v-model="form.organizes"
                  style="width: 220px"
                  multiple
                  filterable
                  collapse-tags
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in orgList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>

              <!--药房-->
              <div v-if="form.type == 2">
                <el-select
                  v-model="form.organizes"
                  style="width: 220px"
                  multiple
                  filterable
                  collapse-tags
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in drugStoreList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="发布日期" prop="release">
            <el-radio-group v-model="form.release">
              <el-radio :label="1">立即发布</el-radio>
              <el-radio :label="2" style="margin-right: 10px" prop="date1"
                >自定义发布时间
                <el-date-picker
                  v-model="form.releaseTime"
                  style="width: 175px; margin-right: 30px"
                  size="mini"
                  type="datetime"
                  placeholder="选择时间"
                  value-format="yyyyMMddHHmmss"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-radio>
              <el-radio :label="3">待发布</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="内容" prop="content">
            <div class="editor">
              <ckeditor
                :editor="editor"
                v-model="form.content"
                :config="{ language: 'zh-cn' }"
                @ready="onReady"
              ></ckeditor>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="pageBack">返回</el-button>
        <el-button type="primary" @click="submit">{{
          form.announceId ? '保存' : '提交'
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn'
import {
  chooseRoles,
  selectOrgs,
  selectDrugstores,
  addAnn,
  editAnn,
  detailAnn,
} from '@/api/setup'
import { deptOuterChooseList } from '@/api'
import MyUploadAdapter from '@/utils/MyUploadAdapter.js'
export default {
  data() {
    let isvalidate = (rule, value, callback) => {
      if (value === 0 && this.form.roles.length < 1) {
        callback(new Error('请至少选择一个发布对象'))
      } else if (
        value === 0 &&
        !(this.form.roles.indexOf('-1') > -1 && this.form.roles.length == 1) &&
        this.form.depts < 1
      ) {
        callback(new Error('请选择科室'))
      } else if ((value == 1 || value == 2) && this.form.organizes.length < 1) {
        callback(new Error('请至少选择一个发布对象'))
      } else {
        callback()
      }
    }
    return {
      deptsList: [],
      defaultProps: {
        children: 'next',
        label: 'name',
      },
      editor: ClassicEditor,
      // 角色身份
      rolesList: [],
      options: [],
      orgList: [],
      drugStoreList: [],
      form: {
        title: '',
        roles: [],
        content: '',
        depts: [],
        organizes: [],
        releaseTime: '',
        release: 1,
        id: '',
        type: 0,
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        },
      },
      rules: {
        type: [
          {
            required: true,
            trigger: 'change',
            validator: isvalidate,
          },
        ],
        name: [
          { required: true, message: '请输入药品名称' },
          {
            min: 3,
            max: 25,
            message: '长度在 3 到 25 个字符',
          },
        ],
        title: [{ required: true, message: '请输入标题' }],
        depts: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动科室',
            trigger: 'change',
          },
        ],
        release: [
          { required: true, message: '请选择发布时间', trigger: 'change' },
        ],
        content: [{ required: true, message: '请输入内容' }],
        date1: [
          {
            type: 'datetime',
            required: true,
            message: '请选择日期',
            trigger: 'change',
          },
        ],
      },
    }
  },
  created() {
    this.getRoles()
    this.getDepartment()
    this.getselectOrgs()
    this.getselectDrugstores()
    this.form.announceId = this.$route.query.id
    //清除验证
    this.$nextTick(() => {
      this.getDetailInfo()
      this.$refs.ruleForm.clearValidate()
    })
  },
  methods: {
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

      this.form.depts = res.map(item => item.id)
      this.form.deptNames = res.map(item => item.name)
    },
    //移除tag
    removeTag(data) {
      let res = this.$refs.tree.getCheckedNodes(true, true)
      //删除tag移除项
      res.forEach((item, index) => {
        item.name === data && res.splice(index, 1)
      })
      this.form.depts = res.map(item => item.id)
      //重新设置选中
      this.$refs.tree.setCheckedNodes(this.form.depts)
    },
    // 提交
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          if (this.form.announceId) {
            this.form.release = this.form.release == '1' ? true : false
            await editAnn({
              ...this.form,
            })
            this.$router.back(-1)
            this.$message.success('操作成功!')
          } else {
            if (this.form.release == '2' && this.form.releaseTime == '') {
              this.$message.error('请选择预约发布时间!')
            } else {
              this.form.release = this.form.release == '1' ? true : false
              await addAnn({
                ...this.form,
              })
              this.$router.back(-1)
              this.$message.success('操作成功!')
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //返回上一页
    pageBack() {
      this.$router.back(-1)
    },
    // 角色切换
    typeChange() {
      this.form.roles = []
      this.form.depts = []
      this.form.organizes = []
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    // 获取角色身份
    async getRoles() {
      let res = await chooseRoles({
        showUser: true,
      })
      this.rolesList = [{ name: '患者', id: '-1' }, ...res]
    },
    // 获取科室
    async getDepartment() {
      let res = await deptOuterChooseList({
        tree: true,
      })
      res.forEach(item => {
        item.next && (item.disabled = true)
      })
      this.options = res
    },
    // 获取机构
    async getselectOrgs() {
      this.orgList = await selectOrgs()
    },
    // 获取药房
    async getselectDrugstores() {
      this.drugStoreList = await selectDrugstores()
    },
    // 自定义图片上传
    onReady(editor) {
      // Insert the toolbar before the editable area.
      editor.ui
        .getEditableElement()
        .parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement(),
        )
      // 自定义上传图片插件
      editor.plugins.get('FileRepository').createUploadAdapter = loader => {
        return new MyUploadAdapter(loader)
      }
    },
    // 获取详情
    async getDetailInfo() {
      if (this.$route.query.id) {
        const res = await detailAnn({
          announceId: this.form.announceId,
        })
        this.form.title = res.title
        // this.form.depts = res.deptRel.split(',')
        //设置选中科室
        this.$refs.tree.setCheckedKeys(res.deptRel.split(','))

        const names = this.options
          .filter(val => {
            return res.deptRel.split(',').includes(val.id)
          })
          .map(i => i.name)
        console.log(names, '名称合集------')
        this.form.deptNames = names

        this.$set(this.form, 'deptNames', ['互联网科室1'])
        this.form.content = res.content

        if (res.releaseTime) {
          let newTime = res.releaseTime
          newTime = newTime.replace(' ', '').replace(/-/g, '').replace(/:/g, '')
          console.log(newTime)
          this.form.releaseTime = newTime
        }

        if (res.releaseState) {
          this.form.release = 1
        } else {
          if (res.releaseTime) {
            this.form.release = 2
          } else {
            this.form.release = 3
          }
        }
        if (res.org?.length > 0) {
          this.form.type = 1
          this.form.organizes = res.org.map(item => item.id)
        }
        if (res.role?.length > 0) {
          this.form.type = 0
          this.form.roles = res.role.map(item => item.id)
        }
        if (res.drugStore?.length > 0) {
          this.form.type = 2
          this.form.organizes = res.drugStore.map(item => item.id)
        }
        // this.form.depts = res.dept.map(item => item.id)
        // this.form.deptNames = res.dept.map(item => item.name)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.editor {
  ::v-deep.ck-content {
    min-height: 300px;
  }
}
.input {
  width: 400px;
}
::v-deep .el-tree-node__content {
  height: 36px !important;
  font-size: 14px;
}
</style>
