<template>
  <div class="view__card" style="padding-top: 60px;">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="110px">
      <el-row>
        <el-col>
          <el-form-item label="标题" prop="title">
            <el-input
              class="input"
              placeholder="请输入"
              v-model="form.title"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="发布对象" prop="roles">
            <el-checkbox-group v-model="form.roles">
              <el-checkbox
                v-for="item in rolesList"
                :key="item.id"
                :label="item.id"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item
            label="科室范围"
            v-if="form.roles.indexOf('-1') > -1 && form.roles.length == 1"
          >
            <el-select
              class="input"
              v-model="form.depts"
              multiple
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="科室范围" prop="depts" v-else>
            <el-select
              class="input"
              v-model="form.depts"
              multiple
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="发布日期" prop="release">
            <el-radio-group v-model="form.release">
              <el-radio :label="1">立即发布</el-radio>
              <el-radio :label="2" style="margin-right: 10px;" prop="date1"
                >自定义发布时间
                <el-date-picker
                  v-model="form.releaseTime"
                  style="width: 175px; margin-right: 30px;"
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
  selDepartment,
  addAnn,
  editAnn,
  detailAnn,
} from '@/api/setup'
import MyUploadAdapter from '@/utils/MyUploadAdapter.js'
export default {
  data() {
    return {
      editor: ClassicEditor,
      // 角色身份
      rolesList: [],
      options: [],
      form: {
        title: '',
        roles: [],
        content: '',
        depts: [],
        releaseTime: '',
        release: 1,
        id: '',
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        },
      },
      rules: {
        roles: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个发布对象',
            trigger: 'change',
          },
        ],
        name: [
          { required: true, message: '请输入药品名称' },
          {
            min: 3,
            max: 25,
            message: '长度在 3 到 25 个字符',
            trigger: 'blur',
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
    this.form.announceId = this.$route.query.id
    this.getDetailInfo()
  },
  methods: {
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
    // 获取角色身份
    async getRoles() {
      let res = await chooseRoles({
        showUser: true,
      })
      console.log(res, '******')
      this.rolesList = res
    },
    // 获取科室
    async getDepartment() {
      let res = await selDepartment({
        showUser: true,
      })
      this.options = res
      console.log(this.options)
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
        this.form.depts = res.dept
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

        let rolesList = []
        for (let i = 0; i < res.role.length; i++) {
          rolesList.push(res.role[i].id)
        }
        this.form.roles = rolesList
        let deptList = []
        for (let i = 0; i < res.dept.length; i++) {
          deptList.push(res.dept[i].id)
        }
        this.form.depts = deptList
        console.log(this.form.roles)
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
</style>
