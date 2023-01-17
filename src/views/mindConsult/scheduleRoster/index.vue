<template>
  <div class="view__card preview">
    <TableFilter
      :data="filter"
      v-model="query"
      ref="filter"
      @change="changeFilter"
    ></TableFilter>
    <div class="content-flex">
      <ListDay v-if="query.type === 1" :query="query"></ListDay>
      <ListMonth v-else :query="query"></ListMonth>
    </div>
  </div>
</template>

<script>
import TableFilter from '@/components/TableFilter'
import ListDay from './components/ListDay'
import ListMonth from './components/ListMonth'
import { deptXzChooseList } from '@/api/index'
import dayjs from 'dayjs'
import apiScheduleTemplate from '@/api/mindConsult/scheduleTemplate'
const pre = {
  deptList: [],
  userList: [],
}
export default {
  components: { TableFilter, ListDay, ListMonth },
  data() {
    this.filter = {
      date: {
        props: {
          options: [{ label: '排班日期', value: 0 }],
          type: 'daterange',
          format: 'yyyy-MM-dd',
          valueFormat: 'yyyy-MM-dd',
        },
        keys: ['timeType', 'startDate', 'endDate'],
      },
      popover: [
        {
          props: {
            label: '科室',
            options: pre.deptList.map(item => {
              return {
                label: item.showName,
                value: item.id,
              }
            }),
          },
          data: {
            attrs: {
              clearable: true,
              filterable: true,
            },
            // on: {
            //   change: this.deptChange,
            // },
          },
          keys: 'deptId',
        },
        {
          props: {
            label: '医生',
            options: pre.userList.map(item => {
              return {
                label: item.name,
                value: item.id,
              }
            }),
          },
          data: {
            attrs: {
              clearable: true,
              filterable: true,
            },
          },
          keys: 'userId',
        },
        {
          props: {
            label: '关键字',
            is: 'el-input',
          },
          data: {
            attrs: {
              clearable: true,
              placeholder: '患者姓名/就诊卡号/手机号/项目名称',
            },
          },
          keys: 'keywords',
        },
        {
          props: {
            label: '展现形式',
            is: 'el-switch',
          },
          data: {
            attrs: {
              activeText: '按月',
              inactiveText: '按日',
              activeValue: 2,
              inactiveValue: 1,
            },
            on: {
              change: this.typeChange,
            },
          },
          keys: 'type',
        },
      ],
    }
    return {
      tiemDatas: [
        {
          title: '2021-01-01',
          desc: '周一',
        },
        {
          title: '2021-01-02',
          desc: '周二',
        },
        {
          title: '2021-01-03',
          desc: '周三',
        },
        {
          title: '2021-01-04',
          desc: '周四',
        },
        {
          title: '2021-01-05',
          desc: '周五',
        },
        {
          title: '2021-01-06',
          desc: '周五',
        },
        {
          title: '2021-01-07',
          desc: '周五',
        },
        {
          title: '2021-01-08',
          desc: '周五',
        },
        {
          title: '2021-01-09',
          desc: '周五',
        },
        {
          title: '2021-01-10',
          desc: '周五',
        },
        {
          title: '2021-01-11',
          desc: '周五',
        },
        {
          title: '2021-01-12',
          desc: '周五',
        },
        {
          title: '2021-01-13',
          desc: '周五',
        },
        {
          title: '2021-01-14',
          desc: '周五',
        },
        {
          title: '2021-01-15',
          desc: '周五',
        },
      ],
      query: {
        type: 1,
        timeType: 0,
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
        userId: null,
      },
      tableData: [],
      deptId: null,
    }
  },
  async beforeRouteEnter(to, from, next) {
    pre.deptList = await deptXzChooseList()
    let list = await Promise.all(
      pre.deptList.map(
        async item =>
          await apiScheduleTemplate.accountChooseList({
            deptId: item.id,
          }),
      ),
    )
    const res = new Map()
    let newlist = list
      .reduce(function (a, b) {
        return a.concat(b)
      })
      .filter(a => !res.has(a.id) && res.set(a.id, 1))
    pre.userList = newlist
    next()
  },
  methods: {
    deptChange(e) {
      this.deptId = e
      this.getDocList(e)
    },
    getDocList(e) {
      apiScheduleTemplate
        .accountChooseList({
          deptId: e,
        })
        .then(res => {
          let list = res.map(item => {
            return {
              label: item.name,
              value: item.id,
            }
          })
          this.query.userId = null
          this.filter.popover[1].props.options = list
          this.$forceUpdate()
        })
    },
    typeChange(e) {
      this.query.type = e
    },
    changeFilter(e) {
      let data = {
        ...e,
        type: e.type === '' ? 1 : e.type,
      }
      this.query = data
    },
  },
}
</script>

<style lang="scss" scoped>
.preview {
  display: flex;
  flex-direction: column;
  /* height: calc(100vh - 85px); */
  .content-flex {
    flex: 1;
  }
}
</style>
