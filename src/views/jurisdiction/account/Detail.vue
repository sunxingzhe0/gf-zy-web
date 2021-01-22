<template>
  <PersonalInfo v-if="audit" is-audit :info="detail" />

  <el-tabs
    v-else
    v-model="activeName"
    type="border-card"
    @tab-click="handleTabClick"
  >
    <el-tab-pane label="个人信息" name="audit" lazy>
      <PersonalInfo :info="detail" />
    </el-tab-pane>

    <el-tab-pane label="业务信息" name="business" lazy>
      <Business
        isDisable
        :doctorId="detail.id"
        :defDeptId="detail.defDeptId"
        :titleId="detail.titleId"
      />
    </el-tab-pane>

    <el-tab-pane label="诊疗信息" name="info" lazy v-loading="info.loading">
      <p>诊疗次数：{{ info.tableData.total }}次</p>
      <List
        v-model="info.query"
        :filter="filter.info"
        :columns="info.columns"
        :tableData="info.tableData"
      >
        <template v-slot:fixed="{ row }">
          <router-link
            class="el-button el-button--text el-button--mini"
            :to="`/order/business/detail/${row.orderId}`"
          >
            查看
          </router-link>
        </template>
        <template v-slot:slot_payFee="{ row }">
          <span>￥{{ row.payFee }}</span>
        </template>
        <!-- 业务类型 -->
        <template v-slot:slot_bizType="{ row }">
          <div v-if="row.bizType == 'CONSULT'">在线咨询</div>
          <div v-if="row.bizType == 'REPEAT_CLINIC'">在线复诊</div>
          <div v-if="row.bizType == 'CARRYON_PRESC'">慢病续方</div>
        </template>
        <!-- 业务形式 -->
        <template v-slot:slot_wayType="{ row }">
          <div v-if="row.wayType == 'GRAPHIC'">图文</div>
          <div v-if="row.wayType == 'VIDEO'">视频</div>
          <div v-if="row.wayType == 'PHONE'">电话</div>
        </template>
        <!-- 业务形式 -->
        <template v-slot:slot_orderStatus="{ row }">
          <div v-if="row.orderStatus == 'UNPAID'">待付款</div>
          <div v-if="row.orderStatus == 'PAID'">已支付</div>
          <div v-if="row.orderStatus == 'WAIT_TREAT'">待接诊</div>
          <div v-if="row.orderStatus == 'IN_TREAT'">接诊中</div>
          <div v-if="row.orderStatus == 'WAIT_TAKE'">待自提</div>
          <div v-if="row.orderStatus == 'WAIT_SEND'">待发货</div>
          <div v-if="row.orderStatus == 'WAIT_RECEIVE'">待收货</div>
          <div v-if="row.orderStatus == 'TO_EVALUATE'">待评价</div>
          <div v-if="row.orderStatus == 'IN_AFTER_SALE'">售后中</div>
          <div v-if="row.orderStatus == 'FINISHED'">已完成</div>
          <div v-if="row.orderStatus == 'CLOSED'">已关闭</div>
        </template>
      </List>
    </el-tab-pane>

    <el-tab-pane label="评价信息" name="comment" lazy>
      <p>评分：{{ avgScore }}</p>

      <el-row
        v-for="{
          id,
          avatar,
          userName,
          bizType,
          bizWay,
          content,
          average,
          answerContent,
          answerTime,
          createTime,
          answer,
        } in comment.list"
        :key="id"
        style="
          padding-bottom: 20px;
          margin-top: 20px;
          border-bottom: 1px solid #e6e6e6;
        "
      >
        <el-col :span="2" class="is-center">
          <el-avatar :src="FILE_URL(avatar)"></el-avatar>
        </el-col>
        <el-col :span="22">
          <div style="display: flex;">
            <span class="info">{{ userName }}</span>
            <el-tag style="margin-left: 10px;" size="mini">{{
              BizWayMap[bizWay]
            }}</el-tag>
            <el-tag style="margin-left: 10px;" size="mini">{{
              BizTypeMap[bizType]
            }}</el-tag>

            <span class="info" style="margin-left: auto;">{{
              createTime
            }}</span>
          </div>

          <p>{{ content }}</p>
          <div style="display: flex;">
            <el-rate
              :value="average * 1"
              disabled
              text-color="#ff9900"
              show-text
              :texts="[
                average + ' 不满意',
                average + ' 一般',
                average + ' 满意',
                average + ' 较满意',
                average + ' 非常满意',
              ]"
              score-template="{value}"
            >
            </el-rate>
            <!-- <span
              style="
                padding-left: 10px;
                font-size: 14px;
                color: #ff9900;
                line-height: 19px;
              "
              >{{ average }}</span
            > -->
          </div>

          <div
            v-if="answer"
            class="view__content"
            style="
              display: flex;
              margin: 20px 0 0 0;
              padding-top: 20px;
              border-top: 1px solid #e6e6e6;
            "
          >
            <span class="info" style="margin-right: 20px; min-width: 2em;">
              回复
            </span>
            {{ answerContent }}

            <span
              class="info"
              style="margin-left: auto; min-width: 130px; text-align: right;"
            >
              {{ answerTime }}
            </span>
          </div>
        </el-col>
      </el-row>

      <TableFooterTool
        :total="comment.allList.length"
        v-model="comment.query"
        @change="changePage"
      />
    </el-tab-pane>

    <el-tab-pane label="操作日志" name="log" lazy v-loading="log.loading">
      <List
        v-model="log.query"
        :filter="filter.log"
        :columns="log.columns"
        :tableData="log.tableData"
      >
      </List>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { PersonalInfo, Business } from './components'
import { List, mixin, TableFooterTool } from '@/components'

// import { randomString, formatDate } from '@/utils'
import { accountGet, findEvaluateData } from '@/api/authority'
import { loggerManageData } from '@/api/log'
import { titleChooseList } from '@/api'
import { getBusOrderList } from '@/api/order'
import { BizWayMap, BizTypeMap } from '@/utils/enums.js'
const pre = {
  detail: {},
}

export default {
  name: 'AuthorityDetail',
  props: {
    audit: Boolean,
  },
  components: {
    PersonalInfo,
    Business,
    List,
    TableFooterTool,
  },
  mixins: [
    mixin([
      { fetchListFunction: getBusOrderList, prop: 'info' },
      { fetchListFunction: loggerManageData, prop: 'log' },
    ]),
  ],
  data() {
    this.filter = {
      info: {
        date: {
          props: {
            options: [{ label: '创建时间', value: 0 }],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '订单号', value: 0 },
              { label: '员工', value: 2 },
              { label: '患者姓名', value: 1 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '业务类型',
              options: [
                { label: '不限', value: '' },
                { label: '在线咨询', value: 'CONSULT' },
                { label: '在线复诊', value: 'REPEAT_CLINIC' },
                { label: '慢病续方', value: 'CARRYON_PRESC' },
              ],
            },
            keys: 'bizType',
          },
          {
            props: {
              label: '业务形式',
              options: [
                { label: '不限', value: '' },
                { label: '图文', value: 'GRAPHIC' },
                { label: '视频', value: 'VIDEO' },
                { label: '电话', value: 'PHONE' },
              ],
            },
            keys: 'wayType',
          },
          {
            props: {
              label: '职称',
              options: [
                { label: '不限', value: '' },
                ...pre.title.map(_ => ({ label: _.name, value: _.id })),
              ],
            },
            keys: 'titleId',
          },
          {
            props: {
              label: '订单状态',
              options: [
                { label: '不限', value: '' },
                { label: '待付款', value: 'UNPAID' },
                { label: '待接诊', value: 'WAIT_TREAT' },
                { label: '接诊中', value: 'IN_TREAT' },
                { label: '已支付', value: 'PAID' },
                { label: '待自提', value: 'WAIT_TAKE' },
                { label: '待发货', value: 'WAIT_SEND' },
                { label: '待收货', value: 'WAIT_RECEIVE' },
                { label: '待评价', value: 'TO_EVALUATE' },
                { label: '售后中', value: 'IN_AFTER_SALE' },
                { label: '已完成', value: 'FINISHED' },
                { label: '已关闭', value: 'CLOSED' },
              ],
            },
            keys: 'orderStatus',
          },
          {
            props: {
              label: '订单金额',
              is: 'InputRange',
            },
            keys: ['startPayFee', 'endPayFee'],
          },
        ],
      },
      // log: {
      //   date: {
      //     props: {
      //       options: [{ label: '操作时间', value: 0 }],
      //     },
      //     keys: ['timeType', 'startTime', 'endTime'],
      //   },
      //   search: {
      //     props: {
      //       options: [
      //         { label: '操作内容', value: 0 },
      //         { label: '操作人', value: 1 },
      //       ],
      //     },
      //     keys: ['searchType', 'searchKeywords'],
      //   },
      // },
    }
    this.BizWayMap = BizWayMap
    this.BizTypeMap = BizTypeMap
    return {
      activeName: this.$route.query.activeName ?? 'audit',
      userName: '', // 当前员工名字
      avgScore: '-',

      info: {
        query: {
          timeType: 0,
          searchType: 2,
          pageSize: 10,
          currentNum: 1,
          searchKeywords: pre.detail.name,
        },
        columns: {
          createTime: {
            minWidth: 160,
          },
          index: {
            hidden: true,
          },
          sex: {
            hidden: true,
          },
          age: {
            hidden: true,
          },
          op: {
            hidden: true,
          },
          bizType: {
            prop: 'slot_bizType',
          },
          wayType: {
            prop: 'slot_wayType',
          },
          orderStatus: {
            prop: 'slot_orderStatus',
          },
          payFee: {
            prop: 'slot_payFee',
          },
        },
      },

      log: {
        query: {
          pageSize: 10,
          timeType: 0,
          searchType: 0,
          type: 0,
          businessRel: this.$route.params.id,
        },
        columns: {
          index: {
            hidden: true,
          },
          createTime: {
            minWidth: 160,
          },
        },
      },

      comment: {
        query: {
          pageSize: 10,
          currentNum: 1,
          dateType: 0,
          searchType: 0,
        },
        list: [],
        allList: [],
      },
    }
  },
  computed: {
    detail() {
      return pre.detail
    },
  },
  async beforeRouteEnter(to, from, next) {
    ;[pre.detail, pre.title] = await Promise.all([
      accountGet({ id: to.params.id }),
      titleChooseList(),
    ])
    next()
  },
  methods: {
    changePage() {
      // console.log(e)
      // console.log(this.comment.query)
      this.comment.list = this.comment.allList.slice(
        (this.comment.query.currentNum - 1) * 10,
        (this.comment.query.currentNum - 1) * 10 + 10,
      )
    },
    async handleTabClick({ name, $slots }) {
      if (['audit', 'business'].includes(name)) return

      if ('comment' === name) {
        if (this.comment.length) return
        // fetch comment
        const res = await findEvaluateData({ doctorId: this.detail.id })
        this.comment.allList = [...res.items, ...res.items, ...res.items]
        this.comment.list = this.comment.allList.slice(
          (this.comment.query.currentNum - 1) * 10,
          (this.comment.query.currentNum - 1) * 10 + 10,
        )
        this.avgScore = (Math.round(res.score * 10) / 10).toFixed(1)

        // this.comment.list = await Promise.resolve(
        //   Array.from({ length: 10 }).map((_, index) => ({
        //     id: randomString(),
        //     avatar:
        //       'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        //     name: '用户姓名',
        //     tag: '图文',
        //     comment: '非常好，我非常满意',
        //     star: 5,
        //     reply:
        //       index === 1
        //         ? {
        //             text: '谢谢！',
        //             datetime: formatDate(new Date(), 'yyyy-MM-dd hh:mm'),
        //           }
        //         : '',
        //     datetime: formatDate(new Date(), 'yyyy-MM-dd hh:mm'),
        //   })),
        // )

        return
      }

      if (this[name]?.tableData.list.length > 0) {
        this.$nextTick(() => {
          $slots.default?.[0].componentInstance?.doLayout?.()
        })
        return
      }

      this.table.tableData.list.length || this.$_fetchTableData()
    },
  },
}
</script>

<style lang="scss">
@use '@/styles/_modules-detail.scss';
</style>
