<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_activityApplicant="{ row }">
        <span style="color: #0ab2c1; cursor: pointer" @click="handelInto(row)">
          {{ row.activityApplicant }}</span
        >
      </template>
      <template v-slot:fixed="{ row }">
        <el-button @click="seeInfo(row)" type="text"> 查看 </el-button>
        <el-button type="text" @click="edit(row.id)"> 编辑 </el-button>
        <el-button
          type="text"
          v-if="row.activityStatus == 1 || row.activityStatus == 3"
          @click="suspended(row)"
        >
          {{ row.activityStatus == 3 ? '恢复' : '暂停' }}
        </el-button>
        <el-button @click="seeRegistration(row)" type="text"> 预览 </el-button>
        <el-button @click="openCode(row)" type="text"> 二维码 </el-button>
        <el-button @click="openUrl(row)" type="text"> 链接 </el-button>
      </template>
      <template v-slot:footertool>
        <el-button type="primary" @click="creat"> 新增 </el-button>
      </template>
    </List>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div class="center">
        <iframe
          v-if="dialogTitle === '预览'"
          style="min-height: 500px"
          :src="acticityUrl"
        ></iframe>
      </div>
      <div class="flex_center" v-if="dialogTitle === '二维码'">
        <!-- <img
          style="width: 120px; height: 120px"
          :src="`https://api.qrserver.com/v1/create-qr-code?data=${acticityUrl}`"
        /> -->
        <QRcode
          width="200"
          height="200"
          :content="acticityUrl"
          :load="false"
        ></QRcode>
      </div>
      <div v-if="dialogTitle === '链接'">
        <span>{{ acticityUrl }}</span>
        <el-button
          type="text"
          @click.stop.prevent=""
          v-clipboard:error="copyFailed"
          v-clipboard:success="copySuccess"
          v-clipboard:copy="acticityUrl"
        >
          复制链接
        </el-button>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { List, mixin } from '@/components'

import QRcode from '@/components/createCode/index.vue'
import { getToken } from '@/utils/auth'
import {
  queryActivityList,
  statusActivity,
  // previewActivityQrCode,
  // previewActivity,
  // activityLink,
} from '@/api/mindConsult/myActivity'
export default {
  components: {
    List,
    QRcode,
  },
  mixins: [mixin([{ fetchListFunction: queryActivityList }])],
  data() {
    this.filter = {
      date: {
        props: {
          options: [
            { label: '开始时间', value: 1 },
            { label: '结束时间', value: 2 },
            { label: '创建时间', value: 3 },
          ],
          // format: 'yyyy-MM-dd',
          // valueFormat: 'yyyy-MM-dd',
        },
        keys: ['timeType', 'beginTime', 'endTime'],
      },
      inline: [
        {
          props: {
            label: '活动类型',
            is: 'el-select',
            options: [
              { label: '全部', value: '' },
              { label: '团体活动', value: '团体活动' },
              { label: '团体督导', value: '团体督导' },
              { label: '团体治疗', value: '团体治疗' },
            ],
          },
          keys: 'activityType',
        },
        {
          props: {
            label: '状态',
            is: 'el-select',
            options: [
              { label: '全部', value: '' },
              { label: '进行中', value: 1 },
              { label: '已结束', value: 2 },
              { label: '暂停', value: 3 },
              { label: '未开始', value: 4 },
            ],
          },
          keys: 'activityStatus',
        },
        {
          props: {
            label: '关键字',
            is: 'el-input',
          },
          data: {
            attrs: {
              placeholder: '活动ID/名称/地点',
            },
          },
          keys: 'keywords',
        },
        // {
        //   props: {
        //     label: '报名开始时间',
        //     is: 'el-date-picker',
        //   },
        //   data: {
        //     attrs: {
        //       type: 'datetime',
        //     },
        //   },
        //   keys: 'beginTime',
        // },
        // {
        //   props: {
        //     label: '报名结束时间',
        //     is: 'el-date-picker',
        //   },
        //   data: {
        //     attrs: {
        //       type: 'datetime',
        //     },
        //   },
        //   keys: 'endTime',
        // },
        // {
        //   props: {
        //     label: '创建时间',
        //     is: 'el-date-picker',
        //   },
        //   data: {
        //     attrs: {
        //       type: 'datetimerange',
        //       startPlaceholder: '开始日期',
        //       endPlaceholder: '结束日期',
        //     },
        //   },
        //   keys: ['creatTime', 'endTimes'],
        // },
      ],
    }
    return {
      token: getToken(),
      acticityUrl: '',
      dialogTitle: '二维码',
      dialogVisible: false,
      imgUrl: '', //预览图
      code: '', //二维码
      linkUrl: '', //链接
      query: {
        pageSize: 10,
        currentNum: 1,
        doctorId: '',
        timeType: 1,
      },
      columns: {
        index: {
          hidden: true,
        },
        activityBeginTime: {
          minWidth: 120,
        },
        activityEndTime: {
          minWidth: 120,
        },
        creatTime: {
          minWidth: 120,
        },
        fixed: {
          minWidth: 300,
        },
        activityApplicant: {
          prop: 'slot_activityApplicant',
        },
        activityStatus: {
          formatter(row) {
            const types = ['进行中', '已结束', '暂停', '未开始']
            return types[row.activityStatus - 1] || ''
          },
        },
      },
    }
  },
  watch: {
    $route() {
      console.log(this.$route.path)
      if (this.$route.path === '/mindConsult/myActivity/list') {
        this.query.doctorId = this.$store.state.user.userId
      } else {
        this.query.doctorId = ''
      }
    },
  },
  created() {
    if (this.$route.path === '/mindConsult/myActivity/list') {
      this.query.doctorId = this.$store.state.user.userId
    }
  },
  methods: {
    handelInto(row) {
      let path =
        this.$route.path == '/mindConsult/allActivity/list'
          ? 'allActivity'
          : 'myActivity'
      this.$router.push(`/mindConsult/${path}/registration?id=${row.id}`)
    },
    edit(id) {
      let path =
        this.$route.path == '/mindConsult/allActivity/list'
          ? 'allActivity'
          : 'myActivity'
      this.$router.push(`/mindConsult/${path}/edit?id=${id}`)
    },
    creat() {
      let path =
        this.$route.path == '/mindConsult/allActivity/list'
          ? 'allActivity'
          : 'myActivity'
      this.$router.push(`/mindConsult/${path}/creat`)
    },
    seeInfo(row) {
      let path =
        this.$route.path == '/mindConsult/allActivity/list'
          ? 'allActivity'
          : 'myActivity'
      this.$router.push(
        `/mindConsult/${path}/info?id=${row.id}&activityTemplateId=${row.activityTemplateId}`,
      )
    },
    //预览
    async seeRegistration(row) {
      this.dialogVisible = true
      this.dialogTitle = '预览'
      this.getActivityUrl(row)
    },
    //二维码
    async openCode(row) {
      this.dialogVisible = true
      this.dialogTitle = '二维码'
      this.getActivityUrl(row)
    },
    //链接
    async openUrl(row) {
      this.dialogVisible = true
      this.dialogTitle = '链接'
      this.getActivityUrl(row)
    },
    getActivityUrl(row) {
      const baseUrl =
        process.env.MODE === 'jwpro'
          ? window.config.proActiveUrl
          : window.config.testAcTiveUrl
      this.acticityUrl = `${baseUrl}${
        window.config.templates[row.activityTemplateId]
      }?activityId=${row.id}&token=${this.token}`
    },
    //暂停
    async suspended(row) {
      const confirm = await this.$confirm(
        `是否${row.activityStatus == 3 ? '恢复' : '暂停'}？`,
        '提示',
        {
          type: 'warning',
        },
      )
      if (confirm !== 'confirm') return
      await statusActivity({
        activityId: row.id,
        status: row.activityStatus == 3 ? 1 : 3,
      })
      this.$message.success('操作成功！')
      this.$_fetchTableData()
    },

    handleClose() {
      this.dialogVisible = false
    },
    copyFailed() {
      this.$message.error('复制失败！')
    },
    copySuccess() {
      this.$message.success('复制成功！')
    },
  },
}
</script>

<style lang="scss" scoped>
.flex_center {
  display: flex;
  justify-content: center;
}
.center {
  display: flex;
  justify-content: center;
}
</style>
