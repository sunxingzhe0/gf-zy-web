<template>
  <div>
    <!-- 弹框 -->
    <el-dialog
      :title="diaTitle"
      :visible.sync="dialogVisible"
      width="80%"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <div class="sendContent">
        <!-- 基本信息 -->
        <el-row>
          <el-col :span="8">
            <div class="itemTitle">订单号</div>
            <div class="itemContent">{{ toSend.orderId }}</div>
          </el-col>
          <el-col :span="8">
            <div class="itemTitle">下单人</div>
            <el-avatar
              style="vertical-align: middle; margin-right: 15px"
              :src="FILE_URL(toSend.userAvatar)"
            ></el-avatar>
            <div class="itemContent">
              {{ toSend.userName }} {{ toSend.userPhone }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="itemTitle">下单时间</div>
            <div class="itemContent">{{ toSend.createTime }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="itemTitle">就诊人</div>
            <div class="itemContent">{{ toSend.memberName }}</div>
          </el-col>
          <el-col :span="8">
            <div class="itemTitle">预留手机</div>
            <div class="itemContent">{{ toSend.receiverPhone }}</div>
          </el-col>
          <el-col :span="8">
            <div class="itemTitle">预约时间</div>
            <div class="itemContent">{{ toSend.createTime }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="itemTitle">药品数量</div>
            <div class="itemContent" v-if="toSend.contentList">
              {{ toSend.contentList.length }}
            </div>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table
          :data="toSend.contentList"
          border
          style="width: 100%"
          class="tableList"
        >
          <el-table-column prop="index" label="序号" width="70" type="index">
          </el-table-column>
          <el-table-column label="类型" width="80">
            <template slot-scope="scoped"
              >{{ scoped.row.type == 'WESTERN_MEDICINE' ? '西药' : '中成药' }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="药品名称"> </el-table-column>
          <el-table-column prop="spec" label="规格"> </el-table-column>
          <el-table-column prop="useWays" label="用药途径"> </el-table-column>
          <el-table-column prop="singleDose" label="单次剂量">
          </el-table-column>
          <el-table-column prop="useFrequency" label="用药频次">
          </el-table-column>
          <el-table-column label="总量"> </el-table-column>
          <el-table-column label="医保">
            <template slot-scope="scoped"
              >{{
                scoped.row.medicare == 'A'
                  ? '甲'
                  : scoped.row.medicare == 'B'
                  ? '乙'
                  : scoped.row.medicare == 'C'
                  ? '丙'
                  : '自费'
              }}
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价"></el-table-column>
          <el-table-column prop="totalPrice" label="总价"> </el-table-column>
          <el-table-column prop="pharmacyName" label="接收方">
          </el-table-column>
          <el-table-column prop="remark" label="备注"> </el-table-column>
          <el-table-column label="所属包裹" width="120px ">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.exType"
                v-if="scope.row.exType"
                @change="handleChange(scope.row)"
              >
                <el-option
                  v-for="(item, index) in ruleForm.exList1"
                  :key="index"
                  :label="'包裹' + (index + 1)"
                  :value="index + 1"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
        <!-- 物流信息 -->
        <div class="wayInfo">
          <el-row>
            <el-col :span="24" class="titleText">物流信息</el-col>
          </el-row>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="logisticsInfo"
          >
            <el-row v-for="(item, index) in ruleForm.exList1" :key="index">
              <el-col :span="13">
                <div class="itemContent lableName">包裹{{ index + 1 }}</div>
                <el-form-item
                  label="物流信息"
                  :prop="'exList1.' + index + '.corpId'"
                  :rules="rules.logisticsInfo"
                >
                  <el-select
                    v-model="item.corpId"
                    placeholder="请选择物流"
                    @change="handleSel($event, index)"
                  >
                    <el-option
                      v-for="(_, index) in exListC"
                      :key="index"
                      :label="_.name"
                      :value="_.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item
                  label="运单号"
                  :prop="'exList1.' + index + '.expressNo'"
                  :rules="rules.waybill"
                  :style="{ width: '400px' }"
                >
                  <el-input v-model="item.expressNo"></el-input>
                </el-form-item>
                <el-button
                  class="mR"
                  type="text"
                  @click="handleDelete(index)"
                  v-if="ruleForm.exList1.length > 1 && index > 0"
                >
                  删除
                </el-button>
              </el-col>
            </el-row>
          </el-form>

          <!-- 新增 -->
          <el-row>
            <el-col :span="24" class="addNewWayInfo"
              ><span @click="handleAdd">+ 新增包裹</span></el-col
            >
          </el-row>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { toSend, exList, submitEx, editExpress } from '@/api/order'
export default {
  name: 'Tosend',
  data() {
    return {
      // 获取物流列表接口数据
      exListC: [],
      selEx: '',
      ruleForm: {
        exList1: [
          {
            corpId: '',
            expressNo: '',
            rpContentList: [],
            cropName: '',
          },
        ],
      },
      // 规则
      rules: {
        logisticsInfo: [
          { required: true, message: '请选择物流公司', trigger: 'change' },
        ],
        waybill: [
          { required: true, message: '请填写运单号', trigger: 'triger' },
        ],
      },
      // 查看弹框是否显示
      dialogVisible: false,
      // 待发货
      toSend: {},
      //  订单 id
      orderId: '',
      // 弹框标题
      diaTitle: '',
    }
  },
  created() {
    this.getExList()
  },
  methods: {
    // 发货
    async getToSendDrugs(id, type) {
      this.dialogVisible = true
      this.diaTitle = type == '1' ? '更新物流' : '发货'

      const res = await toSend({
        orderId: id,
        pharmacyId: this.$store.state.user.store.id,
      })
      this.orderId = res.orderId
      if (res.rpExpressList.length > 0) {
        this.ruleForm.exList1 = res.rpExpressList
      }
      if (this.ruleForm.exList1.length == 0) {
        this.handleAdd()
      }
      for (let i = 0; i < res.contentList.length; i++) {
        res.contentList[i].exType = 1
        for (let j = 0; j < this.ruleForm.exList1.length; j++) {
          if (res.contentList[i].exType == j + 1) {
            let arr = []
            arr.push(res.contentList[i].id)
            this.ruleForm.exList1[j].rpContentList = arr
          }
        }
      }
      this.toSend = res
    },
    // 物流列表
    async getExList() {
      const res = await exList({})
      this.exListC = res
    },
    // 更新物流
    // async updateExpress(id) {
    //   this.dialogVisible = true
    //   const res = await toSend({
    //     orderId: id,
    //     pharmacyId: this.$store.state.user.store.id,
    //   })
    //   this.toSend = res
    //   const res2 = await editExpress({
    //     orderId: id,
    //     pharmacyId: this.$store.state.user.store.id,
    //     expressList: this.ruleForm.exList,
    //   })
    //   console.log(res2)
    //   alert('1')
    // },
    // 点击新增物流包裹
    handleAdd() {
      this.ruleForm.exList1.push({
        corpId: '',
        expressNo: '',
        corpName: '',
      })
    },
    // 删除包裹
    handleDelete(i) {
      this.$confirm('是否要删除该物流信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.ruleForm.exList1.splice(i, 1)
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 修改物流信息
    handleSel(e, index) {
      for (let i = 0; i < this.exListC.length; i++) {
        if (this.exListC[i].code == e) {
          console.log(this.ruleForm.exList1[0])
          console.log(this.exListC[i].name)

          this.ruleForm.exList1[index].corpName = this.exListC[i].name
        }
      }
      console.log(this.ruleForm.exList1)
    },
    // 提交新增包裹
    async handleSubmit() {
      if (this.diaTitle == '更新物流') {
        await editExpress({
          orderId: this.orderId,
          pharmacyId: this.$store.state.user.store.id,
          expressList: this.ruleForm.exList1,
        })
      } else {
        await submitEx({
          expressList: this.ruleForm.exList1,
          orderId: this.orderId,
          pharmacyId: this.$store.state.user.store.id,
        })
      }
      this.dialogVisible = false

      this.$message.success('提交成功！')
      this.$emit('getOrderList')
      // this.$_fetchTableData(getOrderList)
    },
    // 关闭时的回调
    closeDialog() {
      this.ruleForm.exList1 = []
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.operation {
  color: $--color-primary;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  white-space: nowrap;
  font-size: 14px;
  .watch {
    margin-right: 5px;
  }
  .watch,
  .send {
    cursor: pointer;
  }
}
::v-deep .el-dialog__title {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(26, 26, 26, 1);
}

::v-deep .el-dialog__footer {
  display: flex;
  justify-content: space-around;
  .el-button {
    width: 80px;
    line-height: 28px;
    padding: 0;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    text-align: center;
    border-radius: 2px;
  }
}

::v-deep .el-dialog {
  .el-dialog__body {
    padding: 15px 20px;
  }
  .sendContent {
    .el-row {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .el-col {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 30px;
        .itemTitle {
          width: 70px;
          display: flex;
          justify-content: flex-end;
          margin-right: 15px;
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #666666;
        }
        .itemContent {
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(26, 26, 26, 1);
        }
        img {
          margin-right: 15px;
        }
      }
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

.tableList {
  width: 90% !important;
  margin: 0 auto;
  margin-bottom: 20px;
}

.wayInfo {
  ::v-deep .wayInfoTitle {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(102, 102, 102, 1);
    display: flex;
    justify-content: center !important;
  }
  .logisticsInfo {
    width: 100%;
    .el-form-item {
      margin-bottom: 0;
      width: 80%;
    }
    ::v-deep .el-select,
    .el-input {
      width: 100%;
    }
    ::v-deep .el-input__inner {
      border: 0 !important;
      width: 100%;
    }
    ::v-deep .el-form-item__label {
      border-right: 1px solid #cccccc;
      text-align: center;
      padding-right: 0;
    }
    .itemContent {
      margin-right: 15px;
    }
    .delate {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(247, 74, 74, 1);
      cursor: pointer;
      margin-left: 20px;
    }
  }
  ::v-deep .addNewWayInfo {
    color: $--color-primary;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 500;
    padding-left: 25px !important;
    cursor: pointer;
  }
}

.titleText {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
}

::v-deep .el-form-item {
  border: 1px solid #cccccc;
  border-radius: 5px;
}

.lableName {
  margin-right: 30px !important;
}

.mR {
  margin-left: 20px !important;
}
</style>
