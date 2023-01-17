<template>
  <section class="view__card scheduleTemplate">
    <TableFilter :data="filter" v-model="query" @change="search"></TableFilter>
    <section class="opt_btn">
      <div>
        <el-button
          type="primary"
          @click="
            () => {
              isAdd = true
            }
          "
          >新增模板</el-button
        >
        <el-button
          type="primary"
          plain
          @click="
            () => {
              editTemp = query.template
              isAdd = true
            }
          "
          >编辑模板</el-button
        >
        <el-button plain @click="copyTemplate">复制模板</el-button>
        <!-- <el-button plain @click="delTemplate" type="danger">删除模板</el-button> -->
        <el-button type="primary" plain @click="toEdit">编辑排班</el-button>

        <el-button
          type="primary"
          plain
          @click="
            () => {
              isMake = true
            }
          "
          >生成排班</el-button
        >
      </div>
      <!-- <div>
        <el-button
          plain
          @click="
            () => {
              isImport = true
            }
          "
          >导入</el-button
        >
        <el-button plain>导出</el-button>
      </div> -->
    </section>
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      class="schedu_table"
      height="100%"
    >
      <el-table-column prop="deptName" label="科室" width="180">
      </el-table-column>
      <el-table-column prop="userName" label="医生"> </el-table-column>
      <el-table-column prop="periodName" label="午别">
        <template slot-scope="{ row }">
          {{ row.periodName }}
          <div>{{ row.startTime + '~' + row.endTime }}</div>
        </template>
      </el-table-column>
      <template v-for="item in week">
        <el-table-column
          :key="item.value"
          :prop="item.value"
          :label="item.label"
        >
          <template slot-scope="{ row }">
            <el-button type="text" @click="open(row, item.value)">{{
              row[item.value]
            }}</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!--新增编辑模板-->
    <AddTemplate
      :show="isAdd"
      :data="editTemp"
      @onClose="closeTemplate"
    ></AddTemplate>
    <!--生成排班-->
    <MakeSchedule
      :show="isMake"
      :data="{ scheduleId: query.template }"
      @onClose="closeMake"
    ></MakeSchedule>
    <!--批量导入-->
    <BatchImport
      :show="isImport"
      downTemplate="职称导入模板.xlsx"
      :importFetch="titleManagement"
      @onClose="closeImport"
    ></BatchImport>
    <!--排班详情-->
    <ScheduleInfo
      :show="isInfo"
      :data="infoData"
      @onClose="
        () => {
          isInfo = false
        }
      "
    ></ScheduleInfo>
  </section>
</template>

<script>
import TableFilter from '@/components/TableFilter'
import AddTemplate from './components/AddTemplate'
import MakeSchedule from './components/MakeSchedule'
import BatchImport from './components/BatchImport'
import ScheduleInfo from './components/ScheduleInfo'
import {
  titleManagement, //职称管理
} from '@/api/organization'
import { deptXzChooseList } from '@/api/index'
import apiScheduleTemplate from '@/api/mindConsult/scheduleTemplate'
import schedulData from './base'
const pre = {
  tempList: [],
  deptList: [],
  userList: [],
}
export default {
  components: {
    TableFilter,
    AddTemplate,
    MakeSchedule,
    BatchImport,
    ScheduleInfo,
  },
  data() {
    return {
      filter: {
        popover: [
          {
            props: {
              label: '模板名称',
              options: pre.tempList.map(_ => {
                return { label: _.name, value: _.id }
              }),
            },
            data: {
              on: {
                change: this.tempChange,
              },
            },
            keys: 'template',
          },

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
                filterable: true,
              },
            },
            keys: 'userId',
          },
        ],
      },
      week: schedulData.weekData,
      query: {
        template: pre.tempList.length > 0 ? pre.tempList[0].id : '',
        // template: '',
        dept: '',
        doctor: '',
      },
      tableData: [],
      isAdd: false,
      isMake: false,
      isImport: false,
      isInfo: false,
      infoData: {},
      editTemp: '',
    }
  },
  async beforeRouteEnter(to, from, next) {
    pre.tempList = await apiScheduleTemplate.chooseScheduleTemplate()
    console.log(pre.tempList, '---12')
    pre.deptList = await deptXzChooseList()
    next()
  },
  mounted() {
    if (this.query.template) {
      this.tempStatistics()
    }
    // this.$EventBus.$on('backScheduleId', data => {
    //   console.log('收到', data)
    //   this.query.template = data
    // })
    if (this.$route.query.id) {
      this.query.template = this.$route.query.id
    }
  },
  computed: {
    getTemplateId() {
      return this.query.template
    },
  },
  methods: {
    titleManagement,
    search(e) {
      console.log(e)
      if (!e.template) {
        this.query.template = pre.tempList[0].id
      }
      this.tempStatistics()
    },
    tempChange(e) {
      this.query.template = e
      this.tempStatistics()
    },
    deptChange(e) {
      this.$set(this.query, 'doctor', '')
      this.query.doctor = ''
      this.getDocList(e)
    },
    async closeTemplate(data) {
      console.log(data)
      this.isAdd = false
      this.editTemp = ''
      await this.getTempletList()
      this.tempStatistics()
    },
    closeMake(data) {
      console.log(data)
      this.isMake = false
      if (data) {
        this.$router.push('/mindConsult/scheduleTemplate/preview')
      }
    },
    closeImport(data) {
      console.log(data)
      this.isImport = false
    },
    open(row, type) {
      this.infoData = {
        ...row,
        scheduleId: this.query.template,
        scheduleName: pre.tempList.find(item => item.id === this.query.template)
          .name,
        weekDay: type,
      }
      this.isInfo = true
    },
    delTemplate() {
      this.$confirm('确定要删除该模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await apiScheduleTemplate.delTemplate(this.query.template)
        this.query.template = ''
        await this.getTempletList()
        this.tempStatistics()
        this.$message.success('删除成功!')
      })
    },
    copyTemplate() {
      let templateName =
        pre.tempList.find(item => item.id === this.query.template).name +
        '-副本'
      this.$prompt('修改模板名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入模板名称',
        inputValue: templateName,
      })
        .then(async ({ value }) => {
          await apiScheduleTemplate.copyTemplate({
            id: this.query.template,
            name: value,
          })
          this.getTempletList()
          this.$message.success('复制成功！')
        })
        .catch(() => {})
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
    toEdit() {
      const scheduleName = pre.tempList.find(
        item => item.id === this.query.template,
      ).name
      this.$router.push(
        `/mindConsult/scheduleTemplate/edit?id=${this.query.template}&scheduleName=${scheduleName}`,
      )
    },
    async getTempletList() {
      let list = await apiScheduleTemplate.chooseScheduleTemplate()
      pre.tempList = list
      this.filter.popover[0].props.options = list.map(item => {
        return {
          label: item.name,
          value: item.id,
        }
      })
      if (!this.query.template && list.length > 0) {
        this.query.template = list[0].id
      } else if (list.length == 0) {
        this.tableData = []
      }
      console.log(this.filter)
    },
    async getDocList(deptId) {
      let res = await apiScheduleTemplate.accountChooseList({ deptId })
      this.filter.popover[2].props.options = res.map(item => {
        return {
          label: item.name,
          value: item.id,
        }
      })
    },
    async tempStatistics() {
      let res = await apiScheduleTemplate.tempStatistics({
        id: this.query.template,
        userId: this.query.userId,
        deptId: this.query.deptId,
      })
      let list = []
      res.deptList.forEach(item => {
        item.userList.forEach(t => {
          t.periodList.forEach(s => {
            let obj = {
              ...item,
              ...t,
              ...s,
            }
            this.week.forEach(w => {
              obj[w.value] =
                s.weekDayNumber.find(n => n.weekDay === w.value)?.number || 0
            })
            list.push(obj)
          })
        })
      })
      console.log(list)
      this.tableData = list
    },
  },
}
</script>

<style lang="scss" scoped>
.scheduleTemplate {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 85px);
  .opt_btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .schedu_table {
    flex: 1;
    width: 100%;
    will-change: height;
  }
}
</style>
