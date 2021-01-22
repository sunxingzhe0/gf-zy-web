<template>
  <div>
    <el-dialog
      title="使用药品"
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      @close="handleClose"
      width="90%"
    >
      <div class="includeDrug">
        <el-row>
          <el-col :span="18" class="Title">
            <div class="title">包含药品：{{ number }} 个</div>
            <div
              :class="item.state ? 'tag' : 'tag none'"
              v-for="(item, index) in type"
              :key="index"
              @click="handleChange(item)"
            >
              {{ item.name }}
            </div>
          </el-col>
          <el-col :span="6" class="searchBox">
            <el-input
              v-model="query.searchKeywords"
              placeholder="请输入药品名称"
              class="inputBox"
              size="mini"
            ></el-input>
            <el-button type="primary" @click="onSubmit" size="mini"
              >搜索</el-button
            >
          </el-col>
        </el-row>
      </div>
      <div class="list">
        <List v-model="query" :columns="columns" :tableData="tableData">
          <template v-slot:slot_status="{ row }">
            <span>{{ row.status ? '禁用' : '启用' }}</span>
          </template>
          <template v-slot:slot_retailPrice="{ row }">
            <span>￥{{ row.retailPrice }}</span>
          </template>
        </List>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import { getDrugList } from '@/api/drugs'

export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: getDrugList }])],
  data() {
    return {
      number: 0,
      title: '',
      isAdd: false,
      type: [],
      typeList: [],
      query: {
        pageSize: 10,
        currentNum: 1,
        mechanismId: this.$store.state.user.store.id,
        basicUnitId: '',
        regularUnitId: '',
        dosageUnitId: '',
        unitId: '',
        searchKeywords: '',
      },
      columns: {
        index: {
          hidden: true,
        },
        retailPrice: {
          prop: 'slot_retailPrice',
        },
        commonName: {
          minWidth: 120,
        },
        basicUnit: {
          minWidth: 120,
        },
        regularUnit: {
          minWidth: 120,
        },
        status: {
          prop: 'slot_status',
        },
        attr: {
          hidden: true,
        },
        seq: {
          hidden: true,
        },
        basicUnitText: {
          minWidth: 120,
        },
        regularUnitText: {
          minWidth: 120,
        },
      },
    }
  },
  computed: {},
  methods: {
    open(row) {
      let id = row.id
      this.number = row.number
      let names = row.type.split(',')
      for (let j = 0; j < names.length; j++) {
        let newType = {
          name: names[j],
          state: true,
        }
        this.type.push(newType)
      }

      this.typeList = row.typeList
      // for (let i = 0; i < row.typeList.length; i++) {
      //   switch (row.typeList[i]) {
      //     case 'BASIC_PACKAGING_UNIT':
      //       this.query.basicUnitId = id
      //       break
      //     case 'CONVENTIONAL_PACKAGING_UNIT':
      //       this.query.regularUnitId = id
      //       break
      //     case 'DOSAGE_UNIT':
      //       // this.query.dosageUnitId = id
      //       break
      //     case 'DEFAULT_UNIT':
      //       this.query.unitId = id
      //       break
      //   }
      // }
      this.query.searchUnitId = id
      this.isAdd = true
      this.query.currentNum = 1
      this.$_fetchTableData(getDrugList)
    },
    // 切换 tag 标签
    handleChange(item) {
      item.state = !item.state
      this.query.currentNum = 1
      this.$_fetchTableData(getDrugList)
    },
    // 关闭弹框
    handleClose() {
      this.type = []
    },
    // 搜索
    onSubmit() {
      this.query.currentNum = 1
      this.$_fetchTableData(getDrugList)
    },
  },
}
</script>
<style lang="scss" scoped>
.list {
  ::v-deep.c__list .table-wrap {
    max-height: 58vh;
  }
}

.includeDrug {
  padding: 0 10px 10px 10px;
  .Title {
    display: flex;
    align-items: center;
    font-size: 16px;
    .title {
      margin-right: 20px;
    }
    .tag {
      padding: 8px 8px;
      background: rgb(230, 247, 248);
      color: #0ab2c1;
      text-align: center;
      margin-right: 10px;
      border-radius: 3px;
      cursor: pointer;
    }
    .none {
      color: rgb(172, 172, 172);
      background: rgb(245, 245, 245);
    }
  }
}

.searchBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .inputBox {
    width: 70%;
  }
}
</style>
