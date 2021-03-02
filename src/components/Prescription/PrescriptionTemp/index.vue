<template>
  <el-dialog
    top="5vh"
    width="90%"
    title="处方模板"
    :visible.sync="show"
    class="prescription-temp"
  >
    <PrescriptionTemplate ref="pt" mode="IMPORT" v-if="show" />
    <el-row type="flex" justify="center" style="padding-top: 10px">
      <el-button size="small" @click="$emit('update:visible', false)">
        取消
      </el-button>
      <el-button size="small" type="primary" @click="importHandler">
        导入
      </el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { singleRpTemplate } from '@/api/template'
import PrescriptionTemplate from '@/views/template/Prescription'
import { DrugItem } from '../constant'
export default {
  components: {
    PrescriptionTemplate,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    show: {
      get() {
        return this.visible
      },
      set() {
        this.$emit('update:visible', false)
      },
    },
  },
  methods: {
    async importHandler() {
      const selectedList = this.$refs.pt?.tableData.multipleSelection
      if (selectedList.length) {
        const loading = this.$loading({
          lock: true,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        const rpList = await Promise.all(
          selectedList.map(item => {
            return singleRpTemplate({ id: item.id })
          }),
        )
        let drugs = rpList.map(item => item.rpDrugList).flat()
        drugs = drugs.map(item => Object.assign({}, DrugItem, item))
        this.$emit('confirmDrugs', drugs)
        loading.close()
      } else {
        this.$message.warning('请选择需要导入的处方模板')
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.prescription-temp ::v-deep {
  .el-dialog {
    height: 90vh;
    display: flex;
    overflow: hidden;
    margin-bottom: 5vh;
    flex-direction: column;
  }
  .el-dialog__body {
    flex: 1;
    display: flex;
    overflow: hidden;
    padding-top: 10px;
    flex-direction: column;
  }
  .view__template-prescription {
    flex: 1;
    overflow: auto;
  }
}
</style>
