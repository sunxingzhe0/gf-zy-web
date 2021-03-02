<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="diagnosisType" label="类别" width="120">
      <template slot-scope="{ row }">
        {{
          row.diagnosisType === 'WEST_MEDICINE'
            ? '西医'
            : row.diagnosisType === 'CH_MEDICINE_CARD'
            ? '中医证型'
            : row.diagnosisType === 'CH_MEDICINE_NAME'
            ? '中医病名'
            : ''
        }}
      </template>
    </el-table-column>
    <el-table-column prop="diagnosisName" label="诊断/病名">
      <template slot-scope="{ row }">
        {{ row.prefixName ? '(' + row.prefixName + ')' : '' }}
        {{ row.diagnosisName }}
        {{ row.suffixName ? '(' + row.suffixName + ')' : '' }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { findDiagByDiagId } from '@/api/business'
export default {
  name: 'DIAS',
  props: {
    viewMessageDialogData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tableData: [],
    }
  },
  watch: {
    viewMessageDialogData: {
      handler() {
        this.getData()
      },
      deep: true,
    },
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      if (this.viewMessageDialogData) {
        const diagId = JSON.parse(this.viewMessageDialogData.body).content
        const data = await findDiagByDiagId({
          diagId,
        })
        this.tableData = data.map(item => [item, ...item.childDtos]).flat()
      }
    },
  },
}
</script>

<style scoped></style>
