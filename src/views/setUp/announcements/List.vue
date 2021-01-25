<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_title="{ row }">
        <div>
          <span
            :class="
              row.releaseDesc != '已发布'
                ? row.releaseDesc == '待发布'
                  ? 'red'
                  : 'green'
                : 'gray'
            "
            >•</span
          >{{ row.title }}
        </div>
      </template>
      <template v-slot:footertool>
        <el-button size="mini" type="primary" @click="info('add')">
          新增公告
        </el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button
          size="mini"
          type="text"
          @click="info('detail', row.id)"
          v-if="row.releaseState"
        >
          查看
        </el-button>
        <el-button
          size="mini"
          type="text"
          @click="send(row.id)"
          v-if="!row.releaseState"
        >
          发布
        </el-button>
        <el-button
          size="mini"
          type="text"
          @click="info('edit', row.id)"
          v-if="!row.releaseState"
        >
          修改
        </el-button>
        <el-button
          size="mini"
          type="text"
          style="color: #f74a4a;"
          @click="del(row.id)"
          v-if="!row.releaseState"
        >
          删除
        </el-button>
      </template>
      <template v-slot:slot_seeDesc="{ row }">
        <el-switch
          v-if="row.releaseState"
          v-model="row.see"
          @change="handleChange(row.id, row.see)"
          active-text="显示"
          inactive-text="隐藏"
          :width="50"
          class="textSwitch"
        >
        </el-switch>
      </template>
    </List>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import { getAnnounceList, delAnn, sendAnn, showAnn } from '@/api/setup'
import {
  roleChooseList,
  deptChooseList,
  drugStoreChooseList,
  titleChooseList,
} from '@/api'

const pre = {
  role: [],
  dept: [],
  store: [],
  title: [],
}

export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: getAnnounceList }])],
  props: {
    scope: {
      type: String,
    },
  },
  watch: {
    $route() {
      this.$_fetchTableData()
    },
  },
  data() {
    return {
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
        scope: this.scope == 'JG' ? 2 : this.scope == 'YF' ? 1 : 0,
      },
      columns: {
        index: {
          hidden: true,
        },
        id: {
          hidden: true,
        },
        title: {
          prop: 'slot_title',
        },
        fixed: {
          width: 120,
        },
        seeDesc: {
          prop: 'slot_seeDesc',
        },
      },
    }
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [
              { label: '创建时间', value: 0 },
              { label: '发布时间', value: 1 },
            ],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '公告标题', value: 0 },
              { label: '创建人', value: 1 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '发布状态',
              options: [
                { label: '不限' },
                { label: '已发布', value: 0 },
                { label: '待发布', value: 1 },
                { label: '预约发布', value: 2 },
              ],
            },
            keys: 'state',
          },
          {
            props: {
              label: '科室范围',
              options: [
                { label: '不限' },
                ...pre.dept.map(item => ({ label: item.name, value: item.id })),
              ],
            },
            keys: 'deptId',
          },
          {
            props: {
              label: '发布对象',
              options: [
                { label: '不限' },
                ...pre.role.map(_ => ({ label: _.name, value: _.id })),
              ],
            },
            keys: 'roleId',
          },
        ],
      }
    },
  },
  // async activated() {
  //   console.log(1111)
  //   ;[pre.role, pre.dept, pre.store, pre.title] = await Promise.all([
  //     roleChooseList({ showUser: true }),
  //     deptChooseList({ tree: false }),
  //     drugStoreChooseList(),
  //     titleChooseList(),
  //   ])
  //   console.log(this.filter)
  //   console.log(pre)
  //   // next()
  // },
  async beforeRouteEnter(to, from, next) {
    ;[pre.role, pre.dept, pre.store, pre.title] = await Promise.all([
      roleChooseList({ showUser: true }),
      deptChooseList({ tree: false }),
      drugStoreChooseList(),
      titleChooseList(),
    ])
    next()
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.tableData)
    })
  },
  methods: {
    // 发布
    async send(id) {
      await sendAnn({
        announceId: id,
      })
      this.$_fetchTableData(getAnnounceList)
      this.$message.success('发布成功!')
    },
    // 跳转
    info(name, id) {
      this.$router.push(`/set-up/announcements/${name}${id ? '?id=' + id : ''}`)
      console.log(this.tableData)
    },
    // 删除操作
    del(id) {
      this.$confirm('确定删除选中的数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        // 删除接口
        await delAnn({
          announceId: id,
        })
        // 重新拉取数据
        this.$_fetchTableData(getAnnounceList)
        // console.log(id)
        this.$message.success('操作成功!')
      })
    },
    // 是否显示
    async handleChange(id, status) {
      await showAnn({
        announceId: id,
      })
      this.$_fetchTableData(getAnnounceList)
      this.$message.success(status ? '公告已显示!' : '公告已隐藏')
    },
  },
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
::v-deep .gray {
  font-size: 20px;
  margin-right: 10px;
  color: #cccccc;
}
::v-deep .green {
  font-size: 20px;
  margin-right: 10px;
  color: #2cb329;
}
::v-deep .red {
  font-size: 20px;
  margin-right: 10px;
  color: #f74a4a;
}
</style>
