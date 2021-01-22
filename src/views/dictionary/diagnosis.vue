<template>
  <div class="view__card">
    <List
      alwaysShowBtn
      v-model="query"
      :filter="filter"
      :columns="columns"
      resetBtnText="重置"
      :tableData="tableData"
    >
    </List>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import { getDiagnosisList } from '@/api/dictionary'
export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: getDiagnosisList }])],
  data() {
    this.filter = {
      inline: [
        {
          props: {
            label: '诊断代码',
            is: 'el-input',
            noColon: true,
          },
          keys: 'dCode',
        },
        {
          props: {
            label: '诊断名称',
            is: 'el-input',
            noColon: true,
          },
          keys: 'dName',
        },
        {
          props: {
            label: '拼音编码',
            is: 'el-input',
            noColon: true,
          },
          keys: 'dPinyin',
        },
      ],
    }
    return {
      isAdd: false,
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        createDate: {
          minWidth: 180,
        },
        fixed: {
          minWidth: 100,
        },
      },
      options: [],
      form: {
        name: '',
        durgCode: '',
        specs: '',
        price: '',
        subjectCode: '',
        packSizes: '',
        chemicalName: '',
        medicalAttr: '',
        departmentRange: [],
        pharmacyRange: [],
      },
      rules: {
        durgCode: [{ required: true, message: '请输入药品代码' }],
        name: [{ required: true, message: '请输入药品名称' }],
        specs: [{ required: true, message: '请输入药品规格' }],
        price: [{ required: true, message: '请输入药品金额' }],
        commonName: [{ required: true, message: '请输入通用名' }],
        subjectCode: [{ required: true, message: '请输入管理科目码' }],
        packSizes: [{ required: true, message: '请输入包装规格' }],
        chemicalName: [{ required: true, message: '请输入化学名' }],
        medicalAttr: [{ required: true, message: '请输入医保属性' }],
        departmentRange: [{ required: true, message: '请选择适用科室' }],
        pharmacyRange: [{ required: true, message: '请选择适用药房' }],
      },
    }
  },
  methods: {
    add(row) {
      this.isAdd = true
      if (row) {
        this.form.id = row.id
      } else {
        this.form.id = ''
      }
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isAdd = false
          this.$message.success('操作成功!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
.view__card ::v-deep {
  .item-label.is-right {
    height: 32px;
    padding: 0 15px;
    margin-right: 0;
    color: #8c8c8c;
    line-height: 30px;
    border-radius: 4px;
    border-right: none;
    width: unset !important;
    border: 1px solid #dcdfe6;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .item-label.is-right + .el-input {
    .el-input__inner {
      border-left: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
