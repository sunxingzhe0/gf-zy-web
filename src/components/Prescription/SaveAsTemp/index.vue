<template>
  <el-form class="save-as-temp" label-position="right" label-width="80px">
    <el-form-item label="模板名称" class="show-require">
      <el-input v-model="value.name" maxlength="20" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="病种">
      <el-select
        remote
        filterable
        v-model="value.icdId"
        @change="changeHandler"
        placeholder="请输入关键字搜索"
        :remote-method="loadDiagnosis"
      >
        <el-option
          v-for="item in options"
          :label="item.diagnosisName"
          :value="item.id"
          :key="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="描述">
      <el-input
        type="textarea"
        v-model="value.remark"
        maxlength="100"
        show-word-limit
      ></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import { diagnosisKeywordSearch } from '@/api/business'

// 设为模板的参数
export const TempParams = {
  name: '',
  icdId: '',
  remark: '',
  icdName: '',
}

export default {
  props: {
    value: {
      type: Object,
      default: () => ({ ...TempParams }),
    },
  },
  data() {
    return {
      options: [],
    }
  },
  methods: {
    // 加载诊断列表
    async loadDiagnosis(keyword) {
      if (!keyword) return (this.options = [])
      const res = await diagnosisKeywordSearch({
        searchKeywords: keyword,
        currentNum: 1,
        pageSize: 99,
      })
      this.options = res.list
    },
    changeHandler(id) {
      const item = this.options.find(item => item.id === id)
      this.$emit('input', { ...this.value, icdName: item.diagnosisName })
    },
  },
}
</script>
<style lang="scss" scoped>
.save-as-temp ::v-deep {
  .el-input {
    width: 240px;
  }
  .el-textarea {
    width: 480px;
  }
  .show-require label::before {
    color: red;
    content: '*';
    margin-right: 5px;
  }
}
</style>
