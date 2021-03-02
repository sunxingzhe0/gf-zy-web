<template>
  <div class="drugs-list">
    <div class="drugs-list-header">药品清单</div>
    <div class="drugs-list-body">
      <PrescriptionItem
        ref="refItem"
        scene="drugList"
        :prescription="prescription"
      >
      </PrescriptionItem>
    </div>
    <div class="drugs-list-footer">
      <el-button size="mini" @click="cancel" style="margin-right: 40px">
        取消
      </el-button>
      <el-button size="mini" type="primary" @click="confirm"> 确认 </el-button>
    </div>
  </div>
</template>
<script>
import PrescriptionItem from '../PrescriptionItem'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    drugs: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    PrescriptionItem,
  },
  data() {
    return {
      prescription: {},
    }
  },
  methods: {
    cancel() {
      this.$emit('close', [])
    },
    confirm() {
      const err = this.$refs.refItem.validate(undefined)
      if (err) return this.$message.error('您还有药品信息未完善！')
      this.$emit('close', this.$refs.refItem.tableData)
    },
  },
  watch: {
    drugs: {
      handler(val) {
        const drugs = val.map(item => {
          item.price = ''
          item.totalPrice = ''
          item.receivePharmacy = ''
          item.receivePharmacyId = ''
          return item
        })
        this.prescription = {
          rpDrugList: drugs,
          status: 'DRAFT',
        }
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>
<style lang="scss" scoped>
.drugs-list {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #fff;
  z-index: 1;
}
.drugs-list-body {
  flex: 1;
  overflow: auto;
  & ::v-deep {
    .prescription-item {
      min-width: 1200px;
    }
  }
}
.drugs-list-footer {
  display: flex;
  margin-top: 20px;
  justify-content: center;
}
</style>
