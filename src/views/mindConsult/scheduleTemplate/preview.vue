<template>
  <div class="view__card preview">
    <TableFilter :data="filter" v-model="query" @change="search"></TableFilter>
    <DateLine
      v-if="query.type === 1"
      :tiemDatas="tiemDatas"
      :active="currentDate"
      @onchange="changeDate"
    ></DateLine>
    <div class="all-num" v-if="query.type === 1">
      <div>
        <span>排班科室：{{ deptNum.length }} </span
        ><span>排班人数：{{ userNum.length }}人</span>
      </div>
      <el-button type="primary" @click="makeShift">生成排班</el-button>
    </div>
    <el-table
      v-if="query.type === 1"
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="flex: 1; width: 100%"
    >
      <el-table-column prop="deptName" label="科室"> </el-table-column>
      <el-table-column prop="userName" label="医生"> </el-table-column>
      <el-table-column prop="periodName" label="午别"> </el-table-column>
      <el-table-column prop="startTime" label="开始时间"> </el-table-column>
      <el-table-column prop="endTime" label="结束时间"> </el-table-column>
      <el-table-column prop="itemName" label="项目名称"> </el-table-column>
      <el-table-column prop="price" label="价格/元"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            style="color: #f74a4a"
            @click="delSchedule(row)"
            >移除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <ListMonth
      v-if="query.type === 2"
      :query="query"
      :data="sourceData"
      @makeShift="makeShift"
    ></ListMonth>
  </div>
</template>

<script>
import TableFilter from '@/components/TableFilter'
import DateLine from '../scheduleRoster/components/DateLine'
import ListMonth from './components/ListMonth'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
import apiScheduleTemplate from '@/api/mindConsult/scheduleTemplate'
import schedulData from './base'
import { deptChooseList } from '@/api/index'
const pre = {
  deptList: [],
  userList: [],
}
export default {
  components: { TableFilter, DateLine, ListMonth },
  data() {
    return {
      filter: {
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
          // {
          //   props: {
          //     label: '排班日期',
          //     is: 'el-date-picker',
          //   },
          //   data: {
          //     attrs: {
          //       type: 'daterange',
          //       startPlaceholder: '开始日期',
          //       endPlaceholder: '结束日期',
          //       format: 'yyyy-MM-dd',
          //       valueFormat: 'yyyy-MM-dd',
          //     },
          //   },
          //   keys: ['startDate', 'endDate'],
          // },
          {
            props: {
              label: '科室',
              options: pre.deptList.map(item => {
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
              on: {
                change: this.deptChange,
              },
            },
            keys: 'deptId',
          },
          {
            props: {
              label: '医生',
              options: [],
            },
            data: {
              attrs: {
                clearable: true,
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
      },
      tiemDatas: [],
      query: {
        type: 1,
        startDate: this.$store.state.xzSchedule.previewQery?.startDate,
        endDate: this.$store.state.xzSchedule.previewQery?.endDate,
        timeType: 0,
      },
      currentDate: this.$store.state.xzSchedule.previewQery?.startDate,
      tableData: [],
      sourceData: [],
      delIds: [],
    }
  },
  computed: {
    ...mapState('xzSchedule', ['previewQery']),
    deptNum() {
      let deptId = this.tableData.map(item => item.deptId)
      return Array.from(new Set(deptId))
    },
    userNum() {
      let userList = this.tableData.map(item => item.userId)
      return Array.from(new Set(userList))
    },
  },
  async beforeRouteEnter(to, from, next) {
    pre.deptList = await deptChooseList()
    next()
  },
  created() {
    console.log(this.previewQery)
    console.log(this.query)
    // this.getalldays()
    this.getlist()
  },
  methods: {
    delSchedule(e) {
      this.delIds.push({
        id: e.id,
        date: this.currentDate,
      })
      console.log(e)
      this.changeDate({ title: this.currentDate })
    },
    deptChange(e) {
      console.log(e)

      this.getDocList(e)
    },
    getalldays() {
      var arr = []
      if (this.query.startDate && this.query.endDate) {
        var ab = this.query.startDate.split(' ')[0].split('-')
        var ae = this.query.endDate.split(' ')[0].split('-')
        console.log(ab, ae)
        var db = new Date()
        let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
        var de = new Date()
        de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
        var unixDb = db.getTime() - 24 * 60 * 60 * 1000
        var unixDe = de.getTime() - 24 * 60 * 60 * 1000
        for (var k = unixDb; k <= unixDe; ) {
          //console.log((new Date(parseInt(k))).format());
          k = k + 24 * 60 * 60 * 1000
          let value = schedulData.weekData.find(
            item => item.label === week[dayjs(new Date(parseInt(k))).day()],
          ).value
          let disable = this.sourceData.find(item => item.weekDay == value)
            .number
          console.log(disable)
          arr.push({
            title: dayjs(new Date(parseInt(k))).format('YYYY-MM-DD'),
            desc: week[dayjs(new Date(parseInt(k))).day()],
            disable: disable === 0 ? true : false,
            value: value,
          })
        }
        this.currentDate = arr[0].title
      }

      this.tiemDatas = arr
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = schedulData.flitterData(this.tableData).one[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col,
        }
      }
      if (columnIndex === 1) {
        const _row = schedulData.flitterData(this.tableData).two[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col,
        }
      }
    },
    changeDate(e) {
      console.log(e)
      this.currentDate = e.title
      let weekDay = this.tiemDatas.find(item => item.title === this.currentDate)
        .value
      let thatData = this.sourceData.filter(item => item.weekDay === weekDay)
      this.reorganizedData(thatData)
    },
    getArrDifference(arr1, arr2) {
      return arr1.concat(arr2).filter(function (v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })
    },
    makeShift(delIds) {
      console.log(delIds)
      this.$confirm('确定要生成排班吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        if (delIds.length > 0) {
          this.delIds = delIds
        }
        let list = []
        this.tiemDatas.forEach(d => {
          let deptList = this.sourceData.find(s => s.weekDay === d.value)
            .deptList
          let delid = this.delIds.filter(t => t.date == d.title).map(t => t.id)
          console.log(delid)
          deptList.forEach(item => {
            item.userList.forEach(s => {
              let detalId = this.getArrDifference(
                delid,
                s.detailList.map(t => t.id),
              )
              console.log(detalId)
              list.push({
                deptId: item.deptId,
                detailIdList: detalId,
                hasChange: delid.length > 0 ? true : false,
                scheduleDate: d.title,
                userId: s.userId,
              })
            })
          })
        })

        list = list.filter(item => item.detailIdList.length > 0)
        console.log(list)
        await apiScheduleTemplate.publishSchedule({
          detailList: list,
          startDate: this.query.startDate,
          endDate: this.query.endDate,
          tempId: this.previewQery.scheduleId,
        })

        this.$message({
          type: 'success',
          message: '生成成功!',
        })
        this.$router.push('/mindConsult/scheduleRoster')
      })
    },
    typeChange(e) {
      this.query.type = e
      this.getlist()
    },
    search(e) {
      console.log(e)
      this.query.type = e.type === '' ? 1 : e.type

      this.getlist()
    },
    async getDocList(deptId) {
      let res = await apiScheduleTemplate.accountChooseList({ deptId })
      this.filter.popover[1].props.options = res.map(item => {
        return {
          label: item.name,
          value: item.id,
        }
      })
    },
    async getInfo(data) {
      let info = await apiScheduleTemplate.doctorWeekDayScheduleList(data)
      return info
    },
    async getlist() {
      let res = await apiScheduleTemplate.previewSchedule({
        ...this.previewQery,
        startDate: this.query.startDate,
        endDate: this.query.endDate,
        type: this.query.type,
        deptId: this.query.deptId,
        userId: this.query.userId,
        keywords: this.query.keywords,
      })
      this.sourceData = res.weekDayStatisticsVOList
      console.log(this.sourceData)
      await this.getalldays()
      if (this.tiemDatas.length > 0) {
        let weekDay = this.tiemDatas.find(
          item => item.title === this.currentDate,
        ).value
        let thatData = res.weekDayStatisticsVOList.filter(
          item => item.weekDay === weekDay,
        )

        this.reorganizedData(thatData)
      } else {
        this.tableData = []
      }
    },
    reorganizedData(data) {
      let list = []
      console.log(data)
      data[0].deptList.forEach(item => {
        item.userList.forEach(t => {
          if (t.detailList && t.detailList.length > 0) {
            t.detailList.forEach(s => {
              let obj = {
                ...item,
                ...t,
                ...s,
              }
              list.push(obj)
            })
          }
        })
      })
      console.log(list)
      this.tableData = list.filter(
        item =>
          !this.delIds.find(
            s => item.id === s.id && this.currentDate === s.date,
          ),
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.preview {
  display: flex;
  flex-direction: column;
  .all-num {
    font-size: 14px;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
    span {
      margin-right: 30px;
    }
  }
}
</style>
