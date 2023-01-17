<template>
  <el-dialog
    title="替班"
    :visible.sync="innerVisible"
    :close-on-click-modal="false"
    width="600px"
    @close="close()"
  >
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="医生：">
        <span>{{ data ? data.userName || '-' : '-' }}</span>
      </el-form-item>
      <el-form-item label="班次：">
        <span>{{ setWorkSchedule(data) }}</span>
      </el-form-item>
      <el-form-item label="就诊人：">
        <span> {{ setPatientInfo(data) }} </span>
      </el-form-item>
      <el-form-item label="替班医生：" prop="doctor">
        <el-cascader
          :props="props"
          placeholder="请选择"
          v-model="form.doctor"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="替班原因：" prop="replaceRemark">
        <el-input
          v-model="form.replaceRemark"
          type="textarea"
          placeholder="请输入"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer is-center">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { deptXzChooseList } from '@/api/index'
import apiScheduleTemplate from '@/api/mindConsult/scheduleTemplate'
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
      props: {
        //checkStrictly: true,// 父子节点是否互相关联,其余配置见官网
        lazy: true,
        lazyLoad: this.lazyLoad,
      },
      deptList: [],
      form: {
        id: '',
        doctor: '',
        replaceRemark: '',
      },
      rules: {
        replaceRemark: [
          { required: true, message: '请输入停诊原因', trigger: 'blur' },
        ],
        // doctor: [{ required: true, message: '请选择医生', trigger: 'blur' }],
      },
    }
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
  created() {
    this.getDeptList()
  },
  methods: {
    close(data) {
      this.$refs.ruleForm.resetFields()
      this.$emit('onClose', data)
    },
    lazyLoad(node, resolve) {
      setTimeout(() => {
        this.getDoctor(node, resolve)
      }, 50)
    },
    getDoctor(node, resolve) {
      // 第一级
      // this.hospitalData 是提前接口获取的一级下拉框
      if (node.level == 0) {
        resolve(this.deptList)
      }
      // 第二级
      if (node.level == 1) {
        let data = {
          deptId: node.data.value,
        }
        apiScheduleTemplate.accountChooseList(data).then(res => {
          // console.log(res)
          const nodes = res.map(item => ({
            value: item.id,
            label: item.name,
            leaf: node.level >= 1, // 节点数,我的只有二级,设置之后点击二级不再出现加载圈
          }))
          resolve(nodes)
        })
      }
    },
    async getDeptList() {
      let res = await deptXzChooseList()
      let list = res.map(item => {
        return {
          ...item,
          value: item.id,
          label: item.showName,
        }
      })
      this.deptList = list
    },
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          await apiScheduleTemplate.replaceInquiry({
            id: this.data.id,
            replaceDeptId: this.form.doctor[0],
            replaceUserId: this.form.doctor[1],
            replaceRemark: this.form.replaceRemark,
          })
          this.close(true)
          this.$message.success('操作成功!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //设置 班次｜工作日程
    setWorkSchedule(data) {
      if (!data) return '-'
      let itemName = data.itemName || '-'
      let date = data.scheduleDate || '-'
      let time = data.startTime + '-' + data.endTime
      let price = `¥ ${data.price || 0}`
      return `${itemName} ｜ ${date} ${time} ｜ ${price}`
    },
    //设置 就诊人信息
    setPatientInfo(data) {
      if (!data) return '-'
      if (!data.reservedVO) return '-'
      let cardNo = data.reservedVO.cardNo || '-'
      let name = data.reservedVO.patientName || '-'
      let sex =
        data.reservedVO.sex === 1
          ? '男'
          : data.reservedVO.sex === 0
          ? '女'
          : '-'
      let phone = data.reservedVO.phone || '-'
      return `【${cardNo}】 ${name} ｜ ${sex} ｜ ${phone}`
    },
  },
}
</script>
