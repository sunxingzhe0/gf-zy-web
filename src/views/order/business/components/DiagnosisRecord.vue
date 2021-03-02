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
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
        <el-button
          v-for="_ in [-1, 3, 7]"
          :key="_"
          plain
          @click="changeDate(_)"
        >
          {{ _ === -1 ? '今日' : `最近${_}天` }}
        </el-button>
      </div>
      <div>
        <el-input
          placeholder="按聊天内容搜索"
          v-model="keyworder"
          class="input-with-select"
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
      v-for="(item, index) in recordList"
      :key="index"
    >
      <div>
        <el-avatar
          :size="52"
          :src="
            item.chatType == 'DOCTOR'
              ? FILE_URL($attrs.biz.avatar)
              : FILE_URL($attrs.userAvatar)
          "
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
    <div
      v-if="record.length == 0"
      style="margin: 240px 0; color: #999"
      class="is-center"
    >
      暂无数据
    </div>
    <div class="page">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { formatDate } from '@/utils'
import { historyMessageList } from '@/api/prescription'
import formatMessage from '@/views/components/formatMessage'
export default {
  name: 'DiagnosisRecord',
  data() {
    return {
      total: 0,
      currentPage: 1,
      pageSize: 10,
      detailInfo: {},
      record: [],
      date: '',
      keyworder: '',
      active: -1,
      pickerOptions: {
        shortcuts: [
          {
            text: '今日',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              // start.setTime(start.getTime() - 3600 * 1000 * 24)
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
      formatDate,
      // 消息 id
      msgId: '',
    }
  },
  computed: {
    recordList() {
      return this.record.filter(_ => !_.deleteType)
    },
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
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.search()
    },
    // 信息转换
    // change_message(e) {
    //   this.IM.sendMessage({
    //     RequestType: 4,
    //     info: {
    //       messageType: 0,
    //       childMessageType: enumChildMessageTypeEnum[e.childMessageType] ?? 0,
    //       to: this.sessionId,
    //       body: e.body,
    //     },
    //   })
    // },
    // 条件查询
    async search() {
      const data = await historyMessageList({
        page: this.currentPage,
        userId: this.$attrs.userId,
        sessionId: this.$attrs.sessionId,
        search: this.keyworder,
        startDate: this.date ? this.date[0] : '',
        endDate: this.date ? this.date[1] : '',
      })

      this.total = data.totalElements
      this.record = data.content
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
.page {
  width: 100%;
  text-align: right;
  background: #fff;
  position: sticky;
  bottom: 0;
  padding: 10px 0;
}
</style>
