<template>
  <section class="view__p-mine-detail">
    <header>
      <div class="top">
        <h3>{{ patientInfo.name }}</h3>
        <div class="code">
          {{ patientInfo.childState == 0 ? '成人' : '儿童' }}
        </div>
        <div class="severe-patient" v-if="$route.query.severePatient == 'true'">
          重精
        </div>
      </div>
      <div class="bottom">
        <el-row>
          <el-col :span="5">
            <span>患者ID：</span>
            {{ patientInfo.cardNo }}
          </el-col>
          <el-col :span="4">
            <span>性别：</span>
            {{ patientInfo.sex }}
          </el-col>
          <el-col :span="5">
            <span>出生日期：</span>
            {{ patientInfo.birthday }}
          </el-col>
          <el-col :span="5">
            <span>民族：</span>
            {{ patientInfo.nation || '-' }}
          </el-col>
          <el-col :span="5">
            <span>身份证号：</span>
            {{ patientInfo.idCard }}
          </el-col>

          <!--  <el-col :span="8">
            <span>手机号：</span>
            {{ patientInfo.phone }}
          </el-col> -->
        </el-row>
      </div>
    </header>
    <el-tabs
      class="clinic__tabs"
      v-model="activeName"
      type="border-card"
      @tab-click="handleTabClick"
    >
      <el-tab-pane label="基本资料" name="basicInfo">
        <List
          v-model="basicInfo.query"
          :columns="basicInfo.columns"
          :tableData="basicInfo.tableData"
          v-if="$route.query.patientId"
        >
          <template v-slot:slot_userName="{ row }">
            <el-image :src="FILE_URL(row.avatar)">
              <img
                slot="error"
                class="image-slot"
                src="@/assets/headerImg.png"
              />
            </el-image>
            <span class="name">{{ row.userName }}</span>
          </template>

          <!-- <template v-slot:slot_patientAtt="{ row }">
            <span>{{ row.child ? '就诊人、监护人' : '就诊人' }}</span>
          </template> -->
        </List>
      </el-tab-pane>
      <el-tab-pane label="预约单" name="service" lazy>
        <List
          v-model="service.query"
          :columns="service.columns"
          :tableData="service.tableData"
        >
          <!-- 查看 -->
          <template v-slot:fixed="{ row }">
            <router-link
              class="el-button el-button--text"
              :to="`/order/hcReservations/hcReservationsDetail?id=${row.id}`"
            >
              查看
            </router-link>
          </template>
        </List>
      </el-tab-pane>
      <el-tab-pane label="活动报名" name="active">
        <List
          v-model="active.query"
          :columns="active.columns"
          :tableData="active.tableData"
        ></List>
      </el-tab-pane>
      <el-tab-pane label="请假申请单" name="leave">
        <List
          v-model="leave.query"
          :columns="leave.columns"
          :tableData="leave.tableData"
        ></List>
      </el-tab-pane>
      <el-tab-pane label="心咨就诊记录" name="xzRecode">
        <List
          v-model="xzRecode.query"
          :columns="xzRecode.columns"
          :tableData="xzRecode.tableData"
        >
          <!-- 查看 -->
          <template v-slot:fixed="{ row }">
            <router-link
              class="el-button el-button--text"
              :to="`/order/hcReservations/hcReservationsDetail?id=${row.id}`"
            >
              查看
            </router-link>
          </template>
        </List>
      </el-tab-pane>
      <el-tab-pane label="就诊记录" name="treat" lazy>
        <TimeAxis :tiemDatas="tiemDatas" @onchange="changeTime" />
        <ul class="card-wrapper treat" v-loading="isQuery">
          <li
            v-for="{
              medicalId,
              datetime,
              name,
              tag,
              dept,
              doctor,
              position,
              doctorId,
              open,
              patientId,
            } in treat.list"
            :key="medicalId"
            :data-tag="tag"
          >
            <p>门诊记录 {{ datetime }}</p>
            <p>{{ name }}</p>
            <p>
              {{ dept }} {{ doctor }} {{ position }}
              <el-button
                type="text"
                @click="goRecordInfo({ medicalId, doctorId, patientId, open })"
                >查看</el-button
              >
            </p>
          </li>
        </ul>

        <TableFooterTool
          v-model="treat.query"
          @change="changePageHis"
          :total="treat.total"
        />
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="log" lazy>
        <List
          v-model="log.query"
          :columns="log.columns"
          :tableData="log.tableData"
        >
        </List>
      </el-tab-pane>
    </el-tabs>
    <!-- <router-view></router-view> -->
  </section>
</template>

<script>
/**
 * @author xingzhesun
 * @name   Detail
 * @desc   患者详情
 * @props  id          string       memberId
 *         patientId   string       患者id
 * @emit   none
 */
import { List, mixin, TableFooterTool } from '@/components'
import TimeAxis from '@/components/App/TimeAxis'
// import { formatDate, randomString } from '@/utils'
import {
  loggerBillData,
  patientInfo,
  medicalList,
  informationList,
  getMedicalTimeGroup,
  // applyAuthByDocWeb,
} from '@/api/list'
import apiLeaveApproval from '@/api/mindConsult/leaveApproval'
import { queryReservation } from '@/api/mindConsult/order'
import { recordlist } from '@/api/mindConsult/myActivity'
//类型枚举
import types from '../enumsList'
export default {
  name: 'patient_mine_detail',
  props: {
    id: String,
    patientId: String,
  },
  components: {
    List,
    TableFooterTool,
    TimeAxis,
  },
  mixins: [
    mixin([
      { fetchListFunction: informationList, prop: 'basicInfo' },
      { fetchListFunction: queryReservation, prop: 'service' },
      { fetchListFunction: recordlist, prop: 'active' },
      { fetchListFunction: apiLeaveApproval.leaveList, prop: 'leave' },
      { fetchListFunction: queryReservation, prop: 'xzRecode' },
      { fetchListFunction: loggerBillData, prop: 'log' },
    ]),
  ],
  data() {
    return {
      //当前地址
      pathInfo: '',
      //端类型
      clientType: '',
      isQuery: false,
      //时间轴数据
      tiemDatas: [],
      //当前选中时间
      nowTime: {},
      //登录的id
      userId: '',
      //详情枚举项
      enums: [
        { lable: '患者ID', value: 'cardNo' },
        { lable: '出生日期', value: 'birthday' },
        { lable: '民族', value: 'nation' },
        { lable: '身份证号', value: 'idCard' },
        { lable: '性别', value: 'sex' },
        { lable: '就诊卡号', value: 'cardNo' },
        { lable: '手机号', value: 'phone' },
      ],
      //患者详情信息
      patientInfo: {},
      //默认选中项
      activeName: 'basicInfo',
      //基本资料参数
      basicInfo: {
        query: {
          pageSize: 10,
          patientId: this.$route.query.patientId, //患者进本信息id
        },
        columns: {
          createTime: {
            minWidth: 160,
          },
          birthday: {
            minWidth: 120,
          },
          address: {
            minWidth: 140,
          },
          idCard: {
            minWidth: 140,
          },
          addressNow: {
            minWidth: 140,
          },
          index: {
            hidden: true,
          },
          //头像
          userName: {
            prop: 'slot_userName',
            minWidth: 160,
          },
          // patientAtt: {
          //   prop: 'slot_patientAtt',
          // },
          sex: {
            formatter(row) {
              return row.sex == 0 ? '女' : row.sex == 1 ? '男' : ''
            },
          },
        },
        tableData: {},
      },
      //预约单
      service: {
        query: {
          pageSize: 10,
          dateType: 0,
          searchType: 0,
          patientId: this.$route.query.patientId,
        },
        columns: {
          reservationDate: {
            minWidth: 120,
            formatter(row) {
              return row.reservationDate.split(' ')[0]
            },
          },
          reservationDtime: {
            minWidth: 100,
          },
          entryName: {
            minWidth: 100,
          },
          index: {
            hidden: true,
          },
          busiType: {
            formatter(row) {
              return ['预约', '报名'][row.busiType - 1] || '-'
            },
          },
          orderType: {
            formatter(row) {
              return ['支付', '退费'][row.busiType] || '-'
            },
          },
          payWay: {
            formatter(row) {
              return row.payWay === 'WX_JSAPI'
                ? '微信支付'
                : row.payWay === 'OFFLINE_PAY'
                ? '线下支付'
                : row.payWay
            },
          },
          cost: {
            formatter(row) {
              return row.cost ? row.cost + '元' : '-'
            },
          },
          status: {
            formatter(row) {
              const statusTypes = ['已预约', '已请假', '请假中', '已关闭']
              return statusTypes[row.status - 1] || '-'
            },
          },
        },
        tableData: {},
      },
      //活动报名
      active: {
        query: {
          pageSize: 10,
          dateType: 0,
          searchType: 0,
          patientId: this.$route.query.patientId,
        },
        columns: {
          reservationDate: {
            minWidth: 120,
            formatter(row) {
              return row.reservationDate.split(' ')[0]
            },
          },
          reservationDtime: {
            minWidth: 100,
          },
          entryName: {
            minWidth: 100,
          },
          index: {
            hidden: true,
          },
          price: {
            formatter(row) {
              return '￥' + row.price
            },
          },
          status: {
            formatter(row) {
              return row.status == 1
                ? '报名成功'
                : row.status == 2
                ? '报名审核'
                : row.status == 3
                ? '报名失败'
                : ''
            },
          },
          activityStatus: {
            formatter(row) {
              return row.status == 1
                ? '进行中'
                : row.status == 2
                ? '已结束'
                : row.status == 3
                ? '暂停'
                : '未开始'
            },
          },
        },
        tableData: {},
      },
      //请假申请单
      leave: {
        query: {
          pageSize: 10,
          dateType: 0,
          searchType: 0,
          patientId: this.$route.query.patientId,
        },
        columns: {
          index: {
            hidden: true,
          },
          status: {
            formatter(row) {
              return row.status == 1
                ? '已预约'
                : row.status == 2
                ? '已请假'
                : row.status == 3
                ? '请假中'
                : '已关闭'
            },
          },
          approvalResult: {
            formatter(row) {
              return row.approvalResult == 1
                ? '同意'
                : row.approvalResult == 2
                ? '拒绝'
                : ''
            },
          },
          refundRel: {
            formatter(row) {
              return row.refundRel == 1 ? '是' : row.refundRel == 2 ? '否' : ''
            },
          },
          reservationDate: {
            minWidth: 120,
            formatter(row) {
              return row.reservationDate.split(' ')[0]
            },
          },
          entryName: {
            minWidth: 140,
          },
          phone: {
            minWidth: 120,
          },
          reservationDtime: {
            minWidth: 100,
          },
        },
        tableData: {},
      },
      //就诊记录参数
      treat: {
        list: [],
        query: {
          pageSize: 10,
          currentNum: 1,
          sourceType: this.$store.state.user.platform === 'ORG_WEB' ? 1 : 0,
        },
      },
      //心咨就诊记录
      xzRecode: {
        query: {
          pageSize: 10,
          dateType: 0,
          searchType: 0,
          patientId: this.$route.query.patientId,
          status: 1,
        },
        columns: {
          reservationDate: {
            minWidth: 120,
            formatter(row) {
              return row.reservationDate.split(' ')[0]
            },
          },
          reservationDtime: {
            minWidth: 100,
          },
          entryName: {
            minWidth: 100,
          },
          index: {
            hidden: true,
          },
          busiType: {
            formatter(row) {
              return ['预约', '报名'][row.busiType - 1] || '-'
            },
          },
          orderType: {
            formatter(row) {
              return ['支付', '退费'][row.busiType] || '-'
            },
          },
          payWay: {
            formatter(row) {
              return row.payWay === 'WX_JSAPI' ? '微信支付' : row.payWay
            },
          },
          cost: {
            formatter(row) {
              return row.cost ? row.cost + '元' : '-'
            },
          },
          status: {
            formatter(row) {
              const statusTypes = ['已预约', '已请假', '请假中', '已关闭']
              return statusTypes[row.status - 1] || '-'
            },
          },
        },
        tableData: {},
      },
      //操作日志参数
      log: {
        query: {
          businessRel: this.$route.query.patientId,
        },
        columns: {
          createTime: {
            minWidth: 160,
          },
          userDesc: {
            formatter(row) {
              return row.userDesc.substring(0, row.userDesc.indexOf(','))
            },
          },
          index: {
            hidden: true,
          },
        },
      },
    }
  },
  async created() {
    console.log(23455)
    if (this.$route.query.patientId) {
      this.init()
    }
  },

  watch: {
    '$route.query.patientId'() {
      if (!this.$route.query.patientId) return
      this.basicInfo.query.patientId = this.$route.query.patientId
      this.service.query.patientId = this.$route.query.patientId
    },
  },
  methods: {
    async init() {
      this.pathInfo =
        this.$route.path === '/patient/patientTube/detail/detail' ? true : false
      this.userId = this.$store.state.user.userId
      console.log(this.userId, '用户id')
      this.clientType = this.$store.state.user.platform
      this.getPatientInfo()
      this.activeName = 'basicInfo'
      // this.$nextTick(() => {
      //   this.activeName = 'basicInfo'
      // })
      //请求列表数据
      this.getInformationList()
      //先请求时间轴数据
      await this.getMedicalTimeGroupList()
      this.medicalList()
    },
    //切换菜单
    handleTabClick({ name, $slots }) {
      if (['clinic', 'treat'].includes(name)) return

      if (this[name]?.tableData.list.length > 0) {
        this.$nextTick(() => {
          $slots.default?.[0].componentInstance?.doLayout?.()
        })
        return
      }

      this.table.tableData.list.length || this.$_fetchTableData()
    },
    //获取患者详情信息
    async getPatientInfo() {
      const res = await patientInfo({ patientId: this.$route.query.patientId })
      //数据处理
      console.log(res, 111)
      res.sex === 0 && (res.sex = '女')
      res.sex === 1 && (res.sex = '男')
      this.patientInfo = res
    },
    //获取基本资料列表
    async getInformationList() {
      //重新定义参数 页面缓存后data中参数未变  需要重新获取
      const query = {
        pageSize: 10,
        patientId: this.$route.query.patientId, //患者进本信息id
      }
      const res = await informationList(query)
      res.done = true
      this.$set(this.basicInfo, 'tableData', res)
    },
    //获取服务订单列表

    //获取就诊记录列表
    async medicalList() {
      this.isQuery = true
      const res = await medicalList({
        patientId: this.$route.query.patientId,
        ...this.treat.query,
        ...this.nowTime,
      })
      this.isQuery = false
      const { type } = types
      this.treat = {
        total: res.total,
        list: res.list.map(_ => ({
          medicalId: _.medicalId,
          datetime: _.visitDate,
          name: _.name,
          tag: type[_.type],
          dept: _.deptName,
          doctor: _.doctorName,
          position: _.titleName,
          doctorId: _.doctorId,
          open: _.open,
          patientId: _.patientId,
        })),
        query: {
          pageSize: 10,
          currentNum: 1,
          sourceType: this.$store.state.user.platform === 'ORG_WEB' ? 1 : 0,
        },
      }
    },
    changePageHis(page) {
      this.treat.query = {
        ...page,
      }
      this.medicalList()
    },
    //查看就诊记录详情
    async goRecordInfo(row) {
      // if (
      //   this.userId === row.doctorId ||
      //   this.clientType === 'ORG_WEB' ||
      //   row.open ||
      //   this.pathInfo
      // ) {
      console.log(
        this.$route.path === '/patient/patientTube/mindDetail'
          ? '/patient/patientTube/detail/recordInfo'
          : '/patient/mine/detail/recordInfo',
      )
      console.log(row.medicalId)
      this.$router.push({
        path:
          this.$route.path === '/patient/patientTube/mindDetail'
            ? '/patient/patientTube/detail/recordInfo'
            : '/patient/mine/detail/recordInfo',
        query: {
          medicalId: row.medicalId,
        },
      })
      // } else {
      //   await applyAuthByDocWeb({
      //     medicalId: row.medicalId,
      //     patientId: row.patientId,
      //   })
      //   this.$alert('已发送查看申请!')
      // }
    },
    //时间线数据
    async getMedicalTimeGroupList() {
      let res = await getMedicalTimeGroup({
        patientId: this.$route.query.patientId,
      })
      this.tiemDatas = []
      for (let val of res) {
        for (let item of val.months) {
          this.tiemDatas.push(val.year + '年' + item + '月')
        }
      }
      this.nowTime = {
        year: this.tiemDatas[0]?.substr(0, 4) || '',
        month: this.tiemDatas[0]?.substr(5, 2) || '',
      }
      return true
    },
    //选中时间
    changeTime(data) {
      this.nowTime = {
        year: data?.substr(0, 4) || '',
        month: data?.substr(5, 2) || '',
      }
      this.medicalList()
    },
  },
  activated() {
    console.log('info------')
  },
  //判断跳转来源是否缓存页面
  beforeRouteEnter(to, from, next) {
    const caches = [
      '/order/business/detail',
      '/patient/patientTube/detail/roominfo',
      '/patient/patientTube/detail/recordInfo',
      '/business/order/detail',
      '/patient/mine/detail/roominfo',
      '/patient/mine/detail/recordInfo',
    ]
    const cache = caches.find(item => {
      return new RegExp(item).test(from.path)
    })
    if (cache) {
      next()
    } else {
      next(vm => {
        console.log('info1111111')
        vm.init()
      })
    }
  },
}
</script>

<style lang="scss">
@import '@/styles/_variables.scss';
@import '@/styles/_modules-detail.scss';

.view__p-mine-detail {
  .el-image {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 5px;
  }
  > * + * {
    margin-top: 20px;
  }

  > header {
    height: 130px;
    padding: 30px;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    background-image: url('../../../assets/infoTop.png');
    .top {
      display: flex;
      h3 {
        margin: 0 20px 0 0;
        font-size: 24px;
      }
      .code {
        width: 46px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        background: rgba($color: #000000, $alpha: 0.1);
      }
      .severe-patient {
        width: 46px;
        height: 24px;
        color: #f74a4a;
        font-size: 16px;
        background-color: rgba(255, 0, 0, 0.0980392156862745);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 10px;
      }
    }
    .bottom {
      color: #333;
    }
    .el-col {
      margin-top: 30px;
    }
  }
  .name {
    position: relative;
    bottom: 8px;
    left: 0;
  }
  .card-wrapper {
    display: grid;
    justify-content: space-around;
    grid-template-columns: repeat(auto-fill, minmax(300px, 350px));
    margin: -20px 0 0 -20px;
    padding-bottom: 10px;

    > li {
      position: relative;
      margin: 20px 0 0 20px;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      overflow: hidden;

      > p {
        margin: 0;
      }
    }

    &.clinic > li {
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      padding: 20px 20px 20px 100px;
      height: 160px;

      .prepend,
      .append {
        position: absolute;
      }

      .prepend {
        text-align: center;
        line-height: 80px;
        top: -106%;
        left: -126%;
        width: 500px;
        height: 500px;
        border-radius: 50%;
        border: 10px solid #f3fbfc;
        background: #e7f7f9;
        color: #0ab2c1;
        font-size: 22px;
        letter-spacing: 3px;
        writing-mode: vertical-rl;
      }
      .typeOne {
        border: 10px solid #f3fbfc;
        background: #e7f7f9;
        color: #00adbb;
      }
      .typeTwo {
        border: 10px solid #f4f7fd;
        background: #eaeffb;
        color: #2d5fdf;
      }
      .typeTree {
        border: 10px solid #f4fbf4;
        background: #e9f7e9;
        color: #26b523;
      }

      .append {
        right: 0;
        width: 62px;
        height: 20px;
        background: #f2f2f2;
        color: #999;
        border-radius: 10px 0px 0px 10px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;

        &.close {
          background: rgba(10, 178, 193, 0.1);
          color: #0ab2c1;
        }
      }

      .el-tag {
        margin-left: 10px;
      }

      .el-button {
        align-self: flex-end;
      }
      .el-button--text {
        font-size: 14px !important;
      }
    }

    &.treat > li {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px;
      height: 128px;

      &::after {
        position: absolute;
        top: 15px;
        right: -50px;
        width: 50%;
        padding: 6px 0;
        transform: rotate(45deg);
        text-align: center;
        background: $--color-primary;
        color: $--color-white;
        content: attr(data-tag);
      }

      > p {
        &:first-child {
          font-size: 14px;
          color: $--color-info;
        }

        &:last-child {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 18px;
          font-size: 14px;
        }
      }
    }
  }
  .clinic__tabs {
    width: 100%;
  }
}
</style>
