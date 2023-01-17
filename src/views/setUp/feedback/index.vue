<template>
  <div class="view__card">
    <List
      ref="refList"
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_weChatName="{ row }">
        <div class="flex-start-center">
          <el-avatar :size="30" :src="FILE_URL(row.weChatPic)">
            <img src="@/assets/headerImg.png" />
          </el-avatar>
          <span style="margin-left: 15px">{{ row.weChatName }}</span>
        </div>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="info(row)"> 详情 </el-button>
        <el-button type="text" @click="reply(row)"> 回复 </el-button>
      </template>
    </List>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :before-close="beforeColese"
    >
      <div class="info">
        <div class="flex-start-center">
          <el-avatar :size="60" :src="FILE_URL(rowData.weChatPic)">
            <img src="@/assets/headerImg.png" />
          </el-avatar>
          <span style="margin-left: 15px">{{ rowData.weChatName }}</span>
        </div>
        <div class="flex-start-start">
          <span style="width: 45px">原因：</span>
          <div>{{ rowData.reason }}</div>
        </div>
        <div class="flex-start-start">
          <span style="width: 45px">内容：</span>
          <div class="flex_1">
            <div>
              {{ rowData.backContent }}
            </div>
            <div class="imgList">
              <el-image
                v-for="(item, index) in rowData.picIds"
                :key="index"
                style="width: 100px; height: 100px"
                :src="item"
                :preview-src-list="rowData.picIds"
              >
              </el-image>
            </div>
          </div>
        </div>
        <div>联系人：{{ rowData.name }}</div>
        <div>联系电话：{{ rowData.phone }}</div>
        <div>提交时间：{{ rowData.createTime }}</div>
        <div>回复：{{ rowData.backList ? rowData.backList.length : 0 }}</div>
        <div v-if="dialogTitle === '回复'" class="area">
          <el-input
            type="textarea"
            resize="none"
            v-model="areaVal"
            placeholder="请输入"
          ></el-input>
        </div>
        <div
          v-if="dialogTitle === '回复'"
          style="display: flex; justify-content: flex-end"
        >
          <el-button type="primary" @click="confirmVal">确 定</el-button>
        </div>
        <el-timeline :reverse="true">
          <el-timeline-item
            v-for="(activity, index) in rowData.backList"
            :key="index"
            :timestamp="activity.createTime"
          >
            <div>{{ `${activity.createName}  ${activity.deptName}` }}</div>
            <div style="margin-top: 5px">{{ activity.content }}</div>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- <span slot="footer" class="dialog-footer" v-if="dialogTitle === '回复'">
        <el-button @click="cancelModel">取 消</el-button>
        <el-button type="primary" @click="confirmVal">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>
<script>
import { List, mixin } from '@/components'
import {
  getFeedBackList,
  feedBackReply,
  feedBackReplyList,
} from '@/api/zyapi/index'
export default {
  components: {
    List,
  },
  mixins: [
    mixin([
      {
        fetchListFunction: getFeedBackList,
      },
    ]),
  ],
  data() {
    return {
      query: {
        pageSize: 10,
        currentNum: 1,
        timeType: 0,
        searchType: 0,
      },
      columns: {
        index: {
          hidden: true,
        },
        createTime: {
          minWidth: 180,
        },
        weChatName: {
          prop: 'slot_weChatName',
          minWidth: 160,
        },
        fixed: {
          width: 100,
        },
      },
      rowData: {},
      dialogTableVisible: false,
      dialogTitle: '',
      row: {},
      areaVal: '',
    }
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [{ label: '提交时间', value: 0 }],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '原因', value: 0 },
              { label: '联系电话', value: 1 },
              { label: '联系人', value: 2 },
              { label: '内容', value: 3 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
      }
    },
  },
  methods: {
    cancelModel() {
      this.areaVal = ''
      this.dialogTableVisible = false
    },
    beforeColese() {
      this.areaVal = ''
      this.dialogTableVisible = false
    },
    async confirmVal() {
      const params = {
        feedBackId: this.rowData.id,
        content: this.areaVal,
        userId: this.rowData.createId,
        deptName: this.$store.state.user.dept.name || '',
      }
      await feedBackReply(params)
      this.$_fetchTableData()
      this.areaVal = ''
      this.dialogTableVisible = false
      this.$message.success('回复成功！')
    },
    async reply(row) {
      this.dialogTableVisible = true
      this.dialogTitle = '回复'
      this.rowData = JSON.parse(JSON.stringify(row))
      const backList = await feedBackReplyList({ id: row.id })
      this.rowData.backList = backList
      this.$forceUpdate()
    },
    async info(row) {
      this.rowData = JSON.parse(JSON.stringify(row))
      console.log(row, 'log-1')
      this.rowData.picIds = row.picIds.map(item => this.FILE_URL(item))
      this.dialogTableVisible = true
      this.dialogTitle = '意见反馈'
      //打开一详情获取回复列表
      const backList = await feedBackReplyList({ id: row.id })
      this.rowData.backList = backList
      this.$forceUpdate()
    },
  },
}
</script>
<style lang="scss" scoped>
.info {
  > div {
    margin-bottom: 20px;
    &.flex-start-start {
      align-items: flex-start;
      > span {
        width: 80px;
      }
    }
    .imgList {
      margin-top: 10px;
      .el-image {
        margin-right: 10px;
      }
    }
  }
}
/* .area {
  .el-textarea {
    ::v-deep .el-textarea__inner {
      min-height: 180px !important;
    }
  }
} */
</style>
