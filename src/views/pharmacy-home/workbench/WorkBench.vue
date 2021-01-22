<template>
  <section class="view__card">
    <div class="partTitle">
      我的工作台
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <div
          :class="waitTake == 0 ? 'order1 gray' : 'order1'"
          @click="goWaitTake(waitTake)"
        >
          <div class="num">{{ waitTake }}</div>
          <div class="title">待自提订单</div>
          <div class="describe">预约了当天要自提的处方订单</div>
        </div></el-col
      >
      <el-col :span="8">
        <div
          :class="waitSend == 0 ? 'order2 gray' : 'order2'"
          @click="goWaitSend(waitSend)"
        >
          <div class="num">{{ waitSend }}</div>
          <div class="title">待发货订单</div>
          <div class="describe">需要发货的处方订单</div>
        </div></el-col
      >
      <el-col :span="8">
        <div
          :class="stockWarn == 0 ? 'order3 gray' : 'order3'"
          @click="goStockWarn(stockWarn)"
        >
          <div class="num">{{ stockWarn }}</div>
          <div class="title">库存告急</div>
          <div class="describe">库存低于最低值的药品</div>
        </div></el-col
      >
    </el-row>
    <div class="partTitle">
      核销
    </div>
    <div class="inputBox">
      <el-input placeholder="请输入兑换码" v-model="inputCode">
        <template slot="prepend">兑换码</template>
        <template slot="append"
          ><span @click="handleExchange">兑换</span></template
        >
      </el-input>
    </div>
    <!-- 表格 -->
    <el-row class="tableBox" v-if="perInfo.orderId">
      <el-col :span="24">
        <div class="infoBox">
          <el-row class="inforow">
            <el-col :span="8">
              <div class="infotitle">订单号</div>
              {{ perInfo.orderId }}
            </el-col>
            <el-col :span="8" class="item-align"
              ><div class="infotitle1">下单人</div>
              <!-- <el-avatar
                :size="30"
                :src="FILE_URL(perInfo.userAvatar)"
                :style="{ 'margin-left': '10px' }"
              > 
              </el-avatar>-->
              <el-image
                style="
                  width: 30px;
                  height: 30px;
                  border-radius: 50%;
                  margin-right: 10px;
                "
                :src="FILE_URL(perInfo.userAvatar)"
                :fit="cover"
              >
                <div slot="error" class="image-slot">
                  <img src="@/assets/headerImg.png" />
                </div>
              </el-image>
              {{ perInfo.userName }} {{ perInfo.userPhone }}
            </el-col>
            <el-col :span="8">
              <div class="infotitle1">下单时间</div>
              {{ perInfo.createTime }}
            </el-col>
          </el-row>
          <el-row class="inforow">
            <el-col :span="8">
              <div class="infotitle">就诊人</div>
              {{ perInfo.memberName }}
            </el-col>
            <el-col :span="8"
              ><div class="infotitle1">预留手机</div>
              {{ perInfo.memberPhone }}</el-col
            >
            <el-col :span="8"
              ><div class="infotitle1">预约时间</div>
              {{ moment(perInfo.date).format('YYYY-MM-DD') }}
              {{ perInfo.startTime }} - {{ perInfo.endTime }}</el-col
            >
          </el-row>
          <el-row class="inforow">
            <el-col :span="24">
              <div class="infotitle">药品数量</div>
              {{ tableData.length }}
            </el-col>
          </el-row>
        </div>

        <!-- 表格 -->
        <el-table
          :data="tableData"
          border
          style="width: 100%;"
          class="tableList"
        >
          <el-table-column prop="seq" label="序号" width="70" type="index">
          </el-table-column>
          <el-table-column prop="type" label="类型" width="80">
          </el-table-column>
          <el-table-column prop="name" label="药品名称"> </el-table-column>
          <el-table-column prop="spec" label="规格"> </el-table-column>
          <el-table-column prop="useWays" label="用药途径"> </el-table-column>
          <el-table-column prop="singleDose" label="单次剂量">
          </el-table-column>
          <el-table-column prop="useFrequency" label="用药频次">
          </el-table-column>
          <el-table-column prop="total" label="总量"> </el-table-column>
          <el-table-column label="医保"
            >{{
              medicare == 'A'
                ? '甲'
                : medicare == 'B'
                ? '乙'
                : medicare == 'C'
                ? '丙'
                : '自费'
            }}
          </el-table-column>
          <el-table-column prop="price" label="单价"></el-table-column>
          <el-table-column prop="totalPrice" label="总价"> </el-table-column>
          <el-table-column prop="pharmacyName" label="接收方">
          </el-table-column>
          <el-table-column prop="remark" label="备注"> </el-table-column>
        </el-table>

        <!-- 按钮 -->
        <div class="buttonBox">
          <el-button class="cancle" @click="andleCancel">取消</el-button>
          <el-button class="confirm" @click="handleConfirm">确认</el-button>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script>
// import { List, mixin } from '@/components'
import { getOrderNum, getExchangeInfo, confirmExchange } from '@/api/phaIndex'
import moment from 'moment'

let drugType = {
  WESTERN_MEDICINE: '西药',
  CHINESE_PATENT_MEDICINE: '中成药',
  HERBS: '草药',
}
export default {
  name: 'TableList',

  data() {
    return {
      inputCode: '',
      // 待自提订单数量
      waitTake: '',
      // 代发货订单
      waitSend: '',
      stockWarn: '',
      warnVal: '',
      tableData: [
        // {
        //   type: '西药',
        //   drugsName: '盐酸美林他嗪片',
        //   specifications: '20mg*30',
        //   channel: '口服',
        //   singleDose: '1.5mg',
        //   rate: '每日一次',
        //   total: '4盒',
        //   medicalInsurance: '自费',
        //   price: '10.00',
        //   totalPrice: '40.00',
        //   receiver: '药房名称',
        //   remarks: '忌口辛辣食物',
        // },
      ],
      // 兑换码返回的个人信息
      perInfo: {},
      moment: moment,
    }
  },
  created() {
    this.getOrderNumber()
  },
  methods: {
    goWaitTake(waitTake) {
      if (waitTake != 0) {
        // 获取今天的时间并转换成相应的格式
        let nowDate = new Date()
        let date = {
          year: nowDate.getFullYear(),
          month: nowDate.getMonth() + 1,
          date: nowDate.getDate(),
        }
        console.log(date)
        if (date.month < 10) {
          date.month = '0' + date.month
        }
        if (date.date < 10) {
          date.date = '0' + date.date
        }
        let startTime = '' + date.year + date.month + date.date + '000000'
        // 获取明天的时间
        var nowDate1 = new Date()
        nowDate1.setTime(nowDate1.getTime() + 24 * 60 * 60 * 1000)
        var year = nowDate1.getFullYear()

        var month =
          nowDate1.getMonth() + 1 < 10
            ? '0' + (nowDate1.getMonth() + 1)
            : nowDate1.getMonth() + 1

        var day =
          nowDate1.getDate() < 10
            ? '0' + nowDate1.getDate()
            : nowDate1.getDate()

        var endTime = '' + year + month + day + '000000'

        console.log(startTime, '时间', endTime)
        this.$router.push({
          path: '/order/tocarryorder/orderList',
          query: {
            start_time: startTime,
            end_time: endTime,
            timeType: 3,
          },
        })
      }
    },
    goWaitSend(waitSend) {
      if (waitSend != 0) {
        this.$router.push({
          path: '/order/tosendorder/orderList',
        })
      }
    },
    goStockWarn(stockWarn) {
      if (stockWarn != 0) {
        this.$router.push({
          path: '/drugs/drugsmanage',
          query: {
            warnVal: this.warnVal,
          },
        })
      }
    },
    // 点击查看更多
    // showMore() {
    //   this.dialogVisible = true
    // },
    // 获取订单数量
    async getOrderNumber() {
      let res = await getOrderNum({
        pharmacyId: this.$store.state.user.store.id,
      })
      this.waitTake = res.waitTake
      this.waitSend = res.waitSend
      this.stockWarn = res.stockWarn
      this.warnVal = res.warnVal
    },
    // 点击兑换
    async handleExchange() {
      if (!this.inputCode) return this.$message.warning('请输入兑换码！')
      const res = await getExchangeInfo({
        code: this.inputCode,
        pharmacyId: this.$store.state.user.store.id,
      }).catch(err => {
        if (err == 'Error: CUSTOM:兑换码错误，请重新输入') {
          this.inputCode = ''
          this.perInfo = {}
          this.tableData = []
        }
      })
      for (let i = 0; i < res.contentList.length; i++) {
        res.contentList[i].totalPrice = '￥' + res.contentList[i].totalPrice
        res.contentList[i].price = '￥' + res.contentList[i].price
        res.contentList[i].type = drugType[res.contentList[i].type]
      }
      this.perInfo = res
      this.tableData = res.contentList
    },
    //点击取消
    andleCancel() {
      this.inputCode = ''
      this.perInfo = {}
      this.tableData = []
    },
    // 点击兑换确定
    async handleConfirm() {
      await confirmExchange({
        code: this.inputCode,
        pharmacyId: this.$store.state.user.store.id,
      })
      this.$message.success('兑换成功！')
      this.perInfo = {}
      this.inputCode = ''
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.partTitle {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 500;
  border-left: 2px solid $--color-primary;
  margin-bottom: 29px;
  padding: 0 10px;
}

.order1 {
  background: url(../../../assets/yaofang/order1.png) no-repeat right;
  background-size: auto 100%;
  padding: 70px 0 70px 40px;
  overflow: hidden;
  cursor: pointer;
  .num {
    color: rgba(10, 178, 193, 1);
  }
}
.order2 {
  background: url(../../../assets/yaofang/order2.png) no-repeat right;
  background-size: auto 100%;
  padding: 70px 0 70px 40px;
  overflow: hidden;
  cursor: pointer;
  .num {
    color: #43c439;
  }
}
.gray {
  filter: grayscale(100%);
  filter: gray;
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
}
.order3 {
  background: url(../../../assets/yaofang/order3.png) no-repeat right;
  background-size: auto 100%;
  padding: 70px 0 70px 40px;
  overflow: hidden;
  cursor: pointer;
  .num {
    color: #ea7768;
  }
}
::v-deep .el-col {
  margin-bottom: 20px;
  .num {
    font-size: 50px;
    font-family: Arial;
    font-weight: bold;
    line-height: 1;
  }
  .title {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(26, 26, 26, 1);
    margin: 30px 0 19px 0;
  }
  .describe {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(102, 102, 102, 1);
  }
}
.inputBox {
  width: 50%;
  margin: 20px auto;
}
::v-deep .el-input__inner {
  height: 56px;
}

::v-deep .el-input-group__prepend {
  background: #fff;
  font-size: 18px;
  font-family: PingFang SC;
  color: rgba(51, 51, 51, 1);
}
::v-deep .el-input-group__append {
  background: #fff;
  border: 1px solid $--color-primary;
  color: $--color-primary;
}

.tableBox {
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(230, 230, 230, 1);
  padding: 30px;
  .el-col {
    margin: 0;
    .infoBox {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      .inforow {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .el-col:nth-child(1) {
          padding-left: 30px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          .infotitle {
            width: 65px;
            text-align: left;
            margin-right: 20px;
          }
          img {
            margin-right: 10px;
          }
        }
        .el-col {
          justify-content: flex-start;
          display: flex;
        }
      }
    }
  }

  .buttonBox {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    .confirm {
      background: $--color-primary;
      color: #fff;
    }
  }
}

::v-deep .el-table--border th {
  border-right: none;
}

::v-deep .el-table--border td {
  border-right: none;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}

::v-deep .el-input-group__append {
  cursor: pointer;
}

.item-align {
  display: flex;
  align-items: center;
}

.infotitle1 {
  width: 65px;
  text-align: left;
  margin-right: 20px;
}
</style>
