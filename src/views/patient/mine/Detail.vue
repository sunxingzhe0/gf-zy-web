<template>
  <section class="view__p-mine-detail">
    <header>
      <h3>{{ patientInfo.name }}</h3>

      <el-row v-if="patientInfo">
        <el-col v-for="val in enums" :key="val.value" :span="8">
          <span>{{ val.lable }}：</span>
          {{ patientInfo[val.value] }}
        </el-col>
      </el-row>
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
            <span>{{ row.userName }}</span>
          </template>
        </List>
      </el-tab-pane>
      <el-tab-pane label="服务订单" name="service" lazy>
        <List
          v-model="service.query"
          :columns="service.columns"
          :tableData="service.tableData"
        >
          <template v-slot:fixed="{ row }">
            <router-link
              class="el-button el-button--text el-button--mini"
              :to="`/business/order/detail/${row.orderId}`"
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
              state,
              sessionId,
              userId,
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
            <router-link
              class="el-button el-button--text el-button--mini"
              :to="`/patient/mine/roominfo/${sessionId}&${clinicId}&${userId}`"
            >
              查看
            </router-link>
            <div class="prepend" :data-unread="unread < 100 ? unread : '99+'">
              {{ title }}
            </div>
            <div class="append" :class="{ close: state === '已结束' }">
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
        <ul class="card-wrapper treat">
          <li
            v-for="{
              medicalId,
              datetime,
              name,
              tag,
              dept,
              doctor,
              position,
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
                @click="goRecordInfo('50D785D4EB5547CFAF36FEBF87146354')"
                >申请查看</el-button
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
// import { formatDate, randomString } from '@/utils'
import {
  loggerBillData,
  patientInfo,
  orderList,
  clinicRoomList,
  medicalList,
  informationList,
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
      //详情枚举项
      enums: [
        { lable: '姓名', value: 'name' },
        { lable: '就诊卡号', value: 'patientCard' },
        { lable: '性别', value: 'sex' },
        { lable: '出生日期', value: 'birthday' },
        { lable: '身份证号', value: 'idCard' },
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
          patientId: this.patientId, //患者进本信息id
        },
        columns: {
          createTime: {
            minWidth: 160,
          },
          index: {
            hidden: true,
          },
          //头像
          userName: {
            prop: 'slot_userName',
            minWidth: 90,
          },
        },
      },
      //服务订单参数
      service: {
        query: {
          pageSize: 10,
          dateType: 0,
          searchType: 0,
          sourceType: 0,
          memberId: this.id,
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
        },
      },
      //诊室记录参数
      clinic: {
        list: [],
        query: {
          pageSize: 10,
          currentNum: 1,
        },
      },
      //就诊记录参数
      treat: {
        list: [],
        query: {
          pageSize: 10,
          currentNum: 1,
        },
      },
      //操作日志参数
      log: {
        query: {
          businessRel: this.id,
        },
        columns: {
          createTime: {
            minWidth: 160,
          },
        },
      },
    }
  },
  created() {
    this.getPatientInfo()
    this.clinicRoomList()
    this.medicalList()
  },
  methods: {
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
      const res = await patientInfo({ memberId: this.id })
      this.patientInfo = res
    },
    //获取诊室记录列表
    async clinicRoomList() {
      const res = await clinicRoomList({
        memberId: this.id,
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
        })),
        query: {
          pageSize: 10,
          currentNum: 1,
        },
      }
      console.log(this.clinic)
    },
    //获取就诊记录列表
    async medicalList() {
      const res = await medicalList({
        memberId: this.id,
        ...this.treat.query,
      })
      console.log(res, '99-------')
      const { type } = types
      this.treat = {
        list: /* res.list */ [1, 2, 3].map(_ => ({
          medicalId: _.medicalId,
          datetime: _.visitDate,
          name: _.name,
          tag: type[_.type],
          dept: _.deptName,
          doctor: _.doctorName,
          position: _.titleName,
        })),
        query: {
          pageSize: 10,
          currentNum: 1,
        },
      }
      console.log(this.treat)
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
    //查看就诊记录详情
    goRecordInfo(parameter) {
      console.log(parameter, '入参-----')
      this.$router.push({
        name: 'recordInfo',
        params: {
          medicalId: parameter,
        },
      })
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_variables.scss';
@import '@/styles/_modules-detail.scss';
.el-tooltip {
  display: flex;
  align-items: center;
}
.el-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 5px;
}

.view__p-mine-detail {
  > * + * {
    margin-top: 20px;
  }

  > header {
    padding: 30px;
    background: $--color-primary;
    color: $--color-white;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;

    h3 {
      margin: 0;
    }

    .el-col {
      margin-top: 30px;
    }
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
        left: -125%;
        width: 500px;
        height: 500px;
        border-radius: 50%;
        border: 10px solid $--color-primary-light-9;
        background: $--color-primary;
        color: $--color-white;
        font-size: 24px;
        writing-mode: vertical-rl;

        /*  &::before {
          position: absolute;
          top: 38%;
          right: -10px;
          width: 25px;
          height: 25px;
          background: $--color-danger;
          border: 1px solid $--color-white;
          border-radius: 50%;
          line-height: 25px;
          writing-mode: lr;
          font-size: 12px;
          content: attr(data-unread);
        } */
      }

      .append {
        top: -60px;
        right: -60px;
        width: 120px;
        height: 120px;
        line-height: 200px;
        border-radius: 50%;
        text-align: center;
        background: $--color-primary;
        color: $--color-white;
        transform: rotate(45deg);

        &.close {
          background: $--color-info;
        }
      }

      .el-tag {
        margin-left: 10px;
      }

      .el-button {
        align-self: flex-end;
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
