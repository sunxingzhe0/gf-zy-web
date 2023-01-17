<template>
  <section class="view__card view__statistics-comment">
    <el-row>
      <el-col :md="18">
        <el-date-picker
          style="margin-right: 10px"
          type="daterange"
          :clearable="false"
          :picker-options="pickerOptions"
          value-format="yyyyMMdd"
          v-model="date"
          @change="handleDatePickerChange"
        ></el-date-picker>

        <el-button
          v-for="_ in [7, 30, 90]"
          :key="_"
          :type="active === _ ? 'primary' : ''"
          @click="changeDate(_)"
        >
          {{ _ === 7 ? '最近7天' : `最近${_}天` }}
        </el-button>
      </el-col>
      <el-col :md="4" class="is-right">
        <el-button type="primary" @click="eexportList">导出数据</el-button>
        <!-- <el-button
          type="info"
          style="border-color: #f4f4f5"
          plain
          @click="refResh"
          >刷新</el-button
        > -->
      </el-col>
    </el-row>
    <el-table
      border
      :data="tableData"
      :header-row-style="{ color: '#666', fontWeight: 'bold' }"
      style="width: 100%; margin-top: 15px"
    >
      <el-table-column type="index" label="序号" width="100"> </el-table-column>
      <el-table-column prop="typeName" label="指标名称"> </el-table-column>
      <el-table-column prop="nums" label="数量"> </el-table-column>
      <el-table-column prop="unit" label="计量单位"> </el-table-column>
      <el-table-column prop="descInfo" label="上传说明"> </el-table-column>
    </el-table>
  </section>
</template>

<script>
import { isEqual } from 'lodash'
import { formatDate } from '@/utils'
import { bizCountJGPT, exportBizCountJGPT } from '@/api/statistics'
export default {
  data() {
    this.pickerOptions = {
      shortcuts: [
        {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          },
        },
        {
          text: '最近30天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
            picker.$emit('pick', [start, end])
          },
        },
        {
          text: '最近90天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          },
        },
      ],
    }
    return {
      active: 7,
      date: [
        formatDate(
          new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 6),
          'yyyyMMdd',
        ),
        formatDate(new Date(), 'yyyyMMdd'),
      ],
      tableData: [],
    }
  },
  created() {
    this.getbizCountJGPT()
  },
  methods: {
    //获取业务统计列表数据
    async getbizCountJGPT() {
      this.tableData = await bizCountJGPT({
        beginTime: this.date[0] + '000000',
        endTime: this.date[1] + '235959',
      })
    },
    //导出业务统计列表数据
    async eexportList() {
      await exportBizCountJGPT({
        beginTime: this.date[0] + '000000',
        endTime: this.date[1] + '235959',
      })
    },
    handleDatePickerChange(val) {
      this.pickerOptions.shortcuts.some(({ text, onClick }) => {
        let dates = null
        onClick({
          $emit: (name, values) => {
            dates = values.map(_ => formatDate(_, 'yyyyMMdd'))
          },
        })

        if (isEqual(dates, val)) {
          this.active = { 最近一周: 7, 最近30天: 30, 最近90天: 90 }[text]
          return true
        }
        this.active = 0 //时间选中 就把最近一天 一周 一个月 清除
        return false
      })
      this.getbizCountJGPT()
    },
    changeDate(days) {
      this.active = days
      switch (days) {
        case 7:
          this.pickerOptions.shortcuts[0].onClick({
            $emit: (name, values) =>
              (this.date = values.map(_ => formatDate(_, 'yyyyMMdd'))),
          })
          break
        case 30:
          this.pickerOptions.shortcuts[1].onClick({
            $emit: (name, values) =>
              (this.date = values.map(_ => formatDate(_, 'yyyyMMdd'))),
          })
          break
        case 90:
          this.pickerOptions.shortcuts[2].onClick({
            $emit: (name, values) =>
              (this.date = values.map(_ => formatDate(_, 'yyyyMMdd'))),
          })
          break
      }
      this.getbizCountJGPT()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_modules-detail.scss';
v-deep .headerClass {
  color: #666 !important;
  font-weight: bold !important;
  font-size: 14px !important;
}
</style>
