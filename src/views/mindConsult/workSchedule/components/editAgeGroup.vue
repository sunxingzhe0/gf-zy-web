<template>
  <el-dialog
    title="变更号源类型"
    :visible.sync="isOpen"
    :close-on-click-modal="false"
    width="600px"
    @close="close()"
  >
    <div class="content-wrap">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="医生：">
          <span>{{ data ? data.userName || '-' : '-' }}</span>
        </el-form-item>
        <el-form-item label="班次：">
          <span>{{ setWorkSchedule(data) }}</span>
        </el-form-item>
        <el-form-item label="就诊人：" v-if="data && data.reservedVO">
          <span>{{
            `[${data.reservedVO.cardNo}] ${data.reservedVO.patientName} | ${
              data.reservedVO.sex == 0
                ? '女'
                : data.reservedVO.sex == 1
                ? '男'
                : '-'
            } | ${data.reservedVO.phone}`
          }}</span>
        </el-form-item>
        <el-form-item label="号源类型：" prop="ageGroup">
          <el-checkbox-group v-model="form.ageGroup">
            <el-checkbox label="1">儿童</el-checkbox>
            <el-checkbox label="2">青少年</el-checkbox>
            <el-checkbox label="3">成人</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitEdit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
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
      form: {
        ageGroup: [],
      },

      rules: {
        ageGroup: [
          { required: true, message: '请选择号源类型', trigger: 'change' },
        ],
      },
    }
  },
  computed: {
    isOpen: {
      get: function () {
        return this.show
      },
      set: function (val) {
        this.$emit('onClose')
      },
    },
  },
  watch: {
    data() {
      if (this.data) {
        this.form.ageGroup = this.data.ageGroup.split(',')
      }
    },
  },
  methods: {
    async submitEdit(data) {
      const params = {
        ageGroup: this.form.ageGroup.join(','),
        scheduleId: this.data.id,
        sex: this.data.sex,
        video: this.data.video,
      }
      await apiScheduleTemplate.editSchedule(params)
      this.$message.success('操作成功！')
      this.$emit('onClose', data)
    },
    close(data) {
      this.$emit('onClose', data)
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
  },
}
</script>
<style lang="scss" scoped></style>
