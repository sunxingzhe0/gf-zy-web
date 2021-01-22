<template>
  <div>
    <List v-model="query" :columns="columns" :table-data="tableData">
      <template v-slot:slot_title="{ row }">
        <el-button v-if="row.children" type="text" size="mini">{{
          row.address
        }}</el-button>
        <span v-else>{{ row.address }}</span>
      </template>
      <template v-slot:slot_state="{ row }">
        <el-switch
          :value="row.state"
          @change="val => onChangeState(val, row)"
        />
      </template>
      <template v-slot:slot_recommend="{ row }">
        <el-switch
          :value="row.recommend"
          @change="val => onChangeRecommen(val, row)"
        />
      </template>
      <template v-if="!ishc2v1 == 'hc2v1'" v-slot:footertool>
        <el-button size="mini" type="primary" @click="add()">
          新增科室
        </el-button>
        <el-button size="mini" plain type="primary" @click="batch">
          批量导入
        </el-button>
      </template>
      <template v-slot:slot_sonDeptNum="{ row }">
        <el-button type="text">{{ row.sonDeptNum }}</el-button>
      </template>
      <template v-slot:slot_doctorNum="{ row }">
        <el-button
          v-if="row.doctorNum != 0"
          type="text"
          @click="show(row.id)"
          >{{ row.doctorNum }}</el-button
        >
        <span v-else>{{ row.doctorNum }}</span>
      </template>
    </List>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import {
  changeOrder,
  getDepList,
  insertDept,
  getParentDept,
  editDept,
  changeState,
  changeRecommned,
} from '@/api/zyapi/organization'
import { uploadFile } from '@/api/index'
export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: getDepList }])],
  props: {
    deptId: {
      type: String,
      default: '',
    },
  },
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
            { label: '科室名称', value: 0 },
            { label: '科室编码', value: 1 },
            { label: '科室简介', value: 2 },
          ],
        },
        keys: ['searchType', 'searchKeywords'],
      },
      // popover: [
      //   {
      //     props: {
      //       label: '科室等级',
      //       options: [
      //         { label: '不限', value: '' },
      //         { label: '一级', value: 1 },
      //         { label: '二级', value: 2 },
      //       ],
      //     },
      //     keys: 'deptLevel',
      //   },
      //   {
      //     props: {
      //       label: '子科室',
      //       is: 'InputRange',
      //     },
      //     keys: ['sonDeptNumStart', 'sonDeptNumEnd'],
      //   },
      //   {
      //     props: {
      //       label: '是否推荐',
      //       options: [
      //         { label: '不限', value: '' },
      //         { label: '是', value: true },
      //         { label: '否', value: false },
      //       ],
      //     },
      //     keys: 'recommend',
      //   },
      //   {
      //     props: {
      //       label: '科室医生',
      //       is: 'InputRange',
      //     },
      //     keys: ['doctorNumStart', 'doctorNumEnd'],
      //   },

      //   {
      //     props: {
      //       label: '状态',
      //       options: [
      //         { label: '不限', value: '' },
      //         { label: '启用', value: 1 },
      //         { label: '停用', value: 2 },
      //       ],
      //     },
      //     keys: 'state',
      //   },
      // ],
    }
    return {
      ishc2v1: process.env.VUE_APP_APIV,
      isAdd: false,
      form: {
        name: '',
        intro: '',
        appoNotice: '',
        pid: '',
        pics: [''],
        recommend: true,
        state: true,
      },
      rules: {
        name: [{ required: true, message: '请输入科室名称' }],
      },
      options: [
        {
          value: '1',
          label: '内科',
        },
        {
          value: '2',
          label: '外科',
        },
      ],
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
        pid: this.deptId,
        deptLevel: 2,
      },
      columns: {
        index: {
          hidden: true,
        },
        createTime: {
          minWidth: 160,
        },
        doctorNum: {
          minWidth: 100,
          prop: 'slot_doctorNum',
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
      },
      isSonDept: false,
    }
  },
  created() {
    getParentDept().then(res => (this.options = res))
  },
  methods: {
    confirm(val, row) {
      changeOrder({
        id: row.id,
        seq: val,
      }).then(() => {
        this.$_fetchTableData()
      })
    },
    changeDirection(type, row) {
      changeOrder({
        id: row.id,
        direct: type === 'UP',
      }).then(() => {
        this.$_fetchTableData()
      })
    },
    cancel() {},
    add(row) {
      this.isAdd = true
      if (row) {
        row.pics = row.picList
        this.form = { ...row }
      }
    },
    handleImageSuccess(res) {
      this.form.pics = [res]
    },
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isWEBP = file.type === 'image/webp'

      const isLt2M = file.size / 1024 / 720 < 2
      if (!isJPG && !isPNG && !isGIF && !isWEBP) {
        this.$message.error('上传头像图片只能是 JPG PNG GIF WEBP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 720KB!')
      }
      return (isJPG || isPNG || isGIF || isWEBP) && isLt2M
    },
    httpRequest({ file, onProgress, onSuccess, onError }) {
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData, onProgress).then(onSuccess).catch(onError)
    },
    batch() {},
    onChangeState(val, row) {
      changeState({
        id: row.id,
        state: val,
      }).then(() => (row.state = val))
    },
    onChangeRecommen(val, row) {
      changeRecommned({
        id: row.id,
        state: val,
      }).then(() => (row.recommend = val))
    },
    submit() {
      this.$refs.deptForm.validate(valid => {
        if (valid) {
          const func = this.form.id ? editDept : insertDept
          func(this.form).then(() => {
            this.isAdd = false
            this.$message.success('操作成功!')
            this.$_fetchTableData()
            this.$refs.form.resetFields()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 科室医生
    show(id) {
      this.$router.push({
        path: '/jurisdiction/account/list',
        query: {
          deptId: id,
        },
      })
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-upload {
  height: 90px;
  width: 90px;
  border: 1px dashed #cacaca;
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-form-item {
  margin-bottom: 15px;
}
</style>
