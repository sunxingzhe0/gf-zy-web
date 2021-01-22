<template>
  <div class="view__card">
    <el-tabs type="border-card">
      <el-tab-pane label="业务配置">
        <List v-model="query" :columns="columns" :tableData="tableData">
          <template v-slot:slot_marital>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>

          <template v-slot:slot_constellation>
            <div class="item" v-for="(item, index) in itemList" :key="index">
              {{ item }}
            </div>
          </template>
        </List>
      </el-tab-pane>
      <el-tab-pane label="操作日志">操作日志</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import { fetchList } from '@/api/list'
export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: fetchList }])],
  data() {
    return {
      query: {
        pageSize: 10,
        dateType: 0,
        searchType: 0,
      },
      options: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
        },
        {
          value: '选项3',
          label: '蚵仔煎',
        },
        {
          value: '选项4',
          label: '龙须面',
        },
        {
          value: '选项5',
          label: '北京烤鸭',
        },
      ],
      value: '',
      itemList: [
        '1.开启：系统会有低库存的预警',
        '2.关闭：系统不会对低库存的药品进行提醒',
      ],
    }
  },
  computed: {
    columns() {
      return {
        createTime: {
          hidden: true,
        },
        index: {
          hidden: true,
        },
        education: {
          hidden: true,
        },
        zodiac: {
          hidden: true,
        },
        blood: {
          hidden: true,
        },
        name: {
          hidden: true,
        },
        age: {
          hidden: true,
        },
        maritalType: {
          hidden: true,
        },
        phone: {
          hidden: true,
        },

        marital: {
          hidden: true,
        },
        state: {
          hidden: true,
        },
        nurseId: {
          hidden: true,
        },
        userName: {
          prop: 'slot_marital',
        },
        constellation: {
          prop: 'slot_constellation',
        },
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.view__card {
  padding: 0;
}
.el-tabs--border-card {
  box-shadow: none;
  border: 0;
}
::v-deep .el-table {
  border: 1px solid #dfe6ec;
}
</style>
