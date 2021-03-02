<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_title="{ row }">
        <div :class="['title', row.nurseId == '1' ? 'unread' : '']">
          {{ row.address }}
        </div>
      </template>
      <template v-slot:slot_state="{ row }">
        <div :style="{ color: row.nurseId == '1' ? '' : '#999' }">
          {{ row.nurseId == '1' ? '未读' : '已读' }}
        </div>
      </template>
      <template v-slot:footertool>
        <el-button size="mini" type="primary" @click="batchRead">
          一键已读
        </el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button size="mini" type="text" @click="info(row.id)">
          查看
        </el-button>
        <el-button
          size="mini"
          style="color: #f74949"
          type="text"
          @click="del(row.id)"
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
import { fetchList } from '@/api/list'
export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: fetchList }])],
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
          options: [{ label: '标题', value: 0 }],
        },
        keys: ['searchType', 'searchKeywords'],
      },
      popover: [
        {
          props: {
            label: '状态',
            options: [
              { label: '不限', value: '' },
              { label: '未读', value: 1 },
              { label: '已读', value: 2 },
            ],
          },
          keys: 'state',
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
        education: {
          hidden: true,
        },
        gender: {
          hidden: true,
        },
        zodiac: {
          hidden: true,
        },
        blood: {
          hidden: true,
        },
        constellation: {
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
        userName: {
          hidden: true,
        },
        state: {
          hidden: true,
        },
        marital: {
          hidden: true,
        },
        createTime: {
          minWidth: 180,
          formatter(row) {
            return formatDate(row.createTime, 'yyyy.MM.dd hh:mm:ss')
          },
        },
        address: {
          label: '标题',
          prop: 'slot_title',
          minWidth: 300,
        },
        nurseId: {
          label: '状态',
          prop: 'slot_state',
        },
        fixed: {
          minWidth: 90,
        },
      },
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
      this.$router.push(`/pharmacysetup/systeminfo/infodetail?id=${id}`)
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
