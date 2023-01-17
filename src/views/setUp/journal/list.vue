<template>
  <div class="view__card" v-loading="loading">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      :tableClass="`journal-table ${scope != 'YF' ? 'hideBtn' : ''}`"
    >
    </List>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import { getLogList } from '@/api/setup'
import { drugStoreChooseList } from '@/api/index'
import listIndex from './listIndex.js'
export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: getLogList }])],
  props: {
    scope: {
      type: String,
    },
  },
  data() {
    this.filter = {
      date: {
        props: {
          options: [{ label: '操作时间', value: 0 }],
        },
        keys: ['timeType', 'startTime', 'endTime'],
      },
      search: {
        props: {
          options: [
            { label: '操作内容', value: 0 },
            { label: '操作人', value: 1 },
          ],
        },
        keys: ['searchType', 'searchKeywords'],
      },
      popover: [
        {
          props: {
            label: '所属模块',
            options: listIndex(this.scope),
          },
          keys: 'logTypes',
        },
        {
          props: {
            label: '所属药房',
            options: [{ label: '不限', value: '' }],
          },
          keys: 'storeId',
        },
      ],
    }
    return {
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
        type: this.scope == 'JG' ? 2 : this.scope == 'YF' ? 1 : 0,
      },
      columns: {
        index: {
          hidden: true,
        },
        content: {
          minWidth: 300,
        },
        createTime: {
          minWidth: 160,
        },
        storeName: {
          hidden: this.scope == 'YF' ? false : true,
        },
      },
    }
  },
  async created() {
    let list = await drugStoreChooseList()
    list = list.map(item => ({
      label: item.name,
      value: item.id,
    }))
    // console.log(list)
    this.filter.popover = this.filter.popover.filter(
      item => item.keys != 'storeId',
    )
    if (this.scope == 'YF') {
      this.filter.popover.push({
        props: {
          label: '所属药房',
          options: [{ label: '不限', value: '' }, ...list],
        },
        keys: 'storeId',
      })
    }
  },
  methods: {
    del(id) {
      this.$confirm('确定删除该消息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        console.log(id)
        this.$message.success('操作成功!')
      })
    },
    batchRead() {
      this.$confirm('确定一键已读吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$message.success('操作成功!')
      })
    },
    info(id) {
      this.$router.push(`/message/notice/detail?id=${id}`)
    },
  },
}
</script>
<style lang="scss" scoped>
.journal-table {
  height: calc(100vh - 120px);
}
.hideBtn {
  ::v-deep {
    .c__filter {
      .c_filter_right {
        .show-hide {
          display: none;
        }
      }
    }
  }
}
.title {
  &::before {
    content: '•';
    color: #333;
  }
  &.unread {
    &::before {
      color: #ef5757;
    }
  }
}
</style>
