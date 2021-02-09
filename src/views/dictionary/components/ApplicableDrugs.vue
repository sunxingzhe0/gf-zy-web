<template>
  <div>
    <el-dialog
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      width="80%"
      :title="`计量单位：${info.unitName}`"
    >
      <div class="includeDrug">
        <el-row>
          <el-col :span="18" class="Title">
            <span class="title">包含药品：{{ number }} 个</span>
            <template v-for="(item, index) in typeList">
              <el-tag
                v-if="type.indexOf(item.value) > -1"
                size="mini"
                style="margin-right: 10px;"
                :key="index"
                :type="selectType.indexOf(item.value) > -1 ? '' : 'info'"
                @click="typeTap(item)"
                >{{ item.label }}</el-tag
              >
            </template>
          </el-col>
          <el-col :span="6" class="searchBox">
            <el-input
              v-model="query.name"
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
        <List
          v-model="query"
          :columns="columns"
          :tableData="tableData"
          :filter="filter"
        >
        </List>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import { getDrugsList } from '@/api/dictionary'
import { deepClone } from '@/utils/index'
export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: getDrugsList }])],
  data() {
    return {
      title: '',
      isAdd: false,
      id: '',
      number: 0,
      type: [],
      info: {},
      selectType: [],
      typeList: [
        { label: '基本包装单位', value: 'BASIC_PACKAGING_UNIT' },
        { label: '常规包装单位', value: 'CONVENTIONAL_PACKAGING_UNIT' },
        { label: '剂量单位', value: 'DOSAGE_UNIT' },
      ],
      query: {
        pageSize: 10,
        currentNum: 1,
        name: '',
      },
      columns: {
        index: {
          hidden: true,
        },
        drugPharmacyList: {
          hidden: true,
        },
        split: {
          hidden: true,
        },
        seq: {
          hidden: true,
        },
        price: {
          formatter(row) {
            return '￥' + row.price
          },
        },
        status: {
          formatter(row) {
            return row.status ? '禁用' : '启用'
          },
        },
        attr: {
          hidden: true,
        },
        name: {
          minWidth: 110,
        },
        commonName: {
          minWidth: 120,
        },
        manageCodeText: {
          minWidth: 110,
        },
        regularPackVolume: {
          minWidth: 120,
        },
        chemicalName: {
          minWidth: 120,
        },
        healthAttrText: {
          minWidth: 110,
        },
        deptNames: {
          minWidth: 140,
        },
        pharmacyNames: {
          minWidth: 140,
        },
        basicUnitText: {
          minWidth: 120,
        },
        regularUnitText: {
          minWidth: 120,
        },
      },
      filter: {
        search: {
          // props: {},
          // keys: ['searchType', 'searchKeywords'],
        },
      },
    }
  },

  methods: {
    open(row) {
      console.log(row)
      this.number = row.number
      this.query.mechanismId = this.$store.state.user.YF
      this.query.del = false
      this.id = row.id
      this.type = row.typeList
      this.selectType = deepClone(row.typeList)
      this.info = row
      this.isAdd = true
      this.typeSearch()
    },
    //选择单位类型
    typeTap(item) {
      if (this.selectType.indexOf(item.value) > -1) {
        this.selectType.splice(this.selectType.indexOf(item.value), 1)
      } else {
        this.selectType.push(item.value)
      }
      this.typeSearch()
    },
    typeSearch() {
      if (this.selectType.indexOf('BASIC_PACKAGING_UNIT') > -1) {
        this.query.basicUnitId = this.id
      } else {
        this.query.basicUnitId = null
      }
      if (this.selectType.indexOf('CONVENTIONAL_PACKAGING_UNIT') > -1) {
        this.query.regularUnitId = this.id
      } else {
        this.query.regularUnitId = null
      }
      if (this.selectType.indexOf('DOSAGE_UNIT') > -1) {
        this.query.dosageUnitId = this.id
      } else {
        this.query.dosageUnitId = null
      }
      if (this.selectType.length == 0) {
        this.query.searchUnitId = this.id
      } else {
        this.query.searchUnitId = null
      }
      this.query.currentNum = 1
      this.$_fetchTableData(getDrugsList)
    },
    // 搜索
    onSubmit() {
      console.log(1111)
      this.query.currentNum = 1
      this.$_fetchTableData(getDrugsList)
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
