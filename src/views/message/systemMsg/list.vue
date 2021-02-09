<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_title="{ row }">
        <div :class="['title', !row.readed ? 'unread' : '']">
          {{ row.title }}
        </div>
      </template>
      <template v-slot:footertool>
        <el-button type="primary" @click="batchRead">
          一键已读
        </el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="info(row)">查看</el-button>
        <el-button
          style="color: #f74949;"
          type="text"
          @click="del(row.id)"
          v-if="scope == 'GR'"
        >
          删除
        </el-button>
      </template>
    </List>
  </div>
</template>
<script>
import { formatDate } from '@/utils'
import { List, mixin } from '@/components'
import { getSystemInfo, delSystemInfo } from '@/api/message'
import { batchRead, drugStoreChooseList } from '@/api/index'
import { createSocket } from '@/components/Socket'
export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: getSystemInfo }])],
  props: {
    scope: {
      type: String,
    },
  },
  data() {
    this.filter = {
      date: {
        props: {
          options: [{ label: '推送时间', value: 0 }],
        },
        keys: ['timeType', 'startTime', 'endTime'],
      },
      search: {
        props: {
          options: [{ label: '消息标题', value: 0 }],
        },
        keys: ['searchType', 'searchKeywords'],
      },
      popover: [
        {
          props: {
            label: '状态',
            options: [
              { label: '不限', value: 0 },
              { label: '未读', value: 1 },
              { label: '已读', value: 2 },
            ],
          },
          keys: 'readType',
        },
        {
          props: {
            label: '所属药房',
            options: [{ label: '不限', value: 0 }],
          },
          keys: 'storeId',
        },
      ],
    }
    return {
      batchRead_: '',
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
        scope: this.scope == 'JG' ? 2 : this.scope == 'YF' ? 1 : 0,
        // storeId: 'H000000001D000000002',
      },
      columns: {
        index: {
          hidden: true,
        },
        createTime: {
          minWidth: 180,
          formatter(row) {
            return formatDate(row.createTime, 'yyyy.MM.dd hh:mm:ss')
          },
        },
        title: {
          prop: 'slot_title',
          minWidth: 300,
        },
        fixed: {
          minWidth: 90,
        },
        storeName: {
          hidden: this.scope != 'YF',
        },
        id: {
          hidden: true,
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
          options: [{ label: '不限', value: 0 }, ...list],
        },
        keys: 'storeId',
      })
    }
  },
  activated() {
    this.$_fetchTableData(getSystemInfo)
  },
  methods: {
    init() {
      const IM = createSocket()
      IM.use(' SYNC_SYS_NOTICE', message => {
        message?.length && this.fetchConversationList()
      })
    },
    del(id) {
      this.$confirm('确定删除该消息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await delSystemInfo({
          noticeId: id,
        })
        this.$_fetchTableData(getSystemInfo)
        this.$message.success('操作成功!')
      })
    },
    batchRead() {
      this.$confirm('确定一键已读吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$batchRead()
      })
    },
    async $batchRead() {
      console.log(this.scope)
      await batchRead({
        scope: this.scope == 'JG' ? 2 : this.scope == 'YF' ? 1 : 0,
      }).then(() => {
        this.$message.success('操作成功!')
        this.$_fetchTableData(getSystemInfo)
        this.$store.dispatch('updateList/changeFlag', 'updateListFlagNavNotice')
      })
    },
    info(row) {
      const str = this.$route.fullPath.replace('list', 'detail')
      this.$router.push(
        `${str}?id=${row.id}&content=${row.content}&time=${row.createTime}&title=${row.title}&notice=${row.notice}&bizId=${row.bizId}`,
      )
    },
  },
}
</script>
<style lang="scss" scoped>
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
