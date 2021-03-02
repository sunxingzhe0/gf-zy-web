<template>
  <div>
    <div class="flex-between" style="margin-bottom: 30px">
      <div>
        <span style="color: #666">时间段：</span
        ><el-date-picker
          v-model="date"
          type="datetimerange"
          value-format="yyyyMMddHHmmss"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          style="margin-right: 10px"
          @change="dateChange"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
        <el-button
          v-for="_ in [0, 3, 7]"
          :key="_"
          :type="active === _ ? 'primary' : ''"
          plain
          @click="changeDate(_)"
        >
          {{ _ === 0 ? '今天' : `最近${_}天` }}
        </el-button>
      </div>
      <div>
        <el-input
          placeholder="关键字"
          v-model="keyworder"
          class="input-with-select"
        >
          <el-button
            @click="dateChange"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </div>
    </div>
    <div
      class="flex-start-start recodeList"
      v-for="(item, index) in getRecord"
      :key="index"
    >
      <div>
        <el-avatar
          :size="52"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        ></el-avatar>
      </div>
      <div class="flex_1" style="padding-left: 20px">
        <div class="flex-between" style="margin-bottom: 20px">
          <div>{{ item.fromNickName }}</div>
          <span class="info" style="font-size: 14px">{{
            formatDate(item.serverTime, 'yyyy-MM-dd hh:mm:ss')
          }}</span>
        </div>
        <div class="info">{{ formatMessage(item) }}</div>
        <el-divider></el-divider>
      </div>
    </div>
    <Empty v-if="getRecord.length == 0"></Empty>
    <div class="page">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="query.pageNum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="query.total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { formatDate } from '@/utils'
import formatMessage from '@/views/components/formatMessage'
import Empty from '@/components/Empty'
export default {
  name: 'DiagnosisRecord',
  components: { Empty },
  props: {
    query: Object,
    getRecord: {
      type: Array,
    },
  },
  data() {
    return {
      pageSize: 10,
      date: '',
      keyworder: '',
      active: -1,
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime())
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近3天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近7天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      formatDate,
      // 消息 id
      msgId: '',
    }
  },
  methods: {
    formatMessage,
    handleSizeChange(pageNum) {
      this.$emit('serachChange', { pageNum })
    },
    handleCurrentChange(page) {
      this.$emit('serachChange', { page })
    },
    changeDate(days) {
      this.active = days
      switch (days) {
        case 0:
          this.pickerOptions.shortcuts[0].onClick({
            $emit: (name, values) =>
              (this.date = values.map((_, index) => {
                if (index == 0) {
                  return formatDate(_, 'yyyyMMdd') + '000000'
                } else {
                  return formatDate(_, 'yyyyMMddhhmmss')
                }
              })),
          })
          break
        case 3:
          this.pickerOptions.shortcuts[1].onClick({
            $emit: (name, values) =>
              (this.date = values.map(_ => formatDate(_, 'yyyyMMddhhmmss'))),
          })
          break
        case 7:
          this.pickerOptions.shortcuts[2].onClick({
            $emit: (name, values) =>
              (this.date = values.map(_ => formatDate(_, 'yyyyMMddhhmmss'))),
          })
          break
      }
      this.dateChange()
    },
    dateChange() {
      this.$emit('serachChange', {
        startDate: this.date[0],
        endDate: this.date[1],
        search: this.keyworder,
        pageNum: 999999,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/styles/_modules-detail.scss';
.page {
  width: 100%;
  text-align: right;
  background: #fff;
  position: sticky;
  bottom: 0;
  padding: 10px 0;
}
</style>
