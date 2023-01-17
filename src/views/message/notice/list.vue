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
        <el-button type="primary" @click="batchRead"> 一键已读 </el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="info(row.id)"> 查看 </el-button>
      </template>
      <template v-slot:slot_readed="{ row }">
        {{ row.readed == true ? '已读' : '未读' }}
      </template>
    </List>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import { anNotice, readAll } from '@/api/setup'
import { createSocket } from '@/components/Socket'

export default {
  name: 'message_notice',
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: anNotice }])],
  watch: {
    //全局监听刷新
    updateListEditFooter() {
      this.$_fetchTableData(anNotice)
    },
  },
  data() {
    this.filter = {
      date: {
        props: {
          options: [{ label: '发布时间', value: 0 }],
        },
        keys: ['timeType', 'startTime', 'endTime'],
      },
      search: {
        props: {
          options: [
            { label: '标题', value: 0 },
            // { label: '接收对象', value: 2 },
          ],
        },
        keys: ['searchType', 'searchKeywords'],
      },
      popover: [
        {
          props: {
            label: '状态',
            options: [
              { label: '不限', value: '' },
              { label: '未读', value: false },
              { label: '已读', value: true },
            ],
          },
          keys: 'readed',
        },
      ],
    }
    return {
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        state: {
          hidden: true,
        },
        title: {
          label: '标题',
          prop: 'slot_title',
          minWidth: 300,
        },
        fixed: {
          minWidth: 90,
        },
        id: {
          hidden: true,
        },
        roleNames: {
          hidden: true,
        },
        releaseTime: {
          minWidth: 160,
        },
        readed: {
          prop: 'slot_readed',
        },
      },
    }
  },
  computed: {
    updateListEditFooter() {
      return this.$store.state.updateList.updateListEditFooter
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      console.log(111111111)
      const IM = createSocket()
      IM.use('SYNC_SYS_NOTICE', message => {
        message?.length && this.fetchConversationList()
      })
    },
    // del(id) {
    //   this.$confirm('确定删除该消息吗？', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   }).then(() => {
    //     console.log(id)
    //     this.$message.success('操作成功!')
    //   })
    // },
    batchRead() {
      this.$confirm('确定一键已读吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await readAll({})
        this.$message.success('操作成功!')
        this.$store.dispatch('updateList/changeFlag', 'updateListFlagNavNotice')
        this.$_fetchTableData(anNotice)
      })
    },
    info(id) {
      let str = this.$route.fullPath.replace('list', 'detail')
      console.log(str, '----')
      this.$router.push(`${str}?id=${id}`)
      this.$_fetchTableData(anNotice)
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
