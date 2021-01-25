<template>
  <div>
    <el-dialog
      :title="'产地名称：' + title"
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      width="90%"
    >
      <div class="includeDrug">
        <el-row>
          <el-col :span="18" class="Title">
            <div class="title">包含药品：{{ number }}个</div>
          </el-col>
          <el-col :span="6" class="searchBox">
            <el-input
              v-model="query.searchKeywords"
              placeholder="请输入内容"
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
        <List v-model="query" :columns="columns" :tableData="tableData"> </List>
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
        // mechanismId: this.$store.state.user.titleId,
        mechanismId: this.$store.state.user.store.id,
        originId: '',
        // orgUnitId: "",
        // basicUnitId: '',
        // regularUnitId: '',
        // dosageUnitId: '',
        // unitId: '',
        searchKeywords: '',
      },
      columns: {
        index: {
          hidden: true,
        },
        basicUnitText: {
          minWidth: 120,
        },
        regularUnitText: {
          minWidth: 120,
        },
        split: {
          hidden: true,
        },
        attr: {
          hidden: true,
        },
        status: {
          formatter(row) {
            return row.status ? '禁用' : '启用'
          },
        },
        //排序
        seq: {
          hidden: true,
        },
      },
    }
  },

  methods: {
    open(row) {
      this.number = row.number
      this.query.originId = row.id
      this.title = row.originName
      this.isAdd = true
      this.$_fetchTableData(getDrugList)
    },
    // 搜索
    onSubmit() {
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
