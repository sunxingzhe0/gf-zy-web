<template>
  <div class="view__card">
    <el-row style="margin-bottom: 15px; font-size: 14px">
      <el-col :span="16">
        活动名称：[{{ activityInfo.activityType || '-' }}]{{
          activityInfo.activityName || '-'
        }}</el-col
      >
      <el-col :span="8">活动ID：{{ activityInfo.id || '-' }}</el-col>
      <el-col :span="8"
        >负责人：{{ activityInfo.activityDirector || '-' }}
        {{ activityInfo.directorTitle || '-' }}
        {{ activityInfo.directorDept || '-' }}</el-col
      >
    </el-row>
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_name="{ row }">
        <span>{{ row.name }}</span>
        <span v-if="row.severePatient" class="color-red">{{ '重精' }}</span>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="handleDialog(0, row)"> 详情 </el-button>
        <el-button
          type="text"
          v-if="row.status == 2"
          @click="handleDialog(1, row)"
        >
          同意
        </el-button>
        <el-button
          type="text"
          v-if="row.status == 2"
          @click="handleDialog(2, row)"
        >
          拒绝
        </el-button>
      </template>
      <template v-slot:footertool>
        <el-button @click="exportList">导出</el-button>
        <span class="num">
          <span>报名人数：{{ dataNum.orderNum }}</span>
          <span>报名成功人数：{{ dataNum.orderSucNum }}</span>
          <span>待审核人数：{{ dataNum.toAuditNum }}</span>
        </span>
      </template>
    </List>
    <el-dialog
      :title="
        dialogType ? (dialogType == 1 ? '审核-同意' : '审核-拒绝') : '报名详情'
      "
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-row>
        <div v-if="dialogType === 0">
          <el-col :span="8"
            >状态：{{ statusType[infoData.status - 1] || '-' }}</el-col
          >
          <el-col :span="8"
            >是否退款：{{ infoData.refundFee ? '是' : '否' }}</el-col
          >
          <el-col :span="8">退款金额：{{ infoData.refundFee || '-' }}元</el-col>
          <el-col :span="8">退款方式：{{ infoData.refundWay || '-' }}</el-col>
        </div>
        <el-col :span="8">姓名：{{ infoData.name || '-' }}</el-col>
        <el-col :span="8">电话：{{ infoData.phone || '-' }}</el-col>
        <el-col :span="24">报名费：{{ infoData.cost || '-' }}元</el-col>
        <el-col v-if="dialogType === 1" :span="24">是否确认其报名成功？</el-col>
        <el-col v-if="dialogType === 2" :span="24">
          是否退款？
          <el-select v-model="refund" placeholder="请选择">
            <el-option
              v-for="item in refundOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8"
          >支付金额：{{
            infoData.payCost ? infoData.payCost + '元' : '-'
          }}</el-col
        >
        <el-col :span="8"
          >支付方式：{{
            infoData.payWay === 'WX_JSAPI' ? '微信支付' : '-'
          }}</el-col
        >
        <el-col :span="8">支付时间：{{ infoData.payTime || '-' }}</el-col>
        <el-col :span="8">审核人：{{ infoData.approver || '-' }}</el-col>
        <el-col :span="8"
          >审核结果：{{ infoData.approvalResult || '-' }}</el-col
        >
        <el-col :span="8">审核时间：{{ infoData.approvalTime || '-' }}</el-col>

        <el-col :span="24"
          >备注：
          <el-select
            v-if="dialogType"
            v-model="selectRemark"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span v-else>{{ infoData.remark || '-' }}</span>
        </el-col>
        <el-input
          v-if="dialogType && selectRemark == 0 && selectRemark !== ''"
          v-model="remarkInp"
          type="textarea"
          resize="none"
          :rows="4"
        ></el-input>
      </el-row>
      <span slot="footer" class="dialog-footer" v-if="dialogType">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <RegistrationInfo :show="isInfo" :id="row.id" @onClose="handleClose" />
  </div>
</template>

<script>
import { List, mixin } from '@/components'
import {
  signList,
  getSignById,
  getActivityDetail,
  signAgree,
  signRefuse,
  signExport,
  getCount,
} from '@/api/mindConsult/myActivity'
import RegistrationInfo from '../signupRecord/components/RegistrationInfo.vue'

export default {
  components: {
    List,
    RegistrationInfo,
  },
  mixins: [mixin([{ fetchListFunction: signList }])],
  data() {
    this.filter = {
      date: {
        props: {
          options: [{ label: '报名时间', value: 0 }],
        },
        keys: ['dateType', 'beginTime', 'endTime'],
      },
      inline: [
        {
          props: {
            label: '关键字',
            is: 'el-input',
          },
          data: {
            attrs: {
              placeholder: '姓名/电话',
            },
          },
          keys: 'keywords',
        },
        {
          props: {
            label: '状态',
            is: 'el-select',
            options: [
              { label: '全部', value: '' },
              { label: '报名成功', value: 1 },
              { label: '报名待审核', value: 2 },
              { label: '报名失败', value: 3 },
            ],
          },
          keys: 'status',
        },
        // {
        //   props: {
        //     label: '报名时间',
        //     is: 'el-date-picker',
        //   },
        //   data: {
        //     attrs: {
        //       type: 'datetimerange',
        //       startPlaceholder: '开始日期',
        //       endPlaceholder: '结束日期',
        //       defaultTime: ['00:00:00', '23:59:59'],
        //     },
        //   },
        //   keys: ['startTime', 'endTime'],
        // },
        {
          props: {
            label: '',
            is: 'el-checkbox',
          },
          data: {
            attrs: {
              label: '仅看退款的',
            },
            on: {
              change: e => {
                this.query.type = e
              },
            },
          },
          keys: 'type',
        },
      ],
    }
    return {
      dataNum: '',
      selectRemark: '',
      statusType: ['报名成功', '报名待审核', '报名失败', '活动费待支付'],
      activityInfo: {},
      infoData: {},
      dialogVisible: false,
      dialogType: 0,
      query: {
        activityId: this.$route.query.id,
        pageSize: 10,
        currentNum: 1,
        type: false,
        dateType: 0,
      },
      columns: {
        index: {
          hidden: true,
        },
        fixed: {
          minWidth: 140,
        },
        name: {
          prop: 'slot_name',
          minWidth: 150,
        },
        payWay: {
          formatter(row) {
            return row.payWay === 'WX_JSAPI' ? '微信支付' : row.payWay
          },
        },
        status: {
          formatter(row) {
            const statuss = ['报名成功', '报名审核', '报名失败', '活动费待支付']
            return statuss[row.status - 1]
          },
        },
      },
      options: [
        {
          value: '1',
          label: '已完成心理咨询',
        },
        {
          value: '0',
          label: '其他',
        },
      ],

      remarkInp: '',
      refundOptions: [
        {
          value: '2',
          label: '原路退回',
        },
        {
          value: '3',
          label: '线下退款',
        },
        {
          value: '1',
          label: '不退款',
        },
      ],
      refund: '',
      isInfo: false,
      row: {},
    }
  },
  created() {
    this.getActivityDetail()
    this.getAllDataNum()
  },
  computed: {
    // statistics() {
    //   return type => {
    //     const nums = [
    //       this.tableData.list.length,
    //       this.tableData.list.filter(v => v.status == 1).length,
    //       this.tableData.list.filter(v => v.status == 2).length,
    //     ]
    //     return nums[type]
    //   }
    // },
  },
  methods: {
    //统计数据
    async getAllDataNum() {
      this.dataNum = await getCount(this.query)
    },
    //导出报名名单
    async exportList() {
      await signExport(this.query)
    },
    //获取活动详情
    async getActivityDetail() {
      this.activityInfo = await getActivityDetail({
        activityId: this.$route.query.id,
      })
    },
    handleClose() {
      this.isInfo = false
      this.dialogVisible = false
    },
    //详情-同意-拒绝
    handleDialog(e, row) {
      console.log(this.selectRemark)
      this.row = { ...row }
      if (e !== 0) {
        this.dialogType = e
        this.getInfo(row.id)
        this.dialogVisible = true
      } else {
        this.isInfo = true
      }
    },
    //获取名单详情
    async getInfo(signId) {
      this.infoData = await getSignById({ signId })
    },
    //submit 同意拒绝
    async submit() {
      if (this.dialogType == 2 && !this.refund) {
        this.$message.warning('请选择退款方式！')
        return
      }
      this.dialogVisible = false
      const params = {
        approvalResult: this.dialogType, //1同意2拒绝
        refundWay: this.refund, //退款方式
        remark: this.remarkInp || this.selectRemark, //备注
        signId: this.row.id,
      }
      this.dialogType == 1 ? await signAgree(params) : await signRefuse(params)
      this.$message.success('操作成功！')
      this.$_fetchTableData()
      this.getAllDataNum()
    },
  },
}
</script>

<style lang="scss" scoped>
.c__list {
  height: calc(100vh - 155px);
}
::v-deep .el-checkbox__input {
  z-index: 0;
}
::v-deep .el-col {
  margin: 5px 0;
}
.num {
  font-size: 14px;
  span {
    margin-left: 20px;
  }
}

.color-red {
  color: #f74a4a;
  background: rgba(247, 74, 74, 0.15);
  font-size: 12px;
  padding: 2px 4px;
}
.color-org {
  color: #ff6600;
  background: rgba(247, 74, 74, 0.15);
  font-size: 12px;
  padding: 2px 4px;
}
</style>
