<template>
  <div>
    <div class="flex-between" style="margin-bottom: 30px;">
      <div>
        <span style="color: #666;">时间段：</span>
        <el-date-picker
          align="right"
          v-model="date"
          range-separator="至"
          type="datetimerange"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          style="margin-right: 10px;"
          value-format="yyyyMMddHHmmss"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
        <el-button
          v-for="_ in [-1, 3, 7]"
          @click="changeDate(_)"
          :key="_"
          plain
        >
          {{ _ === -1 ? '今日' : `最近${_}天` }}
        </el-button>
      </div>
      <div>
        <el-input
          v-model="keyworder"
          @keyup.native.enter="search"
          class="input-with-select"
          placeholder="按聊天内容搜索"
        >
          <el-button
            slot="append"
            @click="search"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </div>
    </div>
    <div
      class="flex-start-start recodeList"
      v-for="(item, index) in record"
      :key="index"
    >
      <div>
        <el-avatar
          :size="52"
          fit="cover"
          :src="
            item.chatType == 'DOCTOR'
              ? FILE_URL(orderInfo.biz.avatar)
              : FILE_URL(orderInfo.userAvatar)
          "
        ></el-avatar>
      </div>
      <div class="flex_1" style="padding-left: 20px;">
        <div class="flex-between" style="margin-bottom: 20px;">
          <div class="user-name">
            {{
              item.chatType == 'DOCTOR'
                ? item.fromNickName
                : orderInfo.memberName
            }}
          </div>
          <span class="msg-time">{{
            formatDate(item.serverTime, 'yyyy-MM-dd hh:mm:ss')
          }}</span>
        </div>
        <div class="info">{{ formatMessage(item) }}</div>
        <el-divider></el-divider>
      </div>
    </div>
    <div
      v-if="record.length == 0"
      style="margin: 240px 0; color: #999;"
      class="is-center"
    >
      暂无数据
    </div>
    <div class="page">
      <el-pagination
        background
        :total="total"
        :page-size="10"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
/*
@author        qiang
@name          ChatRecord
@desc          聊天记录【处方详情诊疗记录】
               复制于v1.0: /src/views/business/order/components/DiagnosisRecord.vue
@props         orderInfo    Object      订单详情 
@emit
*/
import { formatDate } from '@/utils'
import { historyMessageList } from '@/api/prescription'
import formatMessage from '@/views/components/formatMessage'
export default {
  name: 'ChatRecord',
  props: {
    orderInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      total: 0,
      date: '',
      record: [],
      active: -1,
      pageNum: 10,
      keyworder: '',
      currentPage: 1,
      loading: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '今日',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近3天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              end.setTime(end.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近7天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              end.setTime(end.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      formatDate: formatDate,
    }
  },
  mounted() {
    this.search()
  },
  watch: {
    date: 'search',
  },
  methods: {
    formatMessage,
    handleSizeChange(val) {
      this.pageNum = val
      this.search()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.search()
    },
    // 条件查询
    async search() {
      try {
        this.loading = true
        const data = await historyMessageList({
          pageNum: this.pageNum,
          search: this.keyworder,
          page: this.currentPage,
          userId: this.orderInfo.userId,
          sessionId: this.orderInfo.sessionId,
          endDate: this.date ? this.date[1] : '',
          startDate: this.date ? this.date[0] : '',
        })
        this.total = data.totalElements
        this.record = data.content
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeDate(days) {
      this.active = days
      switch (days) {
        case -1:
          this.pickerOptions.shortcuts[0].onClick({
            $emit: (name, values) =>
              (this.date = values.map(
                _ => formatDate(_, 'yyyyMMdd') + '000000',
              )),
          })
          break
        case 3:
          this.pickerOptions.shortcuts[1].onClick({
            $emit: (name, values) =>
              (this.date = values.map(
                _ => formatDate(_, 'yyyyMMdd') + '000000',
              )),
          })
          break
        case 7:
          this.pickerOptions.shortcuts[2].onClick({
            $emit: (name, values) =>
              (this.date = values.map(
                _ => formatDate(_, 'yyyyMMdd') + '000000',
              )),
          })
          break
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/styles/_modules-detail.scss';
.user-name,
.msg-time {
  height: 16px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #666666;
}
.msg-time {
  font-size: 14px;
}
.info {
  height: 16px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #1a1a1a;
}
.page {
  bottom: 0;
  width: 100%;
  padding: 10px 0;
  position: sticky;
  text-align: right;
  background: #fff;
}
</style>
