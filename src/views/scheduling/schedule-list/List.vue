<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_nurseId="{ row }">
        <el-popover placement="bottom" trigger="click">
          <div>
            <div v-for="(item, index) in row.userInfo" :key="index">
              {{ item }}
            </div>
          </div>
          <!-- <el-button type="text" slot="reference" >{{ row.orderNum }}</el-button> -->
          <span class="orderNumspan" slot="reference">{{ row.orderNum }}</span>
        </el-popover>
        <!-- <el-tooltip placement="top">
          <div slot="content">
            <div v-for="(item, index) in row.userInfo" :key="index">
              {{ item }}
            </div>
          </div>
          <el-button type="text">{{ row.orderNum }}</el-button>
        </el-tooltip> -->
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="info(row.doctorId, row.deptId)">
          查看
        </el-button>
      </template>
    </List>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import { getDocSchList } from '@/api/scheduling'
import {
  roleChooseList,
  deptOuterChooseList,
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
  name: 'shift_scheduleList',
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: getDocSchList }])],
  data() {
    this.filter = {
      date: {
        props: {
          options: [{ label: '排班时间', value: 0 }],
        },
        keys: ['timeType', 'startTime', 'endTime'],
      },
      time: {
        props: {
          is: 'el-time-select',
        },
        keys: ['beginHour', 'endHour'],
      },
      search: {
        props: {
          options: [
            { label: '姓名', value: 0 },
            { label: '工号', value: 1 },
            { label: '员工账号', value: 2 },
          ],
        },
        keys: ['searchType', 'searchKeywords'],
      },
      popover: [
        {
          props: {
            label: '账号类型',
            options: [
              { label: '不限', value: '' },
              { label: '医生', value: 'DOCTOR' },
              { label: '护士', value: 'NURSE' },
              { label: '药师', value: 'DRUGER' },
            ],
          },
          keys: 'drugType',
        },
        {
          props: {
            label: '职称',
            options: [
              { label: '不限', value: '' },
              ...pre.title.map(_ => ({ label: _.name, value: _.id })),
            ],
          },
          keys: 'titleName	',
        },
        {
          props: {
            label: '科室',
            options: [
              { label: '不限', value: '' },
              ...pre.dept.map(_ => ({
                label: _.name,
                value: _.id,
                index: _.name,
              })),
            ],
          },
          keys: 'deptName',
        },
        {
          props: {
            label: '性别',
            options: [
              { label: '不限', value: '' },
              { label: '男', value: 1 },
              { label: '女', value: 0 },
            ],
          },
          keys: 'gender',
        },
      ],
    }
    return {
      query: {
        timeType: 0,
        searchType: 0,
        pageSize: 10,
        currentNum: 1,
        deptName: '',
      },
      columns: {
        index: {
          hidden: true,
        },
        createDate: {
          minWidth: 180,
        },
        orderNum: {
          label: '排班时段',
          prop: 'slot_nurseId',
          minWidth: 120,
        },
        fixed: {
          minWidth: 60,
        },
      },
    }
  },
  async beforeRouteEnter(to, from, next) {
    ;[pre.role, pre.dept, pre.store, pre.title] = await Promise.all([
      roleChooseList({ showUser: true }),
      deptOuterChooseList({ tree: false }),
      drugStoreChooseList(),
      titleChooseList(),
    ])
    next()
  },
  methods: {
    info(id, deptId) {
      // console.log(id, deptId)
      this.$router.push(`/shift/schedule-list/detail?id=${id}&dept=${deptId}`)
    },
  },
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
.orderNumspan {
  color: #0ab2c1;
  &:hover {
    color: rgb(28, 13, 230);
    cursor: pointer;
  }
}
</style>
