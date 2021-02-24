<template>
  <section class="view__p-mine-detail">
    <header v-if="patientInfo">
      <div class="top">
        <h3>{{ patientInfo.name }}</h3>
        <div class="code">
          {{ patientInfo.childState == 0 ? '成人' : '儿童' }}
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

          <template v-slot:slot_patientAtt="{ row }">
            <span>{{ row.child ? '就诊人、监护人' : '就诊人' }}</span>
          </template>
        </List>
      </el-tab-pane>
      <el-tab-pane label="服务订单" name="service" lazy>
        <List
          v-model="service.query"
          :columns="service.columns"
          :tableData="service.tableData"
        >
          <!-- 查看 -->
          <template v-slot:fixed="{ row }">
            <router-link
              class="el-button el-button--text"
              :to="
                $route.path === '/patient/patientTube/detail/detail'
                  ? `/order/business/detail/${row.orderId}`
                  : `/business/order/detail/${row.orderId}`
              "
            >
              查看
            </router-link>
          </template>
        </List>
      </el-tab-pane>
      <el-tab-pane label="诊室记录" name="clinic" lazy>
        <ul class="card-wrapper clinic">
          <li
            v-for="{
              clinicId,
              title,
              unread,
              name,
              type,
              datetime,
              text,
              sessionId,
              userId,
              orderId,
              state,
            } in clinic.list"
            :key="clinicId"
          >
            <p>
              <strong>{{ name }}</strong>
              <el-tag :type="type === '视频' ? 'danger' : ''" size="mini">
                {{ type }}
              </el-tag>
            </p>
            <p>{{ datetime }}</p>
            <p class="text-overflow">{{ text }}</p>
            <el-button
              type="text"
              @click="gotoRoomInfo({ sessionId, clinicId, userId, orderId })"
              >查看</el-button
            >

            <div
              class="prepend"
              :class="{
                typeOne: title === '在线咨询',
                typeTwo: title === '在线复诊',
                typeTree: title === '慢病续方',
              }"
              :data-unread="unread < 100 ? unread : '99+'"
            >
              {{ title }}
            </div>
            <div class="append" :class="{ close: state !== '已结束' }">
              {{ state }}
            </div>
          </li>
        </ul>

        <TableFooterTool
          v-model="clinic.query"
          @change="changePage"
          :total="clinic.list.length"
        />
      </el-tab-pane>
      <el-tab-pane label="就诊记录" name="treat" lazy>
        <TimeAxis :tiemDatas="tiemDatas" @changeTime="changeTime" />
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
                >{{
                  userId === doctorId ||
                  clientType === 'ORG_WEB' ||
                  open ||
                  pathInfo
                    ? ''
                    : '申请'
                }}查看</el-button
              >
            </p>
          </li>
        </ul>

        <TableFooterTool
          v-model="treat.query"
          @change="changePageHis"
          :total="treat.list.length"
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
  orderList,
  clinicRoomList,
  medicalList,
  informationList,
  getMedicalTimeGroup,
  applyAuthByDocWeb,
} from '@/api/list'
//类型枚举
import types from '../enumsList'
export default {
  name: 'Detail',
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
      { fetchListFunction: orderList, prop: 'service' },
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
          patientAtt: {
            prop: 'slot_patientAtt',
          },
          sex: {
            formatter(row) {
              return row.sex == 0 ? '女' : row.sex == 1 ? '男' : ''
            },
          },
        },
        tableData: {},
      },
      //服务订单参数
      service: {
        query: {
          pageSize: 10,
          dateType: 0,
          searchType: 0,
          patientId: this.$route.query.patientId,
          sourceType: this.$store.state.user.platform === 'ORG_WEB' ? 1 : 0,
        },
        columns: {
          createTime: {
            minWidth: 160,
          },
          index: {
            hidden: true,
          },
          orderType: {
            formatter(row) {
              return row.orderType === 'CONSULT'
                ? '在线咨询'
                : row.orderType === 'REPEAT_CLINIC'
                ? '在线复诊'
                : row.orderType === 'CARRYON_PRESC'
                ? '慢病续方'
                : ''
            },
          },
          wayType: {
            formatter(row) {
              return row.wayType === 'GRAPHIC'
                ? '图文'
                : row.wayType === 'VIDEO'
                ? '视频'
                : row.wayType === 'PHONE'
                ? '电话'
                : ''
            },
          },
          orderStatus: {
            formatter(row) {
              return row.orderStatus === 'UNPAID'
                ? '待付款'
                : row.orderStatus === 'PAID'
                ? '已支付'
                : row.orderStatus === 'WAIT_TREAT'
                ? '待接诊'
                : row.orderStatus === 'IN_TREAT'
                ? '接诊中'
                : row.orderStatus === 'WAIT_TAKE'
                ? '待自提'
                : row.orderStatus === 'WAIT_SEND'
                ? '待发货'
                : row.orderStatus === 'WAIT_RECEIVE'
                ? '待收货'
                : row.orderStatus === 'TO_EVALUATE'
                ? '待评价'
                : row.orderStatus === 'IN_AFTER_SALE'
                ? '售后中'
                : row.orderStatus === 'FINISHED'
                ? '已完成'
                : row.orderStatus === 'CLOSED'
                ? '已关闭'
                : ''
            },
          },
          price: {
            formatter(row) {
              return '￥' + row.price
            },
          },
        },
        tableData: {},
      },
      //诊室记录参数
      clinic: {
        list: [],
        query: {
          pageSize: 10,
          currentNum: 1,
          sourceType: this.$store.state.user.platform === 'ORG_WEB' ? 1 : 0,
        },
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
      //操作日志参数
      log: {
        query: {
          businessRel: this.$route.query.patientId,
        },
        columns: {
          createTime: {
            minWidth: 160,
          },
        },
      },
    }
  },
  async created() {
    this.init()
  },

  methods: {
    async init() {
      this.pathInfo =
        this.$route.path === '/patient/patientTube/detail/detail' ? true : false
      this.userId = this.$store.state.user.userId
      this.clientType = this.$store.state.user.platform
      this.getPatientInfo()
      this.clinicRoomList()
      this.$nextTick(() => {
        this.activeName = 'basicInfo'
      })
      //请求列表数据
      this.getInformationList()
      this.getOrderList()
      //先请求时间轴数据
      await this.getMedicalTimeGroup()
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
      this.$set(this.basicInfo, 'tableData', res)
    },
    //获取服务订单列表
    async getOrderList() {
      const query = {
        pageSize: 10,
        dateType: 0,
        searchType: 0,
        patientId: this.$route.query.patientId,
        sourceType: this.$store.state.user.platform === 'ORG_WEB' ? 1 : 0,
      }
      const res = await orderList(query)
      this.$set(this.service, 'tableData', res)
    },
    //获取诊室记录列表
    async clinicRoomList() {
      const res = await clinicRoomList({
        patientId: this.$route.query.patientId,
        ...this.clinic.query,
      })
      //数据处理
      const { orderType, wayType, status } = types
      this.clinic = {
        list: res.list.map(_ => ({
          clinicId: _.clinicId,
          memberId: _.memberId,
          title: orderType[_.orderType],
          unread: 4,
          name: _.name,
          type: wayType[_.wayType],
          datetime: _.createTime,
          text: _.illnessDesc,
          state: status[_.status],
          sessionId: _.sessionId,
          userId: _.userId,
          orderId: _.orderId,
        })),
        query: {
          pageSize: 10,
          currentNum: 1,
        },
      }
    },
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
        },
      }
    },
    //诊室记录列表页码变化
    changePage(page) {
      this.clinic.query = {
        ...page,
      }
      this.clinicRoomList()
    },
    changePageHis(page) {
      this.treat.query = {
        ...page,
      }
      this.medicalList()
    },
    //查看诊室记录
    gotoRoomInfo(row) {
      this.$router.push({
        path:
          this.$route.path === '/patient/patientTube/detail/detail'
            ? '/patient/patientTube/detail/roominfo'
            : '/patient/mine/detail/roominfo',
        query: {
          sessionId: row.sessionId,
          clinicId: row.clinicId,
          userId: row.userId,
          orderId: row.orderId,
        },
      })
    },
    //查看就诊记录详情
    async goRecordInfo(row) {
      if (
        this.userId === row.doctorId ||
        this.clientType === 'ORG_WEB' ||
        row.open ||
        this.pathInfo
      ) {
        this.$router.push({
          path:
            this.$route.path === '/patient/patientTube/detail/detail'
              ? '/patient/patientTube/detail/recordInfo'
              : '/patient/mine/detail/recordInfo',
          query: {
            medicalId: row.medicalId,
          },
        })
      } else {
        await applyAuthByDocWeb({
          medicalId: row.medicalId,
          patientId: row.patientId,
        })
        this.$alert('已发送查看申请!')
      }
    },
    //时间线数据
    async getMedicalTimeGroup() {
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
    console.log(this.$_fetchTableData, '--------------------')
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
